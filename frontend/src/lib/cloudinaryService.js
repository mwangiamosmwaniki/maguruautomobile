// Cloudinary Image Upload Service

/**
 * Upload image to Cloudinary
 * @param {File} file - Image file to upload
 * @param {string} folder - Cloudinary folder (e.g., 'maguruauto/cars')
 * @returns {Promise<string>} - Secure URL of uploaded image
 */
export const uploadToCloudinary = async (file, folder = "maguruauto/cars") => {
  try {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      throw new Error(
        "Cloudinary configuration missing. Check VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in .env.local",
      );
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    formData.append("folder", folder);
    formData.append("resource_type", "auto");

    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;

    const response = await fetch(uploadUrl, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Cloudinary response:", data);
      throw new Error(
        data.error?.message ||
          `Upload failed: ${response.status} ${response.statusText}`,
      );
    }

    return data.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
};

/**
 * Upload multiple images to Cloudinary
 * @param {File[]} files - Array of image files
 * @param {string} folder - Cloudinary folder
 * @returns {Promise<string[]>} - Array of image URLs
 */
export const uploadMultipleToCloudinary = async (
  files,
  folder = "maguruauto/cars",
) => {
  try {
    const uploadPromises = files.map((file) =>
      uploadToCloudinary(file, folder),
    );
    const urls = await Promise.all(uploadPromises);
    return urls;
  } catch (error) {
    console.error("Multiple upload error:", error);
    throw error;
  }
};

/**
 * Delete image from Cloudinary
 * @param {string} publicId - Public ID of the image to delete
 * @returns {Promise<void>}
 */
export const deleteFromCloudinary = async (publicId) => {
  try {
    const response = await fetch("/api/delete-image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ publicId }),
    });

    if (!response.ok) {
      throw new Error("Delete failed");
    }
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    throw error;
  }
};

/**
 * Optimize image URL for specific use case
 * @param {string} imageUrl - Original Cloudinary URL
 * @param {object} options - Transformation options
 * @returns {string} - Optimized image URL
 */
export const optimizeImageUrl = (imageUrl, options = {}) => {
  if (!imageUrl) return "";

  const {
    width = 800,
    height = 600,
    quality = "auto",
    format = "webp",
  } = options;

  // Extract public ID from URL and rebuild with transformations
  const urlParts = imageUrl.split("/upload/");
  if (urlParts.length !== 2) return imageUrl;

  const transformation = `w_${width},h_${height},c_fill,q_${quality},f_${format}`;
  return `${urlParts[0]}/upload/${transformation}/${urlParts[1]}`;
};

/**
 * Get responsive image URL for different screen sizes
 * @param {string} imageUrl - Original Cloudinary URL
 * @returns {object} - Object with URLs for different sizes
 */
export const getResponsiveImages = (imageUrl) => {
  return {
    thumbnail: optimizeImageUrl(imageUrl, { width: 200, height: 150 }),
    small: optimizeImageUrl(imageUrl, { width: 400, height: 300 }),
    medium: optimizeImageUrl(imageUrl, { width: 800, height: 600 }),
    large: optimizeImageUrl(imageUrl, { width: 1200, height: 900 }),
    original: imageUrl,
  };
};
