'use strict';

const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  plot: String,
  genres: [String],
  runtime: Number,
  cast: [String],
  poster: String,
  title: String,
  fullplot: String,
  languages: [String],
  released: Date,
  directors: [String],
  rated: String,
  awards: {
    wins: Number,
    nominations: Number,
    text: String
  },
  lastupdated: String,
  year: Number,
  imdb: {
    rating: Number,
    votes: Number,
    id: Number
  },
  countries: [String],
  type: String,
  tomatoes: {
    viewer: {
      rating: Number,
      numReviews: Number,
      meter: Number
    },
    fresh: Number,
    critic: {
      rating: Number,
      numReviews: Number,
      meter: Number
    },
    rotten: Number,
    lastUpdated: Date
  },
  num_mflix_comments: Number
});

schema.post('countDocuments', function (err, res, next) {
  console.log('CountDocuments error', err);
  if (err.message.includes('Too many documents to count')) {
    return next(null, mongoose.overwriteMiddlewareResult('1000+'));
  }
  return next(err);
});

module.exports = mongoose.model('Movie', schema, 'movies');
