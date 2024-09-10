import React, { useState, useEffect } from 'react';
import Inputs from '../ui/Inputs';
import { createGastos, updateGastos, getGastosById } from '../axios/gastos.axios';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { TextField } from '@mui/material';

function GastosForm() {
  const [gasto, setGasto] = useState({
    typeExpenditure: '',
    reason: '',
    amountMoney: '',
  });
  const { id } = useParams();
 
  const [error, setError] = useState(null); // Estado para manejar errores
  const [success, setSuccess] = useState(null); // Estado para manejar mensajes de éxito

  // Cargar los datos del gasto si el id está definido
  useEffect(() => {
    const loadGastoData = async () => {
      if (id) {
        try {
          const gastoData = await getGastosById(id);
  
          // Verifica que los campos de gastoData.data estén definidos
          if (gastoData?.data) {
            setGasto({
              typeExpenditure: gastoData.data.typeExpenditure || '',
              reason: gastoData.data.reason || '',
              amountMoney: gastoData.data.amountMoney || '',
            });
          } else {
            setError('Error: los datos del gasto no son válidos.');
          }
        } catch (err) {
          setError('Error al cargar los datos del gasto.');
        }
      }
    };
  
    loadGastoData();
  }, [id]);
  
  const handleCreateOrUpdateGasto = async () => {
    try {
      if (id) {
        await updateGastos(id, gasto);
        setSuccess('Gasto actualizado con éxito');
      } else {
        await createGastos(gasto);
        setSuccess('Gasto creado con éxito');
        setGasto({
          typeExpenditure: '',
          reason: '',
          amountMoney: '',
        });
      }
    } catch (err) {
      setError('Error al guardar el gasto. Por favor, inténtalo de nuevo.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGasto(prevGasto => ({ ...prevGasto, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!gasto.typeExpenditure || !gasto.reason || !gasto.amountMoney) {
      setError('Por favor, completa todos los campos obligatorios.');
      return;
    }

    setError(null); 
    setSuccess(null); 
    handleCreateOrUpdateGasto(); 
  };

  return (
    <div className='max-w-[500px] m-auto'>
      <h1 className='text-2xl text-center font-serif'>
        {id ? 'Editar Gasto' : 'Cargar Gasto'}
      </h1>
      {error && <p className='text-red-500 text-center'>{error}</p>}
      {success && <p className='text-green-500 text-center'>{success}</p>}
      <form
        className='flex flex-col flex-1 justify-center items-center gap-4 w-1/2 m-auto'
        onSubmit={handleSubmit}
      >
      
        <select
          name="typeExpenditure"
          value={gasto.typeExpenditure}
          onChange={handleInputChange}
          className={`${error ? 'border-red-500 border-2 rounded-2xl px-3' : ' w-full px-3 py-1 rounded-full'}`}
          required
        >
          <option value="">Tipo de Gasto</option>
          <option value="Proveedores">Proveedores</option>
          <option value="GastosDiarios">Gastos Diarios</option>
          <option value="Impuestos">Impuestos</option>
        </select>
        <TextField
          type="text"
          label='Concepto'
          name='reason'
          error={error}
          value={gasto.reason}
          onChange={handleInputChange}
          className={`${error ? 'border-red-500 border-2 rounded-2xl px-3' : 'px-3 py-1 rounded-full'}`}
          required
        />
        <TextField
          type="number"
          label='Importe $'
          name='amountMoney'
          error={error}
          value={gasto.amountMoney}
          onChange={handleInputChange}
          className={`${error ? 'border-red-500 border-2 rounded-2xl px-3' : 'px-3 py-1 rounded-full'}`}
          required
        />
        <button
          type="submit"
          className='bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600'
        >
          {id ? 'Actualizar' : 'Guardar'}
        </button>
      </form>
      <Link to='/gastos' className='text-lg font-semibold px-4 py-1 text-white bg-orange-500 rounded-xl'>
        Volver
      </Link>
    </div>
  );
}

export default GastosForm;
