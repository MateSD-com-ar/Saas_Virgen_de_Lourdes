import React, { useEffect, useState } from 'react';
import { getAllSales } from '../axios/sales.axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const Ventas = () => {
  const [ventas, setVentas] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVentas = async () => {
      try {
        const response = await getAllSales();
        setVentas(response);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false); // Set loading to false regardless of success or failure
      }
    };
    fetchVentas();
  }, []);

  console.log(ventas);

  return (
    <div>
      <h2>Ventas activas</h2>
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
                        <TableCell>Client</TableCell>
                        <TableCell>Subtotal</TableCell>
                        <TableCell>Total</TableCell>
                        <TableCell>Payment Status</TableCell>
                        <TableCell>Created At</TableCell>
                        <TableCell>Details</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {ventas.map((sale) => (
                        <TableRow key={sale.id}>
                            <TableCell>{sale.id}</TableCell>
                            <TableCell>{sale.client}</TableCell>
                            <TableCell>{sale.subtotal}</TableCell>
                            <TableCell>{sale.total}</TableCell>
                            <TableCell>{sale.paymentStatus}</TableCell>
                            <TableCell>{new Date(sale.createdAt).toLocaleString()}</TableCell>
                            <TableCell>
                                <ul>
                                    {sale.saleDetailsProducts.map((detail) => (
                                        <li key={detail.idDetails}>
                                            {detail.product.name} - {detail.quantity} @ {detail.unitPrice} each
                                        </li>
                                    ))}
                                </ul>
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