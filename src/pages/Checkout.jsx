import React, { useState, useEffect } from 'react';
import { createSale } from '../axios/sales.axios';
const Checkout = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [client, setClient] = useState('');
  const [products, setProducts] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProducts(prevProduct => ({ ...prevProduct, [name]: value }));
  };

  const user = JSON.parse(localStorage.getItem('user'))

  const handleSubmit = async (e) => {
    e.preventDefault();
    const productsData = JSON.parse(localStorage.getItem('cartItems')) || [];
    const saleDetailsProducts = productsData.map(item => ({
      quantity: item.quantity,
      product: item.idProduct
    }));

    const saleData = {
      client,
      userId: user.id, // Ajusta este valor según sea necesario
      saleDetailsProducts
    };

    

    try {
      await createSale(saleData);
      window.location.href = '/ventas';
      localStorage.removeItem('cartItems');

      // Puedes agregar lógica para manejar el éxito, como redirigir al usuario o limpiar el carrito
    } catch (err) {
      setError('Error creating sale');
    }
    console.log(client)
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

  const productsData = JSON.parse(localStorage.getItem('cartItems')) || [];

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="client"
          value={client}
          onChange={(e) => setClient(e.target.value)}
          placeholder="Client Name"
          required
        />
        
        <button type="submit">Create Sale</button>
      </form>
      <div>
        {
          productsData.map((item, index) => (
            <div key={index}>
              <p>{item.name}</p>
              <p>{item.price}</p>
              <p>{item.quantity}</p>
            </div>
          ))
        }
      </div>
    </div>
  );
}

export default Checkout;
