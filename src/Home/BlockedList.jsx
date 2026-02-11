import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getDatabase, onValue, push, ref, remove, set } from 'firebase/database';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
export default function BlockedList() {
  let user = useSelector((state) => (state.user.value))
    let [blocklist, setBlockList] = useState([])

  let db = getDatabase();
  useEffect(() => {
    const blocklistRef = ref(db, 'blocklist/');
    onValue(blocklistRef, (snapshot) => {
      let array = []
      snapshot.forEach((item) => {
        if(user.uid == item.val().blockedbyId){
             array.push({ ...item.val(), id: item.key })
        }
      });
      setBlockList(array);
// here the condition means that if the req is sent to that definite only he should see the array info, other user's shouldn't see that ! 
    });

  }, [])
   let handleUnblock = (item)=>{
     remove(ref(db, 'blocklist/' + item.id))
   }

  return (
    <div className="w-full flex justify-center items-center min-h-[80vh] bg-gradient-to-br from-[#1a001f] via-[#200035] to-[#300040] p-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md p-6 rounded-2xl shadow-2xl bg-gradient-to-br from-purple-900 via-indigo-900 to-[#3a003a]  bg-clip-padding"
        style={{
          borderImage: 'linear-gradient(90deg, rgba(255,0,255,0.3), rgba(120,80,255,0.3), rgba(255,0,255,0.3)) 1',
        }}
      >
        <h2 className="text-center text-2xl font-semibold text-white mb-6 tracking-wide drop-shadow-md">
        Blocked Users
        </h2>

        <ul className="space-y-4">
       {blocklist.map((user) => (
            
            <motion.li
              key={user.id}
              whileHover={{ scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 250 }}
              className="flex justify-between items-center p-4 rounded-xl bg-gradient-to-r from-indigo-900/70 via-purple-800/60 to-[#4b003c]/60 shadow-md hover:shadow-lg hover:shadow-purple-700/30 text-white"
            >
              
              
              <div>
                <h3 className="font-semibold text-lg">{user.blockeduser}</h3>
                
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(180,0,255,0.4)' }}
              onClick={()=>handleUnblock(user)}
                className="px-4 py-2 rounded-lg border cursor-pointer border-purple-400/50 text-sm font-medium text-white bg-gradient-to-r from-purple-900/50 via-indigo-800/40 to-pink-900/40 backdrop-blur-md shadow-md hover:shadow-purple-700/40 transition-all duration-300"
              >
              Unblock
              </motion.button>
            </motion.li>
          ))}
        </ul>

        {/* Animated glowing border */}
        <motion.div
          animate={{
            background: [
              'linear-gradient(90deg, rgba(255,0,255,0.1), rgba(120,80,255,0.1))',
              'linear-gradient(270deg, rgba(255,0,255,0.15), rgba(120,80,255,0.2))',
            ],
          }}
          transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
          className="absolute inset-0 rounded-2xl border-[1px] border-transparent bg-clip-border pointer-events-none"
          style={{ boxShadow: '0 0 20px rgba(120,80,255,0.2)' }}
        />
      </motion.div>
    </div>
  )
}


