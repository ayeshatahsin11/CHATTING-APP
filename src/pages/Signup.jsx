import React, { useState } from 'react'
import { FaUserAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { RxEyeOpen } from "react-icons/rx";
import { BsFillTelephoneFill } from "react-icons/bs";
import { BsEyeSlashFill } from "react-icons/bs";
import { auth } from '../firebase.config';
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from 'firebase/auth';
import { getDatabase, ref, set } from "firebase/database";

import toast, { Toaster } from 'react-hot-toast';
import { Link } from 'react-router';
import { useNavigate } from 'react-router';

const Signup = () => {
    const navigate = useNavigate();
    const db = getDatabase();
    let [info, setInfo] = useState({
        name: "",
        email: "",
        password: "",
        number: "",

    })
    let [loading, setLoading] = useState(false)

    let [error, setError] = useState({
        name: "",
        email: "",
        password: "",
        number: "",

    })
    let [showPassword, setShowPassword] = useState(false)

    let handleShowingPassword = () => {
        setShowPassword(!showPassword)
    }


    let handleName = (e) => {
        setInfo((prev) => ({
            ...prev, name: e.target.value
        }))
        setError("")
    }
    let handleEmail = (e) => {
        setInfo((prev) => ({
            ...prev, email: e.target.value
        }))
        setError("")
    }
    let handlePassword = (e) => {
        setInfo((prev) => ({
            ...prev, password: e.target.value
        }))
        setError("")
    }
    let handleNumber = (e) => {
        setInfo((prev) => ({
            ...prev, number: e.target.value
        }))
        setError("")
    }


    console.log(info)

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
        } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(info.email)) {
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
            setLoading(true)
            createUserWithEmailAndPassword(auth, info.email, info.password)
                .then((userCredential) => {
                    toast.success('Successfully created an account!')
                    sendEmailVerification(auth.currentUser)
                        .then(() => {
                            updateProfile(auth.currentUser, {
                                displayName: info.name, photoURL: "https://www.nuflowerfoods.com/wp-content/uploads/2024/09/person-dummy-Copy.jpg"
                            }).then(() => {
                                // Profile updated!
                                toast.success("Kindly check your Email for verification")

                                setLoading(false)

                                const user = userCredential.user;
                                console.log(user)
                                // ...data store
                                set(ref(db, 'users/' + user.uid), {
                                    fullname: info.name,
                                    email: info.email,

                                });
                            }).catch((error) => {
                                setLoading(false)
                                console.log(error)
                            });


                        }).catch(() => {
                            toast.error("Couldn't send verify code to your Email")
                        })
                    setTimeout(() => {
                        navigate("/signin");
                    }, 1000)
                }

                )
                .catch((error) => {

                    const errorCode = error.code;
                    const errorMessage = error.message;
                    setError((prev) => ({
                        ...prev,
                        email: "This Email is already in use",

                    }))
                    setLoading(false);
                    valid = false;
                });
        }
    };


    return (
        <div>
            <Toaster
                position="top-center"
                reverseOrder={false}
            />
            <main className="bg-gradient-to-r from-blue-950 via-purple-900 to-indigo-800  min-h-screen flex items-center justify-center p-4">
                <div className="w-full max-w-4xl mx-auto bg-black rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden">

                    {/* Left Part: Form */}
                    <div className="w-full md:w-1/2 p-8 md:p-12 bg-slate-900">
                        <h1 className="text-3xl font-bold text-white mb-2">Get Started</h1>
                        <p className="text-gray-400 mb-8">Create your account now</p>

                        <form onSubmit={handleSubmit} >
                            <div className='flex relative py-[20px]'>
                                <FaUserAlt className='text-gray-500 absolute right-[10px]' />
                                <input
                                    id="name"
                                    type="text"
                                    onChange={handleName}
                                    required
                                    placeholder="Full Name"
                                    className={`bg-transparent border-b ${error.name ? "border-red-600" : "border-gray-600"} text-white text-sm focus:outline-none focus:border-indigo-500 block w-full transition-colors duration-300 py-[5px] `}
                                    autoComplete="off"

                                    icon={<path ></path>}
                                />
                            </div>
                            {error.name && <p className='text-red-700 mt-[-10px]'>{error.name}</p>}
                            <div className="flex relative py-[20px]">
                                <MdEmail className=" text-gray-400 absolute right-[10px]" />
                                <input
                                    id="email"
                                    type="email"
                                    onChange={handleEmail}
                                    required
                                    placeholder="Email address"
                                    autoComplete="off"
                                    className={`bg-transparent border-b ${error.email ? "border-red-600" : "border-gray-600"}  text-white text-sm focus:outline-none focus:border-indigo-500 w-full  transition-colors duration-300 py-[5px]
                               `} />
                            </div>
                            {error.email && <p className='text-red-700 mt-[-10px]'>{error.email}</p>}
                            <div className='flex relative py-5'>

                                <button onClick={handleShowingPassword}> {showPassword ? <BsEyeSlashFill className=" text-gray-500 absolute right-[10px]" /> : <RxEyeOpen className=" text-gray-500 absolute right-[10px]" />}        </button>


                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    onChange={handlePassword}
                                    placeholder="Password"
                                    className={`bg-transparent border-b ${error.password ? "border-red-600" : "border-gray-600"}  text-white text-sm focus:outline-none focus:border-indigo-500 w-full  transition-colors duration-300 py-[5px]
                               `}
                                    autoComplete="off"

                                    icon={<svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>}
                                />
                            </div>
                            {error.password && <p className='text-red-700  mt-[-10px]'>{error.password}</p>}
                            <div className='flex relative  py-[5px]'>
                                <BsFillTelephoneFill className='text-gray-500 absolute right-[10px]' />
                                <input
                                    id="number"
                                    type="tel"
                                    required
                                    onChange={handleNumber}
                                    placeholder="Phone Number"
                                    className={`bg-transparent border-b ${error.number ? "border-red-600" : "border-gray-600"}  text-white text-sm focus:outline-none focus:border-indigo-500 w-full  transition-colors duration-300 py-[5px]
                               `}
                                    autoComplete="off"

                                    icon={<svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>}
                                />
                            </div>
                            {error.number && <p className='text-red-700'>{error.number}</p>}
                        </form>
                    </div>

                    {/* Right Part: Image and Actions */}
                    <div className="w-full md:w-1/2 bg-gray-800 p-8 md:p-12 flex flex-col items-center justify-between text-center">
                        <div className="flex-grow flex items-center justify-center">
                            <img
                                src="https://media.istockphoto.com/id/1152137747/vector/cute-panda-character-vector-design.jpg?s=612x612&w=0&k=20&c=ApH4-e_IpWqWhYtHseokRb4-TPL5tp7220FWKyM07Dc="
                                alt="Cute panda waving"
                                className="max-w-xs w-full h-auto object-contain"
                            />
                        </div>

                        <div className="w-full">

                            {loading ? <button className="w-full bg-black mt-[20px] text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white mb-4 cursor-pointer" >
                                <div role="status">
                                    <svg
                                        aria-hidden="true"
                                        className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
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

                                </div>
                                loading .....
                            </button>
                                : <button
                                    type="submit"
                                    onClick={handleSubmit}
                                    className="w-full bg-black mt-[20px] text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white mb-4 cursor-pointer"
                                >
                                    Sign Up
                                </button>}


                            <p className="text-gray-400 text-sm">
                                Already signed up? <Link to="/signin" className="text-indigo-400 hover:underline">Sign in</Link>
                            </p>

                        </div>
                    </div>

                </div>
            </main>
        </div>
    )
}

export default Signup