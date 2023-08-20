const API_URL = import.meta.env.VITE_API_URL;
import axios from 'axios';

export const login = async (username: string, password: string) => {
    try {
        const response = await axios.post(`${API_URL}/auth`, {
            username,
            password,
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });


        const data = await response.data;
        if (response.status !== 200) throw new Error(data);
        return data;
    } catch (error) {
        return error;
    }
}

export const register = async (username: string, password: string) => {
    try {
        const response = await axios.post(`${API_URL}/register`, {
            username,
            password,
        });

        const data = await response.data;
        if (response.status !== 200) throw new Error(data);
        return data;
    } catch (error) {
        return error;
    }
}
