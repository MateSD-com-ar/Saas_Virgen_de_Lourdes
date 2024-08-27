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