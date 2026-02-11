import React, { useEffect } from 'react'
import { Outlet } from 'react-router'
import app from '../firebase.config'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import Signin from '../pages/Signin'
import { getAuth } from 'firebase/auth'
import toast from 'react-hot-toast'
import Nav from '../Home/Nav'


const Rootlayout = () => {

let user = useSelector((state)=>(state.user.value))
let navigate = useNavigate();

const auth = getAuth(app);
  useEffect(()=>{
    // console.log(auth.currentUser)
       if(!user){
        navigate("/signin")
       }else if(!user.emailVerified){
             navigate("/signin")
           
       }
       else{
        console.log(auth.currentUser)
       }

  },[auth.currentUser])
  return (
   <>
 <Nav  />
   <Outlet/>
 
   </>
  )
}

export default Rootlayout

// we keep the common components here in this RootLayOut page, like navbar, footer, icons etc etc, common components appear in all pages of website.we keep only those page's path in rootlayout
// where we wanna show common things, if there are pages where we don't want that common components, we won't keep them in rootlayout, rather we'll seperate them

// outlet shows the inner details of children

