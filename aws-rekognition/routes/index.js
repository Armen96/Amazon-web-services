const express = require("express");
const router = express.Router();
const facialAWS = require("./../resources/aws-rekogniton/facial-detection");
const s3AWS = require("./../resources/aws-s3/s3");

router.post('/detect-face', function(req, res){
    const obj = {
        photo: req.body.photo
    };

    facialAWS.search_face(obj, function(data){
       res.send(data);
    });
});

router.post('/index-new-face', function(req, res){
    const obj = {
        photo: req.body.photo,
        id_user: req.body.id_user
    };

    facialAWS.indexFaces(obj, function(data){
        res.send(data);
    });
});

router.post('/compare-faces', function(req, res){
    const obj = {
        // photo: req.body.photo,
        // id_user: req.body.id_user
    };

    facialAWS.compareFaces(obj, function(data){
        res.send(data);
    });
});

router.post('/delete-face', function(req, res){
    const obj = {
        face_id: req.body.face_id
    };

    facialAWS.deleteFace(obj, function(data){
        res.send(data);
    });
});

// TODO
router.post('/upload', function(req, res){
    const obj = {
        image: req.files.file
    };

    s3AWS.upload(obj, function(data){
        res.send(data);
    });
});

router.get('/get-s3-images', async function(req, res){
   const data = await s3AWS.getS3Objects();
   res.send(data);
});

router.post('/compare', async function(req, res){
    const obj = {
        source: req.body.source,
        target: req.body.target
    };

    if (obj.source && obj.target) {
        facialAWS.compareFaces(obj, function(data){
            res.send(data);
        });
    } else {
        res.send([]);
    }
});

module.exports = router;
