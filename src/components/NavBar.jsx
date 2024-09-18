import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { NavLinks } from '../utils/utils';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';

const NavBar = () => {
  const dispatch = useDispatch();
  const cart = useSelector(state => state.cart);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
  }, [cart.totalQuantity]);

  useEffect(() => {
    setIsAdmin(user?.role === 'ADMIN');
  }, [user]);

  const handleLogout = () => {
    dispatch(logout());
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem('user');
  };

  return (
    <div className='bg-slate-950/5 text-black flex flex-col lg:flex-row lg:justify-between gap-4 px-4 py-2 items-center w-full m-auto h-auto lg:h-16'>
      {/* User Info */}
      <p className='text-sm'>{user?.name}</p>

      {/* Navigation Links */}
      <div className='flex flex-1 flex-row items-center gap-4 justify-center lg:justify-start'>
        <Link to='/cart' className='hidden lg:flex gap-1 bg-green-500 text-white px-4 py-1 rounded-full font-semibold'>
          Iniciar Venta
        </Link>

        {isAdmin && (
          <Link to='/admin' className='px-4 py-1 bg-orange-500 text-white font-medium rounded-full'>
            ADMIN
          </Link>
        )}
        <button onClick={handleLogout} className='px-4 py-1 bg-red-700 text-white font-medium rounded-full'>
          SALIR
        </button>
      </div>

      {/* Mobile Navigation Links */}
      <div className='block lg:hidden flex flex-row items-center gap-4'>
        <Link to='/cart' className='flex gap-1 bg-green-500 text-white px-4 py-1 rounded-full font-semibold'>
          Iniciar Venta
        </Link>
      </div>

      {/* Nav Links */}
      <div className='flex flex-col lg:flex-row gap-4 px-4 mt-2 lg:mt-0'>
        {NavLinks.map((link, index) => (
          <Link key={index} to={link.path} className='hover:text-orange-500'>
            {link.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default NavBar;
