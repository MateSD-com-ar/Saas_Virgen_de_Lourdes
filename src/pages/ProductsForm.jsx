import React, { useState, useEffect } from 'react';
import Inputs from '../ui/Inputs';
import { createProductAlmacen, updateProductAlmacen, getProductId } from '../axios/products.axios';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

function ProductsForm() {
  const [product, setProduct] = useState({
    name: '',
    brand: '',
    code: '',
    price: '',
    roleProduct: '',
    unitMeasure: '',
    stock: '',
  });
  const {id}= useParams()

  const [error, setError] = useState(null); // State to handle errors
  const [success, setSuccess] = useState(null); // State to handle success messages

  // Cargar los datos del producto si productId está definido
  useEffect(() => {
    const loadProductData = async () => {
      if (id) {
        try {
          const productData = await getProductId(id); 
          console.log(productData.data)// Aquí deberías obtener los datos del producto desde la API
          setProduct(productData.data); // Asegúrate de que la estructura del objeto coincide con el estado
        } catch (err) {
          setError('Error al cargar los datos del producto.');
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
          roleProduct: '',
          unitMeasure: '',
          stock: '',
        });
      }
    } catch (err) {
      setError('Error al guardar el producto. Por favor, inténtalo de nuevo.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct(prevProduct => ({ ...prevProduct, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!product.name || !product.price || !product.roleProduct) {
      setError('Por favor, completa todos los campos obligatorios.');
      return;
    }

    setError(null); 
    setSuccess(null); 
    handleCreateOrUpdateProduct(); 
  };

  return (
    <div className='max-w-[500px] m-auto'>
      <h1 className='text-2xl text-center font-serif'>
        {id ? 'Editar Producto' : 'Cargar Producto'}
      </h1>
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
          error={error}
          onChange={handleInputChange}
          className={`${error ? 'border-red-500 border-2 rounded-2xl px-3' : 'px-3 py-1 rounded-full'}`}
          required
        />
        <Inputs
          type="text"
          placeholder='Descripción'
          name='brand'
          error={error}
          value={product.brand}
          onChange={handleInputChange}
          className={`${error ? 'border-red-500 border-2 rounded-2xl px-3' : 'px-3 py-1 rounded-full'}`}
        />
        <Inputs
          type="text"
          placeholder='Código'
          name='code'
          error={error}
          value={product.code}
          onChange={handleInputChange}
          className={`${error ? 'border-red-500 border-2 rounded-2xl px-3' : 'px-3 py-1 rounded-full'}`}
        />
        <Inputs
          type="number"
          placeholder='Precio'
          name='price'
          error={error}
          value={product.price}
          onChange={handleInputChange}
          className={`${error ? 'border-red-500 border-2 rounded-2xl px-3' : 'px-3 py-1 rounded-full'}`}
          required
        />
        <select
          name="roleProduct"
          value={product.roleProduct}
          onChange={handleInputChange}
          className={`${error ? 'border-red-500 border-2 rounded-2xl px-3' : 'px-3 py-1 rounded-full'}`}
          required
          error={error}
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
          error={error}
          value={product.unitMeasure}
          onChange={handleInputChange}
          className={`${error ? 'border-red-500 border-2 rounded-2xl px-3' : 'px-3 py-1 rounded-full'}`}
        />
        <Inputs
          type="number"
          placeholder='Stock'
          name='stock'
          error={error}
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
      <Link to='/admin' className='text-lg font-semibold px-4 py-1 text-white bg-orange-500  rounded-xl'>Volver</Link>
    </div>
  );
}

export default ProductsForm;
