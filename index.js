const core = require('@actions/core');
const { promises: fs } = require('fs');

const getScopes = (data, registryUrl, token) => {
  const regex = /# scope\((.*)\)/g;
  const registry = registryUrl.replace('https://', '').replace('http://', '');

  let matches = [];
  let output = [];

  while ((matches = regex.exec(data))) {
    const scope = matches[1];

    const parts = scope.split(':');

    if (parts[1]) {
      const organizationKey = parts[1];

      output.push(
        `//${registry}/api/packages/${organizationKey}/npm/:_authToken=${token}`
      );
    }
  }

  return output;
};

const main = async () => {
  const token = core.getInput('registry-token');
  const registryUrl = core.getInput('registry-url');

  if (!token || !token.length) {
    return;
  }

  await fs.access('./.npmrc', fs.constants.F_OK);
  const data = await fs.readFile('./.npmrc', 'utf-8');

  const scopes = getScopes(data, registryUrl, token);

  const authString = scopes.join('\n');

  const output = `${data}\n${authString}`;

  console.log('output', output); // TODO: remove

  await fs.writeFile('./.npmrc', output, 'utf-8');
};

main().catch((err) => core.setFailed(err.message));
