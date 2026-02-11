

// import React, { useEffect, useState } from 'react'
// import { motion } from 'framer-motion'
// import { getDatabase, ref, onValue, set, push } from "firebase/database";
// import { useSelector } from 'react-redux';
// import toast from 'react-hot-toast';

// export default function Userlist({ userinfo }) {
//   const db = getDatabase();
//   const [userList, setUserList] = useState([])
//   const [loading, setLoading] = useState(true)
//   let [friendreqid, setFriendReqId] = useState([])
//   let [friendId, setFriendId] = useState([])
//   const [blockedUserIds, setBlockedUserIds] = useState([]); // State to hold IDs of blocked users

//   let user = useSelector((state) => (state.user.value))
  
//   useEffect(() => {
//     const userRef = ref(db, 'users/');
//     onValue(userRef, (snapshot) => {
//       let array = []
//       snapshot.forEach((item) => {
//         if (item.key !== user.uid) {

//           array.push({ ...item.val(), id: item.key })
//         }
//       });
//       setUserList(array)
//       setLoading(false)
//     });

//   }, [])

//   useEffect(() => {
//     const friendreqRef = ref(db, 'friendreq/');
//     onValue(friendreqRef, (snapshot) => {
//       let array = []
//       snapshot.forEach((item) => {
//         array.push(item.val().senderid + item.val().recieverid)
//       });
//       setFriendReqId(array);
//     });
//   }, [])

//   useEffect(() => {
//     const friendlistRef = ref(db, 'friendlist/');
//     onValue(friendlistRef, (snapshot) => {
//       let array = []
//       snapshot.forEach((item) => {
//         array.push(item.val().senderid + item.val().recieverid)
//       });
//       setFriendId(array);
//     });
//   }, [])

//   // MODIFIED: useEffect to fetch and process the blocklist
//   useEffect(() => {
//     const blocklistRef = ref(db, 'blocklist/');
//     onValue(blocklistRef, (snapshot) => {
//       let array = []
//       snapshot.forEach((item) => {
//         // Check if the current user blocked someone
//         if (user.uid === item.val().blockedbyId) {
//           array.push(item.val().blockeduserId);
//         }
//         // Check if the current user was blocked by someone
//         if (user.uid === item.val().blockeduserId) {
//           array.push(item.val().blockedbyId);
//         }
//       });
//       setBlockedUserIds(array);
//     });
//   }, [])

//   const handleFrndReq = (item) => {
//     set(push(ref(db, "friendreq/")), {
//       sendername: user.displayName,
//       senderid: user.uid,
//       senderemail: user.email,
//       recievername: item.fullname,
//       recieverid: item.id,
//       recieveremail: item.email
//     }).then(() => {
//       toast.success("Request Sent")
//     })
//   }

//   return (
//     <div className="w-full flex justify-center items-center min-h-[100vh] bg-gradient-to-br from-[#1a001f] via-[#200035] to-[#300040] p-6">
//       <motion.div
//         initial={{ opacity: 0, y: 40 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//         className="relative w-full max-w-md p-6 rounded-2xl shadow-2xl bg-gradient-to-br from-purple-900 via-indigo-900 to-[#3a003a]  bg-clip-padding"
//         style={{
//           borderImage: 'linear-gradient(90deg, rgba(255,0,255,0.3), rgba(120,80,255,0.3), rgba(255,0,255,0.3)) 1',
//         }}
//       >
//         <h2 className="text-center text-2xl font-semibold text-white mb-6 tracking-wide drop-shadow-md">
//           Users
//         </h2>

//         <ul className="space-y-4">
//           {loading ? <div className="mx-auto w-full max-w-sm rounded-md border border-blue-300 p-4">
//             <div className="flex animate-pulse space-x-4">
//               <div className="size-10 rounded-full bg-gray-200"></div>
//               <div className="flex-1 space-y-6 py-1">
//                 <div className="h-2 rounded bg-gray-200"></div>
//                 <div className="space-y-3">
//                   <div className="grid grid-cols-3 gap-4">
//                     <div className="col-span-2 h-2 rounded bg-gray-200"></div>
//                     <div className="col-span-1 h-2 rounded bg-gray-200"></div>
//                   </div>
//                   <div className="h-2 rounded bg-gray-200"></div>
//                 </div>
//               </div>
//             </div>
//           </div> :

