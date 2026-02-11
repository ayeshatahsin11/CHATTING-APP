import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router'
import Rootlayout from './layout/Rootlayout';
import Home from './pages/Home'
import About from './pages/About'
import Signup from './pages/Signup';
import Signin from './pages/Signin';
import Message from './pages/Message';



const App = () => {

  let router = createBrowserRouter([
    {
      path: "/",
      Component: Rootlayout,
      children: [
        { index: true, Component: Home },
        { path: "about", Component: About },
{
      path: "/message",
      Component: Message,
    },
        // all the private pages/routes will be placed here.

      ],
    },
    {
      path: "/signup",
      Component: Signup,
    },
      {
      path: "/signin",
      Component: Signin,
    },
     
    // we created seperate path (OBJECT) here for signup page cause in this page, we won't show any common component.
  ]);

  return (
    <RouterProvider router={router} />
  )
}

export default App



