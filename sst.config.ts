import { SSTConfig } from "sst";
import { Web } from "./stacks/Web";

export default {
  config(_input) {
    return {
      name: "web",
      region: "eu-west-3",
    };
  },
  stacks(app) {
    app.stack(Web);
  }
} satisfies SSTConfig;
