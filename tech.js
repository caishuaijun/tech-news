const axios = require('axios');
const { JSDOM } = require('jsdom');
const { getWeekly } = require('./weekly');
const fs = require('node:fs/promises');

; (async function () {
  const JsUrl = 'https://javascriptweekly.com/issues/latest';
  const FeUrl = 'https://frontendfoc.us/latest';
  const [response1, response2] = await Promise.all([axios.get(FeUrl), axios.get(JsUrl)])
  const { window: { document: feDoc } } = new JSDOM(response1.data, { FeUrl })
  const { window: { document: jsDoc } } = new JSDOM(response2.data, { JsUrl })

  const today = new Date();
  const dayOfWeek = today.getUTCDay();

  let docs = []

  if (dayOfWeek === 4) {
    docs = [feDoc]
  } else if (dayOfWeek === 5) {
    docs = [jsDoc, feDoc]
  }

  if (docs.length === 0) {
    console.log('do nothing')
    return 
  }

  const weeklyFeed = getWeekly(...docs)

  await fs.rm('./dist', { recursive: true });
  console.log(`successfully deleted ./dist`);

  await fs.mkdir('./dist');
  console.log(`successfully create ./dist`);

  await fs.writeFile('./dist/weeklyFeed.json', JSON.stringify(weeklyFeed));
  console.log(`successfully write js.json`);

  await fs.copyFile('index.html', `./dist/index.html`);
  console.log(`successfully copy asset files`);
})()
