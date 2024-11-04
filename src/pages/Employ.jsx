import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllUsers, deleteEmployee } from '../axios/employ.axios';

const Employ = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await getAllUsers();
                setUsers(response);
            } catch (err) {
                setError('Error loading users');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleDelete = async (userId) => {
        try {
            await deleteEmployee(userId);
            // Update the list of users after deletion
            setUsers(users.filter(user => user.id !== userId));
        } catch (err) {
            setError('Error deleting user');
            console.error(err);
        }
    };

    const getClassName = (user) => {
        return user.isActive ? 'bg-green-500' : 'bg-gray-300';
    };

    return (
        <div className='w-full flex flex-col items-center justify-center gap-4 px-4 py-6 lg:max-w-[800px] m-auto'>
            <div className='w-full flex flex-col items-center mb-4'>
                <h1 className='text-2xl font-bold mb-2'>Empleados</h1>
                <Link to='/empleados/create' className='text-lg font-semibold px-4 py-2 text-white bg-green-500 rounded-xl'>
                    Cargar
                </Link>
            </div>
            {error && <div className='text-red-500 mb-4'>{error}</div>}
            <div className='w-full flex flex-col gap-4'>
                {loading ? (
                    <h1>Cargando...</h1>
                ) : (
                    users.length > 0 ? (
                        users.map(user => (
                            <div
                                key={user.id}
                                className={`flex flex-col md:flex-row gap-4 md:gap-10 w-full md:w-3/4 justify-between items-center border rounded-lg px-4 py-2 ${getClassName(user)}`}
                            >
                                <h2 className='text-lg font-semibold'>{user.name}</h2>
                                <div className='flex flex-col md:flex-row gap-4 md:gap-4 items-center'>
                                    <p className='text-sm'>{user.role === 'EMPLOYEE' ? 'Empleado' : 'ADMINISTRADOR'}</p>
                                    {user.role === 'EMPLOYEE' && (
                                        <>
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            className='bg-red-500 text-white px-3 py-1 rounded-lg'
                                            aria-label={`Eliminar ${user.name}`}
                                            >
                                            Eliminar
                                        </button>
                                      
                                        </>
                                    )}
                                    <Link
                                        to={`/empleados/${user.id}`}
                                        className='bg-blue-500 text-white px-3 py-1 rounded-lg'
                                        aria-label={`Editar ${user.name}`}
                                    >
                                        Editar
                                    </Link>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No hay empleados disponibles.</p>
                    )
                )}
            </div>
            <Link to='/admin' className='text-lg font-semibold px-4 py-2 text-white bg-orange-500 rounded-xl mt-4'>
                Volver
            </Link>
        </div>
    );
};

export default Employ;
