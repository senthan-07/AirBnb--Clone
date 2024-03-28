const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

//Things which I require to connect with clodinary
cloudinary.config({
    cloud_name: process.env.COULD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'wanderlust_DEV',
      allowedformats: ["png","jpq","jpeg"],
    },
  });


  module.exports={
    cloudinary,
    storage,
  };
