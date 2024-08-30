import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { NavLinks } from '../utils/utils';
import { useSelector, useDispatch } from 'react-redux';
import CartSvg from '../cart.svg';
import { logout } from '../redux/slices/authSlice';

const NavBar = () => {
  const dispatch = useDispatch();
  const cart = useSelector(state => state.cart); // Access the cart slice from Redux state
  const [cartNumber, setCartNumber] = useState(cart.totalQuantity);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
    setCartNumber(cart.totalQuantity);
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
    <div className='bg-slate-950/5 text-black flex justify-between gap-4 px-2 items-center w-full m-auto h-10'>
      <div className='flex flex-1 gap-2 px-4 flex-row items-center justify-center'>
        {NavLinks.map((link, index) => (
          <Link key={index} to={link.path} className='hover:text-orange-500'>
            {link.name}
          </Link>
        ))}
      </div>
      <div className='flex flex-1 flex-row items-center gap-4'>
        <div className='relative'>
          <Link to='/cart' className='hover:text-orange-500 text-2xl'>
            <img src={CartSvg} alt='' className='w-4 h-4 font-white' />
            {cartNumber > 0 && (
              <span className='absolute -bottom-1 -right-0 text-black font-bold text-[10px]'>
                {cartNumber}
              </span>
            )}
          </Link>
        </div>
        {isAdmin && (
          <Link to='/admin' className='px-4 py-1 bg-orange-500 text-white font-medium rounded-xl'>
            ADMIN
          </Link>
        )}
        <button onClick={handleLogout} className='px-4 py-1 bg-red-700 text-white font-medium rounded-xl'>
          SALIR
        </button>
        <p>{user?.name}</p>
      </div>
    </div>
  );
};

export default NavBar;
