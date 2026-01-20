import React, { useState } from "react";
import { uploadphotogetalldata } from "../cloudinary/Cloudinary";
import axios from "axios";
import { Download } from "lucide-react";


const Bgremover = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [state, setstate] = useState(false);
  const [rembgphoto, setrembgphoto] = useState('')

let token =  localStorage.getItem("token")




  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }

    setError("");
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImage(null);
    setPreview(null);
    setrembgphoto('');
    setError("");
  };

  const uploadimage = async () => {
    if (!image) {
      setError("Please select an image to upload");
      return;
    }

    try {
      setstate(true); // ✅ START loading BEFORE upload

      const res = await uploadphotogetalldata(image).then(async (data) => {
      const res =   await axios.post(`${import.meta.env.VITE_BASE_URL}/photo/rembg`, {
          publicid: data.public_id
        },{headers:{Authorization:`Bearer ${token}`}})
        console.log(res);
        
        setrembgphoto(res.data.bgRemovedUrl);
      console.log("Background removed URL:", res.data.bgRemovedUrl);
      }).catch((err) => {
        console.error("Error removing background:", err);
        setError("Failed to remove background");
      });

      console.log("Cloudinary full response:", res);
      // res.public_id
      // res.secure_url
      // res.width, height, format, bytes, etc.

      setImage(rembgphoto);
     
      setError("");
    } catch (err) {
      console.error(err);
      setError("Upload failed");
    } finally {
      setstate(false); // ✅ ALWAYS stop loading
      setPreview(rembgphoto);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex justify-center items-start">
      <div className="flex flex-col w-[500px] justify-center items-center gap-6">
        {rembgphoto ? <img src={rembgphoto} className="h-32 object-cover rounded-lg" alt="" /> : <div className="flex flex-col items-center justify-center h-72 bg-white rounded-xl shadow-md border border-gray-300 p-5 w-full max-w-md">
          <h2 className="text-xl font-semibold text-black mb-5">
            Background Remover
          </h2>

          {!preview ? (
            <label className="cursor-pointer border-2 border-dotted border-gray-600 rounded-xl p-10 flex flex-col items-center hover:border-gray-400 transition">
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageChange}
              />
              <p className="text-black text-sm mb-2">
                Click to upload image
              </p>
              <span className="text-gray-400 text-xs">
                PNG, JPG • Max 5MB
              </span>
            </label>
          ) : (
            <div className="flex flex-col items-center gap-3 w-full">
                { <img
                src={preview}
                alt="preview"
                className="h-32 object-cover rounded-lg"
              />}
              <button
                onClick={removeImage}
                className="bg-red-500 hover:bg-gray-900 text-white px-4 py-2 rounded-full transition"
              >
                Remove Image
              </button>
            </div>
          )}

          {error && (
            <p className="text-red-500 mt-3 text-sm">{error}</p>
          )}
        </div>}

        {rembgphoto ? (<div className="flex flex-col items-center gap-3 w-full">
          <a
         href={rembgphoto}
          download={true}
          className="bg-black hover:bg-gray-900 text-white px-4 py-2 rounded-full w-[220px] transition disabled:opacity-60 decoration-0 font-bold"
        >
        Download Image <Download  className="inline-block ml-2 h-4 w-4" />
        </a>
          <button
            onClick={removeImage}
            className="bg-red-500 hover:bg-gray-900 text-white px-4 py-2 rounded-full transition"
          >
            Remove Image
          </button>
        </div>) : <button
          disabled={state}
          onClick={uploadimage}
          className="bg-black hover:bg-gray-900 text-white px-4 py-2 rounded-full w-[220px] transition disabled:opacity-60"
        >
          {state ? "Uploading..." : "Upload Image"}
        </button>}
      </div>
    </div>
  );
};

export default Bgremover;
