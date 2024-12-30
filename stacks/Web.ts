import { StackContext, Stack, StaticSite } from "sst/constructs";


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
  const birl = getStaticSite(stack, 'birl', 'back-in-real-life.com');

  stack.addOutputs({
    "Birl Web URL": birl.customDomainUrl || birl.url,
  });
}
