import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getGastos, deleteGastos } from '../axios/gastos.axios';


const Gastos = () => {
  const [gastos, setGastos] = useState([]);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const response = await getGastos();
      setGastos(response);
    } catch (err) {
      console.log(err);
      setError("Ocurrió un error al obtener los gastos.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteEXpenditure = async (id) => {
    try {
      await deleteGastos(id);
      fetchData(); // Actualizar la lista de gastos después de eliminar
    } catch (err) {
      console.log(err);
      setError("Ocurrió un error al eliminar el gasto.");
    }
  };


  return (
    <section className='max-w-[800px] m-auto flex flex-col gap-4 pt-4'>
      <Link to='./create' className='text-lg font-semibold px-4 py-1 text-white bg-green-500 rounded-xl w-36'>Cargar Gasto</Link>
      Gastos:
      <div className='flex flex-wrap gap-2'>
        {error && <p>{error}</p>}
      {gastos && gastos.map((gasto, index) => (
          <div key={index} className='border rounded-xl px-4 py-2 gap-4 flex flex-col'>
            <div>

          <p>{gasto.dateExpenditure}</p>
          <p>{gasto.typeExpenditure  === 'GastosDiarios' ? 'Gastos Diarios' : gastos.typeExpenditure === 'Provedores' ? 'Provedores' : 'Impuestos'}</p>
          <p>Gasto: {gasto.reason}</p>
          <p>Importe: {gasto.amountMoney}</p>
            </div>
            <div>

          <Link to={`/gastos/edit/${gasto.idExpenditure}`} className='bg-blue-500 text-white px-4 py-1 text-center font-semibold  rounded-lg hover:bg-blue-600'>Editar</Link>
          <button onClick={() => handleDeleteEXpenditure(gasto.idExpenditure)} className='bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600'>Eliminar</button>
          </div>
        </div>
      ))}
      </div>
    </section>
  );
};

export default Gastos;
