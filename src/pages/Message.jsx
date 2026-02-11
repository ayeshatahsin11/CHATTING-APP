
import { getDatabase, onValue, push, ref, remove, set } from "firebase/database";
import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selecteduser } from "../slices/messageslice";
import { AiFillCloseCircle } from "react-icons/ai";
import toast from "react-hot-toast";
import moment from "moment/moment";

const ChatApp = () => {
  let user = useSelector((state) => (state.user.value))
  let selectedUser = useSelector((state) => (state.selecteduser.value))
  console.log(user)
  console.log(selectedUser);
  const messagesEndRef = useRef(null);
  const gradientClass = "bg-gradient-to-r from-indigo-900 via-fuchsia-900 to-purple-900";
  const [friendmsg, setFriendMsg] = useState([]);
  const db = getDatabase();
  let [msglist, setMsgList] = useState([])
  let dispatch = useDispatch();

  useEffect(() => {
    const friendreqRef = ref(db, 'friendlist/');
    onValue(friendreqRef, (snapshot) => {
      let array = []
      snapshot.forEach((item) => {
        if (user.uid == item.val().senderid || user.uid == item.val().recieverid) {

          array.push({ ...item.val(), id: item.key })
        }

      });
      setFriendMsg(array);
    });

  }, [user.uid]) // Added user.uid as a dependency

  useEffect(() => {
    if (selectedUser) { // Only run this effect if a user is selected
      const msgRef = ref(db, 'msglist/');
      onValue(msgRef, (snapshot) => {
        let array = []
        snapshot.forEach((item) => {
          if ((user.uid === item.val().senderid && selectedUser.id === item.val().recieverid) || (user.uid === item.val().recieverid && selectedUser.id === item.val().senderid)) {
            array.push(item.val())
          }
        });
        setMsgList(array)
      });
    }
  }, [selectedUser, user.uid]) // Added user.uid as a dependency
  console.log(msglist);

  let handleselectuser = (item) => {
    if (user.uid === item.senderid) {
      dispatch(selecteduser({ name: item.recievername, email: item.recieveremail, id: item.recieverid }))
    } else {
      dispatch(selecteduser({ name: item.sendername, email: item.senderemail, id: item.senderid }))
    }
  }
  console.log(friendmsg)
  let [msg, setMsg] = useState("")

  let handleMsgInput = (e) => {
    setMsg(e.target.value)
  }

  let handleSendMsg = (e) => {
    e.preventDefault();
    if (!msg.trim()) return; // Prevent sending empty messages
    set(push(ref(db, "msglist/")), {
      sendername: user.displayName,
      senderemail: user.email,
      senderid: user.uid,
      recievername: selectedUser.name,
      recieveremail: selectedUser.email,
      recieverid: selectedUser.id,
      Message: msg,
      Time: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`

    }).then(() => {
      setMsg("")
      toast.success("Message Sent")
    })
  }

  let handleBlock = (item) => {
    const isBlockingCurrentUser = (user.uid === item.senderid && selectedUser?.id === item.recieverid) ||
      (user.uid === item.recieverid && selectedUser?.id === item.senderid);

    if (user.uid === item.senderid) {
      set(push(ref(db, "blocklist/")), {
        blockedbyId: user.uid,
        blockedby: user.displayName,
        blockeduserId: item.recieverid,
        blockeduser: item.recievername
      }).then(() => {
        toast.success("Blocked")
        remove(ref(db, 'friendlist/' + item.id))
        if (isBlockingCurrentUser) {
          dispatch(selecteduser(null))
        }
      })
    } else {
      set(push(ref(db, "blocklist/")), {
        blockedbyId: user.uid,
        blockedby: user.displayName,
        blockeduserId: item.senderid,
        blockeduser: item.sendername
      }).then(() => {
        toast.success("Blocked")
        remove(ref(db, 'friendlist/' + item.id))
        if (isBlockingCurrentUser) {
          dispatch(selecteduser(null))
        }
      })
    }
  }
  let handleClose = ()=>{
    dispatch(selecteduser(null))
  }

  return (
    <div className="flex h-screen bg-gray-950 text-white">
      {/* Sidebar */}
      <div className="w-1/3 min-w-80 bg-gray-900 shadow-xl rounded-l-xl overflow-hidden flex flex-col border-r border-fuchsia-900">
        <div className={`p-4 text-xl font-bold border-b border-gray-800 ${gradientClass} bg-opacity-10`}>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
            Messages
          </span>
        </div>
        {/* Chat List */}
        <div className="flex-1 overflow-y-auto p-3">
          {friendmsg.map((item) => (
            <div
              key={item.id}
              className={`flex items-center mb-4 cursor-pointer p-2 rounded-md  "bg-indigo-900/50 border-l-4 border-fuchsia-600 hover:bg-gray-600"}`}
            >
              <div className="flex-1" >
                {user.uid === item.senderid ? <><h2 onClick={() => handleselectuser(item)} className="text-lg font-semibold">{item.recievername}</h2>  <p className="text-gray-400 text-sm truncate">{item.recieveremail}</p></> : <><h2 onClick={() => handleselectuser(item)} className="text-lg font-semibold">{item.sendername}</h2> <p className="text-gray-400 text-sm truncate">{item.senderemail}</p></>}
              </div>
              {/* FIX APPLIED HERE */}
              <button type="button" onClick={() => handleBlock(item)} className={`${selectedUser?.name ? "p-3 font-semibold  cursor-pointer  text-[14px] z-50 rounded-lg bg-gradient-to-r from-indigo-900 via-fuchsia-900 to-purple-900 " : "hidden"}`}>Block</button>
  <button onClick={handleClose} className={`${selectedUser?.name ? "p-3 font-semibold  cursor-pointer  text-[24px] z-50 text-gray-500 " : "hidden"}`} ><AiFillCloseCircle /></button>
                              

            </div>

          ))}
        </div>
      </div>
      {/* Chat Window */}
      {selectedUser ? <div className="flex-1 flex flex-col bg-gray-900 shadow-2xl rounded-r-xl overflow-hidden">
        {/* Chat Header */}
        <div className={`p-4 border-b-2 border-transparent relative overflow-hidden bg-gray-800/80`}>
          <div className={`absolute inset-0 h-full w-full opacity-30 ${gradientClass} filter blur-sm`}></div>
          <h2 className="text-xl font-bold relative z-10">{selectedUser.name}</h2>
          <p className={`${selectedUser.name ? "text-sm text-fuchsia-400 relative z-10" : "hidden"}`}>Active Now</p>

        </div>
        {/* Messages */}
        <div className="flex-1 p-6 overflow-y-auto space-y-2">
          {msglist.map((item, index) => (

            item.senderid === user.uid
              ? <div key={index} className={` ${gradientClass} text-white ml-auto rounded-l-2xl rounded-tr-2xl p-3 max-w-xs lg:max-w-md shadow-lg `} >    <p>{item.Message}</p>
                <p>{moment(item.Time, "YYYY-MM-DD HH:mm:ss").fromNow()}</p></div>
              : <div key={index} className="bg-gray-700 text-gray-200 mr-auto rounded-r-2xl rounded-tl-2xl p-3 max-w-xs lg:max-w-md shadow-md"><p>{item.Message}</p>    <p>{moment(item.Time, "YYYY-MM-DD HH:mm:ss").fromNow()}</p></div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-800 bg-gray-800/50">
          <form className="flex items-center space-x-3 rounded-xl p-0.5 border-2 border-transparent" style={{ backgroundImage: `linear-gradient(to right, #1e1b4b, #4a044e, #4c056d), linear-gradient(to right, #4c056d, #4a044e, #1e1b4b)`, backgroundOrigin: 'border-box', backgroundClip: 'content-box, border-box' }}>
            <input
              type="text"
              name="message"
              value={msg}
              placeholder="Write a message..."
              className="flex-1 p-3 bg-gray-900 text-gray-200 placeholder-gray-500 rounded-lg focus:outline-none"
              onChange={handleMsgInput}
            />
            <button type="submit" onClick={handleSendMsg} className={`p-3 font-semibold cursor-pointer text-sm rounded-lg ${gradientClass}`}>
              Send
            </button>
          </form>
        </div>
      </div> :
        <div className="flex-1 flex items-center justify-center">
          <h1 className="text-4xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">Start a conversation here!</h1>
        </div>
      }
    </div>
  );
};

export default ChatApp;