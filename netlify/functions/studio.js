'use strict';

const mongoose = require('mongoose');
const { driver, createAstraUri } = require('@datastax/astra-mongoose');

const mongodbMongoose = new mongoose.Mongoose();

mongoose.setDriver(driver);
mongoose.set('autoCreate', false);
mongoose.set('autoIndex', false);

require('../../src/movies-demo/movies.model');

const context = `
This project is configured to communicate with DataStax Astra's Data API using the @datastax/astra-mongoose project, not MongoDB.
Please be aware of the following additional rules and features of Data API.

Data API does not support aggregations. Do not write any aggregate() calls in your scripts. If the user asks you to write an aggregation, reply "Data API does not support aggregations."

Data API supports vector search using the following syntax: UserModel.find().sort({ $vectorize: { $meta: 'some text' } }).limit(5) will return the 5 documents whose $vectorize property is closest to 'some text'. Data API computes embeddings automatically.

Use vector search to help answer user queries based on broad descriptions rather than exact queries. For example, "What is that 2000s movie about a famous mathematician?" should run UserModel.find().sort({ year: { $gte: 2000, $lte: 2009 }, $vectorize: { $meta: 'a famous mathematician' } }).limit(5)
`.trim();

const handler = require('@mongoosejs/studio/backend/netlify')(mongoose, {
  apiKey: process.env.MONGOOSE_STUDIO_API_KEY,
  studioConnection: mongodbMongoose,
  context
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
