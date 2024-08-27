import React, { useState, useEffect } from 'react';
import Inputs from '../ui/Inputs';
import { createProductAlmacen, updateProductAlmacen, getProductId } from '../axios/products.axios';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

function ProductsForm() {
  const [product, setProduct] = useState({
    name: '',
    description: '',
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
          description: '',
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

    // Validación básica
    if (!product.name || !product.price || !product.roleProduct) {
      setError('Por favor, completa todos los campos obligatorios.');
      return;
    }

    setError(null); // Limpiar errores anteriores
    setSuccess(null); // Limpiar mensajes de éxito anteriores
    handleCreateOrUpdateProduct(); // Llamar la función para crear o actualizar
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
      <Link to='/admin' className='text-lg font-semibold px-4 py-1 text-white bg-orange-500  rounded-xl'>Volver</Link>
    </div>
  );
}

export default ProductsForm;
