import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import React from 'react';
import { getSaleDetails, updateSale } from '../axios/sales.axios';

const VentaDetails = () => {
  const [venta, setVenta] = useState({});
  const [formData, setFormData] = useState({
    cuil: '',
    interest: '',
    discount: '',
    paymentMethod: '',
    status: ''
  });
  const { id } = useParams();

  useEffect(() => {
    const fetchVenta = async () => {
      try {
        const response = await getSaleDetails(id);
        setVenta(response);
        // Initialize form data with existing sale details if necessary
        setFormData({
          cuil: response.cuil || '',
          interest: response.interest || '',
          discount: response.discount || '',
          paymentMethod: response.paymentMethod || '',
          status: response.status || ''
        });
      } catch (error) {
        console.error('Error fetching venta:', error);
      }
    };

    fetchVenta();
  }, [id]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateSale(id, formData);
      alert('Sale updated successfully!');
    } catch (error) {
      console.error('Error updating venta:', error);
    }
  };

  if (!venta || Object.keys(venta).length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className='max-w-[800px] m-auto'>
      <div className='flex flex-row items-center justify-between mb-4'>
        {
          venta.map((item)=> (
            <div key={item.idProduct}>
              <h3>Finalizar orden de compra de {item.client} - {new Date(item.createdAt).toLocaleString()}</h3>
            </div>
          ))
        }
      </div>
      <form onSubmit={handleSubmit}>
        <div className='mb-4'>
          <label htmlFor="cuil" className='block'>CUIL:</label>
          <input
            type="number"
            name="cuil"
            id="cuil"
            value={formData.cuil}
            onChange={handleChange}
            className='border-2 border-gray-300 rounded-lg p-2 w-full'
          />
        </div>
        <div className='mb-4'>
          <label htmlFor="interest" className='block'>Interes:</label>
          <input
            type="number"
            name="interest"
            id="interest"
            value={formData.interest}
            onChange={handleChange}
            className='border-2 border-gray-300 rounded-lg p-2 w-full'
          />
        </div>
        <div className='mb-4'>
          <label htmlFor="discount" className='block'>Descuento:</label>
          <input
            type="number"
            name="discount"
            id="discount"
            value={formData.discount}
            onChange={handleChange}
            className='border-2 border-gray-300 rounded-lg p-2 w-full'
          />
        </div>
        <div className='mb-4'>
          <label htmlFor="paymentMethod" className='block'>Metodo de pago:</label>
          <select
            name="paymentMethod"
            id="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            className='border-2 border-gray-300 rounded-lg p-2 w-full'
          >
            <option value="">Selecionar metodo de pago</option>
            <option value="Efectivo">Efectivo</option>
            <option value="Debito">Débito</option>
            <option value="Tarjeta Credito">Tarjeta Crédito</option>
            <option value="Fiado">Fiado</option>
            <option value="Transferencia">Transferencia</option>
            <option value="Qr">QR</option>

          </select>
        </div>
        <div className='mb-4'>
          <label htmlFor="status" className='block'>Estado:</label>
          <select name="" id=""  
          className='border-2 border-gray-300 rounded-lg p-2 w-full'
          value={formData.status} onChange={handleChange}
          >
            <option value="Pendiente">Pendiente</option>
            <option value="Pagado">Pagado</option>
            <option value="Fiado">Fiado</option>
          </select>
         
        </div>
        <button
          type="submit"
          className='text-lg font-semibold px-4 py-2 text-white bg-blue-500 rounded-xl'
        >
         FINALIZAR
        </button>
      </form>
    </div>
  );
};

export default VentaDetails;
// metodos de pago: CASH, CURRENT_ACCOUNT, CREDIT_CARD, DEBIT_CARD, TRANSFER, QR 
// estados: PENDING,
//     PAID,
//     CREDIT