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
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      <main className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-slate-900/40 via-slate-800/30 to-slate-900/40 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden">
            <div className="flex flex-col md:flex-row">
              {/* Left Part: Image Section */}
              <div className="w-full md:w-2/5 bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-8 md:p-12 flex flex-col items-center justify-center text-center border-r border-white/5">
                <div className="mb-6">
                  <img
                    src="https://media.istockphoto.com/id/1152137747/vector/cute-panda-character-vector-design.jpg?s=612x612&w=0&k=20&c=ApH4-e_IpWqWhYtHseokRb4-TPL5tp7220FWKyM07Dc="
                    alt="Cute panda waving"
                    className="max-w-xs w-64 h-auto object-contain drop-shadow-2xl"
                  />
                </div>
                <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">
                  Join ZenPanda
                </h2>
                <p className="text-gray-300 text-sm mb-8 max-w-xs">
                  Create your account and start your journey of peace and
                  productivity.
                </p>
              </div>

              {/* Right Part: Form */}
              <div className="w-full md:w-3/5 p-8 md:p-12 bg-gradient-to-br from-slate-900/60 to-slate-800/40">
                <div className="max-w-md mx-auto">
                  <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
                    Get Started
                  </h1>
                  <p className="text-gray-400 mb-8">Create your account now</p>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Full Name */}
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-300 mb-2"
                      >
                        Full Name
                      </label>
                      <div className="relative">
                        <input
                          id="name"
                          type="text"
                          onChange={handleName}
                          required
                          placeholder="Enter your full name"
                          className={`w-full bg-white/5 backdrop-blur-sm border ${
                            error.name ? "border-red-500/50" : "border-white/10"
                          } rounded-lg px-4 py-3 pr-10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-300`}
                          autoComplete="off"
                        />
                        <FaUserAlt className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                      </div>
                      {error.name && (
                        <p className="text-red-400 text-xs mt-1.5 ml-1">
                          {error.name}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-300 mb-2"
                      >
                        Email
                      </label>
                      <div className="relative">
                        <input
                          id="email"
                          type="email"
                          onChange={handleEmail}
                          required
                          placeholder="username@gmail.com"
                          autoComplete="off"
                          className={`w-full bg-white/5 backdrop-blur-sm border ${
                            error.email
                              ? "border-red-500/50"
                              : "border-white/10"
                          } rounded-lg px-4 py-3 pr-10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-300`}
                        />
                        <MdEmail className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-base" />
                      </div>
                      {error.email && (
                        <p className="text-red-400 text-xs mt-1.5 ml-1">
                          {error.email}
                        </p>
                      )}
                    </div>

                    {/* Password */}
                    <div>
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-300 mb-2"
                      >
                        Password
                      </label>
                      <div className="relative">
                        <input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          required
                          onChange={handlePassword}
                          placeholder="••••••••"
                          className={`w-full bg-white/5 backdrop-blur-sm border ${
                            error.password
                              ? "border-red-500/50"
                              : "border-white/10"
                          } rounded-lg px-4 py-3 pr-10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-300`}
                          autoComplete="off"
                        />
                        <button
                          type="button"
                          onClick={handleShowingPassword}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                        >
                          {showPassword ? (
                            <BsEyeSlashFill className="text-base" />
                          ) : (
                            <RxEyeOpen className="text-base" />
                          )}
                        </button>
                      </div>
                      {error.password && (
                        <p className="text-red-400 text-xs mt-1.5 ml-1">
                          {error.password}
                        </p>
                      )}
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label
                        htmlFor="number"
                        className="block text-sm font-medium text-gray-300 mb-2"
                      >
                        Phone Number
                      </label>
                      <div className="relative">
                        <input
                          id="number"
                          type="tel"
                          required
                          onChange={handleNumber}
                          placeholder="01XXXXXXXXX"
                          className={`w-full bg-white/5 backdrop-blur-sm border ${
                            error.number
                              ? "border-red-500/50"
                              : "border-white/10"
                          } rounded-lg px-4 py-3 pr-10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-300`}
                          autoComplete="off"
                        />
                        <BsFillTelephoneFill className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                      </div>
                      {error.number && (
                        <p className="text-red-400 text-xs mt-1.5 ml-1">
                          {error.number}
                        </p>
                      )}
                    </div>

                    {/* Submit Button */}
                    {loading ? (
                      <button
                        type="button"
                        disabled
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3.5 rounded-lg font-semibold shadow-lg shadow-purple-500/30 transition-all duration-300 flex items-center justify-center gap-3"
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
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3.5 rounded-lg font-semibold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-[1.02]"
                      >
                        Sign Up
                      </button>
                    )}

                    {/* Sign In Link */}
                    <p className="text-center text-gray-400 text-sm">
                      Already signed up?{" "}
                      <Link
                        to="/signin"
                        className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
                      >
                        Sign in
                      </Link>
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Signup;
