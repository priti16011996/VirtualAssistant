
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userDataContext } from "../context/UserContext";
import "./Home.css";
import axios from "axios";
import { toast } from "react-toastify";

function Home() {
    const navigate = useNavigate();
    const [showCustomize, setShowCustomize] = useState(false);

    const {
        userData,
        serverUrl,
        setUserData,
    } = useContext(userDataContext);

    const assistantImage = userData?.virtualAssistantProfile;

    const handleLogout = async () => {
        try {
            const result = await axios.get(
                `${serverUrl}/v1/api/auth/signout`,
                { withCredentials: true }
            );

            if (result.status === 200) {
                setUserData(null);
                navigate("/signin");
                toast.success(result.data.message);
            }
        } catch (error) {
            console.error("Logout error:", error);
            toast.error("Failed to logout. Please try again!");
        }
    };

    return (
        <main className="home-container">

            {/* Navigation */}
            <header className="home-navbar">

                <div className="brand">
                    <div className="brand-icon">AI</div>
                    <div>
                        <h2>Virtual Assistant</h2>
                        <span>Your personal AI companion</span>
                    </div>
                </div>

                <div className="navbar-actions">

                    <div className="customize-dropdown">

                        <button
                            className="personalize-btn"
                            onClick={() =>
                                setShowCustomize(!showCustomize)
                            }
                        >
                            <span>⚙</span>
                            Personalize Assistant
                            <span className="dropdown-arrow">
                                {showCustomize ? "⌃" : "⌄"}
                            </span>
                        </button>

                        {showCustomize && (
                            <div className="customize-menu">

                                <button
                                    onClick={() => {
                                        setShowCustomize(false);
                                        navigate("/customize");
                                    }}
                                >
                                    <span>▣</span>
                                    <div>
                                        <strong>Change Profile</strong>
                                        <small>Choose your assistant image</small>
                                    </div>
                                </button>

                                <button
                                    onClick={() => {
                                        setShowCustomize(false);
                                        navigate("/customizeName");
                                    }}
                                >
                                    <span>T</span>
                                    <div>
                                        <strong>Change Name</strong>
                                        <small>Give your assistant a name</small>
                                    </div>
                                </button>

                            </div>
                        )}
                    </div>

                    <button
                        className="logout-btn"
                        onClick={handleLogout}
                    >
                        Log Out
                    </button>

                </div>
            </header>

            {/* Assistant */}
            <section className="assistant-section">

                <div className="assistant-image-wrapper">
                    <div className="assistant-glow"></div>

                    <img
                        src={assistantImage || "/assistant.png"}
                        alt="Virtual Assistant"
                        className="assistant-image"
                    />
                </div>

                <div className="assistant-details">
                    <span className="welcome-text">
                        YOUR PERSONAL AI ASSISTANT
                    </span>

                    <h1>
                        Hello, I'm{" "}
                        <span>
                            {userData?.virtualAssistantName || "Assistant"}
                        </span>
                    </h1>

                    <p>
                        Your intelligent companion, always ready to help.
                    </p>
                </div>

            </section>

        </main>
    );
}

export default Home;
