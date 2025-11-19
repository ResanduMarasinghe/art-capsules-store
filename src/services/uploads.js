const CLOUDINARY_CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

const buildUploadUrl = () => {
  if (!CLOUDINARY_CLOUD_NAME) return null;
  return `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`;
};

export const uploadImage = async (file) => {
  if (!file) {
    throw new Error('No file selected for upload.');
  }

  const uploadUrl = buildUploadUrl();

  if (!uploadUrl || !CLOUDINARY_UPLOAD_PRESET) {
    throw new Error('Cloudinary environment variables are not configured.');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  const response = await fetch(uploadUrl, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Image upload failed.');
  }

  const data = await response.json();
  return {
    url: data.secure_url || data.url,
    publicId: data.public_id,
    width: data.width,
    height: data.height,
    format: data.format,
  };
};
