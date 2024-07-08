
import {baseUrl} from "../../utils/fetch";
import axios from "axios";
import {setUserAction} from "./index";

export const requestLogin = async (params) => {
    const data = JSON.stringify({
        "account": params.account,
        "password": params.password
    });

    const config = {
        method: 'post',
        url: baseUrl+'api/accounts/login',
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    };

  const res = await axios(config)
        .then(function (response) {
            console.log("aaa",response.data)
            localStorage.setItem("user", JSON.stringify(response.data.data));
                return {
                    code : 1,
                    data :response.data.data
                };

        })
        .catch(function (error) {
            console.log(error.response.data.message);
            return  {
                code : 0,
                data :error.response.data.message
            };
        });
  // if (res.code === 1) {
  //     console.log("user",res.data)
  //
  //   setUserAction({
  //       id: res.data.id,
  //       email : res.data.email,
  //       phone : res.data.phone
  //     }
  //   );
  // }

  return res;
};
export const requestRegister = async (params) => {
    const data = JSON.stringify({
        "email": params.email,
        "password": params.password,
        "fullName": params.fullName,
        "address": "Viet Nam",
        "phoneNumber": params.phone,
        "dayOfBirth": ""
    });

    const config = {
        method: 'post',
        url: 'http://localhost:3000/api/accounts/signup',
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    };

    const res = await axios(config)
        .then(function (response) {
            return {
                code : 1,
                data :response.data.data
            };

        })
        .catch(function (error) {
            return  {
                code : 0,
                data :error.response.data.message
            };
        });
    // if (res.code === 1) {
    //     console.log("user",res.data)
    //
    //   setUserAction({
    //       id: res.data.id,
    //       email : res.data.email,
    //       phone : res.data.phone
    //     }
    //   );
    // }

    return res;
};


