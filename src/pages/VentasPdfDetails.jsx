import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSaleDetails } from '../axios/sales.axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Modal from 'react-modal'; 

// Set root element for accessibility
Modal.setAppElement('#root');

const VentasPdfDetails = () => {
    const { id } = useParams();
    const [venta, setVenta] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pdfData, setPdfData] = useState(null);
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
    // Destructuring firstVenta directly in return statement to avoid unnecessary variable assignment
    const {  createdAt, total, client, user, saleDetailsProducts, paymentStatus, paymentMethod } = venta[0] || {};

    // Refactored generatePDF function: extracted PDF creation logic for better readability
    const generatePDF = () => {
        const doc = new jsPDF();
    
        doc.setFontSize(18);
        doc.text(`Detalle de la Venta ${id}`, 14, 16);
    
        doc.setFontSize(14);
        doc.text(`Fecha: ${formatDate(createdAt)}`, 14, 24);
    
        doc.setFontSize(12);
        doc.text(`Cliente: ${client}`, 14, 30);
        doc.text(`Estado de Pago: ${paymentStatus==='CREDIT'?'Fiado':paymentStatus==='PAID'?'Pagada': 'Pendiente'}`, 14,35);
        doc.text(`Método de Pago: ${paymentMethod==='CASH'?'Efectivo':paymentMethod==='CURRENT_ACCOUNT'?'Fiado':paymentMethod==='CREDIT_CARD'?'Tarjeta de Credito': paymentMethod==='DEBIT_CARD'?'Tarjeta de Debito':paymentMethod==='QR'? 'QR': paymentMethod==='TRANSFER'?'TRASNFERENCIA':'Pendiente'}`, 14, 40);
        doc.text(`Vendedor: ${user?.name || 'No disponible'}`, 14, 45);
    
        if (saleDetailsProducts && saleDetailsProducts.length > 0) {
            const tableColumn = ["Producto", "Descripción", "Cantidad", "Precio Unitario", "Precio Total", "Unidad de Medida"];
            const tableRows = saleDetailsProducts.map(product => [
                product.product.name,
                product.description || '', // Use empty string as fallback for description
                product.quantity,
                product.unitPrice,
                product.totalPrice,
                product.product.unitMeasure,
            ]);
            const totalText = total === 0 ? 'Nada que mostrar' :total;

            // Add total row
            const totalRow = [
                'Total de la compra',
                '',
                '',
                '',
                ` $${totalText}`, // Total text
                '', // Empty cell for Unidad de Medida
              ]
    
            doc.autoTable({
                head: [tableColumn],
                body: [...tableRows, totalRow], // Append total row to the table rows
                startY: 60,
                theme: 'grid',
                headStyles: { fillColor: [41, 87, 141] },
                styles: { fontSize: 10 },
                margin: { top: 10 }
            });
        } else {
            doc.text('No hay productos para mostrar', 14, 60);
        }
    
        const pdfBlob = doc.output('blob');
        setPdfData(URL.createObjectURL(pdfBlob));
        setIsModalOpen(true);
    };
    

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Simplified closeModal function to only close the modal and reset pdfData
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
            {
                paymentStatus==='PENDING' ?  <Link to={`/ventas/details/${id}`} className=' text-center text-lg font-semibold px-4 py-1 text-white bg-blue-500 rounded-full'>Agregar productos</Link> : null
           
            }
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
