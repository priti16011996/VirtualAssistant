
import { useRef, useState, useEffect, useContext } from "react";
import { userDataContext } from "../context/UserContext.jsx";
import Card from "../components/Card";
import { useNavigate } from "react-router-dom";


import image1 from "../assets/image1.png";
import image2 from "../assets/image2.png";
import image3 from "../assets/image3.png";
import image4 from "../assets/image4.png";
import image5 from "../assets/image5.png";
import image6 from "../assets/image6.png";
import image7 from "../assets/image7.png";
import image8 from "../assets/image8.png";

function Customize() {
    const fileInputRef = useRef(null);
    const images = [
        image1, image2, image3, image4,
        image5, image6, image7, image8,
    ];

    const { serverUrl, userData, setUserData, loading, customFrontendImage, setCustomFrontendImage, customBackendImage,
        setCustomBackendImage, selectedImage, setSelectedImage, } = useContext(userDataContext);
    const navigate = useNavigate();
    const handleImageUpload = (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Please select a valid image");
            e.target.value = "";
            return;
        }

        const previewUrl = URL.createObjectURL(file);

        setCustomBackendImage(file);
        setCustomFrontendImage(previewUrl);

        // Select uploaded image
        setSelectedImage(previewUrl);

        e.target.value = "";
    };

    return (
        <div className="min-h-screen w-full bg-gradient-to-b from-[#08065c] via-[#050329] to-black flex flex-col items-center justify-center px-5 py-5">
            <button
                type="button"
                onClick={() => navigate("/customize")}
                className="self-start mb-6 flex items-center gap-2 text-gray-300 hover:text-cyan-400 transition-colors"
            >
                <span className="text-xl">←</span>
                <span>Back</span>
            </button>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-5">
                Choose Your AI Assistant
            </h1>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 md:gap-7 max-w-6xl w-full justify-items-center">

                {images.map((image, index) => (
                    <Card key={index} image={image} />
                ))}

                {customFrontendImage && (
                    <Card image={customFrontendImage} />
                )}

                {!customFrontendImage && (
                    <>
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full max-w-[170px] h-[235px] rounded-2xl 
                            border-2 border-dashed border-blue-500/60 bg-blue-950/20 
                            flex flex-col items-center justify-center gap-4 text-white 
                            hover:border-cyan-400 hover:shadow-[0_0_25px_rgba(59,130,246,0.6)] 
                            transition-all duration-300"
                        >
                            <span className="text-6xl text-cyan-400">+</span>
                            <span className="text-sm font-semibold">
                                Add Your Image
                            </span>
                            <span className="text-xs text-gray-400">
                                Upload one image only
                            </span>
                        </button>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={handleImageUpload}
                        />
                    </>
                )}

            </div>
            {selectedImage && <button
                type="submit"
                className="w-[180px] h-[52px]
                        mx-auto mt-4 rounded-full
                        bg-white text-black text-base
                        font-semibold transition-all duration-300
                        hover:bg-blue-400 hover:text-white
                        hover:scale-105 active:scale-95"
                onClick={() => navigate("/CustomizeName")}
            >
                Next
            </button>}

        </div>
    );
}

export default Customize;
