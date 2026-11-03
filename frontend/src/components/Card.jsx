import React, { useContext } from "react";
import { userDataContext } from "../context/UserContext.jsx";

function Card({ image }) {
    const { selectedImage, setSelectedImage } =
        useContext(userDataContext);

    const isSelected = selectedImage === image;

    return (
        <div
            onClick={() => setSelectedImage(image)}
            className={`group w-full max-w-[170px] h-[235px]
            rounded-2xl overflow-hidden border-2 cursor-pointer
            transition-all duration-300 hover:scale-105
            ${isSelected
                    ? "border-cyan-400 shadow-[0_0_25px_rgba(34,211,238,0.9)] scale-105"
                    : "border-blue-900 shadow-[0_0_15px_rgba(30,64,175,0.35)] hover:border-cyan-400"
                }`}
        >
            <img
                src={image}
                alt="AI Assistant"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
        </div>
    );
}

export default Card;