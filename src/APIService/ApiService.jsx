import axios from 'axios'
import { useState } from "react";

export default class ApiService {

    static BASE_URL = "http://localhost:9090";

    static getHeader(){
        const token = localStorage.getItem('token');
        return {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        };
    }


    static async loginUser(loginDetails){
        const response = await axios.post(`${this.BASE_URL}/auth/v1/login`,loginDetails);
        console.log("Login Response: ",response);
        return response.data;
    }

    static async logoutUser(){
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('userId');
        localStorage.removeItem('sessionId');

        console.log('Logged Out Successfully...');
    }

    static isAuthenticated(){
        const response = localStorage.getItem('token');
        return !!response;
    }

    static async makePayment(paymentRequest){
        localStorage.removeItem('sessionId');
        const response = await axios.post(`${this.BASE_URL}/gold/v1/makepayment` , paymentRequest,{ headers : this.getHeader() })
        console.log("Response from Make Payment : ", response);
        localStorage.setItem('sessionId',response.data.sessionId)
        return response.data;
    }

    static async getAllTransactions(){
        const response = await axios.get(`${this.BASE_URL}/gold/v1/getAllTransactions`, {headers : this.getHeader()})
        console.log("Get All Transactions : ", response)
        return response.data;
    }
  
}
