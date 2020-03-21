const config = require('./../config/aws-config');
const AWS = require('aws-sdk');

let s3bucket = new AWS.S3({
    accessKeyId: config.IAM_USER_KEY,
    secretAccessKey: config.IAM_USER_SECRET,
    Bucket: config.Bucket,
    region: config.region
});

module.exports.upload = function(object, callback) {
    const sourceImage = object.image;

    const params = {
        Bucket: config.Bucket,
        Key: sourceImage.name, // File name you want to save as in S3
        Body: sourceImage.data,
        ACL: "public-read",
        ContentType: 'image/jpeg'
    };

    s3bucket.upload(params, function(err, data){
        if (err) { console.log('Error uploading data: ', data);
            callback(data);
        } else {
            console.log('succesfully uploaded the image!');
            callback('error');
        }
    });
};

module.exports.getS3Objects = async () => {
    const params = {
        Bucket: config.Bucket,
    };

    return await s3bucket.listObjects(params).promise();
};
