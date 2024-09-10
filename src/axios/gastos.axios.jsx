import axios from 'axios'
import { url } from '../utils/utils'

export const getGastos = async () => {
    try {
      const response = await axios.get(`${url}expenditure/get`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return { message: "No se encontraron ventas", data: [] };
      } else {
        throw error;
      }
    }
  }

export const createGastos = async(data)=>{
    try {
        const response=await axios.post(`${url}expenditure/create`,data,{
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          });
        return response.data
    }catch(error){
        throw error
    }

}

export const deleteGastos = async(id)=>{
    try {
        const response=await axios.delete(`${url}expenditure/delete/${id}`,{
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          });
        return response.data
    }catch(error){
        throw error
    }

}


export const editGastos = async(id,data)=>{
    try {
        const response=await axios.put(`${url}expenditure/edit/${id}`,data,{
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          });
        return response.data
    }catch(error){
        throw error
    }

}