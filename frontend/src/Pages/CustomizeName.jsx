
import React, { useContext } from "react";
import axios from "axios";
import { userDataContext } from "../context/UserContext.jsx";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
function CustomizeName() {
    const {
        serverUrl,
        assistantName,
        setAssistantName,
        selectedImage,
        customFrontendImage,
        customBackendImage,
        setUserData
    } = useContext(userDataContext);
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!assistantName?.trim()) {
            alert("Please enter assistant name");
            return;
        }

        if (!selectedImage) {
            alert("Please select an assistant image");
            return;
        }

        try {
            const formData = new FormData();

            formData.append(
                "virtualAssistantName",
                assistantName.trim()
            );

            const isCustomImage =
                selectedImage === customFrontendImage &&
                !!customBackendImage;

            if (isCustomImage) {
                // Upload actual image file
                formData.append(
                    "profileImage",
                    customBackendImage
                );
            } else {
                // Send default image path
                formData.append(
                    "virtualAssistantProfile",
                    selectedImage
                );
            }

            const response = await axios.put(
                `${serverUrl}/v1/api/user/customize`,
                formData,
                {
                    withCredentials: true
                }
            );

            setUserData(response.data);

            // alert("Your AI Assistant is ready!");
            toast.success("Your AI Assistant is ready!");
            navigate("/");
            console.log(response.data);

        } catch (error) {
            toast.error("Failed to customize your assistant. Please try again.");
            console.error(
                "Customization error:",
                error.response?.data || error.message
            );
        }
    };

    return (
        <div className="min-h-screen w-full bg-gradient-to-b from-[#08065c] via-[#050329] to-black flex items-center justify-center px-5 py-10">
            <button
                type="button"
                onClick={() => navigate("/customize")}
                className="self-start mb-6 flex items-center gap-2 text-gray-300 hover:text-cyan-400 transition-colors"
            >
                <span className="text-xl">←</span>
                <span>Back</span>
            </button>
            <div className="w-full max-w-xl flex flex-col items-center">

                <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 text-center">
                    Customize Your Assistant
                </h1>

                <p className="text-gray-400 text-center mb-10">
                    Give your AI assistant a unique identity.
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="w-full bg-blue-950/30 border border-blue-500/30 rounded-3xl p-6 md:p-10 mt-4            "
                >

                    <label className="block text-lg font-bold mb-3 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
                        Assistant Name
                    </label>

                    <input
                        type="text"
                        value={assistantName || ""}
                        onChange={(e) =>
                            setAssistantName(e.target.value)
                        }
                        placeholder="e.g. Alexa, Jarvis, Friday..."
                        maxLength={20}
                        className="w-full h-14 px-5 rounded-xl bg-black/40 border border-blue-500/50 text-white outline-none focus:border-cyan-400"
                    />

                    <p className="text-gray-500 text-xs text-right mt-2">
                        {(assistantName || "").length}/20 characters
                    </p>

                    {/* Selected Image Preview */}
                    <div className="mt-8 flex flex-col items-center gap-3">

                        <p className="text-gray-400 text-sm">
                            Your selected assistant
                        </p>

                        <img
                            src={selectedImage}
                            alt="Selected Assistant"
                            className="w-32 h-32 object-cover rounded-2xl border-2 border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.5)]"
                        />

                        <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
                            {assistantName?.trim() || "Your Assistant"}
                        </h2>

                    </div>

                    <button
                        disabled={!assistantName?.trim() || !selectedImage}
                        className="w-full h-14 mt-8 rounded-full bg-white text-black font-bold text-lg hover:bg-cyan-400 hover:text-white transition-all disabled:opacity-40"
                        onClick={handleSubmit}
                    >
                        Create Your AI Assistant
                    </button>

                </form>
            </div>
        </div>
    );
}

export default CustomizeName;
