import { useNavigate } from 'react-router-dom'
import React from 'react'
import { useDispatch } from 'react-redux'
import { login } from '../redux/slices/authSlice'

const Login = () => {
    const Navigate = useNavigate()
    const dispatch = useDispatch()
    const handleLogin = () => {
        dispatch(login());
        Navigate('/ventas')

    }
  return (
    <div className='flex flex-col items-center bg-slate-600 w-full h-screen gap-7'>
        <h1 className='text-2xl'>BIENVENIDOS</h1>
        <form action="" className='flex flex-col  gap-2 uppercase text-start ' onSubmit={()=>handleLogin()}>
            <label htmlFor="">Email</label>
            <input type="text" className='px-3 py-1 rounded-full' />
            <label htmlFor="">Password</label>
            <input type="text" className='px-3 py-1 rounded-full' />
            <button className='px-4 py-2 rounded-full bg-white text-green-800 font-semibold border-2 border-solid hover:bg-slate-500' type='submit'>ENTRAR</button>
        </form>
      
    </div>
  )
}

export default Login
