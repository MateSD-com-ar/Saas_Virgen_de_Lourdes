import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getAllProducts, deleteProductAlmacen } from '../axios/products.axios';
import debounce from 'lodash.debounce'; // Asegúrate de tener lodash.debounce instalado

const Admin = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await getAllProducts(); // Asegúrate de que `getAllProducts` maneje el token si es necesario
        if (response && Array.isArray(response)) { // Verifica si la respuesta es un array
          setProducts(response);
          setFilteredProducts(response);
        } else {
          setError('No se recibieron datos válidos.');
        }
      } catch (error) {
        setError('Failed to fetch products. Please try again later.');
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [token]);

  const handleDeleteProduct = async (productId) => {
    try {
      await deleteProductAlmacen(productId);
      const updatedProducts = products.filter(product => product.idProduct !== productId);
      setProducts(updatedProducts);
      setFilteredProducts(updatedProducts);
    } catch (error) {
      console.error('Failed to delete product:', error);
      setError('Failed to delete product. Please try again.');
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSearch = useCallback(debounce((searchTerm) => {
    if (products && Array.isArray(products)) {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, 300), [products]);

  const onSearchChange = (e) => {
    setSearch(e.target.value);
    handleSearch(e.target.value);
  };

  const handleErase = () => {
    setSearch('');
    setFilteredProducts(products); // Reset the filtered list to show all products
  };

  return (
    <div className='flex flex-col items-center max-w-[1100px] m-auto'>
      <h1 className='text-2xl font-bold'>Administrador</h1>
      <div className='mb-4 flex flex-col lg:flex-row items-center'>
        <Link to='/empleados' className='text-blue-500 hover:underline mr-4'>Ver Empleados</Link>
        <Link to='/producto/create/' className='text-blue-500 hover:underline mr-4'>Cargar Producto</Link>
        <Link to='/resumen/' className='text-blue-500 hover:underline mr-4'>Resumen</Link>
      </div>
      <div className='mb-4 flex items-center'>
        <input
          type="text"
          name="search"
          id="search"
          value={search}
          placeholder="Buscar productos..."
          onChange={onSearchChange}
          className='border px-4 py-1 rounded-lg flex-1'
        />
        <button
          onClick={handleErase}
          className='ml-2 bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600'
        >
          Borrar
        </button>
      </div>
      <div className='flex flex-row items-center justify-center gap-5 flex-wrap'>
        {loading && <p>Cargando productos...</p>}
        {error && <p className='text-red-500'>{error}</p>}
        {filteredProducts.length === 0 && !loading && <p className='text-red-500'>No hay productos para mostrar</p>}
        {filteredProducts.length > 0 && filteredProducts.map(product => (
          <div key={product.idProduct} className="grid grid-cols-2 gap-2 p-5 border rounded-lg shadow-sm">
            <h3 className='font-semibold'>{product.name}</h3>
            <p>Precio: ${product.price}</p>
            <p>Código: {product.code}</p>
            <p>Stock: {product.stock}</p>
            <div className='flex gap-2'>
              <Link to={`/producto/edit/${product.idProduct}`} className='bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-600'>Editar</Link>
              <button onClick={() => handleDeleteProduct(product.idProduct)} className='bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600'>Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;
