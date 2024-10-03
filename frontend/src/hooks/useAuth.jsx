
import { useState, useEffect } from "react";
import { userConfirmation, userLogout } from "../utilities";

export function useProvideAuth() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const confirmUser = async () => {
            const result = await userConfirmation();
            if (result) {
                setUser(result);
            }
        };

        confirmUser();
    }, []);

    const login = (userData) => {
        setUser(userData);
    };

    const logout = async () => {
        const loggedOut = await userLogout();
        if (loggedOut) {
            setUser(null);
        }
    };

    return {
        user,
        login,
        logout
    };
}
