import React from 'react'
import { useSelector } from 'react-redux';

const About = () => {

  let data = useSelector((state)=>(state?.user?.value?.name));
  return (
    <div>About

      {data}
    </div>
  )
}

export default About