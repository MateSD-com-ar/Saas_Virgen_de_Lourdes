import React, { useState, useEffect } from 'react';
import { createSaleDetails } from '../axios/sales.axios';

const Checkout = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [productInputs, setProductInputs] = useState({});

  // Obtener productos desde localStorage
  const productsData = JSON.parse(localStorage.getItem('cartItems')) || [];
  const saleId = localStorage.getItem('saleId'); // Obtener el saleId desde localStorage

  // Productos adicionales que se pueden agregar
  const additionalProducts = [
    {
      idProduct: 2,
      name: "verduleria",
      brand: "verduleria",
      code: "",
      price: 0.0,
      roleProduct: "Verduleria",
      unitMeasure: "",
      stock: 0
    },
    {
      idProduct: 1,
      name: "carne",
      brand: "carne",
      code: "",
      price: 0.0,
      roleProduct: "Carniceria",
      unitMeasure: "kilogramo",
      stock: 0
    }
  ];

  // Manejar selección de productos
  const handleCheckboxChange = (e, product) => {
    if (e.target.checked) {
      setSelectedProducts([...selectedProducts, product]);
    } else {
      setSelectedProducts(selectedProducts.filter(p => p.idProduct !== product.idProduct));
    }
  };

  // Manejar cambios en los inputs de nombre, precio y descripción
  const handleInputChange = (e, idProduct) => {
    const { name, value } = e.target;
    setProductInputs(prevState => ({
      ...prevState,
      [idProduct]: {
        ...prevState[idProduct],
        [name]: value
      }
    }));
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
        ...selectedProducts.map(product => ({
          quantity: productInputs[product.idProduct]?.quantity || 1,
          product: product.idProduct,
          name: productInputs[product.idProduct]?.name || product.name,
          description: productInputs[product.idProduct]?.brand || product.brand,
          unitMeasure: productInputs[product.idProduct]?.unitMeasure || product.unitMeasure || '',
          unitPrice: productInputs[product.idProduct]?.price || product.price,
          
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
    <div>
      <form onSubmit={handleSubmit}>
        <button type="submit">Create Sale</button>

        <div>
          {productsData.map((item, index) => (
            <div key={index}>
              <p>{item.name}</p>
              <p>{item.price}</p>
              <p>{item.quantity}</p>
            </div>
          ))}
        </div>

        <h3>Agregar productos adicionales</h3>
        {additionalProducts.map((product, index) => (
          <div key={index}>
            <label>
              <input
                type="checkbox"
                onChange={(e) => handleCheckboxChange(e, product)}
              />
              {product.name}
            </label>

            {selectedProducts.some(p => p.idProduct === product.idProduct) && (
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Nombre del producto"
                  value={productInputs[product.idProduct]?.name || product.name}
                  onChange={(e) => handleInputChange(e, product.idProduct)}
                />

                <input
                  type="text"
                  name="brand"
                  placeholder="Descripción"
                  value={productInputs[product.idProduct]?.brand || product.brand}
                  onChange={(e) => handleInputChange(e, product.idProduct)}
                />

                <input
                  type="number"
                  name="price"
                  placeholder="Precio"
                  value={productInputs[product.idProduct]?.price || product.price}
                  onChange={(e) => handleInputChange(e, product.idProduct)}
                />

                <input
                  type="number"
                  name="quantity"
                  placeholder="Cantidad"
                  value={productInputs[product.idProduct]?.quantity || ''}
                  onChange={(e) => handleInputChange(e, product.idProduct)}
                />
              </div>
            )}
          </div>
        ))}
      </form>
    </div>
  );
};

export default Checkout;
