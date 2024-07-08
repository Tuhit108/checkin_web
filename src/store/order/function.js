import axios from "axios";
import {baseUrl} from "../../utils/fetch";

;
export const createOrder = async(param) =>{
    console.log("pảam",param)
    const data = JSON.stringify({
        "fullName": param.name ,
        "address": param.address ,
        "phoneNumber": param.phoneNumber ,
        "productList": [
            param.productId
        ],
        "totalPrice": param.price ,
        "paymentMethod": param.paymentMethod,
        "deliveryUnit": param.deliveryMethod,
        "status": param.status ,
        "buyerId": param.buyerId ,
        "shopId": param.shopId
    });
    console.log("data",data)

    const config = {
        method: 'post',
        url: baseUrl+'api/order/create',
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    };

   const res = await axios(config)
    .then(function (response) {
        console.log("aaa",response.data)
        return {
            code : 1,
            data : response.data
        }
    })
        .catch(function (error) {
            console.log("lỗi",config);
            return{
                code : 0,
                data : error.response.data
            }
        });
   return res
}


