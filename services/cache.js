const mongoose = require('mongoose');
const redis = require('redis');
const utils = require('util');

const redisURL = require('../config/keys').redisURL;

const redisClient = redis.createClient(redisURL);
const exec = mongoose.Query.prototype.exec;

redisClient.hget = utils.promisify(redisClient.hget);

mongoose.Query.prototype.cache = function(options = {}) {
  this.useCache = true;
  this.hashKey = JSON.stringify(options.key) || 'default';

  return this;
};

mongoose.Query.prototype.exec = async function() {
  if (!this.useCache) {
    return exec.apply(this, arguments)
  }

  const key = JSON.stringify({ ...this.getQuery(), collection: this.mongooseCollection.name });
  const cachedValue = await redisClient.hget(this.hashKey, key);

  if (cachedValue) {
    const doc = JSON.parse(cachedValue);
    return Array.isArray(doc) ? doc.map(d => new this.model(d)) : new this.model(doc);
  }

  const result = await exec.apply(this, arguments);

  redisClient.hset(this.hashKey, key, JSON.stringify(result), 'EX', 10);

  return result;
};

module.exports = {
  clearCache(hashKey) {
    redisClient.del(JSON.stringify(hashKey));
  }
};