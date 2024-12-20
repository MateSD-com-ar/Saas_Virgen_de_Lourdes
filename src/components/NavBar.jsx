import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { NavLinks } from '../utils/utils';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';

const NavBar = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user); // Asegúrate de que la información del usuario esté en el estado global
  const [isAdmin, setIsAdmin] = useState(user?.role === 'ADMIN');
  const sessionTimeout = 4 * 60 * 60 * 1000; // 4 horas en milisegundos
  const inactivityTimeout = 30 * 60 * 1000; // 30 minutos de inactividad (modificable)

  useEffect(() => {
    setIsAdmin(user?.role === 'ADMIN');

    // Función para cerrar sesión
    const handleLogout = () => {
      dispatch(logout());
      localStorage.removeItem('user');
    };

    // Deslogueo automático por tiempo de sesión
    const sessionTimer = setTimeout(() => {
      handleLogout();
    }, sessionTimeout);

    // Deslogueo por inactividad
    let inactivityTimer;
    const resetInactivityTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        handleLogout();
      }, inactivityTimeout);
    };

    // Eventos para detectar actividad
    window.addEventListener('mousemove', resetInactivityTimer);
    window.addEventListener('keydown', resetInactivityTimer);
    window.addEventListener('scroll', resetInactivityTimer);

    // Inicializa el temporizador de inactividad
    resetInactivityTimer();

    // Limpieza de eventos y temporizadores al desmontar el componente
    return () => {
      clearTimeout(sessionTimer);
      clearTimeout(inactivityTimer);
      window.removeEventListener('mousemove', resetInactivityTimer);
      window.removeEventListener('keydown', resetInactivityTimer);
      window.removeEventListener('scroll', resetInactivityTimer);
    };
  }, [dispatch, sessionTimeout, inactivityTimeout, user?.role]);

  const handleLogoutClick = () => {
    dispatch(logout());
    localStorage.removeItem('user');
  };

  return (
    <nav className='bg-slate-500 text-white flex flex-col lg:flex-row justify-between gap-4 px-4 py-2 items-center w-full m-auto h-auto lg:h-16'>
      {/* Mobile Menu Toggle Button */}
      <div>
        {/* Navigation Links */}
        <div className='flex flex-row items-center gap-4 lg:gap-6'>
          <Link to='/cart' className='bg-green-500 text-white lg:px-4 lg:py-2 p-1 rounded-full font-semibold hover:bg-green-600'>
            Iniciar Venta
          </Link>
          <Link to='/productos' className='bg-yellow-300 text-black lg:px-4 lg:py-2 p-1 rounded-full font-medium'>Productos</Link>
          <div className='flex gap-1'>
            {isAdmin && (
              <Link to='/admin' className='bg-orange-500 text-white lg:px-4 lg:py-2 p-1 rounded-full font-medium hover:bg-orange-600'>
                ADMIN
              </Link>
            )}
            <button onClick={handleLogoutClick} className='bg-red-700 text-white lg:px-4 lg:py-2 p-1 rounded-full font-medium hover:bg-red-800'>
              SALIR
            </button>
          </div>
        </div>
      </div>
      <div className='lg:hidden flex items-center'>
        <button className='text-white text-2xl' onClick={() => document.getElementById('mobile-menu').classList.toggle('hidden')}>
          &#9776;
        </button>
      </div>
      {/* Nav Links for Desktop */}
      <div className='hidden lg:flex flex-row items-center gap-4 lg:gap-6'>
        {NavLinks.map((link, index) => (
          <Link key={index} to={link.path} className='hover:text-orange-500'>
            {link.name}
          </Link>
        ))}
      </div>
      {/* Mobile Nav Menu */}
      <div id='mobile-menu' className='lg:hidden hidden flex-col items-center gap-4 mt-4'>
        {NavLinks.map((link, index) => (
          <Link key={index} to={link.path} className='text-lg px-1 hover:text-orange-500'>
            {link.name}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default NavBar;
