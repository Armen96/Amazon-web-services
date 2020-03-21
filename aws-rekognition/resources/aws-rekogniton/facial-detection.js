const config = require('./../config/aws-config');
const AWS = require('aws-sdk');
AWS.config.region = config.region;

const rekognition = new AWS.Rekognition({
    accessKeyId: config.IAM_USER_KEY,
    secretAccessKey: config.IAM_USER_SECRET,
	region: config.region
});

const objReturn = {
	found: false,
	resultAWS: ''
};

module.exports.search_face = function(obj, callback){
	rekognition.searchFacesByImage({
	 	CollectionId: config.collectionName,
	 	FaceMatchThreshold: 70,
		Image: {
			S3Object: {
				Bucket:  config.Bucket,
				Name: "IMG_20190531_204018.jpg"
			}
		},
	 	MaxFaces: 1
	}, function(err, data) {
	 	if (err) {
			callback(err);
	 	} else {
			if(data.FaceMatches && data.FaceMatches.length > 0 && data.FaceMatches[0].Face) {
				callback (data.FaceMatches[0].Face);
			} else {
				objReturn.found = false;
				callback(objReturn);
			}
		}
	});
};

module.exports.indexFaces = function (obj, callback){
	const params = {
		CollectionId: config.collectionName,
		DetectionAttributes: [ "ALL" ],
		ExternalImageId: obj.id_user,
		Image: {
			S3Object: {
				Bucket: config.Bucket,
				Name: "andranik.jpg"
			}
		}
	};

	rekognition.indexFaces(params, function(err, data) {
		if (err) {
			objReturn.found = false;
			objReturn.resultAWS = [err, err.stack];
			callback(objReturn)
		} else {
			objReturn.found = true;
			objReturn.resultAWS = data.FaceRecords[0].Face;
			callback(objReturn)
		}
	});
};

module.exports.compareFaces = function(obj, callback) {
	const photo_source  = obj.source;
	const photo_target  = obj.target;
	const params = {
		SourceImage: {
			S3Object: {
				Bucket: config.Bucket,
				Name: photo_source
			},
		},
		TargetImage: {
			S3Object: {
				Bucket: config.Bucket,
				Name: photo_target
			},
		},
		SimilarityThreshold: 20
	};

	rekognition.compareFaces(params, function(err, data) {
		if (err) {
			objReturn.found = false;
			objReturn.resultAWS = [err, err.stack];
			callback(objReturn)
		} else {
			const detectFaces = [];
			data.FaceMatches.forEach(data => {
				let position   = data.Face.BoundingBox;
				let similarity = data.Similarity;
				console.log(`The face at: ${position.Left}, ${position.Top} matches with ${similarity} % confidence`);

				detectFaces.push({
					position,
					similarity
				})
			});

			objReturn.found = true;
			objReturn.resultAWS = detectFaces;
			callback(objReturn)
		}
	});
};

module.exports.deleteFace = function (obj, callback){
	const params_deletion = {
		CollectionId: config.collectionName,
		FaceIds: [obj.face_id]
	};

	rekognition.deleteFaces(params_deletion, function(err, data) {
		if (err) callback(err, err.stack);
		else     callback(true,data);
	});
};
