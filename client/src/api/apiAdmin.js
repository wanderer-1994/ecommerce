import axios from "axios";
import { domain } from "./config";

// auth 
const adminAuthenticate = (authInfo) => {
    // authInfo: {admin_cookie, admin_tel, admin_pas}
    return new Promise(async (resolve, reject) => {
        try{
            let response = await axios.post(`${domain}/api/admin/auth`, authInfo)
            let admin = (response.data && response.data.admin) ? response.data.admin : {};
            if(admin.admin_id) localStorage.setItem("admin_cookie", admin.admin_cookie);
            resolve(admin);
        }catch(err){
            reject(err);
        }
    })
}

const adminLogout = (admin_cookie) => {
    return new Promise(async (resolve, reject) => {
        try{
            let response = await axios.post(`${domain}/api/admin/unauth`, {admin_cookie: admin_cookie});
            let data = response.data;
            resolve(data);
        }catch(err){
            reject(err);
        }
    })
}

// products
const admin_getAllProducts = () => {
    return new Promise(async (resolve, reject) => {
        try{
            let response = await axios.get(`${domain}/api/product-admin`)
            let products = (response.data && response.data.products) ? response.data.products : [];
            resolve(products);
        }catch(err){
            reject(err);
        }
    })
}

const addProduct = (products) => {
    return new Promise(async (resolve, reject) => {
        try{
            let response = await axios.post(`${domain}/api/product`, {products: products});
            resolve(response.data);
        }catch(err){
            reject(err)
        }
    })
}

const updateProducts = (products) => {
    return new Promise(async (resolve, reject) => {
        try{
            let response = await axios.put(`${domain}/api/product`, {products: products});
            resolve(response.data);
        }catch(err){
            reject(err)
        }
    })
}

const deleteProduct = (product_id) => {
    return new Promise(async (resolve, reject) => {
        try{
            let response = await axios.delete(`${domain}/api/product?product_id=${product_id}`);
            resolve(response.data);
        }catch(err){
            reject(err)
        }
    })
}

const initProduct = (product_ids) => {
    return new Promise(async (resolve, reject) => {
        try{
            let response = await axios({
                method: 'put',
                url: `${domain}/api/product-initprod`,
                timeout: 20*60*1000, // Let's say you want to wait at least 8 seconds
                data: {product_ids: product_ids}
            })
            // let response = await axios.put(`${domain}/api/product-initprod`, {product_ids: product_ids});
            resolve(response.data);
            console.log(response)
        }catch(err){
            reject(err)
        }
    })
}

const updateSupInfo = (product_ids) => {
    return new Promise(async (resolve, reject) => {
        try{
            let response = await axios({
                method: 'put',
                url: `${domain}/api/product-supinfo`,
                timeout: 20*60*1000, // Let's say you want to wait at least 8 seconds
                data: {product_ids: product_ids}
            })
            // let response = await axios.put(`${domain}/api/product-supinfo`, {product_ids: product_ids});
            resolve(response.data);
        }catch(err){
            reject(err)
        }
    })
}

// orders
const adminLoadOrders = (options) => {
    return new Promise(async (resolve, reject) => {
        try{
            let { since, upto, searchText, searchStatus } = options;
            if(!since || typeof(since) != "number") since = 0;
            since = since.toString();   // since và upto lưu ở dạng varchar(13) vì dạng int(13) không lưu được
            if(!upto || typeof(upto) != "number") upto = 9999999999999;
            upto = upto.toString();
            if(!searchText) searchText = "";
            if(!searchStatus) searchStatus = "";
            let response = await axios.get(`${domain}/api/order-admin?since=${since}&upto=${upto}&searchText=${searchText}&searchStatus=${searchStatus}`);
            resolve(response.data);
        }catch(err){
            console.log(err);
            reject(err)
        }
    })
}

const updateOrders = orders => {
    return new Promise(async (resolve, reject) => {
        try{
            let response = await axios.put(`${domain}/api/order`, {orders: orders});
            resolve(response.data);
        }catch(err){
            console.log(err);
            reject(err)
        }
    })
}

export {
    adminAuthenticate,
    adminLogout,
    admin_getAllProducts,
    addProduct,
    deleteProduct,
    updateProducts,
    initProduct,
    updateSupInfo,
    adminLoadOrders,
    updateOrders
}