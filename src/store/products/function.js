import axios from "axios";
import {syncAllProducts} from "./index";
import {baseUrl} from "../../utils/fetch";

export const getAllProduct = (num)=>{
    const data = JSON.stringify({
        "limit": num
    });

    const config = {
        method: 'post',
        url: baseUrl + 'api/products/get-all-product',
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    };

    axios(config)
        .then(function (response) {

            console.log("a",JSON.stringify(response.data.data[0]))
            syncAllProducts(response.data.data);
            return response.data.data
        })
        .catch(function (error) {
            console.log("lỗi",error);
        });
}
export const getProductDetail =async (id)=>{
    const data = JSON.stringify({
        "productId": id
    });

    const config = {
        method: 'post',
        url: baseUrl+'api/products/get-product-detail',
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    };

    const res = await axios(config)
        .then(function (response) {
            console.log(JSON.stringify(response.data));
            return {
                code : 1,
                data : response.data.data
            }
        })
        .catch(function (error) {
            return {
                code : 0,
                data : error.response.data.data
            }
        });
    return res
}
export const searchProduct =async (query)=>{
    const data = JSON.stringify({
        "search": query,
        "limit": 100
    });

    const config = {
        method: 'post',
        url: 'http://localhost:3000/api/products/search',
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    };
    const res = await axios(config)
        .then(function (response) {
            console.log(JSON.stringify(response.data));
            return {
                code : 1,
                data : response.data.data
            }
        })
        .catch(function (error) {
            return {
                code : 0,
                data : error.response.data.data
            }
        });
    return res
}


