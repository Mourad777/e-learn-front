import axios from 'axios';

const axiosGraphql = (query,token)=>{
    return axios({
        url:`${process.env.REACT_APP_SERVER_URL}graphql`,
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        data: JSON.stringify(query),
        validateStatus:false,
    })
}

export default axiosGraphql;