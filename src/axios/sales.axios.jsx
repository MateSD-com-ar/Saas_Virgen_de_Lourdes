import axios from "axios"
import { url } from "../utils/utils"


export const getAllSales = async()=>{
    try {
        const response = await axios.get(`${url}api/sales`,{
            headers:{
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        return response.data
    } catch (error) {
        console.log(error)
    }
}


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
        const response = await axios.get(`${url}api/sales?paymentDate=${date}`,{
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
        const response = await axios.put(`${url}api/sales?id=${id}`,data,{
            headers:{
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        return response.data
    } catch (error) {
        console.log(error)
    }
}

