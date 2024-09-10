import React, { useState, useEffect } from 'react';
import { createSaleDetails } from '../axios/sales.axios';
import { GiCow } from "react-icons/gi";
import { LuVegan } from "react-icons/lu";


const Checkout = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  // const [selectedProducts, setSelectedProducts] = useState([]);
  // const [productInputs, setProductInputs] = useState({});

  // Obtener productos desde localStorage
  const productsData = JSON.parse(localStorage.getItem('cartItems')) || [];
  const saleId = localStorage.getItem('saleId'); // Obtener el saleId desde localStorage

  // Productos base de verdulería y carnicería
  const initialAdditionalProducts = [
    { icon:<LuVegan className='text-xl'/>, idProduct: 2, name: "Verduleria", brand: "Verduleria", code: "", price: 0.0, roleProduct: "Verduleria", unitMeasure: "", stock: 0 },
    { icon:<GiCow className='text-xl'/>,idProduct: 1, name: "Carniceria", brand: "Carniceria", code: "", price: 0.0, roleProduct: "Carniceria", unitMeasure: "kilogramo", stock: 0 }
  ];

  // Estado para almacenar productos adicionales dinámicos
  const [additionalProducts, setAdditionalProducts] = useState([]);

  // Manejar cambios en los inputs de nombre, precio y descripción
  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const updatedProducts = [...additionalProducts];
    updatedProducts[index][name] = value;
    setAdditionalProducts(updatedProducts);
  };

  // Función para agregar un nuevo producto de verdulería o carnicería
  const addProduct = (product) => {
    setAdditionalProducts([...additionalProducts, { ...product }]);
  };

  // Función para eliminar un producto
  const removeProduct = (index) => {
    const updatedProducts = additionalProducts.filter((_, i) => i !== index);
    setAdditionalProducts(updatedProducts);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Crear los detalles de la venta
      const saleDetailsProducts = [
        ...productsData.map(item => ({
          quantity: item.quantity,
          product: item.idProduct,
          unitMeasure: item.unitMeasure, 
          unitPrice: item.price,
          saleId: saleId,
          description: item.brand,
        })),
        ...additionalProducts.map((product, index) => ({
          quantity: product.quantity || 1,
          product: product.idProduct,
          name: product.name || '',
          description: product.brand || '',
          unitMeasure: product.unitMeasure || '',
          unitPrice: product.price || 0,
          saleId: saleId,
        }))
      ];

      // Enviar los productos directamente a la API
      await createSaleDetails(saleDetailsProducts);

      // Redirigir a la página de ventas
      window.location.href = '/ventas';
      localStorage.removeItem('cartItems');
    } catch (err) {
      setError('Error creating sale or sale details');
    }
  };

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return <div className='text-center'>Loading products...</div>;
  }

  if (error) {
    return <div className='text-center'>Error: {error}</div>;
  }

  return (
    <div className='max-w-[800px] m-auto pt-5' >
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <button type="submit" className='bg-green-500 text-white px-4 py-1 rounded-xl w-40'>Cerrar Venta</button>

        <div className='flex flex-col items-start justify-start'>
          {productsData.map((item, index) => (
            <div key={index} className='border-y-2 border-black w-60'>
              <p>Producto: {item.name}</p>
              <p>Marca: {item.price}</p>
              <p>Cantidad: {item.quantity}</p>
              <p>Precio: ${item.price}</p>
            </div>
          ))}
        </div>

        <h3>Agregar productos adicionales</h3>
        {additionalProducts.map((product, index) => (
          <div key={index}>
            <input
              type="text"
              name="name"
              placeholder="Nombre del producto"
              value={product.name}
              onChange={(e) => handleInputChange(e, index)}
            />

            <input
              type="text"
              name="brand"
              placeholder="Descripción"
              value={product.brand}
              onChange={(e) => handleInputChange(e, index)}
            />

            <input
              type="number"
              name="price"
              placeholder="Precio"
              value={product.price}
              onChange={(e) => handleInputChange(e, index)}
            />

            <input
              type="number"
              name="quantity"
              placeholder="Cantidad"
              value={product.quantity}
              onChange={(e) => handleInputChange(e, index)}
            />

            <button type="button" onClick={() => removeProduct(index)}>Eliminar</button>
          </div>
        ))}

        <h3>Agregar más productos de verdulería o carnicería</h3>
        <div className='flex flex-row gap-4'>

        {initialAdditionalProducts.map((product, index) => (
          <button
          className='flex flex-1 items-center gap-2'
          key={index}
          type="button"
          onClick={() => addProduct(product)}
          >
            Agregar {product.name} {product.icon}
          </button>
        ))}
        </div>
      </form>
    </div>
  );
};

export default Checkout;
