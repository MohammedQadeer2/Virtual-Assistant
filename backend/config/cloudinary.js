import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'

const uploadOnCloudinary = async (filePath) => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

    try{
     const uploadResult = await cloudinary.uploader
       .upload(filePath)
       //delete the file from the storage
       fs.unlinkSync(filePath)
       return  uploadResult.secure_url
    } catch(err) {
       fs.unlinkSync(filePath)
       console.log(err)
    }
}

export default uploadOnCloudinary