import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createGastos } from '../axios/gastos.axios';
import { TextField, Button } from '@mui/material';

const GastosForm = () => {
  const [typeExpenditure, setTypeExpenditure] = useState('');
  const [reason, setReason] = useState('');
  const [amountMoney, setAmountMoney] = useState('');
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!typeExpenditure || !reason || !amountMoney) {
      console.error('Please fill in all fields');
      return;
    }
    
    const data = {
      typeExpenditure,
      reason,
      amountMoney
    };

    try {
      const response = await createGastos(data);
      navigate('/gastos')
      console.log(response);
    } catch (error) {
      console.error('Error creating gastos:', error);
    }
  };

  const handleNumberInput = (event) => {
    if (event.target.type === 'number') {
      event.preventDefault(); // Previene el incremento/decremento
    }
  };

  return (
    <div className='py-2 max-w-[800px] m-auto'>
      <h2 className='font-semibold text-2xl'>Ingresar Gasto:</h2>
      <form onSubmit={handleSubmit} className='flex flex-col items-center justify-center gap-4'>
         <select
            name="typeExpenditure"
            id="typeExpenditure"
            value={typeExpenditure}
            onChange={(e) => setTypeExpenditure(e.target.value)}
            className='border-2 border-gray-300 rounded-lg p-2 w-full'
          >
            <option value="Proveedores">Proveedores</option>
            <option value="GastosDiarios">Gastos Diarios</option>
            <option value="Impuestos">Impuestos</option>
          </select>
        <TextField
          type="text"
          label='Concepto'
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className='border-2 border-gray-300 rounded-lg p-2'
        />
        <TextField
          type="number"
          label='Importe $'
          value={amountMoney}
          onChange={(e) => setAmountMoney(e.target.value)}
          className='border-2 border-gray-300 rounded-lg p-2'
          onWheel={handleNumberInput} // Previene el scroll
          // onKeyDown={handleNumberInput} // Previene las flechas del teclado
        />
        <button type="submit" className='bg-green-500 text-white px-4 py-1 rounded-xl'>Guardar</button>
      </form>
      <Link to='/gastos' className='text-lg font-semibold px-4 py-1 text-white bg-orange-500 rounded-xl'>Volver</Link>
    </div>
  );
};

export default GastosForm;
