import React, { useState, useEffect, useRef } from 'react';
import { createSaleDetails, getSaleDetails, deleteDetailsSale, updateDetailsSale } from '../axios/sales.axios';
import { getProductsAlmacen } from '../axios/products.axios';
import { GiCow } from "react-icons/gi";
import { LuVegan } from "react-icons/lu";
import { useParams } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const Checkout = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [productsAlmacen, setProductsAlmacen] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [saleDetail, setSaleDetails] = useState([]);
  const [additionalProducts, setAdditionalProducts] = useState([]);
  const { id } = useParams();
  const searchInputRef = useRef(null);

  const initialAdditionalProducts = [
    { icon: <LuVegan className='text-xl' />, idProduct: 2, name: "Verduleria", brand: "Verduleria", price: '', roleProduct: "Verduleria", unitMeasure: "", stock: 0 },
    { icon: <GiCow className='text-xl' />, idProduct: 1, name: "Carniceria", brand: "Carniceria", price: '', roleProduct: "Carniceria", unitMeasure: "kilogramo", stock: 0 }
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

  useEffect(() => {
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
  }, [id]);

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const productCode = e.target.value.trim().replace(/[^a-zA-Z0-9]/g, '');
      const product = productsAlmacen.find(prod => prod.code === productCode);
      if (!product) {
        setSearchTerm('');
        e.target.value = '';
        alert('Producto no encontrado');
        setTimeout(() => setError(null), 3000);
        return;
      }
      if (product.stock === 0) {
        setSearchTerm('');
        e.target.value = '';
        alert('Producto sin stock');
        setTimeout(() => setError(null), 3000);
        return;
      }
      if (product) {
        addProduct(product);
        setSearchTerm('');
        e.target.value = '';
      } else {
        setError('Producto no encontrado');
        setTimeout(() => setError(null), 3000);
      }
    }
  };

  const handleInputChange = async (e, index, type) => {
    const { name, value } = e.target;
    if (type === 'cart') {
      const updatedCart = [...saleDetail];
      const productToUpdate = updatedCart[index]?.product;
      if (productToUpdate) {
        updatedCart[index].quantity = value;
        try {
          await updateDetailsSale(updatedCart[index].id, { quantity: value });
          setSaleDetails(updatedCart);
        } catch (error) {
          console.error('Error updating sale detail:', error);
          setError('Error updating sale detail');
        }
      } else {
        console.error("El producto no existe en el índice proporcionado");
      }
    } else {
      const updatedProducts = [...additionalProducts];
      updatedProducts[index][name] = value;
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
  };

  const addProduct = (product) => {
    const existingProduct = additionalProducts.find(p => p.idProduct === product.idProduct);
    if (existingProduct) {
      setAdditionalProducts(additionalProducts.map(p =>
        p.idProduct === product.idProduct ? { ...p, quantity: p.quantity + 1 } : p
      ));
    } else {
      setAdditionalProducts([...additionalProducts, { ...product, quantity: 1 }]);
    }
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
      await createSaleDetails(saleDetailsProducts);
      window.location.href = `/venta/${id}`;
      localStorage.removeItem('cartItems');
    } catch (err) {
      setError('Error creating sale or sale details');
    }
  };

  useEffect(() => {
    if (productsAlmacen && Array.isArray(productsAlmacen)) {
      const results = productsAlmacen.filter(product =>
        product.code.includes(searchTerm)
      );
      setFilteredProducts(results);
    }
  }, [searchTerm, productsAlmacen]);

  if (loading) {
    return <div className='text-center'>Loading products...</div>;
  }

  if (error) {
    return <div className='text-center'>Error: {error}</div>;
  }

  return (
    <div className='lg:max-w-[1100px] px-4 pt-5 mx-auto w-full'>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <div className='flex flex-col md:flex-row justify-between items-center'>
          <button type="submit" className='bg-green-500 text-white px-4 py-1 rounded-full font-semibold w-full md:w-40'>Cerrar Venta</button>
        </div>

        <div className='mt-2 overflow-x-auto'>
          <h3 className='text-xl font-semibold mb-2'>Productos en el carrito</h3>
          <table className='min-w-full bg-white border border-gray-200'>
            <thead>
              <tr className='border-b'>
                <th className='py-2 px-4 text-left'>Producto</th>
                <th className='py-2 px-4 text-left'>Descripcion</th>
                <th className='py-2 px-4 text-left'>Precio</th>
                <th className='py-2 px-4 text-left'>Cantidad</th>
                <th className='py-2 px-4 text-left'>Acciones</th>
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
            <input
              type="text"
              name="name"
              placeholder="Nombre del producto"
              value={product.name}
              onChange={(e) => handleInputChange(e, index, 'additional')}
              className='border-2 px-4 py-2 rounded-full w-full md:w-1/4'
            />
            <input
              type="text"
              name="brand"
              placeholder="Descripción"
              value={product.brand}
              onChange={(e) => handleInputChange(e, index, 'additional')}
              className='border-2 px-4 py-2 rounded-full w-full md:w-1/4'
            />
            <input
              type="number"
              name="quantity"
              placeholder="Cantidad"
              value={product.quantity}
              onChange={(e) => handleInputChange(e, index, 'additional')}
              className='border-2 px-4 py-2 rounded-full w-full md:w-1/4'
            />
            <input
              type="number"
              name="price"
              placeholder="Precio"
              value={product.price}
              onChange={(e) => handleInputChange(e, index, 'additional')}
              className='border-2 px-4 py-2 rounded-full w-full md:w-1/4'
            />
            <button type="button" onClick={() => removeProduct(index)} className='text-red-500 font-semibold'>Eliminar</button>
          </div>
        ))}

        <div className='flex flex-col md:flex-row m-auto w-full md:w-1/4 gap-4 mt-2'>
          {initialAdditionalProducts.map((product, index) => (
            <button
              key={index}
              type="button"
              onClick={() => addProduct(product)}
              className={`${product.roleProduct === 'Verduleria'
                ? 'bg-green-500 text-white px-4 py-1 rounded-full font-semibold w-full flex flex-row items-center gap-4 justify-center'
                : 'bg-red-500 text-white px-4 py-1 rounded-full font-semibold w-full flex flex-row items-center gap-4 justify-center'
                }`}
            >
              <p className='hidden md:block'>
                {product.icon}
              </p>
              {product.name}
            </button>
          ))}
        </div>

        <div className='mt-4'>
          <input
            type="text"
            placeholder="Buscar por código de barra"
            onKeyPress={handleKeyPress}
            ref={searchInputRef}
            className='border-2 px-4 py-2 rounded-full w-full'
          />
        </div>
      </form>
    </div>
  );
};

export default Checkout;
