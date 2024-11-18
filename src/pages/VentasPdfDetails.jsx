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
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

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
    console.log(saleDetailsProducts)
    const generatePDF = () => {
        const ticketWidth = 50;
        let ticketHeight = 55; // Altura inicial
        const lineHeight = 5; // Altura de cada línea de texto
    
        // Calcular altura según cantidad de productos
        if (saleDetailsProducts && saleDetailsProducts.length > 0) {
            ticketHeight += saleDetailsProducts.length * lineHeight;
        }
    
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: [ticketWidth, ticketHeight]
        });
    
        doc.setFontSize(8);
        doc.text(`Detalle de Venta ${id}`, 2, 10);
        doc.text(`Fecha: ${formatDate(createdAt)}`, 2, 16);
        doc.setTextColor(0, 0, 0);
        doc.text('Hora' + createdAt.slice(11, 16), 2, 16)
        doc.text(`Cliente: ${client || 'No disponible'}`, 2, 22);
        doc.text(`Pago: ${paymentStatus === 'CREDIT' ? 'Fiado' : paymentStatus === 'PAID' ? 'Pagada' : 'Pendiente'}`, 2, 28);
        doc.text(`Método: ${formatPaymentMethod(paymentMethod)}`, 2, 34);
        doc.text(`Vendedor: ${user?.name || 'No disponible'}`, 2, 40);
    
        // Agregar productos
        if (saleDetailsProducts && saleDetailsProducts.length > 0) {
            saleDetailsProducts.forEach((product, index) => {
                const productText = `${index + 1}. ${product.product.name} x${product.quantity} - $${product.unitPrice.toFixed(2)}`;
                doc.text(productText, 2, 46 + (index * lineHeight));
            });
    
            // Mostrar total al final
            doc.setTextColor(0, 0, 0);
            doc.setFont("Helvetica", "bold"); // Cambia "900" a "bold" y establece el tamaño
            doc.text(`Total: $${total}`, 2, 46 + (saleDetailsProducts.length * lineHeight) + 6);
        } else {
            doc.text('No hay productos para mostrar', 2, 46);
        }
    
        if (isMobile) {
            doc.save(`venta_${id}.pdf`);
        } else {
            const pdfBlob = doc.output('blob');
            setPdfData(URL.createObjectURL(pdfBlob));
            setIsModalOpen(true);
        }
    };
    
    
    const formatPaymentMethod = (method) => {
        switch (method) {
            case 'CASH': return 'Efectivo';
            case 'CURRENT_ACCOUNT': return 'Fiado';
            case 'CREDIT_CARD': return 'Tarjeta de Crédito';
            case 'DEBIT_CARD': return 'Tarjeta de Débito';
            case 'QR': return 'QR';
            case 'TRANSFER': return 'Transferencia';
            default: return 'Pendiente';
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
                className="modal"
                overlayClassName="overlay"
            >
                <div className='flex justify-end items-center max-w-[800px] m-auto py-4 mx-4'>
                    <button onClick={closeModal} className="close-button px-2 text-white bg-red-600 rounded-full relative right-0">X</button>
                </div>
                <iframe
                    src={pdfData}
                    width="80%"
                    height="600px"
                    title="PDF Preview"
                    className="pdf-iframe m-auto"
                />
            </Modal>
        </div>
    );
};

export default VentasPdfDetails;
