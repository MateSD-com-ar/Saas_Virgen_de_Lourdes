import React, { useState, useEffect, useRef } from 'react';
import { createSaleDetails, getSaleDetails, deleteDetailsSale, updateDetailsSale } from '../axios/sales.axios';
import { getProductsAlmacen } from '../axios/products.axios';
import { CiSquarePlus } from "react-icons/ci";
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [productsAlmacen, setProductsAlmacen] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [saleDetail, setSaleDetails] = useState([]);
  const [additionalProducts, setAdditionalProducts] = useState([]);
  const searchInputRef = useRef(null);
  const { id } = useParams()
  const navigate = useNavigate();
  const initialAdditionalProducts = [
    { icon: <CiSquarePlus className='text-xl' />, idProduct: '', name: "", brand: "", price: 0, roleProduct: "", unitMeasure: "", stock: 0 },
  ];
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
  if (id) {
    const fetchData = async () => {
      try {
        const response = await getSaleDetails(id);
        setSaleDetails(response);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }
  const handleKeyPress = (e) => {
    if (e.key !== 'Enter') return;
  
    e.preventDefault();
    const query = e.target.value.trim().toLowerCase();
    
    // Buscar por código de barra, nombre o marca
    const product = productsAlmacen.find(prod => 
      prod.code.toLowerCase().includes(query) || 
      prod.name.toLowerCase().includes(query) || 
      prod.brand.toLowerCase().includes(query)
    );
  
    if (!product || product.stock === 0) {
      setSearchTerm('');
      e.target.value = '';
      const message = !product ? 'Producto no encontrado' : 'Producto sin stock';
      alert(message);
      setTimeout(() => setError(null), 3000);
      return;
    }
  
    addProduct(product);
    setSearchTerm('');
    e.target.value = '';
  };
  
  const handleInputChange = (e, index, type) => {
    const { name, value } = e.target;
    if (type === 'additional') {
      const updatedProducts = [...additionalProducts];
      updatedProducts[index][name] = value; // Actualiza el valor de la propiedad correspondiente
      setAdditionalProducts(updatedProducts);
    }
  };
  const deleteDetails = async (id) => {
    try {
      await deleteDetailsSale(id);
      const updatedDetails = saleDetail.filter(detail => detail.id !== id);
      setSaleDetails(updatedDetails);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  }
  const addProduct = (product) => {
    setAdditionalProducts([...additionalProducts, { ...product, quantity: '' }]);
  };
  const removeProduct = (index) => {
    const updatedProducts = additionalProducts.filter((_, i) => i !== index);
    setAdditionalProducts(updatedProducts);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const saleDetailsProducts = [
        ...additionalProducts.map((product) => ({
          quantity: product.quantity || '',
          product: product.idProduct,
          name: product.name || '',
          description: product.brand || '',
          unitMeasure: product.unitMeasure || '',
          unitPrice: product.price || 0,
          saleId: id,
        }))
      ];
      console.log(saleDetailsProducts)
      await createSaleDetails(saleDetailsProducts);
        navigate(`/venta/${id}`)
      localStorage.removeItem('cartItems');
    } catch (err) {
      setError('Error creating sale or sale details');
    }
  };

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
    <div className='lg:max-w-[1100px] px-4 pt-5 m-auto'>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <div className='flex flex-wrap justify-between items-center'>
          <button type="submit" className='bg-green-500 text-white px-4 py-1 rounded-full font-semibold w-full md:w-40'>Cerrar Venta</button>
        </div>

        <div className='mt-6 overflow-x-auto'>
          <h3 className='text-xl font-semibold mb-2'>Productos en el carrito</h3>
          <table className='min-w-full bg-white border border-gray-200'>
            <thead>
              <tr className='border-b'>
                <th className='py-2 px-4 text-left'>Producto</th>
                <th className='py-2 px-4 text-left'>Descripcion</th>
                <th className='py-2 px-4 text-left'>Precio</th>
                <th className='py-2 px-4 text-left'>Cantidad</th>
              </tr>
            </thead>
            <tbody>
              {saleDetail && saleDetail[0]?.saleDetailsProducts.map((item, index) => (
                <tr key={index} className='border-b'>
                  <td className='py-2 px-4 capitalize'>{item.product.name}</td>
                  <td className='py-2 px-4 capitalize'>{item.description}</td>
                  <td className='py-2 px-4'>${item.unitPrice}</td>
                  <td className='py-2 px-4'>{item.quantity}</td>
                  <td className='py-2 px-4'>
                    <button type="button" onClick={() => deleteDetails(item.id)} className='text-red-500 font-semibold'>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className='text-center'>Agregar productos adicionales</h3>
        {additionalProducts.map((product, index) => (
  <div key={index} className='flex flex-col md:flex-row gap-2 w-full'>
    {/* Select para categorías */}
    <select
      name="idProduct"
      value={product.idProduct}
      onChange={(e) => handleInputChange(e, index, 'additional')}
      className='border-2 px-4 py-2 rounded-full w-full md:w-1/4'
    >
      <option value="">Seleccionar categoría</option>
      <option value="1">Carnicería</option>
      <option value="2">Verdulería</option>
    </select>

    {/* Input para nombre del producto */}
    <input
      type="text"
      name="name"
      placeholder="Nombre del producto"
      value={product.name}
      onChange={(e) => handleInputChange(e, index, 'additional')}
      className='border-2 px-4 py-2 rounded-full w-full md:w-1/4'
    />

    {/* Input para descripción */}
    <input
      type="text"
      name="brand"
      placeholder="Descripción"
      value={product.brand}
      onChange={(e) => handleInputChange(e, index, 'additional')}
      className='border-2 px-4 py-2 rounded-full w-full md:w-1/4'
    />

    {/* Input para precio */}
    <input
      type="number"
      name="price"
      placeholder="Precio"
      value={product.price}
      onChange={(e) => handleInputChange(e, index, 'additional')}
      className='border-2 px-4 py-2 rounded-full w-full md:w-1/4'
    />

    {/* Input para cantidad */}
    <input
      type="number"
      name="quantity"
      placeholder="Cantidad"
      value={product.quantity}
      onChange={(e) => handleInputChange(e, index, 'additional')}
      className='border-2 px-4 py-2 rounded-full w-full md:w-1/4'
    />

    {/* Botón de eliminar */}
    <button
      type="button"
      onClick={() => removeProduct(index)}
      className='px-4 py-1 bg-red-700 text-white font-medium rounded-full w-full md:w-auto'
    >
      Eliminar
    </button>
  </div>
))}

{/*importenate no borrar */}
<div className='mt-4'>
          <input
            type="text"
            placeholder="Buscar por código de barra"
            onKeyPress={handleKeyPress}
            ref={searchInputRef}
            className='border-2 px-4 py-2 rounded-full w-full'
          />
        </div>
        <div className='flex flex-row gap-4 py-4'>
          {initialAdditionalProducts.map((product, index) => (
            <button
              key={index}
              type="button"
              onClick={() => addProduct(product)}
              className={`${product.roleProduct === 'Verduleria' ?
                'bg-green-500 text-white px-4 py-1 rounded-full font-semibold w-full flex flex-row items-center gap-4 justify-center' :
                'bg-red-500 text-white px-4 py-1 rounded-full font-semibold w-full flex flex-row items-center gap-4 justify-center'
                }`}
            >
              Agregar {product.name} {product.icon}
            </button>
          ))}
        </div>
      </form>
      <div className="w-full bg-gray-100 p-4 border-2 border-gray-300">
        <h3>Buscar productos en almacén</h3>
        <input
          type="text"
          placeholder="Buscar producto..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='border-2 px-4 py-2 rounded-full'
        />
        <div>
          {filteredProducts.map((product) => (
            <div key={product.idProduct} className='border-2 mt-2 px-4 py-2 rounded flex flex-col lg:flex-row place-items-center gap-3'>
              <p className='capitalize'>Producto: <strong>{product.name}</strong></p>
              <p className='capitalize'>Marca: {product.brand}</p>
              <p>Precio: ${product.price}</p>
              <p>Stock: {product.stock}</p>
              {
                product.stock === 0 ? <p className='text-red-500'>Sin stock</p> : <button type="button" onClick={() => addProduct(product)} className={`${product.stock === 0 ? 'hidden' : 'bg-blue-500 text-white px-4 py-1 rounded-full mt-2'} `}>Agregar</button>
              }
              
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Checkout;