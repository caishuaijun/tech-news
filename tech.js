const axios = require('axios');
const { JSDOM } = require('jsdom');
const { getWeekly } = require('./weekly');
const fs = require('node:fs/promises');

;(async function () {
  const JsUrl = 'https://javascriptweekly.com/issues/latest';
  const FeUrl = 'https://frontendfoc.us/latest';
  const [response1, response2] = await Promise.all([ axios.get(FeUrl), axios.get(JsUrl) ])
  const { window: { document: feDoc } } = new JSDOM(response1.data, { FeUrl })
  const { window: { document: jsDoc } } = new JSDOM(response2.data, { JsUrl })
  const weeklyFeed = getWeekly(jsDoc, feDoc)

  await fs.rm('./dist', { recursive: true });
  console.log(`successfully deleted ./dist`);

  await fs.mkdir('./dist');
  console.log(`successfully create ./dist`);

  await fs.writeFile('./dist/weeklyFeed.json', JSON.stringify(weeklyFeed));
  console.log(`successfully write js.json`);
})()
