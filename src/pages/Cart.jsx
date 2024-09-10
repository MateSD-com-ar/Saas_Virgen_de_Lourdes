import React, { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart } from '../redux/slices/cartSlice';
import { useNavigate } from 'react-router-dom';
import { createSale } from '../axios/sales.axios';

const Cart = () => {
  const cart = useSelector((state) => state.cart);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  const [client, setClient] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const removeItem = useCallback((id) => {
    dispatch(removeFromCart(id));
  }, [dispatch]);
  const userId = JSON.parse(localStorage.getItem('user')).id;

  const handleCreateSale = async () => {
    if (!client) {
      setError('El nombre del cliente es requerido');
      return;
    }

    const saleData = {
      client,
      userId:userId, // Usar el ID del usuario almacenado
    };

    try {
      const saleResponse = await createSale(saleData);
      const saleId = saleResponse.id; // Asumiendo que obtienes el ID de la venta en la respuesta
      
      // Guarda el saleId en el localStorage para usarlo en Checkout
      localStorage.setItem('saleId', saleId);
      
      navigate('/checkout'); // Redirigir a la página de checkout
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
          onChange={(e) => setClient(e.target.value)} 
        />
        {error && <p className="text-red-500">{error}</p>}
        <p>Total Items:<strong> {cart.totalQuantity}</strong></p>
        <p>Total Precio:<strong> ${cart.totalAmount.toFixed(2)}</strong></p>
        <div className='flex flex-1 flex-col gap-2'>
          <button onClick={handleOpenModal} className='px-4 py-2 bg-blue-300 w-1/5 rounded-xl text-white font-semibold'>Ver detalles</button>
          <button onClick={handleCreateSale} className='px-4 py-2 bg-green-600 w-1/5 rounded-xl text-white font-semibold'>Comprar</button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseModal}>&times;</span>
            <h1>Carrito de Compras</h1>
            <ul>
              {cart.items.map((item, index) => (
                <li key={index} className='flex flex-row gap-2 items-center'>
                  Cantidad: {item.quantity} - {item.name.length > 0 ? item.name.split(' ').slice(0, 3).join(' ') : item.name} - ${item.price.toFixed(2)}
                  <button className='px-2 py-1 text-red-600 w-1/5 rounded-xl font-semibold' onClick={() => removeItem(item.id)}>Eliminar</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
