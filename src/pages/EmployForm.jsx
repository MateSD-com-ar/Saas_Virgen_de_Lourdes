import { useEffect, useState } from 'react'
import React from 'react'
import { Link } from 'react-router-dom'
import Inputs from '../ui/Inputs'
import { authRegister } from '../axios/auth'
import { updateEmployee, getEmployee } from '../axios/employ.axios'
import { useParams } from 'react-router-dom'

const EmployForm = () => {
    const [error, setError] = useState(null)
    const [name, setName] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [employ, setEmploy] = useState(null)
    const { id } = useParams()
    
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError(null)
            }, 5000)
            return () => clearTimeout(timer)
        }
    }, [error])

    useEffect(() => {
        const fetchEmploy = async () => {
            if (id) { // Solo buscar si estamos en modo edición (si hay un id)
                const response = await getEmployee(id)
                setEmploy(response[0])
                setName(response[0].name) // Poblar campos con los datos del empleado
                setUsername(response[0].username)
            }
        }
        fetchEmploy()
    }, [id])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
          if(id){
            // Solo enviar la contraseña si se está editando
            const response = await updateEmployee(id, { password })
            console.log(response)
            // window.location.href = '/empleados'
            return
          }
          // En caso de registro, enviar todos los datos
          const response = await authRegister(name, username, password)
          console.log(response)
          window.location.href = '/empleados'
        } catch (error) {
            setError(error.message)
        }
    }

    return (
        <div className='max-w-[800px] m-auto'>
            <h1 className='text-2xl font-bold text-center py-4'>{id ? "Editar Usuario" : 'Registrar Usuario'}</h1>
            <form className='flex flex-1 flex-col justify-center items-center gap-4'> 
                <Inputs 
                    className='border px-4 py-1 rounded-lg' 
                    label='Nombre' 
                    type='text' 
                    placeholder='Ingrese nombre' 
                    name='name' 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    disabled={!!id} // Deshabilitar si está editando
                />
                <Inputs 
                    className='border px-4 py-1 rounded-lg' 
                    label='Usuario' 
                    type='text' 
                    placeholder='Ingrese usuario' 
                    name='username' 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    disabled={!!id} // Deshabilitar si está editando
                />
                <Inputs 
                    className='border px-4 py-1 rounded-lg' 
                    label='Contraseña' 
                    type='password' 
                    placeholder='Ingrese contraseña' 
                    name='password' 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                />
                <button 
                    onClick={handleSubmit} 
                    className='text-lg font-semibold px-4 py-1 text-white bg-green-500 rounded-xl'>
                    Guardar
                </button>
            </form>
            <Link to='/empleados' className='text-lg font-semibold px-4 py-1 text-white bg-orange-500  rounded-xl'>Volver</Link>
        </div>
    )
}

export default EmployForm
