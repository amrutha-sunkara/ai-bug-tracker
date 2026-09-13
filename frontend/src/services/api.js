import axios from "axios";


const api = axios.create({

    baseURL: "https://ai-bug-tracker-t9ik.onrender.com",

});


// Attach JWT token automatically

api.interceptors.request.use(

    (config) => {

        const token = localStorage.getItem("token");

        if (token) {

            config.headers.Authorization = 
            `Bearer ${token}`;

        }

        return config;

    },

    (error) => {

        return Promise.reject(error);

    }

);


// Handle expired token automatically

api.interceptors.response.use(

    (response) => {

        return response;

    },

    (error) => {

        if (error.response) {

            const status = error.response.status;

            if (status === 401) {

                console.log(
                    "Session expired. Please login again."
                );

                localStorage.clear();

                window.location.href = "/login";

            }

        }

        return Promise.reject(error);

    }

);


export default api;