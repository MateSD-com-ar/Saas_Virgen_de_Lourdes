import React, { useState, useEffect, useCallback } from 'react'; 
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import { getProductsAlmacen } from '../axios/products.axios';
import debounce from 'lodash.debounce';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await getProductsAlmacen();
        if (Array.isArray(response)) {
          setProducts(response);
          setFilteredProducts(response);
        } else {
          throw new Error('Invalid data format');
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = useCallback((product) => {
    dispatch(addToCart(product));
  }, [dispatch]);

  const handleSearch = useCallback(debounce((search) => {
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, 300), [products]);

  const onSearchChange = (e) => {
    handleSearch(e.target.value);
  };

  if (loading) {
    return <div className='text-center'>Loading products...</div>;
  }

  if (error) {
    return <div className='text-red-500 text-center'>{error}</div>;
  }

  return (
    <div className='max-w-[800px] m-auto'>
      <div className='flex flex-row items-center justify-between mb-4'>
        <h2>PRODUCTOS DE ALMACEN</h2>
        <input
          type="text"
          placeholder="Search Products"
          className="border-2 border-solid border-black p-2 rounded-lg"
          onChange={onSearchChange}
        />
      </div>
      <div className="grid grid-cols-2 gap-2 p-5">
        {filteredProducts.length > 0 ? filteredProducts.map(product => (
          <div key={product.idProduct} className="border-2 border-solid border-black p-2 rounded-lg">
            <h3>Producto: {product.name}</h3>
            <p>Precio: ${product.price}</p>
            <p>Codigo: {product.code}</p>
            <p>Stock: {product.stock} unidades</p>
            <button 
              onClick={() => handleAddToCart(product)} 
              className="bg-blue-500 text-white px-2 rounded-lg hover:bg-blue-600"
            >
              Add to Cart
            </button>
          </div>
        )) : <div className='text-center'> <h2>No se encontro ningun producto</h2></div>}
      </div>
    </div>
  );
};

export default Products;
