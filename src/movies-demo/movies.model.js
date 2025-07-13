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
  num_mflix_comments: Number,
  $vectorize: String
});

// Workaround for countDocuments() failing when result set has more than 1000 results
schema.pre('countDocuments', async function(next) {
  const filter = this.getFilter();
  if (filter == null || Object.keys(filter).length === 0) {
    return next(
      mongoose.skipMiddlewareFunction(
        await this.clone().estimatedDocumentCount()
      )
    );
  }
  return next(
    mongoose.skipMiddlewareFunction(
      await this.clone().find(this.getFilter()).select({ '*': 0 }).then(res => res.length)
    )
  );
});

schema.pre('find', function() {
  if (this.options.sort != null) {
    if (Object.keys(this.options.sort).length === 1 && this.options.sort._id === -1) {
      delete this.options.sort;
      delete this.options.skip;
    }
  }
});

module.exports = mongoose.model('Movie', schema, 'movies');
