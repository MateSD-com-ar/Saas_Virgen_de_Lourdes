import React from 'react';

const Home = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const userName = user?.name || 'Invitado';

  return (
    <div className='flex flex-col items-center justify-normal'>
      <h1>Bienvenido {userName || 'Invitado'}</h1>
    </div>
  );
};

export default Home;
