import React, { useEffect, useState, useCallback } from 'react';
import { getAllSales } from '../axios/sales.axios';
import { getGastos } from '../axios/gastos.axios';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Registro de componentes de Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
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
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    const calculateTotal = (data, key) => data.reduce((acc, item) => acc + item[key], 0);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const [salesRes, gastosRes] = await Promise.all([getAllSales(), getGastos()]);

            const totalSales = calculateTotal(salesRes, 'total');
            const totalGastos = calculateTotal(gastosRes, 'amountMoney');
            const totalEgresos = totalSales - totalGastos;

            setSalesData({
                sales: salesRes,
                gastos: gastosRes,
                dailySales: [],
                dailyGastos: [],
                totalSales,
                totalGastos,
                totalEgresos,
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
            const dailySales = salesData.sales.filter(sale => sale.createdAt.startsWith(selectedDate));
            const dailyGastos = salesData.gastos.filter(gasto => gasto.dateExpenditure.split('-').reverse().join('-') === selectedDate);

            setSalesData(prevState => ({
                ...prevState,
                dailySales,
                dailyGastos,
            }));
        }
    }, [selectedDate, salesData.sales, salesData.gastos]);

    const handleDateChange = (e) => setSelectedDate(e.target.value);

    if (loading) return <div className='w-[800px] m-auto'>Loading...</div>;
    if (error) return <div className='w-[800px] m-auto'>Error: {error.message}</div>;

    const { dailySales, dailyGastos, totalSales, totalGastos, totalEgresos } = salesData;

    const groupTotalsByDate = (data, key) => {
        return data.reduce((acc, item) => {
            const date = item[key].split('T')[0];
            acc[date] = (acc[date] || 0) + (item.total || item.amountMoney);
            return acc;
        }, {});
    };

    const salesByDate = groupTotalsByDate(salesData.sales, 'createdAt');
    const gastosByDate = groupTotalsByDate(salesData.gastos, 'dateExpenditure');


    // Función personalizada para formatear las fechas como dd-mm-aaaa
    const formatDate = (dateStr) => {
        const [year, month, day] = dateStr.split('-');
        return `${day}-${month}-${year}`;
    };



    const barChartData = {
        labels: ['Ventas del día', 'Gastos del día'],
        datasets: [
            {
                label: 'Total en Pesos',
                data: [
                    calculateTotal(dailySales, 'total'),
                    calculateTotal(dailyGastos, 'amountMoney')
                ],
                backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
                borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
                borderWidth: 1,
            },
        ],
    }

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Histórico de Ventas y Gastos' },
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
                        <p>Ventas del día: ${calculateTotal(dailySales, 'total')}</p>
                        <p>Gastos del día: ${calculateTotal(dailyGastos, 'amountMoney')}</p>
                        <p>Total del día: ${calculateTotal(dailySales, 'total') - calculateTotal(dailyGastos, 'amountMoney')}</p>
                    </div>
                </div>
            </div>

            <div className='mt-8'>
                <Bar data={barChartData} options={options} />
            </div>
        </div>
    );
};

export default Resumen;
