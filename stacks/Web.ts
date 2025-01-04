import { StackContext, Stack, StaticSite, Api, Config } from "sst/constructs";

function getStaticSite(stack: Stack, path: string, hostedZone: string) {
  const domain = stack.stage === 'prod' ? hostedZone : `local.${hostedZone}`;

  return new StaticSite(stack, `StaticStite-${path}`, {
    customDomain: stack.stage === 'prod' ? {
      domainName: domain,
      domainAlias: `www.${domain}`,
      hostedZone
    } : undefined,
    path: `packages/${path}`,
    errorPage: "404.html",
    buildOutput: "dist",
    buildCommand: "npm run build"
  });
}

export function Web({ stack }: StackContext) {
  const GIPHY_AUTHORIZATION_KEY = new Config.Secret(stack, "GIPHY_AUTHORIZATION_KEY");
  const GOOGLE_CLOUD_PROJECT = new Config.Secret(stack, "GOOGLE_CLOUD_PROJECT");

  const birl = getStaticSite(stack, 'birl', 'back-in-real-life.com');

  const giphyApi = new Api(stack, "GiphyApi", {
    defaults: {
      function: {
        bind: [GIPHY_AUTHORIZATION_KEY, GOOGLE_CLOUD_PROJECT],
      }
    },
    routes: {
      "GET    /search": "packages/giphy/src/get/search.handler"
    },
  });

  stack.addOutputs({
    "Birl Web URL": birl.customDomainUrl || birl.url,
    "Giphy API URL": giphyApi.url,
  });
}
