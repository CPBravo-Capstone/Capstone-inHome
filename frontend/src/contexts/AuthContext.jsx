import { createContext, useContext, useState, useEffect } from 'react';
import { api, userConfirmation } from "../utilities";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const initializeAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                api.defaults.headers.common["Authorization"] = `Token ${token}`;
                try {
                    const response = await api.get('user/');
                    if (response.data) {
                        setUser({
                            ...response.data,
                            token
                        });
                    }
                } catch (error) {
                    console.error('Error fetching user details:', error);
                    localStorage.removeItem('token');
                    api.defaults.headers.common["Authorization"] = null;
                }
            }
        };

        initializeAuth();
    }, []);

    const login = (data) => {
        localStorage.setItem('token', data.token);
        api.defaults.headers.common["Authorization"] = `Token ${data.token}`;
        setUser(data);
        // console.log("data", data)
        
    };

    const logout = async () => {
        const token = localStorage.getItem('token');
        if (token){     
            try {
                api.defaults.headers.common["Authorization"] = `Token ${token}`;
                const response = await api.post('user/logout/');
                console.log('Logged out successfully', response);
            } catch (error) {
                console.error('Logout failed:', error.response || error);
            }
        }
        localStorage.removeItem('token');
        delete api.defaults.headers.common["Authorization"];
        setUser(null);
}
    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    return useContext(AuthContext);
}
