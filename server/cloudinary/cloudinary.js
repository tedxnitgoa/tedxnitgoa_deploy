const cloudinary = require('cloudinary').v2;
const fs = require('fs');

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'raw', // Set resource_type to 'raw' to handle PDF files explicitly
    });

    console.log('PDF is uploaded to Cloudinary:', response.secure_url);

    // Delete the local file after successful upload
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    console.error('Error uploading PDF to Cloudinary:', error);

    // Ensure the local file is deleted even if there's an error
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    return null;
  }
};

const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: 'raw', // Specify raw type for deleting PDFs
    });

    console.log('PDF deleted successfully from Cloudinary:', result);
    return result;
  } catch (error) {
    console.error('Error deleting PDF from Cloudinary:', error);
    return null;
  }
};

module.exports = { uploadOnCloudinary, deleteFromCloudinary };
