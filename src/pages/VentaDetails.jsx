import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { getSaleDetails, updateSale } from '../axios/sales.axios';
import { useNavigate } from 'react-router-dom';

const VentaDetails = () => {
  const { id } = useParams();
  const [venta, setVenta] = useState(null);
  const [formData, setFormData] = useState({
    cuil: '',
    interest: '',
    discount: '',
    paymentMethod: '',
    paymentStatus: '',
  });
  const [errorFields, setErrorFields] = useState({});
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
      } catch (err) {
        console.error('Error fetching venta:', err);
      }
    };

    fetchVenta();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
    setErrorFields(prev => ({ ...prev, [name]: false })); // Reset error for the field being changed
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { cuil, interest, discount, paymentMethod, paymentStatus } = formData;
    let errors = {};

    if (paymentMethod === 'CURRENT_ACCOUNT' && (!interest || !paymentStatus || !cuil)) {
      if (!cuil) errors.cuil = true;
      if (!interest) errors.interest = true;
      if (!paymentStatus) errors.paymentStatus = true;
    }

    if (paymentStatus === 'PAID' && !paymentMethod) {
      errors.paymentMethod = true;
    }

    if (Object.keys(errors).length) {
      setErrorFields(errors);
      return;
    }

    const updatedData = {
      ...(paymentStatus === 'PENDING' && { paymentStatus }),
      ...(paymentStatus !== 'PENDING' && {
        cuil: cuil || undefined,
        discount: discount || undefined,
        paymentMethod,
        paymentStatus,
        ...(paymentMethod === 'CURRENT_ACCOUNT' && paymentStatus === 'CREDIT' && { interest })
      })
    };

    try {
      await updateSale(id, updatedData);
      navigate('/ventas');
      alert('Venta actualizada exitosamente');
    } catch (err) {
      console.error('Error actualizando la venta:', err);
    }
  };

  if (!venta) {
    return <div className='w-full m-auto text-center'>Cargando...</div>;
  }

  const isInterestEnabled = formData.paymentMethod === 'CURRENT_ACCOUNT' && formData.paymentStatus === 'CREDIT';

  return (
    <div className='px-4 lg:max-w-2xl m-auto'>
      <div className='flex flex-col lg:flex-row items-center justify-between mb-4'>
        <p className='text-center lg:text-start'>
          Finalizar orden de compra de {venta[0].client} - {new Date(venta[0].createdAt).toLocaleString()}
        </p>
        <p>
          <strong>
            {venta[0].paymentStatus === 'PAID' ? 'PAGADA' : 
              venta[0].paymentStatus === 'PENDING' ? 'Pendiente' : 'Fiado'}
          </strong>
        </p>
        <p>Total: <strong>{venta[0].total}</strong></p>
      </div>

      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <div className='mb-4'>
          <label htmlFor="cuil" className='block text-sm font-medium'>CUIL:</label>
          <input
            type="number"
            name="cuil"
            id="cuil"
            value={formData.cuil}
            onChange={handleChange}
            className={`border-2 rounded-lg p-2 w-full ${errorFields.cuil ? 'border-red-500' : 'border-gray-300'}`}
          />
        </div>

        <div className='mb-4'>
          <label htmlFor="interest" className='block text-sm font-medium'>Interés:</label>
          <input
            type="number"
            name="interest"
            id="interest"
            value={formData.interest}
            onChange={handleChange}
            className={`border-2 rounded-lg p-2 w-full ${errorFields.interest ? 'border-red-500' : 'border-gray-300'}`}
            disabled={!isInterestEnabled}
          />
        </div>

        <div className='mb-4'>
          <label htmlFor="discount" className='block text-sm font-medium'>Descuento:</label>
          <input
            type="number"
            name="discount"
            id="discount"
            value={formData.discount}
            onChange={handleChange}
            className={`border-2 rounded-lg p-2 w-full ${errorFields.discount ? 'border-red-500' : 'border-gray-300'}`}
          />
        </div>

        <div className='mb-4'>
          <label htmlFor="paymentMethod" className='block text-sm font-medium'>Método de pago:</label>
          <select
            name="paymentMethod"
            id="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            className={`border-2 rounded-lg p-2 w-full ${errorFields.paymentMethod ? 'border-red-500' : 'border-gray-300'}`}
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

        <div className='mb-10'>
          <label htmlFor="paymentStatus" className='block text-sm font-medium'>Estado:</label>
          <select
            name="paymentStatus"
            id="paymentStatus"
            className={`border-2 rounded-lg p-2 w-full ${errorFields.paymentStatus ? 'border-red-500' : 'border-gray-300'}`}
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
