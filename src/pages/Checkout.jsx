import React, { useState, useEffect } from 'react';
import { createSaleDetails, getSaleDetails } from '../axios/sales.axios';
import { getProductsAlmacen } from '../axios/products.axios';
import { GiCow } from "react-icons/gi";
import { LuVegan } from "react-icons/lu";

const Checkout = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [productsAlmacen, setProductsAlmacen] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [saleDetail, setSaleDetails] = useState([])
  // Obtener productos desde localStorage
  const productsData = JSON.parse(localStorage.getItem('cartItems')) || [];
  const saleId = localStorage.getItem('saleId'); // Obtener el saleId desde localStorage
  // Productos base de verdulería y carnicería
  const initialAdditionalProducts = [
    { icon: <LuVegan className='text-xl' />, idProduct: 2, name: "Verduleria", brand: "Verduleria", price: 'price', roleProduct: "Verduleria", unitMeasure: "", stock: 0 },
    { icon: <GiCow className='text-xl' />, idProduct: 1, name: "Carniceria", brand: "Carniceria", price: 'price', roleProduct: "Carniceria", unitMeasure: "kilogramo", stock: 0 }
  ];

  // Estado para almacenar productos adicionales dinámicos
  const [additionalProducts, setAdditionalProducts] = useState([]);
  console.log(saleId)
  // Obtener productos del almacén desde la API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await getProductsAlmacen();
        setProductsAlmacen(products);
      } catch (err) {
        setError('Error fetching products from almacen');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);
  const id = localStorage.getItem('saleId');
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getSaleDetails(id);
        setSaleDetails(response);
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    }
  
    fetchData();
  }, [id]);
  
  console.log(saleDetail)
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
        ...additionalProducts.map((product) => ({
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

  // Manejar el filtrado de productos en el almacén
  useEffect(() => {
    const results = productsAlmacen.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(results);
  }, [searchTerm, productsAlmacen]);

  if (loading) {
    return <div className='text-center'>Loading products...</div>;
  }

  if (error) {
    return <div className='text-center'>Error: {error}</div>;
  }

  return (
    <div className='max-w-[800px] m-auto pt-5'>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <div className='flex flex-row justify-between items-center'>

        {/* <h1 className='text-2xl font-serif font-bold'>{saleDetail[0].client}</h1> */}
        <button type="submit" className='bg-green-500 text-white px-4 py-1 rounded-full font-semibold w-40'>Cerrar Venta</button>
        </div>

        <div className='flex flex-col items-start justify-start'>
          {productsData.map((item, index) => (
            <div key={index} className='border-y-2 border-black w-60'>
              <p>Producto: {item.name}</p>
              <p>Marca: {item.brand}</p>
              <p>Cantidad: {item.quantity}</p>
              <p>Precio: ${item.price}</p>
            </div>
          ))}
        </div>
        <h3>Agregar productos adicionales</h3>
        {additionalProducts.map((product, index) => (
          <div key={index} className='flex flex-1 gap-2'>
            <input
              type="text"
              name="name"
              placeholder="Nombre del producto"
              value={product.name}
              onChange={(e) => handleInputChange(e, index)}
              className='border-2 px-4 py-2 rounded-full'
            />

            <input
              type="text"
              name="brand"
              placeholder="Descripción"
              value={product.brand}
              onChange={(e) => handleInputChange(e, index)}
              className='border-2 px-4 py-2 rounded-full'
            />
            <input
              type="number"
              name="price"
              placeholder="Precio"
              value={product.price}
              onChange={(e) => handleInputChange(e, index)}
              className='border-2 px-4 py-2 rounded-full'
            />
            <input
              type="number"
              name="quantity"
              placeholder="Cantidad"
              value={product.quantity}
              onChange={(e) => handleInputChange(e, index)}
              className='border-2 px-4 py-2 rounded-full'
            />
            <button type="button" onClick={() => removeProduct(index)} className='px-4 py-1 bg-red-700 text-white font-medium rounded-full'>Eliminar</button>
          </div>
        ))}

        <h3>Agregar más productos de verdulería o carnicería</h3>
        <div className='flex flex-row gap-4'>
          {initialAdditionalProducts.map((product, index) => (
            <button
              key={index}
              type="button"
              onClick={() => addProduct(product)}
              className={`${product.roleProduct==='Verduleria' ?
                'bg-green-500 text-white px-4 py-1 rounded-full font-semibold w-full flex flex-row items-center gap-4 justify-center':
                'bg-red-500 text-white px-4 py-1 rounded-full font-semibold w-full flex flex-row items-center gap-4 justify-center'
              }`}
            >
              Agregar {product.name} {product.icon}
            </button>
          ))}
        </div>
      </form>

      <div className="w-full bg-gray-100 p-4 border-l-2 border-gray-300">
        <h3>Buscar productos en almacén</h3>
        <input
          type="text"
          placeholder="Buscar producto"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-4 py-2 rounded w-full"
        />
        <ul className="mt-4">
          {filteredProducts.map((product, index) => (
            <li key={index} className="py-2">
              {product.name} - ${product.price}
              <button
                type="button"
                className="ml-2 bg-blue-500 text-white px-2 py-1 rounded"
                onClick={() => addProduct(product)}
              >
                Agregar
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Checkout;
