import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = BACKEND_URL;

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {

    const [token, setToken] = useState(localStorage.getItem("token"));
    const [authUser, setAuthUser] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [socket, setSocket] = useState(null);

    const checkAuth =  async () => {
        try {
            const { data } = await axios.get('/api/users/check');
            if(data.success){
                setAuthUser(data.userData);
                connectSocket(data.userData);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    // Login function to handle user authentication and set token

    const login = async (state,credentials)=> {
        try {
            const { data } = await axios.post(`/api/users/${state}`, credentials);

            if(data.success){
                setAuthUser(data.userData);
                connectSocket(data.userData);
                axios.defaults.headers.common["token"] = data.token;
                setToken(data.token);
                localStorage.setItem("token", data.token);
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    // Logout function to handle user logout and socket disconnection

    const logout = () => {
         localStorage.removeItem("token");
         setToken(null);
         setAuthUser(null);
         setOnlineUsers([]);
         axios.defaults.headers.common["token"] = null;
         toast.success("Logged out successfully");
         socket.disconnect();
    }

    //Update profile function to handle user profile updates

    const updateProfile = async (body) => {
        try {
            const { data } = await axios.put('/api/users/update-profile', body);

            if(data.success){
                setAuthUser(data.user);
                toast.success(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    // to handle socket connection and online Users updates
    const connectSocket = (userData) => {
        if(!userData || socket?.connected) return;
        const newSocket = io(BACKEND_URL, {
            query: {
                userId : userData._id,
            }
        });
        newSocket.connect();
        setSocket(newSocket);

        newSocket.on('onlineUsers', (userIds) => {
            setOnlineUsers(userIds);
        });
    }

    useEffect(()=>{
        if(token){
            axios.defaults.headers.common["token"] = token;
        }
        checkAuth();
    },[])

    const value = {
        axios,
        authUser,
        onlineUsers,
        socket,
        login,
        logout,
        updateProfile,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuthContext = () => {
    return useContext(AuthContext);
}