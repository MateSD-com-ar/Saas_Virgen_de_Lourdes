import React, { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart } from '../redux/slices/cartSlice';
import { Link } from 'react-router-dom';

const Cart = () => {
  const cart = useSelector((state) => state.cart);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();

  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const removeItem = useCallback((id) => {
    dispatch(removeFromCart(id));
  }, [dispatch]);

 
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape') {
        setIsModalOpen(false);
      }
    };

    if (isModalOpen) {
      window.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      window.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isModalOpen]);
  return (
    <div>
        <div className='w-4/6 m-auto'>

      <h1>Venta</h1>
      <p>Total Items:<strong> {cart.totalQuantity}</strong></p>
      <p>Total Precio:<strong> ${cart.totalAmount.toFixed(2)}</strong></p>
      <div className='flex flex-1 flex-col gap-2'>

      <button onClick={handleOpenModal} className='px-4 py-2 bg-blue-300 w-1/5 rounded-xl text-white font-semibold'>Ver detalles</button>
      <Link to='/checkout' className='px-4 py-2 bg-green-600 w-1/5 rounded-xl text-white font-semibold'>Comprar</Link>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseModal}>&times;</span>
            <h1>Carrito de Compras</h1>
            <ul>
              {cart.items.map((item) => (
                <li key={item.id} className='flex flex-row gap-2 items-center'>
                  Cantidad: {item.quantity} - {item.name.length > 0 ? item.name.split(' ').slice(0, 3).join(' ') : item.name} - ${item.price.toFixed(2)}
                  <button className='px-2 py-1 text-red-600 w-1/5 rounded-xl font-semibold' onClick={() => removeItem(item.id)}>Eliminar</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <style jsx>{`
        .modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .modal-content {
          background: white;
          padding: 10px;
          border-radius: 4px;
          position: relative;
          width: 90%;
          max-width: 700px;
        }
        .close {
          position: absolute;
          top: 10px;
          right: 10px;
          cursor: pointer;
          font-size: 20px;
        }
      `}</style>
    </div>
  );
};

export default Cart;
