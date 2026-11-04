import axios from 'axios'
import { useState } from "react";


// Global interceptor - runs for every axios call across the app
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if(error.response && error.response.status == 401){
            console.log(" Token Expired..  Removing all local storage values...")
            localStorage.removeItem("token")
            localStorage.removeItem("role")
            localStorage.removeItem("userId")
            localStorage.removeItem("sessionId")

            window.location.href= "/login";
            console.log("Navigated.........")
        }

        return Promise.reject(error);
    }
);

export default class ApiService {

    static BASE_URL = "http://localhost:30000";

    static getHeader(){
        const token = localStorage.getItem('token');
        return {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        };
    }

    static async registerUser(registerData){
        const response = await axios.post(`${this.BASE_URL}/auth/v1/register`,registerData);
        console.log("Register Response: ", response);
        return response.data;
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

    static async getAllTransactions(pageNumber,recordSize){
        const response = await axios.get(`${this.BASE_URL}/gold/v1/getAllTransactions`, 
            {headers : this.getHeader(),
             params :{
                        pageNo: pageNumber,
                        size: recordSize
                        }
            })
        console.log("Get All Transactions : ", response)
        return response.data;
    }

    static async getDashData(){
        const dashData = await axios.get(`${this.BASE_URL}/gold/v1/getDashData`, {headers : this.getHeader()})
        console.log("Dash Data : ",dashData.data)
        return dashData.data;
    }
  
}
