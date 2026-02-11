import React, { useState } from 'react'
import { RxEyeOpen } from "react-icons/rx";
import { BsEyeSlashFill } from "react-icons/bs";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import toast from 'react-hot-toast';
import { auth } from '../firebase.config';
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { userinfo } from '../slices/userSlice';
import { Link, useNavigate } from 'react-router';
import { getDatabase, ref, set } from "firebase/database";



const Signin = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const db = getDatabase();
    let [data, setData] = useState({
        email: "",
        password: ""
    })
    let [error, setError] = useState({

        email: "",
        password: "",


    })

    let handleChange = (e) => {
        let { name, value } = e.target;
        setData((prev) => ({
            ...prev, [name]: value

            // name is storing email and password's value at the same time and upating as well, that's why took the 3rd bracket aka array form.

        }))
        setError(" ")
    }



    let handleSubmit = (e) => {
        let valid = true;
        e.preventDefault();
        console.log(data)

        // EMAIL
        if (!data.email) {
            setError((prev) => ({ ...prev, email: "Fill up your Email" }));
            valid = false;
        } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data.email)) {
            setError((prev) => ({ ...prev, email: "Invalid Email" }));
            valid = false;
        } else {
            setError((prev) => ({ ...prev, email: "" }));
        }

        // PASSWORD
        if (!data.password) {
            setError((prev) => ({ ...prev, password: "Fill up your Password" }));
            valid = false;
        } else if (data.password.length < 8) {
            setError((prev) => ({
                ...prev,
                password: "Password must be at least 8 characters long",
            }));
            valid = false;
        } else {
            setError((prev) => ({ ...prev, password: "" }));
        }
        if (valid) {

            signInWithEmailAndPassword(auth, data.email, data.password)
                .then((userCredential) => {
                    // Signed in 

                    toast.success("signing in successfully")
                    const user = userCredential.user;
                    dispatch(userinfo(user))
                    localStorage.setItem("user", JSON.stringify(user))
                    // ...
                    setTimeout(() => {
                        navigate("/");
                    }, 1000)
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.log(errorMessage)
                });
        } else {
            toast.error("failed to sign in")
        }
    }
    //    form tag is used for submission usually, so using onclick on button and onSubmit for form is the same thing, form has a default feature of taking reloads at web so we use preventDefault function.
    let [showPassword, setShowPassword] = useState(false)
    const handleShowingPassword = () => {
        setShowPassword(!showPassword)
    }

    const handleGoogle = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                // The signed-in user info.
                const user = result.user;
                // data store in database
                set(ref(db, 'users/' + user.uid), {
                    fullname: user.displayName,
                    email: user.email,

                });
                // IdP data available using getAdditionalUserInfo(result)
                toast.success("signing in successfully")

                dispatch(userinfo(user))
                localStorage.setItem("user", JSON.stringify(user))
                // ...
                setTimeout(() => {
                    navigate("/");
                }, 1000)
                // ...

            }).catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorMessage)
            });


    }



    return (
        <div className="min-h-screen w-full bg-slate-900 bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-900 flex items-center justify-center p-4">

            <div className="grid grid-cols-1 md:grid-cols-2 max-w-4xl w-full rounded-2xl shadow-2xl overflow-hidden backdrop-blur-sm bg-black/10">

                {/* Left Side: Panda Image */}
                <div className="hidden md:flex flex-col items-center justify-center bg-black/20 p-8">
                    <img
                        src="https://i.pinimg.com/736x/f0/8c/98/f08c98e7bdd3dff3a6d9a3fb6578ba68.jpg"
                        alt="Cute Panda Illustration"
                        className="w-[500px] h-[400px] max-w-sm object-contain drop-shadow-[0_20px_20px_rgba(0,0,0,0.5)]"
                    />
                    <h2 className="text-3xl font-bold text-white mt-4 text-center">Welcome Back to Zen Panda</h2>
                    <p className="text-gray-300 mt-2 text-center">Log in to continue your journey of peace and productivity.</p>
                </div>

                {/* Right Side: Login Form */}
                <div className="w-full bg-black/30 backdrop-blur-lg p-8 md:p-12 border border-white/10">
                    <div className="text-left">
                        <p className="text-xl text-purple-400 font-semibold font-sans">ZenPanda</p>
                        <h1 className="text-4xl font-bold text-white mt-2">Login</h1>
                    </div>

                    <form className="mt-8 space-y-6"
                        onSubmit={handleSubmit}>
                        <p className='block text-sm font-medium text-gray-300 mb-2'>Email</p>
                        <input
                            id="email"
                            label="Email"
                            name='email'
                            type="email"
                            onChange={handleChange}
                            placeholder="username@gmail.com"
                            className={`w-full ${error.email ? "border-red-600" : "border-gray-700"} bg-gray-900/50 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"'
`}
                        />
                        {error.email && <p className='text-red-700 mt-[-10px]'>{error.email}</p>}
                        <div className="relative ">
                            <p className='block text-sm font-medium text-gray-300 mb-2'>Password</p>
                            <div onClick={handleShowingPassword}> {showPassword ? <BsEyeSlashFill className=" text-gray-500 absolute right-[10px] bottom-[15px]" /> : <RxEyeOpen className=" text-gray-500 absolute right-[10px] bottom-[15px]" />}        </div>

                            <input
                                id="password"
                                label="Password"
                                name='password'
                                type={showPassword ? "text" : "password"}
                                onChange={handleChange}
                                placeholder="••••••••••"
                                className={`'block text-sm font-medium mb-2 w-full ${error.password ? "border-red-600" : "border-gray-700"} bg-gray-900/50 border  text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300'
`}
                            />
                            {error.password && <p className='text-red-700 mt-[2px]'>{error.password}</p>}

                        </div>

                        <div className="text-right">
                            <a href="#" className="text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors">
                                Forgot Password?
                            </a>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg cursor-pointer"
                        >
                            Sign In
                        </button>
                    </form>

                    <div className="flex items-center my-6">
                        <hr className="flex-grow border-gray-600" />
                        <span className="px-4 text-gray-400 text-sm">Or Continue With</span>
                        <hr className="flex-grow border-gray-600" />
                    </div>

                    <div className="flex justify-center space-x-4">

                        <button className='cursor-pointer' onClick={handleGoogle}><FcGoogle /></button>
                        <button className='cursor-pointer'><FaGithub className='text-white' /></button>
                        <button className='cursor-pointer'><FaFacebook className='text-white' /></button>
                    </div>

                    <p className="text-center text-sm text-gray-400 mt-8">
                        Don't have an account yet?{' '}
                        <Link to="/signup" className="font-medium text-purple-400 hover:text-purple-300 transition-colors">
                            Sign Up for free
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signin