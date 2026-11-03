
import React, { useState, useContext } from "react";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { Link } from "react-router-dom";
import bg from "../assets/authBg.png";
import { userDataContext } from "../context/UserContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Signin() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const Navigate = useNavigate();

    const { serverUrl, userData, setUserData, } = useContext(userDataContext);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prevent multiple requests
        if (loading) return;

        setLoading(true);

        try {
            const formData = {
                email,
                password,
            };

            const result = await axios.post(
                `${serverUrl}/v1/api/auth/signin`,
                formData,
                { withCredentials: true }
            );
            setUserData(result.data);
            toast.success(result.data.message);

            // Clear form after successful signup
            setEmail("");
            setPassword("");
            Navigate("/");

        } catch (error) {
            setUserData(null);
            console.error("Signup error:", error);

            const errorMessage =
                error.response?.data?.message ||
                error.message ||
                "Something went wrong!";

            toast.error(errorMessage);

        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-dvh w-full flex items-center justify-center
            bg-cover bg-center bg-no-repeat p-4"
            style={{ backgroundImage: `url(${bg})` }}
        >
            {/* Signup Card */}
            <div
                className="w-full max-w-[480px]
                flex flex-col justify-center
                px-7 sm:px-10 py-8
                bg-white/[0.04]
                backdrop-blur-[5px]
                border border-white/[0.12]
                shadow-[0_8px_32px_rgba(0,0,0,0.15)]
                rounded-2xl"
            >
                {/* Heading */}
                <h1 className="text-center text-white text-xl sm:text-2xl font-bold mb-8">
                    Signin to{" "}
                    <span
                        className="bg-gradient-to-r from-cyan-300 via-black-400 to-red-400
                        bg-clip-text text-transparent
                        drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]
                        font-extrabold"
                    >
                        Virtual Assistant
                    </span>
                </h1>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                    {/* Email */}
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                        className="w-full h-[52px] rounded-full
                        border border-white bg-transparent
                        px-5 text-sm sm:text-base text-white
                        placeholder:text-gray-300 outline-none
                        focus:border-blue-400 transition-all
                        disabled:opacity-50"
                    />

                    {/* Password */}
                    <div className="relative w-full">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                            disabled={loading}
                            className="w-full h-[52px] rounded-full
                            border border-white bg-transparent
                            px-5 pr-12 text-sm sm:text-base text-white
                            placeholder:text-gray-300 outline-none
                            focus:border-blue-400 transition-all
                            disabled:opacity-50"
                        />

                        <button
                            type="button"
                            disabled={loading}
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-5 top-1/2
                            -translate-y-1/2 text-white
                            hover:text-blue-400"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? (
                                <IoEyeOff size={21} />
                            ) : (
                                <IoEye size={21} />
                            )}
                        </button>
                    </div>

                    {/* Signin Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-[180px] h-[52px]
                        mx-auto mt-4 rounded-full
                        bg-white text-black text-base
                        font-semibold transition-all duration-300
                        hover:bg-blue-400 hover:text-white
                        hover:scale-105 active:scale-95
                        disabled:opacity-60 disabled:cursor-not-allowed
                        disabled:hover:scale-100"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="w-5 h-5 border-2
                                border-gray-400 border-t-black
                                rounded-full animate-spin" />
                                Logging...
                            </span>
                        ) : (
                            "Sign In"
                        )}
                    </button>
                </form>

                {/* Sign In Link */}
                <p className="text-center text-white text-sm sm:text-base mt-5
                    drop-shadow-[0_2px_5px_rgba(0,0,0,0.9)]">

                    Don't have account?{" "}

                    <Link
                        to="/signup"
                        className="font-bold
                        bg-gradient-to-r from-cyan-300 via-black-400 to-red-400
                        bg-clip-text text-transparent
                        hover:from-purple-400 hover:to-cyan-300
                        transition-all duration-300"
                    >
                        Create New Account
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Signin;
