import axios from "axios"

const instance = axios.create({
    baseURL: import.meta.env.DEV ? "/api" : "/",
    timeout: 1000,
    headers: {
        "Content-Type": "application/json",
    },
})

export default instance