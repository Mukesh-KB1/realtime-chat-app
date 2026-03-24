import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "./AuthContext";


export const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {

    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [unseenMessages, setUnseenMessages] = useState({});

    const { socket, axios } = useAuthContext();

    // Function to get all users for the sidebar
    const getAllUsers = async () => {
        try {
            const { data } = await axios.get('/api/messages/users');
            if (data.success) {
                setUsers(data.users);
                setUnseenMessages(data.unseenMessages);
            }

        } catch (error) {
            toast.error(error.messages);
        }
    }

    // Function to get messages for selected user
    const getMessages = async (userId) => {
        try {
            const { data } = await axios.get(`/api/messages/${userId}`);
            if(data.success) {
                setMessages(data.messages);
            }
        } catch (error) {
            toast.error(error.messages);
        }
    }

    // Function to send message to selected user
    const sendMessage = async (messageData) => {
        try {
            const { data } = await axios.post(`/api/messages/send/${selectedUser._id}`, messageData);
            if(data.success) {
                setMessages(prev => [...prev, data.newMessage]);
            }
            else{
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.messages);
        }
    }

    // function to subscribe to messages for selected user
    const subscribeToMessages = () => {
        if(!socket) return;

        socket.on('newMessage', (newMessage) => {
            if(selectedUser && newMessage.senderId === selectedUser._id) {
                newMessage.seen = true;
                setMessages(prev => [...prev, newMessage]);
                axios.put(`/api/messages/mark/${newMessage._id}`);
            } else {
                setUnseenMessages( prev => ({
                    ...prev,
                    [newMessage.senderId] : prev[newMessage.senderId] ? prev[newMessage.senderId] + 1 : 1
                }))
            }
        });
    }

    // function to unsubscribe from messages
    const unsubscribeFromMessages = () => {
        if(socket) socket.off('newMessage');
    }

    useEffect(()=> {
        subscribeToMessages();
        return () => unsubscribeFromMessages();
    },[socket, selectedUser])


    const value = {
        messages, users, selectedUser, unseenMessages, getAllUsers, setMessages, getMessages, sendMessage, setSelectedUser, setUnseenMessages
    }

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )
}

export const useChatContext = () => {
    return useContext(ChatContext);
}