import { useEffect, useState } from 'react'
import React from 'react'
import { Link } from 'react-router-dom'
import Inputs from '../ui/Inputs'
import { authRegister } from '../axios/auth'
const EmployForm = () => {
    const [error, setError] = useState(null)
    const [name, setName] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError(null)
            }, 5000)
            return () => clearTimeout(timer)
        }
    }, [error])
 
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await authRegister(name, username, password)
            console.log(response)
            window.location.href = '/empleados'
        } catch (error) {
            setError(error.message)
        }
    }

  return (
    <div className='max-w-[800px] m-auto'>
        <h1 className='text-2xl font-bold'>ALTA EMPLEADO</h1>
      <form action="" className='flex flex-1 flex-col justify-center items-center gap-4'> 
        <Inputs   className='border px-4 py-1 rounded-lg' label='Nombre' type='text' placeholder='Ingrese nombre' name='name' value={name} onChange={(e) => setName(e.target.value)}/>
        <Inputs   className='border px-4 py-1 rounded-lg' label='Usuario' type='text' placeholder='Ingrese  usuario'  name='name' value={username} onChange={(e) => setUsername(e.target.value)}/>
        <Inputs   className='border px-4 py-1 rounded-lg' label='Contraseña' type='password' placeholder='Ingrese contraseña'  name='name' value={password} onChange={(e) => setPassword(e.target.value)}/>
      <button onClick={handleSubmit} className='text-lg font-semibold px-4 py-1 text-white bg-green-500 rounded-xl'>Guardar</button>
      </form>
      <Link to='/empleados' className='text-lg font-semibold px-4 py-1 text-white bg-orange-500  rounded-xl'>Volver</Link>

    </div>
  )
}

export default EmployForm
// name,
// username,
// password