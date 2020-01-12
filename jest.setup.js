// mock environment vars
process.env.GB_TOKEN = 'giantbomb-test-token';
process.env.GM_TOKEN = 'groupme-test-token';
process.env.DEV_BOT_ID = 'test-dev-bot-id';
process.env.PROD_BOT_ID = 'test-prod-bot-id';
process.env.GCLOUD_CREDENTIALS = 'e3NvbWU6a2V5fSB9Cg==';

// mock console.error
// sometimes you'll want to comment this out
// for testing.
console.error = () => {};
