import { useEffect } from 'react'
import { useState } from 'react'
import React from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { addToCart } from '../redux/slices/cartSlice'


const Products = () => {

  const [products, setProducts] = useState([])
  const dispatch = useDispatch()
  useEffect(() => {
    axios.get('https://fakestoreapi.com/products')
      .then(res => setProducts(res.data))
      .catch(err => console.log(err))
  }, [])

  const handleAddToCart = () => {
    dispatch(addToCart(products));
};
  console.log(products)
  return (
    <div className='grid grid-cols-4 gap-2 p-5'>
      {
        products.map(product => (
          <div key={product.id} className='p-3 border-2 border-solid border-black rounded-2xl flex flex-col items-center gap-4'>
            <h2 className='text-lg'>{product.title}</h2>
            <img src={product.image} alt={product.title} className='w-32 h-32' />
            <p>{product.price}</p>
            <p>{product.category}</p>
            <button className='bg-blue-500 text-white p-2 rounded-lg' onClick={handleAddToCart}>Add to Cart</button>
          </div>
        ))
      }
     
    </div>
  )
}

export default Products
