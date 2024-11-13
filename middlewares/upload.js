const { S3Client } = require('@aws-sdk/client-s3');
const multer = require('multer');
const multerS3 = require('multer-s3');

// Initialize the S3 client
const s3 = new S3Client({
  credentials: {
    accessKeyId: 'AKIASNDEWWHFBMN6YYUS',
    secretAccessKey: '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',
  },
  region: 'ap-south-1',
});

// Configure multer for handling file uploads
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'nishantchathub',
    metadata: (req, file, cb) => {
      cb(null, { fieldname: file.fieldname });
    },
    key: (req, file, cb) => {
      const fileName ='profile_pic/'+
        Date.now() + '_' + file.fieldname + '_' + file.originalname;
      cb(null, fileName);
    },
    contentType: multerS3.AUTO_CONTENT_TYPE, 
  }),
});



const uploadGroupProfilePic = multer({
    storage: multerS3({
      s3: s3,
      bucket: 'nishantchathub', 
      metadata: (req, file, cb) => {
        cb(null, { fieldname: file.fieldname });
      },
      key: (req, file, cb) => {
        const fileName ='Group_profile_pic/'+
          file.originalname;
        cb(null, fileName);
      },
      contentType: multerS3.AUTO_CONTENT_TYPE,
    }),
  });


  module.exports = {
    upload,
    uploadGroupProfilePic
  };