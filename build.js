'use strict';

const { execSync } = require('child_process');

const opts = {
  apiKey: process.env.MONGOOSE_STUDIO_API_KEY
};
console.log('Creating Mongoose studio', opts);
require('@mongoosejs/studio/frontend')(`/.netlify/functions/studio`, true, opts).then(() => {
  execSync(`
  mkdir -p ./public/imdb
  cp -r ./node_modules/@mongoosejs/studio/frontend/public/* ./public/imdb/
  `);
});
