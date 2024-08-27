import React, { useState } from 'react';
import Inputs from '../ui/Inputs';
import { createProductAlmacen } from '../axios/products.axios';

function ProductsForm({
  productId,
  name: existingName = '',
  description: existingDescription = '',
  code: existingCode = '',
  price: existingPrice = '',
  roleProduct: existingRoleProduct = '',
  unitMeasure: existingUnitMeasure = '',
  stock: existingStock = '',
}) {
  const [product, setProduct] = useState({
    name: existingName,
    description: existingDescription,
    code: existingCode,
    price: existingPrice,
    roleProduct: existingRoleProduct,
    unitMeasure: existingUnitMeasure,
    stock: existingStock,
  });
  const [error, setError] = useState(null); // State to handle errors
  const [success, setSuccess] = useState(null); // State to handle success messages

  const handleCreateProduct = async () => {
    try {
      await createProductAlmacen(product);
      setSuccess('Producto cargado con éxito');
      if(productId){
        setProduct({
          name: existingName,
          description: existingDescription,
          code: existingCode,
          price: existingPrice,
          roleProduct: existingRoleProduct,
          unitMeasure: existingUnitMeasure,
          stock: existingStock,
        })
      }
      setProduct({
        name: '',
        description: '',
        code: '',
        price: '',
        roleProduct: '',
        unitMeasure: '',
        stock: '',
      }); // Reset form fields
    } catch (err) {
      setError('Failed to create product. Please try again.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct(prevProduct => ({ ...prevProduct, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!product.name || !product.price || !product.roleProduct) {
      setError('Please fill in all required fields.');
      return;
    }

    setError(null); // Clear previous errors
    setSuccess(null); // Clear previous success messages
    handleCreateProduct();
  };

  return (
    <div className='max-w-[500px] m-auto'>
      <h1 className='text-2xl text-center font-serif'>Cargar Producto</h1>
      {error && <p className='text-red-500 text-center'>{error}</p>}
      {success && <p className='text-green-500 text-center'>{success}</p>}
      <form
        className='flex flex-col flex-1 justify-center items-center gap-4'
        onSubmit={handleSubmit}
      >
        <Inputs
          type="text"
          placeholder='Nombre'
          name='name'
          value={product.name}
          onChange={handleInputChange}
          className='border px-4 py-1 rounded-lg'
          required
        />
        <Inputs
          type="text"
          placeholder='Descripción'
          name='description'
          value={product.description}
          onChange={handleInputChange}
          className='border px-4 py-1 rounded-lg'
        />
        <Inputs
          type="text"
          placeholder='Código'
          name='code'
          value={product.code}
          onChange={handleInputChange}
          className='border px-4 py-1 rounded-lg'
        />
        <Inputs
          type="number"
          placeholder='Precio'
          name='price'
          value={product.price}
          onChange={handleInputChange}
          className='border px-4 py-1 rounded-lg'
          required
        />
        <select
          name="roleProduct"
          value={product.roleProduct}
          onChange={handleInputChange}
          className='border px-4 py-1 rounded-lg'
          required
        >
          <option value="">Categoría</option>
          <option value="Almacen">Almacen</option>
          <option value="Verduleria">Verduleria</option>
          <option value="Carniceria">Carniceria</option>
        </select>
        <Inputs
          type="text"
          placeholder='Unidad de Medida'
          name='unitMeasure'
          value={product.unitMeasure}
          onChange={handleInputChange}
          className='border px-4 py-1 rounded-lg'
        />
        <Inputs
          type="number"
          placeholder='Stock'
          name='stock'
          value={product.stock}
          onChange={handleInputChange}
          className='border px-4 py-1 rounded-lg'
        />
        <button
          type="submit"
          className='bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600'
        >
          Guardar
        </button>
      </form>
    </div>
  );
}

export default ProductsForm;
