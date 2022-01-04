//to generate presigned URL for image upload from AWS-Bucket
const AWS = require('aws-sdk');
const keys = require('../config/keys');
const uuid = require('uuid/v1');
const requireLogin = require('../middlewares/requireLogin')

const s3 = new AWS.S3({
    accessKeyId: keys.accessKeyId,
    secretAccessKey: keys.secretAccessKey
    },
    {
        region: 'us-east-1'

    }
)

module.exports = app =>{
    app.get('/api/upload', requireLogin, (req,res)=>{
        const uniqueKey = `${req.user.id}/${uuid()}.jpeg`;

        s3.getSignedUrl('putObject', {
            Bucket: 'the-blog-bucketer',
            ContentType: 'image/jpeg',
            //<UserId>/<randomStringOfCharactersAndImages>.<fileExtension>
            Key: uniqueKey
        }, (err, url)=>{
            res.send({
                uniqueKey,
                url
            })
        } )
    })
}