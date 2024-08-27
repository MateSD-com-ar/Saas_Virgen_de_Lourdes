import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllProducts, deleteProductAlmacen } from '../axios/products.axios';

const Admin = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Assuming getAllProducts accepts token for authorization
        const response = await getAllProducts(); 
        console.log(response)// Pass token if required
        setProducts(response);
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
      await deleteProductAlmacen(productId, token);
      setProducts(products.filter(product => product.idProduct !== productId));
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  return (
    <div className='flex flex-col flex-1 max-w-[1100px] m-auto'>
      <h1>Administrador</h1>
      <div>
        <Link to='/producto/create/'>Cargar Producto</Link>
      </div>
      <div className='flex flex-row items-center justify-center gap-5'>
        {loading && <p>Loading products...</p>}
        {error && <p className='text-red-500'>{error}</p>}
        {products.length === 0 && !loading && <p>No products available.</p>}
        {products.map(product => (
          <div key={product.idProduct} className="grid grid-cols-2 gap-2 p-5"  >
            <h3>{product.name}</h3>
            <p>{product.price}</p>
            <p>{product.code}</p>
            <p>{product.stock}</p>
            <Link to={`/producto/edit/${product.idProduct}`}>Editar</Link>
            <button onClick={() => handleDeleteProduct(product.idProduct)}>Eliminar</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;
