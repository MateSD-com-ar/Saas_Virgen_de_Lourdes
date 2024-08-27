import axios from 'axios';

export const getProductsAlmacen = async () => {
    try {
        const response = await axios.get('https://minimarket-virgen-lourdes-backend.onrender.com/products/get/almacen', {
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
        const response = await axios.get('https://minimarket-virgen-lourdes-backend.onrender.com/products/get', {
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
        const response = await axios.post('https://minimarket-virgen-lourdes-backend.onrender.com/products/create', product, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error creating product:', error);
    }
}

export const updateProductAlmacen = async (product, productId) => {
    try {
        const response = await axios.put(`https://minimarket-virgen-lourdes-backend.onrender.com/products/products/edit/${productId}`, product, {
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
        const response = await axios.delete(`https://minimarket-virgen-lourdes-backend.onrender.com/products/delete/${productId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting product:', error);
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