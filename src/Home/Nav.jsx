
import React, { useState } from 'react'
import { FaHome, FaUserAlt } from 'react-icons/fa'
import { BiMessageDetail } from 'react-icons/bi'
import { RiLogoutBoxRLine } from 'react-icons/ri'
import { motion, AnimatePresence } from 'framer-motion'
import { useSelector, useDispatch } from 'react-redux'

import { getAuth, signOut } from 'firebase/auth'
import { useNavigate } from 'react-router' // keep as you had it
import { userinfo } from '../slices/userSlice'

export default function Nav() {
  const [active, setActive] = useState('') // currently active icon id
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const user = useSelector((s) => s.user?.value)
  const dispatch = useDispatch()

  const items = [
    { id: '/', label: 'Home', icon: <FaHome size={20} /> , name : 'Home' },
    { id: '/message', label: 'Messages', icon: <BiMessageDetail size={20} /> , name :' Message'},
    { id: '/user', label: 'Profile', icon: <FaUserAlt size={20} /> ,name : 'Profile'},
    { id: '/logout', label: 'Logout', icon: <RiLogoutBoxRLine size={20} /> , name : 'Logout'},
  ]

  const auth = getAuth()
  const navigate = useNavigate()

  const handleClick = (id) => {
    // If logout, open logout confirmation modal
    if (id === '/logout') {
      setShowLogoutModal(true)
      setActive('')
      return
    }

    // If profile, toggle the profile popup (do NOT navigate)
    if (id === '/user') {
      setShowLogoutModal(false)
      setActive((prev) => (prev === id ? '' : id))
      return
    }

    // For other items (home, messages) navigate and toggle active
    navigate(id)
    setShowLogoutModal(false)
    setActive((prev) => (prev === id ? '' : id))
  }

  const closeLogoutModal = (e) => {
    if (e) e.stopPropagation()
    setShowLogoutModal(false)
  }

  const handleLogoutConfirm = () => {
    // close modal immediately for UX
    setShowLogoutModal(false)

    signOut(auth)
      .then(() => {
        // Sign-out successful.
        localStorage.removeItem('user')
        dispatch(userinfo(null))
        navigate('/signin')
      })
      .catch((error) => {
        console.log(error)
      })
  }

  return (
    // keep nav centered but note pointer-events on outer wrapper is NONE,
    // modal uses pointer-events-auto so it receives clicks
    <div className="fixed inset-x-0 bottom-6 left-[-1200px] flex justify-center pointer-events-none">
    
      <nav className="pointer-events-auto w-fit px-4 py-3 rounded-2xl shadow-2xl bg-gradient-to-r from-purple-900 via-indigo-900 to-pink-700/80 backdrop-blur-md">
        <ul className="flex items-center gap-6">
          {items.map((it) => {
            const isActive = active === it.id
            return (
              <li key={it.id} className="relative">
                <button
                  type="button"
                  onClick={() => handleClick(it.id)}
                  className={`relative z-10 flex items-center justify-center cursor-pointer w-12 h-12 rounded-xl text-white transition-transform focus:outline-none ${
                    isActive ? 'scale-110' : 'hover:scale-105'
                  }`}
                >
                  <motion.span
                    animate={isActive ? { scale: [1, 1.18, 1] } : { scale: 1 }}
                    transition={{ duration: 0.6 }}
                    className="inline-block"
                  >
                    {it.icon}
                  </motion.span>

                  <AnimatePresence>
                    {isActive && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 rounded-xl ring-2 ring-white/10"
                        aria-hidden
                      />
                    )}
                  </AnimatePresence>
                     <h4>{items.name}</h4>
                </button>
             
                {/* Popups for non-logout icons; make sure popup has pointer-events-auto */}
                <AnimatePresence>
                  {isActive && it.id !== '/logout' && (
                    <motion.div
                      initial={{ y: 8, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 8, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                      className="absolute -top-24 left-1/2 -translate-x-1/2 w-52 rounded-2xl p-4 bg-gradient-to-t from-black/80 via-indigo-900/70 to-purple-800/60 shadow-xl text-white text-sm pointer-events-auto"
                    >
                      {it.id === '/user' ? (
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-700 to-indigo-700 flex items-center justify-center text-lg font-bold">
                            {user?.displayName?.[0]?.toUpperCase() || 'U'}
                          </div>
                          <div>
                            <p className="font-semibold text-base">{user?.displayName || 'Unknown User'}</p>
                            <p className="text-xs opacity-70">Active Profile</p>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <p className="font-semibold text-base mb-1">{it.label}</p>
                          <p className="text-xs opacity-75">{`Open ${it.label.toLowerCase()}`}</p>
                        </div>
                      )}

                      <div className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-3 h-3 rotate-45 bg-gradient-to-t from-black/80 via-indigo-900/70 to-purple-800/60" />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* subtle background glow */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.18 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.35 }}
                      className="absolute inset-0 -z-10 rounded-xl blur-2xl"
                      style={{
                        background:
                          'radial-gradient(circle at 30% 20%, rgba(199,102,255,0.45), transparent 25%), radial-gradient(circle at 80% 80%, rgba(99,102,255,0.3), transparent 20%)',
                      }}
                      aria-hidden
                    />
                  )}
                </AnimatePresence>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* ========== Logout Modal ========== */}
      <AnimatePresence>
        {showLogoutModal && (
          // overlay must be pointer-events-auto so clicks reach children
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 pointer-events-auto"
            onClick={closeLogoutModal} // clicking overlay closes modal
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="bg-gradient-to-br from-[#1c0029] via-[#2a0049] to-[#3f0070] text-white rounded-2xl p-6 shadow-2xl w-80 text-center pointer-events-auto"
              onClick={(e) => e.stopPropagation()} // prevent overlay click from closing when clicking modal content
            >
              <h2 className="text-lg font-semibold mb-3">You really want to logout?</h2>
              <p className="text-sm opacity-80">This will sign you out of the app.</p>

              <div className="flex justify-center gap-4 mt-5">
                <button
                  type="button"
                  onClick={handleLogoutConfirm}
                  className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 transition-all font-medium shadow-md cursor-pointer"
                >
                  Logout
                </button>

                <button
                  type="button"
                  onClick={closeLogoutModal}
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition-all font-medium shadow-md cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

