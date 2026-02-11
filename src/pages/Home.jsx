import React from 'react'
import { useSelector } from 'react-redux'
import Userlist from '../Home/Userlist'
import FriendReqlist from '../Home/FriendReqlist'
import BlockedList from '../Home/BlockedList'

const Home = () => {
let user = useSelector((state)=>(state.user.value))
console.log(user)

  return (
    <div>

     
    <div className='flex w-full'>
   <Userlist userinfo = {user}/>
       <FriendReqlist/>
       <BlockedList/>

    </div>
    </div>
  )
}

export default Home