//             userList.map((item) => (
//               <motion.li
//                 key={item.id} // Fixed key to be unique for each item
//                 whileHover={{ scale: 1.03 }}
//                 transition={{ type: 'spring', stiffness: 250 }}
//                 className="flex justify-between items-center p-4 rounded-xl bg-gradient-to-r from-indigo-900/70 via-purple-800/60 to-[#4b003c]/60 shadow-md hover:shadow-lg hover:shadow-purple-700/30 text-white"
//               >
//                 <div>
//                   <h3 className="font-semibold text-lg">{item.fullname}</h3>
//                   <p className="text-sm opacity-75">{item.email}</p>
//                 </div>
//                 {
//                   // MODIFIED: Conditional rendering for the button
//                   blockedUserIds.includes(item.id) ?
//                     <button disabled className="px-4 py-2 rounded-lg text-sm font-medium bg-red-900/80 text-white/90 cursor-not-allowed">
//                       Blocked
//                     </button>
//                   :
//                   friendId.includes(user.uid + item.id) || friendId.includes(item.id + user.uid) ?
//                     <button disabled className="px-4 py-2 rounded-lg text-sm font-medium bg-green-800/80 text-white/90 cursor-not-allowed">
//                       Friends
//                     </button>
//                   :
//                   friendreqid.includes(user.uid + item.id) || friendreqid.includes(item.id + user.uid) ?
//                     <button disabled className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-700/80 text-white/90 cursor-not-allowed">
//                       Request Sent
//                     </button>
//                   :
//                     <motion.button
//                       onClick={() => handleFrndReq(item)}
//                       whileTap={{ scale: 0.9 }}
//                       whileHover={{ scale: 1.05, backgroundColor: 'rgba(180,0,255,0.4)' }}
//                       className="px-4 py-2 rounded-lg border cursor-pointer border-purple-400/50 text-sm font-medium text-white bg-gradient-to-r from-purple-900/50 via-indigo-800/40 to-pink-900/40 backdrop-blur-md shadow-md hover:shadow-purple-700/40 transition-all duration-300"
//                     >
//                       Add Friend
//                     </motion.button>
//                 }
//               </motion.li>
//             ))}
//         </ul>

//         {/* Animated glowing border */}
//         <motion.div
//           animate={{
//             background: [
//               'linear-gradient(90deg, rgba(255,0,255,0.1), rgba(120,80,255,0.1))',
//               'linear-gradient(270deg, rgba(255,0,255,0.15), rgba(120,80,255,0.2))',
//             ],
//           }}
//           transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
//           className="absolute inset-0 rounded-2xl border-[1px] border-transparent bg-clip-border pointer-events-none"
//           style={{ boxShadow: '0 0 20px rgba(120,80,255,0.2)' }}
//         />
//       </motion.div>
//     </div>
//   )
// }

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getDatabase, ref, onValue, set, push } from "firebase/database";
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

