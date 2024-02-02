const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const uploadMedia = async (file, preset, type) => {
  try {
    if (!file[0]) {
      throw new Error("Please select a file.");
    }

    const formData = new FormData();
    formData.append("file", file[0]);
    formData.append("upload_preset", preset);

    const response = await fetch(
      "https://api.cloudinary.com/v1_1/sayuk/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to upload file. Status: ${response.status}`);
    }

    const data = await response.json();
    const { secure_url: mediaURL } = data;

    return mediaURL;
  } catch (error) {
    console.error(error);
  }
};

export { uploadMedia };
