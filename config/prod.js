module.exports = {
  googleClientID: process.env.GOOGLE_CLIENT_ID || '',
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  mongoURI: process.env.MONGO_URI || 'mongodb://admin:2F7p&MxWN*@ds247058.mlab.com:47058/node-blog-dev',
  cookieKey: process.env.COOKIE_KEY,
  redisURL: process.env.REDIS_URI || 'redis://127.0.0.1:6379'
};