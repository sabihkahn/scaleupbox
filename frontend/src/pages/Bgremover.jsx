import React, { useEffect, useState } from "react";
import { uploadphotogetalldata } from "../cloudinary/Cloudinary";
import axios from "axios";
import { Download } from "lucide-react";

const Bgremover = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [state, setstate] = useState(false);
  const [rembgphoto, setrembgphoto] = useState("");
  const [historydata, sethistorydata] = useState([]);

  let token = localStorage.getItem("token");

  useEffect(() => {
    const historydata = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/photo/rembg/history`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        sethistorydata(res.data.bgRemovedHistory);
      } catch (error) {
        console.log(error);
      }
    };

    historydata();
  }, []);

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
    setrembgphoto("");
    setError("");
  };

  const uploadimage = async () => {
    if (!image) {
      setError("Please select an image to upload");
      return;
    }

    try {
      setstate(true);

       await uploadphotogetalldata(image)
        .then(async (data) => {
          const res = await axios.post(
            `${import.meta.env.VITE_BASE_URL}/photo/rembg`,
            { publicid: data.public_id },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          setrembgphoto(res.data.bgRemovedUrl);
        })
        .catch((err) => {
          console.error("Error removing background:", err);
          setError("Failed to remove background");
        });

      setImage(rembgphoto);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Upload failed");
    } finally {
      setstate(false);
      setPreview(rembgphoto);
    }
  };

  return (
    <div className="p-4 md:p-8 bg-gray-100 min-h-screen flex flex-col lg:flex-col   gap-10 items-center">

      {/* Upload Section */}
      <div className="flex flex-col w-full max-w-md justify-center items-center gap-6">
        {rembgphoto ? (
          <img
            src={rembgphoto}
            className="h-40 object-contain rounded-xl bg-white shadow-md p-4"
            alt=""
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-72 bg-white rounded-xl shadow-md border border-gray-300 p-5 w-full">
            <h2 className="text-xl font-semibold text-black mb-5">
              Background Remover
            </h2>

            {!preview ? (
              <label className="cursor-pointer border-2 border-dashed border-gray-500 rounded-xl p-10 flex flex-col items-center hover:border-gray-400 transition w-full">
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
                <img
                  src={preview}
                  alt="preview"
                  className="h-32 object-contain rounded-lg bg-gray-50"
                />
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
          </div>
        )}

        {rembgphoto ? (
          <div className="flex flex-col items-center gap-3 w-full">
            <a
              href={rembgphoto}
              download
              className="bg-black hover:bg-gray-900 text-white px-4 py-2 rounded-full w-[220px] transition font-semibold text-center"
            >
              Download Image <Download className="inline-block ml-2 h-4 w-4" />
            </a>

            <button
              onClick={removeImage}
              className="bg-red-500 hover:bg-gray-900 text-white px-4 py-2 rounded-full transition"
            >
              Remove Image
            </button>
          </div>
        ) : (
          <button
            disabled={state}
            onClick={uploadimage}
            className="bg-black hover:bg-gray-900 text-white px-4 py-2 rounded-full w-[220px] transition disabled:opacity-60"
          >
            {state ? "Uploading..." : "Upload Image"}
          </button>
        )}
      </div>

      {/* History Section */}
      <div className="w-full lg:max-w-lg bg-white border border-gray-200 rounded-xl shadow-md p-4">
        <h2 className="text-xl font-semibold mb-4">History</h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-h-[420px] overflow-y-auto overflow-x-hidden pr-1">
          {historydata.length === 0 ? (
            <p className="text-gray-500 text-sm">No history available.</p>
          ) : (
            historydata.map((item, index) => (
              <div
                key={index}
                className="border border-gray-200 p-2 rounded-xl bg-white shadow-sm hover:shadow-md transition"
              >
                <img
                  src={item}
                  alt={`History ${index + 1}`}
                  className="w-full h-28 md:h-32 object-contain bg-gray-50 rounded-lg"
                />

                <a
                  href={item}
                  download
                  className="mt-2 flex items-center justify-center gap-1 bg-black hover:bg-gray-900 text-white px-3 py-1.5 rounded-full text-xs font-medium transition"
                >
                  Download <Download className="h-4 w-4" />
                </a>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Bgremover;
