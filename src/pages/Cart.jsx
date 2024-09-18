import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createSale } from '../axios/sales.axios';

const Cart = () => {
 
  const [client, setClient] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const userId = JSON.parse(localStorage.getItem('user')).id;

  const handleCreateSale = async () => {
    if (!client) {
      setError('El nombre del cliente es requerido');
      return;
    }

    const saleData = {
      client,
      userId:userId, 
    };

    try {
      const saleResponse = await createSale(saleData);
      const saleId = saleResponse.id; 
      localStorage.setItem('saleId', saleId);
      
      navigate(`/ventas/details/${saleId}`); 
    } catch (err) {
      setError('Error al crear la venta');
    }
  };

  return (
    <div>
      <div className='w-4/6 m-auto'>
        <h1>Venta</h1>
        <input 
          type="text" 
          placeholder='Nombre cliente' 
          value={client}
          className={`${error ? 'border-red-500 border-2 rounded-2xl px-3' : ''}`}
          onChange={(e) => setClient(e.target.value)} 
        />
        {error && <p className="text-red-500">{error}</p>} 
        <div className='flex flex-1 flex-col gap-2'>
          <button onClick={handleCreateSale} className='px-4 py-2 bg-green-600 w-1/5 rounded-xl text-white font-semibold'>Comprar</button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
