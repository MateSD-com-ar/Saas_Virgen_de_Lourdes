import { useState } from 'react'
import React from 'react'

const Home = () => {
  const [userName, setUserName ] = useState('')
  console.log(userName)
  // const userName = 'XXXX'
 const getToken = localStorage.getItem('token')
console.log(getToken)
  return (
    <div className='flex flex-col items-center justify-normal '> 
      <h1>Bienvenido {getToken}</h1>
    </div>
  )
}

export default Home
