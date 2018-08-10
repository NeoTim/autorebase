/* eslint-env node */

import {
  createAuthenticatedOctokit,
  getConfig,
} from "@tibdex/shared-github-internals/src/app";
import autorebase from "github-autorebase";

/* eslint-disable no-process-env */
const main = async (context, payload) => {
  const { appId, privateKey } = getConfig(process.env);
  const {
    installation: { id: installationId },
    repository: {
      name: repo,
      owner: { login: owner },
    },
  } = payload;
  const octokit = await createAuthenticatedOctokit({
    appId,
    installationId,
    privateKey,
  });
  const action = await autorebase({ octokit, owner, repo });
  context.log({ action, owner, repo });
  context.res = action;
};

export default main;
