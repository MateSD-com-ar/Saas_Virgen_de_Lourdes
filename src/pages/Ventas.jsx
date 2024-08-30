import React, { useEffect, useState } from 'react';
import { getAllSales } from '../axios/sales.axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField } from '@mui/material';
import { Link } from 'react-router-dom';

const Ventas = () => {
  const [ventas, setVentas] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchVentas = async () => {
      try {
        const response = await getAllSales();
        setVentas(response);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchVentas();
  }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const filteredVentas = ventas.filter((venta) =>
    venta.client.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className='max-w-[800px] m-auto py-5'>
      <div className='flex flex-1 items-center justify-between pb-10'>
        <h2 className='text-2xl font-serif font-bold'>Ventas</h2>
        <TextField
          label='Buscar Ventas'
          variant='outlined'
          onChange={handleSearch}
          value={search}
          className='w-1/2'
        />
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Cliente</TableCell>
                <TableCell>Subtotal</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Creada</TableCell>
                <TableCell>Finalizar</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredVentas.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell>{sale.id}</TableCell>
                  <TableCell>{sale.client}</TableCell>
                  <TableCell>{sale.subtotal}</TableCell>
                  <TableCell>{sale.total}</TableCell>
                  <TableCell>{sale.paymentStatus}</TableCell>
                  <TableCell>{new Date(sale.createdAt).toLocaleString()}</TableCell>
                  <TableCell>
                    <Link to={`/venta/${sale.id}`} className='text-lg font-semibold px-4 py-1 text-white bg-green-500 rounded-xl'>
                      Finalizar
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default Ventas;
