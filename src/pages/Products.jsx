/* eslint-disable react-hooks/exhaustive-deps */
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

  // Fetch products from the API
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await getProductsAlmacen();
        if (Array.isArray(response)) {
          setProducts(response);
          setFilteredProducts(response); // Initial filter set to all products
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

  // Add product to the cart
  const handleAddToCart = useCallback((product) => {
    dispatch(addToCart(product));
  }, [dispatch]);

  // Search function with debounce
  const handleSearch = useCallback(
    debounce((search) => {
      if (!search) {
        setFilteredProducts(products); // Show all products when search is empty
      } else {
        const filtered = products.filter(product =>
          product.name.toLowerCase().includes(search.toLowerCase()) ||
          product.code.toLowerCase().includes(search.toLowerCase())
        );
        console.log("Filtered products:", filtered);
        setFilteredProducts(filtered);
      }
    }, 300), 
    [products]  // Make sure to memoize based on the `products` array
  );

  const onSearchChange = (e) => {
    handleSearch(e.target.value);
  };

  // Loading or error message
  if (loading) {
    return <div className="text-center">Loading products...</div>;
  }

  if (error) {
    return (
      <div className="text-red-500 text-center">
        {error}
        <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="lg:max-w-[800px] m-auto">
      <div className="flex flex-col lg:flex-row items-center justify-between mb-4">
        <h2>PRODUCTOS DE ALMACEN</h2>
        <input
          type="text"
          placeholder="Search Products"
          className="border-2 border-solid border-black p-2 rounded-lg"
          onChange={onSearchChange}
        />
      </div>
      <div className="flex flex-wrap lg:items-center justify-center px-4 gap-4">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <div key={product.idProduct} className="border-2 border-solid border-black p-2 my-2 rounded-lg">
              <h3><strong>Producto:</strong> {product.name}</h3>
              <p><strong>Precio:</strong> ${product.price}</p>
              <p><strong>Codigo:</strong> {product.code}</p>
              <p><strong>Strock</strong> {product.stock} unidades</p>
              <button
                onClick={() => handleAddToCart(product)}
                className={`bg-blue-500 text-white mt-2 px-4 py-1 rounded-full hover:bg-blue-600 ${product.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={product.stock === 0}
                aria-label={`Add ${product.name} to cart`}
              >
                {product.stock === 0 ? 'Sin Stock' : 'Agregar'}
              </button>
            </div>
          ))
        ) : (
          <div className="text-center">
            <h2>No se encontro ningun producto</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
