'use strict';

const mongoose = require('mongoose');
const { driver, createAstraUri } = require('@datastax/astra-mongoose');

const mongodbMongoose = new mongoose.Mongoose();

mongoose.setDriver(driver);
mongoose.set('autoCreate', false);
mongoose.set('autoIndex', false);

require('../../src/movies-demo/movies.model');

const handler = require('@mongoosejs/studio/backend/netlify')(mongoose, {
  apiKey: process.env.MONGOOSE_STUDIO_API_KEY,
  studioConnection: mongodbMongoose
}).handler;

let conn = null;
let mongodbConn = null;

module.exports = {
  handler: async function studioHandler(params) {
    if (mongodbConn == null) {
      mongodbConn = await mongodbMongoose.connect(process.env.MONGODB_CONNECTION_STRING, { serverSelectionTimeoutMS: 3000 });
    }
    if (conn == null) {
      conn = await mongoose.connect(
        createAstraUri(
          process.env.ASTRA_ENDPOINT,
          process.env.ASTRA_TOKEN,
          process.env.ASTRA_KEYSPACE
        )
      );
    }

    return handler.apply(null, arguments);
  }
};
