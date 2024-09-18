import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSaleDetails } from '../axios/sales.axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const VentasPdfDetails = () => {
    const { id } = useParams();
    const [venta, setVenta] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pdfData, setPdfData] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const fetchVenta = async () => {
            try {
                const response = await getSaleDetails(id);
                setVenta(response);
            } catch (error) {
                console.error('Error fetching venta:', error);
            }
        };
        fetchVenta();
    }, [id]);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const { createdAt, total, client, user, saleDetailsProducts, paymentStatus, paymentMethod } = venta[0] || {};

    const generatePDF = () => {
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text(`Detalle de la Venta ${id}`, 14, 16);

        doc.setFontSize(14);
        doc.text(`Fecha: ${formatDate(createdAt)}`, 14, 24);

        doc.setFontSize(12);
        doc.text(`Cliente: ${client}`, 14, 30);
        doc.text(`Estado de Pago: ${paymentStatus === 'CREDIT' ? 'Fiado' : paymentStatus === 'PAID' ? 'Pagada' : 'Pendiente'}`, 14, 35);
        doc.text(`Método de Pago: ${paymentMethod === 'CASH' ? 'Efectivo' : paymentMethod === 'CURRENT_ACCOUNT' ? 'Fiado' : paymentMethod === 'CREDIT_CARD' ? 'Tarjeta de Credito' : paymentMethod === 'DEBIT_CARD' ? 'Tarjeta de Debito' : paymentMethod === 'QR' ? 'QR' : paymentMethod === 'TRANSFER' ? 'TRANSFERENCIA' : 'Pendiente'}`, 14, 40);
        doc.text(`Vendedor: ${user?.name || 'No disponible'}`, 14, 45);

        if (saleDetailsProducts && saleDetailsProducts.length > 0) {
            const tableColumn = ["Producto", "Descripción", "Cantidad", "Precio Unitario", "Precio Total", "Unidad de Medida"];
            const tableRows = saleDetailsProducts.map(product => [
                product.product.name,
                product.description || '',
                product.quantity,
                product.unitPrice,
                product.totalPrice,
                product.product.unitMeasure,
            ]);
            const totalText = total === 0 ? 'Nada que mostrar' : total;

            const totalRow = [
                'Total de la compra',
                '',
                '',
                '',
                ` $${totalText}`,
                '',
            ];

            doc.autoTable({
                head: [tableColumn],
                body: [...tableRows, totalRow],
                startY: 60,
                theme: 'grid',
                headStyles: { fillColor: [41, 87, 141] },
                styles: { fontSize: 10 },
                margin: { top: 10 }
            });
        } else {
            doc.text('No hay productos para mostrar', 14, 60);
        }

        // Save the PDF directly
        if (isMobile) {
            doc.save(`venta_${id}.pdf`);
        } else {
            const pdfBlob = doc.output('blob');
            setPdfData(URL.createObjectURL(pdfBlob));
            setIsModalOpen(true);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setPdfData(null);
    };

    return (
        <div className='max-w-[800px] m-auto px-4 pt-2'>
            <h1>Detalle de la venta</h1>
            <p>Fecha: {formatDate(createdAt)}</p>
            <p>Total: {total === 0 ? 'Nada que mostrar' : total}</p>
            <div className='flex flex-col gap-4 mt-4 w-1/2'>
                <button onClick={generatePDF} className='text-lg font-semibold px-4 py-1 text-white bg-green-500 rounded-full'>Generar PDF</button>
                {paymentStatus === 'PENDING' ? <Link to={`/ventas/details/${id}`} className=' text-center text-lg font-semibold px-4 py-1 text-white bg-blue-500 rounded-full'>Agregar productos</Link> : null}
            </div>
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Vista Previa del PDF"
                className="modal max-w-full mx-auto p-4"
                overlayClassName="overlay fixed inset-0 bg-black bg-opacity-50"
            >
                <div className='flex justify-end mb-2'>
                    <button onClick={closeModal} className="text-white bg-red-600 rounded-full px-3 py-1">X</button>
                </div>
                {pdfData ? (
                    <iframe
                        src={pdfData}
                        width="100%"
                        height="80vh"
                        title="PDF Preview"
                        className="border-0"
                    />
                ) : (
                    <p>Loading...</p>
                )}
            </Modal>
        </div>
    );
};

export default VentasPdfDetails;
