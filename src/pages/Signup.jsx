import React, { useState } from "react";
import { FaUserAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { RxEyeOpen } from "react-icons/rx";
import { BsFillTelephoneFill } from "react-icons/bs";
import { BsEyeSlashFill } from "react-icons/bs";
import { auth } from "../firebase.config";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";

import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router";
import { useNavigate } from "react-router";

const Signup = () => {
  const navigate = useNavigate();
  const db = getDatabase();
  let [info, setInfo] = useState({
    name: "",
    email: "",
    password: "",
    number: "",
  });
  let [loading, setLoading] = useState(false);

  let [error, setError] = useState({
    name: "",
    email: "",
    password: "",
    number: "",
  });
  let [showPassword, setShowPassword] = useState(false);

  let handleShowingPassword = () => {
    setShowPassword(!showPassword);
  };

  let handleName = (e) => {
    setInfo((prev) => ({
      ...prev,
      name: e.target.value,
    }));
    setError("");
  };
  let handleEmail = (e) => {
    setInfo((prev) => ({
      ...prev,
      email: e.target.value,
    }));
    setError("");
  };
  let handlePassword = (e) => {
    setInfo((prev) => ({
      ...prev,
      password: e.target.value,
    }));
    setError("");
  };
  let handleNumber = (e) => {
    setInfo((prev) => ({
      ...prev,
      number: e.target.value,
    }));
    setError("");
  };

  console.log(info);

  const handleSubmit = (e) => {
    e.preventDefault();

    let valid = true;

    // NAME
    if (!info.name) {
      setError((prev) => ({ ...prev, name: "Fill up your name" }));
      valid = false;
    } else {
      setError((prev) => ({ ...prev, name: "" }));
    }

    // EMAIL
    if (!info.email) {
      setError((prev) => ({ ...prev, email: "Fill up your Email" }));
      valid = false;
    } else if (
      !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(info.email)
    ) {
      setError((prev) => ({ ...prev, email: "Invalid Email" }));
      valid = false;
    } else {
      setError((prev) => ({ ...prev, email: "" }));
    }

    // PASSWORD
    if (!info.password) {
      setError((prev) => ({ ...prev, password: "Fill up your Password" }));
      valid = false;
    } else if (info.password.length < 8) {
      setError((prev) => ({
        ...prev,
        password: "Password must be at least 8 characters long",
      }));
      valid = false;
    } else {
      setError((prev) => ({ ...prev, password: "" }));
    }

    // NUMBER
    if (!info.number) {
      setError((prev) => ({ ...prev, number: "Fill up your Number" }));
      valid = false;
    } else if (!/^(?:\+88|88)?01[3-9]\d{8}$/.test(info.number)) {
      setError((prev) => ({ ...prev, number: "Invalid Bangladeshi Number" }));
      valid = false;
    } else {
      setError((prev) => ({ ...prev, number: "" }));
    }

    // ✅ SHOW ALERT IF EVERYTHING IS VALID
    if (valid) {
      // (Optional) Clear form:
      // setInfo({ name: "", email: "", password: "", number: "" });
      setLoading(true);
      createUserWithEmailAndPassword(auth, info.email, info.password)
        .then((userCredential) => {
          toast.success("Successfully created an account!");
          sendEmailVerification(auth.currentUser)
            .then(() => {
              updateProfile(auth.currentUser, {
                displayName: info.name,
                photoURL:
                  "https://www.nuflowerfoods.com/wp-content/uploads/2024/09/person-dummy-Copy.jpg",
              })
                .then(() => {
                  // Profile updated!
                  toast.success("Kindly check your Email for verification");

                  setLoading(false);

                  const user = userCredential.user;
                  console.log(user);
                  // ...data store
                  set(ref(db, "users/" + user.uid), {
                    fullname: info.name,
                    email: info.email,
                  });
                })
                .catch((error) => {
                  setLoading(false);
                  console.log(error);
                });
            })
            .catch(() => {
              toast.error("Couldn't send verify code to your Email");
            });
          setTimeout(() => {
            navigate("/signin");
          }, 1000);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          setError((prev) => ({
            ...prev,
            email: "This Email is already in use",
          }));
          setLoading(false);
          valid = false;
        });
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-0">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="w-full h-screen flex flex-col lg:flex-row">
        {/* Left Panel - Gradient & Branding */}
        <div className="w-full lg:w-1/2 bg-gradient-to-br from-[#1a1a2e] via-[#2d1b4e] to-[#1a1a2e] p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden">
          {/* Gradient Orb Effect */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-16">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                  />
                </svg>
              </div>
              <span className="text-white text-xl font-semibold">ZenPanda</span>
            </div>

            <div className="max-w-md">
              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Your Keys.
                <br />
                Your Chats.
                <br />
                Your Security.
              </h1>
              <p className="text-gray-400 text-lg leading-relaxed">
                Take control of your conversations with end-to-end encryption
                and complete privacy. Your data belongs to you.
              </p>
            </div>
          </div>

          <div className="relative z-10 flex items-center justify-center mt-8 lg:mt-0">
            {/* <img
                            src="https://media.istockphoto.com/id/1152137747/vector/cute-panda-character-vector-design.jpg?s=612x612&w=0&k=20&c=ApH4-e_IpWqWhYtHseokRb4-TPL5tp7220FWKyM07Dc="
                            alt="ZenPanda mascot"
                            className="w-64 lg:w-80 h-auto object-contain drop-shadow-2xl opacity-90"
                        /> */}
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="w-full lg:w-1/2 bg-[#0a0a0f] p-8 lg:p-16 flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="mb-10">
              <h2 className="text-3xl font-bold text-white mb-2">
                Sign Up An Account
              </h2>
              <p className="text-gray-500 text-sm">
                Enter your details to create an account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name Input */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide"
                >
                  Name
                </label>
                <div className="relative">
                  <input
                    id="name"
                    type="text"
                    onChange={handleName}
                    required
                    placeholder="Enter full name"
                    className={`w-full bg-[#15151f] border ${
                      error.name ? "border-red-500/50" : "border-[#2a2a3a]"
                    } rounded-lg px-4 py-3.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-200`}
                    autoComplete="off"
                  />
                </div>
                {error.name && (
                  <p className="text-red-400 text-xs mt-1.5">{error.name}</p>
                )}
              </div>

              {/* Email Input */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide"
                >
                  Email
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    onChange={handleEmail}
                    required
                    placeholder="Enter email address"
                    autoComplete="off"
                    className={`w-full bg-[#15151f] border ${
                      error.email ? "border-red-500/50" : "border-[#2a2a3a]"
                    } rounded-lg px-4 py-3.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-200`}
                  />
                </div>
                {error.email && (
                  <p className="text-red-400 text-xs mt-1.5">{error.email}</p>
                )}
              </div>

              {/* Password Input */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    onChange={handlePassword}
                    placeholder="Enter your password"
                    className={`w-full bg-[#15151f] border ${
                      error.password ? "border-red-500/50" : "border-[#2a2a3a]"
                    } rounded-lg px-4 py-3.5 pr-12 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-200`}
                    autoComplete="off"
                  />
                  <button
                    type="button"
                    onClick={handleShowingPassword}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-400 transition-colors"
                  >
                    {showPassword ? (
                      <BsEyeSlashFill className="text-base" />
                    ) : (
                      <RxEyeOpen className="text-base" />
                    )}
                  </button>
                </div>
                {error.password && (
                  <p className="text-red-400 text-xs mt-1.5">
                    {error.password}
                  </p>
                )}
              </div>

              {/* Phone Number Input */}
              <div>
                <label
                  htmlFor="number"
                  className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide"
                >
                  Phone Number
                </label>
                <div className="relative">
                  <input
                    id="number"
                    type="tel"
                    required
                    onChange={handleNumber}
                    placeholder="Enter phone number"
                    className={`w-full bg-[#15151f] border ${
                      error.number ? "border-red-500/50" : "border-[#2a2a3a]"
                    } rounded-lg px-4 py-3.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-200`}
                    autoComplete="off"
                  />
                </div>
                {error.number && (
                  <p className="text-red-400 text-xs mt-1.5">{error.number}</p>
                )}
              </div>

              {/* Terms and Privacy */}
              <div className="pt-2">
                <p className="text-xs text-gray-500 leading-relaxed">
                  By clicking Create Account, you agree to our{" "}
                  <a
                    href="#"
                    className="text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="#"
                    className="text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    Privacy Policy
                  </a>
                  .
                </p>
              </div>

              {/* Submit Button */}
              {loading ? (
                <button
                  type="button"
                  disabled
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3.5 rounded-lg font-semibold shadow-lg shadow-purple-900/30 transition-all duration-300 flex items-center justify-center gap-3 mt-6"
                >
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5 text-white/30 animate-spin fill-white"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span>Creating Account...</span>
                </button>
              ) : (
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3.5 rounded-lg font-semibold shadow-lg shadow-purple-900/30 hover:shadow-purple-900/50 transition-all duration-300 transform hover:scale-[1.01] mt-6"
                >
                  Create Account
                </button>
              )}

              {/* Sign In Link */}
              <p className="text-center text-gray-500 text-sm mt-6">
                Already have an account?{" "}
                <Link
                  to="/signin"
                  className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
                >
                  Login
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
