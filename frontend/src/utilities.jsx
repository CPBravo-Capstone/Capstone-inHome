import axios from "axios";

// Since NGINX is handling the API routing, use a relative URL
const endpoint = "/api/v1/";  // Use a relative path instead of a full URL
console.log("current endpoint: ", endpoint); 

export const api = axios.create({
    baseURL: endpoint,  // This now points to the NGINX proxy
});

console.log("api base created: ", api);

api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Token ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

export const userLogin = async(email, password) => {
    const response = await api.post("users/login/", { email, password});

    if (response.status === 200) {
        const { user, token } = response.data;
        localStorage.setItem("token", token);
        api.defaults.headers.common["Authorization"] = `Token ${token}`;
        return { user, email }
    } else {
        console.log('login error', response)
    }
}

export const userLogout = async() => { 
    const response = await api.post("users/logout/")
    if (response.status === 204) {
        delete api.defaults.headers.common["Authorization"]
        localStorage.removeItem("token")
        console.log('user logged out');
        return true;
    } else {
        console.log('error logging user out ', response)
        return false;
    }
}

export const userConfirmation = async() => {
    const token = localStorage.getItem("token");
    if(token) {
        api.defaults.headers.common["Authorization"] = `Token ${token}`
        const response = await api.get("user/")
        if (response.status === 200) {
            console.log(response.data)
            return { user: response.data.user, email: response.data.email }
        } else {
            console.log('error userConfirmation', response)
            return null
        }
    } else {
        console.log('userConfirmation no token in localStorage');
        return null
    }
}
