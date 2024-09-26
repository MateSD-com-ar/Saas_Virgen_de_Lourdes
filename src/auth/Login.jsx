/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../redux/slices/authSlice';
import { authLogin } from '../axios/auth';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const Login = () => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleLoginAxios = useCallback(async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Both fields are required.');
      return;
    }
    setLoading(true);
    try {
      const response = await authLogin(username, password);
      const { accessToken, user } = response;

      if (accessToken) {
        dispatch(login({ token: accessToken, user })); // Adjust payload structure
        window.location.href = '/cart';
      } else {
        throw new Error('No token received');
      }
    } catch (error) {
      setError('Login failed. Please check your credentials and try again.');
      console.error('Login failed', error);
    } finally {
      setLoading(false);
    }
  }, [username, password, dispatch]);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className='flex flex-col items-center bg-slate-400 w-full h-screen gap-7'>
      <h1 className='text-2xl'>BIENVENIDOS</h1>
      {error && <p className='text-red-500' aria-live="assertive">{error}</p>}
      <form className='flex flex-col gap-2 uppercase text-start' onSubmit={handleLoginAxios}>
        <label htmlFor="username">Usuario</label>
        <input
          type="text"
          id="username"
          className={`${error ? 'border-red-500 border-2 rounded-2xl px-3' : 'px-3 py-1 rounded-full'}`}
          onChange={handleUsernameChange}
          value={username}
          aria-required="true"
          aria-label="Username"
        />
        <label htmlFor="password">Password</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            className={`${error ? 'border-red-500 border-2 rounded-2xl px-3' : 'px-3 py-1 rounded-full'} w-full`}
            onChange={handlePasswordChange}
            value={password}
            aria-required="true"
            aria-label="Password"
          />
          <span
            className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
            onClick={handleShowPassword}
          >
            {showPassword ? <FaRegEye className="text-lg text-black" /> : <FaRegEyeSlash className="text-lg text-black" />}
          </span>
        </div>
        <button
          className='px-4 py-2 rounded-full bg-white text-green-800 font-semibold border-2 border-solid hover:bg-slate-500'
          type='submit'
          disabled={loading}
        >
          {loading ? 'Ingresando...' : 'ENTRAR'}
        </button>
      </form>
    </div>
  );
};

export default Login;
