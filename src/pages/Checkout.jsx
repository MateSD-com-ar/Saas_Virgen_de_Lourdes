import React, { useState, useEffect } from 'react';
import { createSaleDetails, getSaleDetails, deleteDetailsSale, updateDetailsSale } from '../axios/sales.axios';
import { getProductsAlmacen } from '../axios/products.axios';
import { GiCow } from "react-icons/gi";
import { LuVegan } from "react-icons/lu";
import { useNavigate, useParams } from 'react-router-dom';

const Checkout = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [productsAlmacen, setProductsAlmacen] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [saleDetail, setSaleDetails] = useState([]);
  const [additionalProducts, setAdditionalProducts] = useState([]);
  const navigate = useNavigate()
  const { id } = useParams()
  const initialAdditionalProducts = [
    { icon: <LuVegan className='text-xl' />, idProduct: 2, name: "Verduleria", brand: "Verduleria", price: 'price', roleProduct: "Verduleria", unitMeasure: "", stock: 0 },
    { icon: <GiCow className='text-xl' />, idProduct: 1, name: "Carniceria", brand: "Carniceria", price: 'price', roleProduct: "Carniceria", unitMeasure: "kilogramo", stock: 0 }
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
  const handleInputChange = async (e, index, type) => {
    const { name, value } = e.target;
    if (type === 'cart') {
      const updatedCart = [...saleDetail]; // Clona el array del carrito
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
      await createSaleDetails(saleDetailsProducts);
        window.location.href=`/venta/${id}`
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
                <th className='py-2 px-4 text-left'>Nombre</th>
                <th className='py-2 px-4 text-left'>Marca</th>
                <th className='py-2 px-4 text-left'>Precio</th>
                <th className='py-2 px-4 text-left'>Cantidad</th>
              </tr>
            </thead>
            <tbody>
              {saleDetail && saleDetail[0]?.saleDetailsProducts.map((item, index) => (
                <tr key={index} className='border-b'>
                  <td className='py-2 px-4 capitalize'>{item.product.name}</td>
                  <td className='py-2 px-4 capitalize'>{item.product.brand}</td>
                  <td className='py-2 px-4'>${item.product.price}</td>
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
              name="price"
              placeholder="Precio"
              value={product.price}
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
            <button type="button" onClick={() => removeProduct(index)} className='px-4 py-1 bg-red-700 text-white font-medium rounded-full w-full md:w-auto'>Eliminar</button>
          </div>
        ))}
{/*importenate no borrar */}
       
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
            <div key={product.idProduct} className='border-2 mt-2 px-4 py-2 rounded flex flex-row gap-3'>
              <h2>Producto: <strong>{product.name}</strong></h2>
              <p>Precio: ${product.price}</p>
              <p>Stock: {product.stock}</p>
              <button type="button" onClick={() => addProduct(product)} className={`${product.stock === 0 ? 'hidden' : 'bg-blue-500 text-white px-4 py-1 rounded-full mt-2'} `}>Agregar</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
