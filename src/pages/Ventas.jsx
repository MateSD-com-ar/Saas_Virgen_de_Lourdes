import React, { useEffect, useState } from 'react';
import { getAllSales, deleteSale } from '../axios/sales.axios';
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
        setLoading(true);
        const response = await getAllSales();
        if (response.message) {
          // Maneja el caso en que no se encontraron ventas
          setError(response.message);
          setVentas([]);
        } else {
          setVentas(response);
        }
      } catch (error) {
        setError("Ha ocurrido un error al obtener las ventas.");
      } finally {
        setLoading(false);
      }
    };
    fetchVentas();
  }, []);
  const handleDelete = async (id) => {
    try {
      await deleteSale(id);
      setVentas(ventas.filter(venta => venta.id !== id));
    } catch (error) {
      setError("Ha ocurrido un error al eliminar la venta.");
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const filteredVentas = ventas?.filter(venta =>
    venta.client.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className='max-w-[900px] m-auto py-5'>
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
      {loading && <p>Loading...</p>}
      {error && <p> {error}</p>}
      {!loading && !error && (
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
                <TableCell>Detalles</TableCell>
                <TableCell>Finalizar</TableCell>
                <TableCell>Eliminar</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                filteredVentas && filteredVentas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7}>No hay ventas</TableCell>
                  </TableRow>
                ) :
                filteredVentas.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell>{sale.id}</TableCell>
                    <TableCell>{sale.client}</TableCell>
                    <TableCell>{sale.subtotal}</TableCell>
                    <TableCell>{sale.total}</TableCell>
                    <TableCell>{sale.paymentStatus === 'PAID' ? 'PAGADA' : sale.paymentStatus === 'PENDING' ? 'Pendiente' : 'Fiado'}</TableCell>
                    <TableCell>{new Date(sale.createdAt).toLocaleString()}</TableCell>
                    <TableCell><Link to={`/venta/details/${sale.id}`}           className='text-lg font-semibold px-4 py-1 text-white bg-blue-500 rounded-xl'
                    >Detalles</Link></TableCell>
                    <TableCell>
                      <Link to={`/venta/${sale.id}`} className='text-lg font-semibold px-4 py-1 text-white bg-green-500 rounded-xl'>
                        Finalizar
                      </Link>
                    </TableCell>
                    <TableCell>
                      <button onClick={() => handleDelete(sale.id)} className='text-lg font-semibold px-4 py-1 text-white bg-red-500 rounded-xl'>
                        Eliminar
                      </button>
                     
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default Ventas;
