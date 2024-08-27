import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getAllUsers, deleteEmployee } from '../axios/employ.axios'

const Employ = () => {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        getAllUsers()
            .then(res => {
                setUsers(res)
                setLoading(false)
            })
            .catch(err => console.log(err))
    }, [])

    const getClassName = (user) => {
    
        return user.isActive ? 'bg-green-500' : 'bg-gray-300'
    }

    return (
        <div className='max-w-[800px] m-auto'>
            <div>
                <h1 className='text-2xl font-bold'>Empleados</h1>
                <div className='flex flex-row justify-between'>
                    <Link to='/admin' className='text-lg font-semibold px-4 py-1 text-white bg-orange-500 rounded-xl'>Volver</Link>
                    <Link to='/empleados/create' className='text-lg font-semibold px-4 py-1 text-white bg-green-500 rounded-xl'>Cargar</Link>
                </div>
            </div>
            <div className='flex flex-col justify-center items-center gap-2'>
                {loading ? (
                    <h1>Cargando...</h1>
                ) : (
                    users.map(user => (
                        <div key={user.id} className={`flex flex-row gap-10 w-3/4 justify-between items-center border rounded-lg px-2 py-2 ${getClassName(user)}`}>
                            <h2>{user.name}</h2>
                            <div className='flex gap-4 justify-center flex-row items-center'>

                            <p>{user.role === 'EMPLOYEE' ? 'Empleado' : 'ADMINISTRADOR'}</p>
                            {
                                user.role === 'EMPLOYEE' && <button onClick={() => deleteEmployee(user.id)} className='bg-red-500 text-white px-2 py-1 rounded-lg'>Eliminar</button>

                            }
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default Employ
