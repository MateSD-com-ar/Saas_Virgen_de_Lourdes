import React, { useState, useEffect } from 'react';
import { createProductAlmacen, updateProductAlmacen, getProductId } from '../axios/products.axios';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Select, TextField, MenuItem } from '@mui/material';

function ProductsForm() {
  const [product, setProduct] = useState({
    name: '',
    brand: '',
    code: '',
    price: '',
    roleProduct: 'Almacen',
    unitMeasure: '',
    stock: '',
  });
  const { id } = useParams();

  const [error, setError] = useState({});
  const [success, setSuccess] = useState(null);

  // Load product data for editing
  useEffect(() => {
    const loadProductData = async () => {
      if (id) {
        try {
          const productData = await getProductId(id);
          setProduct(productData.data); // Ensure the structure matches your state
        } catch (err) {
          setError({ global: 'Error al cargar los datos del producto.' });
        }
      }
    };
    loadProductData();
  }, [id]);

  const handleCreateOrUpdateProduct = async () => {
    try {
      if (id) {
        await updateProductAlmacen(id, product);
        setSuccess('Producto actualizado con éxito');
      } else {
        await createProductAlmacen(product);
        setSuccess('Producto creado con éxito');
        setProduct({
          name: '',
          brand: '',
          code: '',
          price: '',
          roleProduct: 'Almacen',
          unitMeasure: '',
          stock: '',
        });
      }
      setTimeout(() => {
        window.location.href = '/admin'; // Redirect after success
      }, 1500);
    } catch (err) {
      setError({ global: 'Error al guardar el producto. Por favor, inténtalo de nuevo.' });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({ ...prevProduct, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    
    // Validate all fields
    if (!product.name) newErrors.name = 'El nombre es obligatorio';
    if (!product.price || isNaN(product.price) || product.price <= 0) newErrors.price = 'El precio debe ser un número positivo';
    if (!product.stock || isNaN(product.stock) || product.stock < 0) newErrors.stock = 'El stock debe ser un número positivo';
    if (!product.roleProduct) newErrors.roleProduct = 'Selecciona un rol para el producto';
    if (!product.unitMeasure) newErrors.unitMeasure = 'La unidad de medida es obligatoria';
    if (!product.code) newErrors.code = 'El código es obligatorio';

    if (Object.keys(newErrors).length > 0) {
      setError(newErrors);
      return;
    }

    setError({});
    setSuccess(null);
    handleCreateOrUpdateProduct();
  };

  return (
    <div className='max-w-[500px] m-auto'>
      <h1 className='text-2xl text-center font-serif'>
        {id ? 'Editar Producto' : 'Cargar Producto'}
      </h1>
      {error.global && <p className='text-red-500 text-center'>{error.global}</p>}
      {success && <p className='text-green-500 text-center'>{success}</p>}
      <form
        className='flex flex-col flex-1 justify-center items-center gap-4'
        onSubmit={handleSubmit}
      >
        <TextField
          type="text"
          label='Nombre'
          name='name'
          value={product.name}
          error={!!error.name}
          helperText={error.name}
          onChange={handleInputChange}
          className='w-1/2 px-3 py-1 rounded-full'
          required
        />
        <TextField
          type="text"
          label='Descripción'
          name='brand'
          value={product.brand}
          error={!!error.brand}
          helperText={error.brand}
          onChange={handleInputChange}
          className='w-1/2 px-3 py-1 rounded-full'
        />
        <TextField
          type="number"
          label='Precio'
          name='price'
          value={product.price}
          error={!!error.price}
          helperText={error.price}
          onChange={handleInputChange}
          className='w-1/2 px-3 py-1 rounded-full'
          required
        />
        <TextField
          type="text"
          label='Unidad de Medida'
          name='unitMeasure'
          value={product.unitMeasure}
          error={!!error.unitMeasure}
          helperText={error.unitMeasure}
          onChange={handleInputChange}
          className='w-1/2 px-3 py-1 rounded-full'
          required
        />
        <TextField
          type="number"
          label='Stock'
          name='stock'
          value={product.stock}
          error={!!error.stock}
          helperText={error.stock}
          onChange={handleInputChange}
          className='w-1/2 px-3 py-1 rounded-full'
          required
        />
        <Select
          value={product.roleProduct}
          name='roleProduct'
          onChange={handleInputChange}
          className='w-1/2 px-3 py-1 rounded-full'
        >
          <MenuItem value="Almacen">Almacen</MenuItem>
          {/* Add more options if needed */}
        </Select>
        <TextField
          type="text"
          label='Código'
          name='code'
          value={product.code}
          error={!!error.code}
          helperText={error.code}
          onChange={handleInputChange}
          className='w-1/2 px-3 py-1 rounded-full'
          required
        />
        <button
          type="submit"
          className='bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600'
        >
          Guardar
        </button>
      </form>
      <Link to='/admin' className='text-lg font-semibold px-4 py-1 text-white bg-orange-500  rounded-xl'>
        Volver
      </Link>
    </div>
  );
}

export default ProductsForm;
