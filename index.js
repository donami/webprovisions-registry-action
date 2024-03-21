const core = require('@actions/core');

try {
  console.log(`Hello World!`);
} catch (error) {
  // Handle errors and indicate failure
  core.setFailed(error.message);
}
