import axios from "axios"
import { url } from "../utils/utils"


export const getAllSales = async () => {
    try {
      const response = await axios.get(`${url}api/sales`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return { message: "No se encontraron ventas", data: [] };
      } else {
        throw error;
      }
    }
  };


export const createSale = async(data)=>{
    try {
        const response = await axios.post(`${url}api/sales`,data,{
            headers:{
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        return response.data
    } catch (error) {
        console.log(error)
    }
}

export const createSaleDetails = async(data)=>{
    try {
        const response = await axios.post(`${url}details/create`,data,{
            headers:{
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        return response.data
    } catch (error) {
        console.log(error)
    }
}


export const getSaleDetails = async(id)=>{
    try {
        const response = await axios.get(`${url}api/sales?id=${id}`,{
            headers:{
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        return response.data
    } catch (error) {
        console.log(error)
    }
}

export const getSaleCuit = async(cuil)=>{
    try {
        const response = await axios.get(`${url}api/sales?CUIL=${cuil}`,{
            headers:{
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        return response.data
    } catch (error) {
        console.log(error)
    }
}

export const getSaleClient = async(name)=>{
    try {
        const response = await axios.get(`${url}api/sales?client=${name}`,{
            headers:{
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        return response.data
    } catch (error) {
        console.log(error)
    }
}

export const getSaleDate = async(date)=>{
    try {
        const response = await axios.get(`${url}sales?createdAt=${date}`,{
            headers:{
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        return response.data
    } catch (error) {
        console.log(error)
    }
}

export const getSalePayment = async(payment)=>{
    try {
        const response = await axios.get(`${url}api/sales?paymentMethod=${payment}`,{
            headers:{
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        return response.data
    } catch (error) {
        console.log(error)
    }
}


export const updateSale = async(id, data )=>{
    try {
        const response = await axios.put(`${url}api/sales/${id}`,data,{
            headers:{
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        return response.data
    } catch (error) {
        console.log(error)
    }
}

export const deleteSale = async(id)=>{
    try {
        const response = await axios.delete(`${url}api/sales/${id}`,{
            headers:{
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        return response.data
    } catch (error) {
        console.log(error)
    }
}


export const updateDetailsSale = async(id, data)=>{
    try {
        const response = await axios.put(`${url}details/update/${id}`,data,{
            headers:{
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        return response.data
    } catch (error) {
        console.log(error)
    }
}

export const deleteDetailsSale = async(id)=>{
    try {
        const response = await axios.delete(`${url}details/delete/${id}`,{
            headers:{
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        return response.data
    } catch (error) {
        console.log(error)
    }
}