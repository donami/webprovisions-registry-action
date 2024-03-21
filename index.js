const core = require('@actions/core');
const { promises: fs } = require('fs');

const main = async () => {
  const token = core.getInput('registry-token');

  if (!token || !token.length) {
    return;
  }

  await fs.access('./.npmrc', fs.constants.F_OK);
  const data = await fs.readFile('./.npmrc', 'utf-8');

  console.log('data', data);

  var result = data.replace(/deploykey/g, token);

  console.log('result', result);

  await fs.writeFile('./.npmrc', result, 'utf-8');
};

main().catch((err) => core.setFailed(err.message));

console.log('Hello World!');
