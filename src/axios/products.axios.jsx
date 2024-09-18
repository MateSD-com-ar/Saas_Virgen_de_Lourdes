import axios from 'axios';
import { url } from '../utils/utils';

export const getProductsAlmacen = async () => {
    try {
        const response = await axios.get(`${url}products/get/almacen`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
        
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}
export const getAllProducts = async () => {
    try {
        const response = await axios.get(`${url}products/get`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        // Ensure response contains expected data structure
        if (response && response.data) {
            return response.data; // Assuming response.data contains the list of products
        } else {
            throw new Error('Unexpected response structure');
        }
    } catch (error) {
        console.error('Error fetching products:', error);
        // Optionally, you can return null or an empty array if you prefer
        return []; // Return an empty array to ensure the component handles it gracefully
    }
}

export const createProductAlmacen = async (product) => {
    try {
        const response = await axios.post(`${url}products/create`, product, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error creating product:', error);
    }
}

export const updateProductAlmacen = async (productId, product) => {
    try {
        const response = await axios.put(`${url}products/edit/${productId}`, product, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating product:', error);
    }
}

export const deleteProductAlmacen = async (productId) => {
    try {
        const response = await axios.delete(`${url}products/delete/${productId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting product:', error);
    }
}   

export const getProductId = async (id) => {
    try {
        const response = await axios.get(`${url}products/get/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response;
    } catch (error) {
        console.error('Error fetching product:', error);
    }
}



// {
//   "name":"lechuga",
//   "description":"1 kg",
//   "code": "75",
//   "price": 1000,
//   "roleProduct": "Almacen",
//   "unitMeasure": "1kg",
//   "stock": 10
// }