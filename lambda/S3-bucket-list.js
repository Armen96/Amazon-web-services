const AWS = require('aws-sdk');

const s3 = new AWS.S3({
    region: 'us-east-2',
    accessKeyId: 'xxxxxxxxxxxxxxx',
    secretAccessKey: 'xxxxxxxxxxxxxxxxxxxx',
});

exports.handler = async (event) => {
    // TODO implement
    var params = {
        Bucket: 'elasticbeanstalk-us-east-2-931503002598'
    };

    let isTruncated = true;
    let marker;
    while(isTruncated) {
        let params = { Bucket: params.Bucket };

        if (marker) params.Marker = marker;
        try {
            const response = await s3.listObjects(params).promise();
            response.Contents.forEach(item => {
                console.log(item.Key);
            });
            isTruncated = response.IsTruncated;
            if (isTruncated) {
                marker = response.Contents.slice(-1)[0].Key;
            }
        } catch(error) {
            throw error;
        }
    }

    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda! Get S3 bucket list!'),
    };
    return response;
};
