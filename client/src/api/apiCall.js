import axios from "axios";
import { getMenuInOrder } from "../utils/functions";
import { domain } from "./config";

function getCategories(){
    return new Promise( async (resolve, reject) => {
        try{
            let response = await axios.get(`${domain}/api/category`);
            resolve(response.data.categories);
        }catch(err){
            reject(err);
        }
    })
}

function getProducts(url){
    return new Promise(async (resolve, reject) => {
        try{
            let response = await axios.get(`${domain}${url}`);
            resolve(response.data);
        }catch(err){
            reject(err);
        }
    })
}

async function getSidebarLinks(){
    return new Promise(async (resolve, reject) => {
        try{
            let links = [];
            let categories = await getCategories();
            categories.forEach(item => {
                for(let i in item){
                    item[i] = unescape(item[i]);
                }
            })
            getMenuInOrder(links, categories);
            resolve(links);
        }catch(err){
    
        }
    })
}

async function getOrders(user_tel){
    return new Promise(async (resolve, reject) => {
        try{
            let response = await axios.get(`${domain}/api/order-user?user_tel=${user_tel}`);
            resolve(response.data.orders);
        }catch(err){
            reject(err);
        }
    })
}

const submitOrder = (user, products) => {
    return new Promise(async (resolve, reject) => {
        try{
            let response = await axios.post(`${domain}/api/order`, {
                user: user,
                products: products
            })
            resolve(response.data);
        }catch(err){
            reject(err);
        }
    })
}

const user_triggerWarranty = (order_record_id) => {
    return new Promise(async (resolve, reject) => {
        try{
            let response = await axios.put(`${domain}/api/order-userwarranty`, {record_id: order_record_id});
            resolve(response.data);
        }catch(err){
            reject(err);
        }
    })
}

const validateCart = (prod_ids) => {
    return new Promise(async (resolve, reject) => {
        try{
            let response = await axios.post(`${domain}/api/cart-validate`, {prod_ids: prod_ids});
            resolve(response.data.products);
        }catch(err){
            reject(err);
        }
    })
}

const accessAnnounce = (machine_key, last_access) => {
    return new Promise(async (resolve, reject) => {
        try{
            let response = await axios.post(`${domain}/api/access-announce`, {
                machine_key: machine_key,
                last_access: last_access
            });
            resolve(response.data.isSuccess);
        }catch(err){
            reject(err);
        }
    })
}

export {
    getSidebarLinks,
    getCategories,
    getProducts,
    getOrders,
    submitOrder,
    user_triggerWarranty,
    validateCart,
    accessAnnounce
}