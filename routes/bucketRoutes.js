const requireLogin = require('../middlewares/requireLogin');
const uuid = require('uuid/v1');
const AWS = require('aws-sdk');
const Keys = require('../config/keys');

const s3 = new AWS.S3({
  accessKeyId: Keys.awsAccessKey,
  secretAccessKey: Keys.awsSecret,
  region: 'eu-central-1'
});

module.exports = app => {
  app.get('/api/upload', requireLogin, async (req, res) => {
    const key = `${req.user.id}/${uuid()}.jpeg`;
    s3.getSignedUrl('putObject', {
      Bucket: Keys.bucketName,
      ContentType: 'image/jpeg',
      Key: key,
    }, (err, url) => {
      res.send({ key, url });
    });
  })
};
