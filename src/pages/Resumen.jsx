import React, { useEffect, useState, useCallback } from 'react';
import { getAllSales } from '../axios/sales.axios';
import { getGastos } from '../axios/gastos.axios';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Resumen = () => {
  const [salesData, setSalesData] = useState({
    sales: [],
    gastos: [],
    dailySales: [],
    dailyGastos: [],
    totalSales: 0,
    totalGastos: 0,
    totalEgresos: 0,
    paymentStatusData: {},
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [salesRes, gastosRes] = await Promise.all([getAllSales(), getGastos()]);

      const totalSales = salesRes.reduce((acc, sale) => acc + sale.total, 0);
      const totalGastos = gastosRes.reduce((acc, gasto) => acc + gasto.amountMoney, 0);
      const totalEgresos = totalSales - totalGastos;

      const paymentStatusData = salesRes.reduce((acc, sale) => {
        const status = sale.paymentStatus || 'unknown';
        acc[status] = (acc[status] || 0) + sale.total;
        return acc;
      }, {});

      setSalesData({
        sales: salesRes,
        gastos: gastosRes,
        dailySales: [],
        dailyGastos: [],
        totalSales,
        totalGastos,
        totalEgresos,
        paymentStatusData,
      });

      setLoading(false);
    } catch (err) {
      console.error(err);
      setError(err);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (salesData.sales.length && salesData.gastos.length) {
      const filteredDailySales = salesData.sales.filter(sale =>
        sale.createdAt.startsWith(selectedDate)
      );
      const filteredDailyGastos = salesData.gastos.filter(gasto =>
        gasto.dateExpenditure.split('-').reverse().join('-') === selectedDate
      );

      setSalesData(prevState => ({
        ...prevState,
        dailySales: filteredDailySales,
        dailyGastos: filteredDailyGastos,
      }));
    }
  }, [selectedDate, salesData.sales, salesData.gastos]);

  const handleDateChange = e => setSelectedDate(e.target.value);

  if (loading) return <div className='w-[800px] m-auto'>Loading...</div>;
  if (error) return <div className='w-[800px] m-auto'>Error: {error.message}</div>;

  const { dailySales, dailyGastos, totalSales, totalGastos, totalEgresos, paymentStatusData } = salesData;

  const totalDailySales = dailySales.reduce((total, sale) => total + sale.total, 0);
  const totalDailyGastos = dailyGastos.reduce((total, gasto) => total + gasto.amountMoney, 0);
  const netTotalDaily = totalDailySales - totalDailyGastos;

  const barChartData = {
    labels: ['Ventas del día', 'Gastos del día'],
    datasets: [
      {
        label: 'Moviemientos Diarios',
        data: [totalDailySales, totalDailyGastos],
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
        borderWidth: 1,
      },
    ],
  };

  const paymentStatusChartData = {
    labels: Object.keys(paymentStatusData).map(status =>
      status === 'PENDING' ? 'Pendiente' :
      status === 'PAID' ? 'Pagada' :
      'Fiado'
    ),
    datasets: [
      {
        label: 'Importe por Estado de Pago',
        data: Object.values(paymentStatusData),
        backgroundColor: [
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 99, 132, 0.6)'
        ],
        borderColor: [
          'rgba(153, 102, 255, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Histórico de Ventas y Gastos' },
    },
  };

  const paymentStatusOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Estados de Pagos por Fecha' },
    },
  };

  return (
    <div className='w-[900px] m-auto'>
      <div className='flex flex-row items-center justify-between gap-4'>
        <div className='border-2 rounded-xl p-2 h-full'>
          <h2>Resumen de ventas diarias y egresos totales:</h2>
          <p>Ventas total: ${totalSales}</p>
          <p>Egresos total: ${totalGastos}</p>
          <p>Total: ${totalEgresos}</p>
        </div>
        <div className='border-2 rounded-xl p-2 h-full'>
          <div className='flex flex-row items-center gap-2'>
            <h2>Fecha: </h2>
            <input type='date' value={selectedDate} onChange={handleDateChange} />
          </div>
          <div>
            <p>Ventas del día: ${totalDailySales}</p>
            <p>Gastos del día: ${totalDailyGastos}</p>
            <p>Total del día: ${netTotalDaily}</p>
          </div>
        </div>
      </div>
      <div className='flex flex-row justify-center gap-4'>
        <div className='mt-8'>
          <Bar data={barChartData} options={options} />
        </div>
        <div className='mt-8'>
          <Bar data={paymentStatusChartData} options={paymentStatusOptions} />
        </div>
        <div className='mt-8 w-[420px] h-[420px]'>
          <Pie data={paymentStatusChartData} options={paymentStatusOptions} />
        </div>
      </div>
    </div>
  );
};

export default Resumen;
