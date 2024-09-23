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

    const generatePDF = () => {
        // Definir tamaño personalizado (80mm de ancho y 40mm de alto)
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: [44, 55] // Ancho: 80mm, Alto: 40mm
        });

        doc.setFontSize(8); // Ajusta el tamaño de la fuente para que se ajuste al papel pequeño
        doc.text(`Detalle de Venta ${id}`, 4, 10); // Ajusta la posición del texto

        doc.text(`Fecha: ${formatDate(createdAt)}`, 4, 16);
        doc.text(`Cliente: ${client || 'No disponible'}`, 4, 22);
        doc.text(`Pago: ${paymentStatus === 'CREDIT' ? 'Fiado' : paymentStatus === 'PAID' ? 'Pagada' : 'Pendiente'}`, 4, 28);
        doc.text(`Método: ${formatPaymentMethod(paymentMethod)}`, 4, 34);
        doc.text(`Vendedor: ${user?.name || 'No disponible'}`, 4, 40);

        if (saleDetailsProducts && saleDetailsProducts.length > 0) {
            const tableColumn = ["Producto", "Cant.", "Precio"];
            const tableRows = saleDetailsProducts.map(product => [
                product.product.name,
                product.quantity,
                `$${product.totalPrice}`,
            ]);
            const totalText = total === 0 ? 'Nada que mostrar' : `$${total}`;

            // Añadir la tabla de productos y el total
            doc.autoTable({
                head: [tableColumn],
                body: tableRows,
                startY: 46,
                theme: 'plain',
                styles: { fontSize: 6 }, // Ajusta el tamaño de la fuente para la tabla
                margin: { left: 2, right: 2 }, // Ajusta los márgenes para que quepa en el papel
            });

            // Mostrar el total al final de la tabla
            doc.text(`Total: ${totalText}`, 4, doc.lastAutoTable.finalY + 6);
        } else {
            doc.text('No hay productos', 4, 46);
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
