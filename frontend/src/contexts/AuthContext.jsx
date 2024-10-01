/* eslint-disable react/prop-types */
import { createContext, useState, useEffect } from 'react';
import { api } from '../utilities';
import { toast } from 'react-hot-toast';


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Confirm user on initial load if a token exists
        const initializeAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                api.defaults.headers.common['Authorization'] = `Token ${token}`;
                try {
                    const response = await api.get('user/');
                    if (response.data) {
                        setUser({
                            ...response.data,
                            token,
                        });
                    }
                } catch (error) {
                    console.error('Error fetching user details:', error);
                    logout(); // Clear invalid token and user state
                }
            }
            setLoading(false);
        };
        initializeAuth();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.post('users/login/', { email, password });
            if (response.status === 200) {
                const { user, token } = response.data;
                localStorage.setItem('token', token);
                api.defaults.headers.common['Authorization'] = `Token ${token}`;
                setUser(user);
                toast.success('Login successful');
            }
        } catch (error) {
            console.error('Login failed:', error);
            toast.error('Failed to login. Please check your credentials.');
        }
    };

    const logout = async () => {
        try {
            await api.post('users/logout/');
        } catch (error) {
            console.error('Error logging out:', error);
        }
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
        toast.success('Logged out successfully');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};