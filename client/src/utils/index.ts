import axios from "axios";

export const sendImagetoCloud = async (
  image: File | null,
  folderName: string
) => {
  const data = new FormData();
  if (image) {
    data.append("file", image);
    data.append("upload_preset", "mealway");
    data.append("cloud_name", "dxn3cmvet");
    data.append("folder", "/wing/" + folderName);
  }

  try {
    const response = await axios.post(
      "https://api.cloudinary.com/v1_1/dxn3cmvet/image/upload",
      data
    );
    if (response) {
      console.log("Image uploaded successfully!");
      return response.data.secure_url;
    }
  } catch (error) {
    console.log("Error in image upload", error);
  }
};
