import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { getSaleDetails, updateSale } from '../axios/sales.axios';
import { useNavigate } from 'react-router-dom';

const VentaDetails = () => {
  const { id } = useParams();
  const [venta, setVenta] = useState({});
  const [formData, setFormData] = useState({
    cuil: '',
    interest: '',
    discount: '',
    paymentMethod: '',
    paymentStatus: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVenta = async () => {
      try {
        const response = await getSaleDetails(id);
        setVenta(response);
        setFormData({
          cuil: response.cuil || '',
          interest: response.interest || '',
          discount: response.discount || '',
          paymentMethod: response.paymentMethod || '',
          paymentStatus: response.paymentStatus || ''
        });
      } catch (error) {
        console.error('Error fetching venta:', error);
      }
    };

    fetchVenta();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { cuil, interest, discount, paymentMethod, paymentStatus } = formData;

    // Validación si el método de pago es CURRENT_ACCOUNT
    if (paymentMethod === 'CURRENT_ACCOUNT' && (!interest || !paymentStatus || !cuil)) {
      alert('Todos el INTERES es obligatorio cuando el método de pago es Cuenta Corriente (FIADO) ');
      return;
    }

    // Crear un objeto solo con los valores que no están vacíos
    const updatedData = {};

    // Si el estado es 'PENDING' solo mandamos ese campo
    if (paymentStatus === 'PENDING') {
      updatedData.paymentStatus = paymentStatus;
    } else {
      if (cuil) updatedData.cuil = cuil;
      if (discount) updatedData.discount = discount;
      updatedData.paymentMethod = paymentMethod;
      updatedData.paymentStatus = paymentStatus;

      // Si el método de pago es CURRENT_ACCOUNT y el estado es CREDIT, agregar el interés si existe
      if (paymentMethod === 'CURRENT_ACCOUNT' && paymentStatus === 'CREDIT' && interest) {
        updatedData.interest = interest;
      }
    }

    try {
      await updateSale(id, updatedData);
      navigate('/ventas');
      alert('Venta actualizada exitosamente');
    } catch (error) {
      console.error('Error actualizando la venta:', error);
    }
  };

  if (!venta || Object.keys(venta).length === 0) {
    return <div className='w-full m-auto text-center'>Cargando...</div>;
  }

  const isInterestEnabled = formData.paymentMethod === 'CURRENT_ACCOUNT' && formData.paymentStatus === 'CREDIT';

  return (
    <div className='max-w-[800px] m-auto'>
      <div className='flex flex-row items-center justify-between mb-4'>
        <h3>Finalizar orden de compra de {venta[0].client} - {new Date(venta[0].createdAt).toLocaleString()} - {venta[0].paymentStatus === 'PAID' ? 'PAGADA' : venta[0].paymentStatus === 'PENDING' ? 'Pendiente' : 'Fiado'}</h3>
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

        {/* Input for Interest */}
        <div className='mb-4'>
          <label htmlFor="interest" className='block'>Interés:</label>
          <input
            type="number"
            name="interest"
            id="interest"
            value={formData.interest}
            onChange={handleChange}
            className='border-2 border-gray-300 rounded-lg p-2 w-full'
            disabled={!isInterestEnabled}
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
          <label htmlFor="paymentMethod" className='block'>Método de pago:</label>
          <select
            name="paymentMethod"
            id="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            className='border-2 border-gray-300 rounded-lg p-2 w-full'
          >
            <option value="">Seleccionar método de pago</option>
            <option value="CASH">Efectivo</option>
            <option value="DEBIT_CARD">Débito</option>
            <option value="CREDIT_CARD">Tarjeta Crédito</option>
            <option value="CURRENT_ACCOUNT">Fiado</option>
            <option value="TRANSFER">Transferencia</option>
            <option value="QR">QR</option>
          </select>
        </div>

        <div className='mb-4'>
          <label htmlFor="paymentStatus" className='block'>Estado:</label>
          <select
            name="paymentStatus"
            id="paymentStatus"
            className='border-2 border-gray-300 rounded-lg p-2 w-full'
            value={formData.paymentStatus}
            onChange={handleChange}
          > 
            <option value="">Seleccionar estado</option>
            <option value="PENDING">Pendiente</option>
            <option value="PAID">Pagado</option>
            <option value="CREDIT">Fiado</option>
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