export default function Userlist() {
  const db = getDatabase();
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [friendreqid, setFriendReqId] = useState([]);
  const [friendId, setFriendId] = useState([]);
  
  // States to manage the blocking relationship
  const [usersIBlocked, setUsersIBlocked] = useState([]);
  const [usersWhoBlockedMe, setUsersWhoBlockedMe] = useState([]);

  const user = useSelector((state) => (state.user.value));
  
  useEffect(() => {
    if (!user) return; // Guard clause if user data is not yet available

    const userRef = ref(db, 'users/');
    onValue(userRef, (snapshot) => {
      let array = [];
      snapshot.forEach((item) => {
        if (item.key !== user.uid) {
          array.push({ ...item.val(), id: item.key });
        }
      });
      setUserList(array);
      setLoading(false);
    });

  }, [user]);

  useEffect(() => {
    if (!user) return;
    
    const friendreqRef = ref(db, 'friendreq/');
    onValue(friendreqRef, (snapshot) => {
      let array = [];
      snapshot.forEach((item) => {
        array.push(item.val().senderid + item.val().recieverid);
      });
      setFriendReqId(array);
    });
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const friendlistRef = ref(db, 'friendlist/');
    onValue(friendlistRef, (snapshot) => {
      let array = [];
      snapshot.forEach((item) => {
        array.push(item.val().senderid + item.val().recieverid);
      });
      setFriendId(array);
    });
  }, [user]);

  // MODIFIED: useEffect to differentiate who blocked whom
  useEffect(() => {
    if (!user) return;

    const blocklistRef = ref(db, 'blocklist/');
    onValue(blocklistRef, (snapshot) => {
      let iBlocked = [];
      let blockedMe = [];
      snapshot.forEach((item) => {
        // Check if the current user is the one who blocked
        if (item.val().blockedbyId === user.uid) {
          iBlocked.push(item.val().blockeduserId);
        }
        // Check if the current user is the one who was blocked
        if (item.val().blockeduserId === user.uid) {
          blockedMe.push(item.val().blockedbyId);
        }
      });
      setUsersIBlocked(iBlocked);
      setUsersWhoBlockedMe(blockedMe);
    });
  }, [user]);

  const handleFrndReq = (item) => {
    set(push(ref(db, "friendreq/")), {
      sendername: user.displayName,
      senderid: user.uid,
      senderemail: user.email,
      recievername: item.fullname,
      recieverid: item.id,
      recieveremail: item.email
    }).then(() => {
      toast.success("Request Sent");
    });
  };

  return (
    <div className="w-full flex justify-center items-center min-h-[100vh] bg-gradient-to-br from-[#1a001f] via-[#200035] to-[#300040] p-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md p-6 rounded-2xl shadow-2xl bg-gradient-to-br from-purple-900 via-indigo-900 to-[#3a003a] bg-clip-padding"
      >
        <h2 className="text-center text-2xl font-semibold text-white mb-6 tracking-wide drop-shadow-md">
          Users
        </h2>

        <ul className="space-y-4">
          {loading ? (
             <div className="mx-auto w-full max-w-sm rounded-md border border-blue-300 p-4">
               <div className="flex animate-pulse space-x-4">
                 <div className="size-10 rounded-full bg-gray-600"></div>
                 <div className="flex-1 space-y-6 py-1">
                   <div className="h-2 rounded bg-gray-500"></div>
                   <div className="space-y-3">
                     <div className="grid grid-cols-3 gap-4">
                       <div className="col-span-2 h-2 rounded bg-gray-500"></div>
                       <div className="col-span-1 h-2 rounded bg-gray-500"></div>
                     </div>
                     <div className="h-2 rounded bg-gray-500"></div>
                   </div>
                 </div>
               </div>
             </div>
          ) : (
            userList.map((item) => (
              <motion.li
                key={item.id}
                whileHover={{ scale: 1.03 }}
                transition={{ type: 'spring', stiffness: 250 }}
                className="flex justify-between items-center p-4 rounded-xl bg-gradient-to-r from-indigo-900/70 via-purple-800/60 to-[#4b003c]/60 shadow-md hover:shadow-lg hover:shadow-purple-700/30 text-white"
              >
                <div>
                  <h3 className="font-semibold text-lg">{item.fullname}</h3>
                  <p className="text-sm opacity-75">{item.email}</p>
                </div>
                {
                  // MODIFIED: Conditional button rendering with "Blocked" and "Unavailable" states
                  usersIBlocked.includes(item.id) ? (
                    <button disabled className="px-4 py-2 rounded-lg text-sm font-medium bg-red-900/80 text-white/90 cursor-not-allowed">
                      Blocked
                    </button>
                  ) : usersWhoBlockedMe.includes(item.id) ? (
                    <button disabled className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-800/80 text-white/90 cursor-not-allowed">
                      Unavailable
                    </button>
                  ) : friendId.includes(user.uid + item.id) || friendId.includes(item.id + user.uid) ? (
                    <button disabled className="px-4 py-2 rounded-lg text-sm font-medium bg-green-800/80 text-white/90 cursor-not-allowed">
                      Friends
                    </button>
                  ) : friendreqid.includes(user.uid + item.id) || friendreqid.includes(item.id + user.uid) ? (
                    <button disabled className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-700/80 text-white/90 cursor-not-allowed">
                      Request Sent
                    </button>
                  ) : (
                    <motion.button
                      onClick={() => handleFrndReq(item)}
                      whileTap={{ scale: 0.9 }}
                      whileHover={{ scale: 1.05, backgroundColor: 'rgba(180,0,255,0.4)' }}
                      className="px-4 py-2 rounded-lg border cursor-pointer border-purple-400/50 text-sm font-medium text-white bg-gradient-to-r from-purple-900/50 via-indigo-800/40 to-pink-900/40 backdrop-blur-md shadow-md hover:shadow-purple-700/40 transition-all duration-300"
                    >
                      Add Friend
                    </motion.button>
                  )
                }
              </motion.li>
            ))
          )}
        </ul>
      </motion.div>
    </div>
  );
}