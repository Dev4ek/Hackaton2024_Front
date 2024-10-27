import React, { useEffect, useState } from 'react';
import './chat.css';

interface Message {
    id: number;
    content: string;
}

const Chat: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [ws, setWs] = useState<WebSocket | null>(null);

    useEffect(() => {
        const socket = new WebSocket(`ws://31.128.36.91:8082/chat/ws?token=${localStorage.getItem('token')}`);

        socket.onmessage = (event) => {
        const message: Message = JSON.parse(event.data);
        setMessages((prevMessages) => [...prevMessages, message]);
        };

        socket.onopen = () => {
        console.log('WebSocket connected');
        };

        socket.onclose = () => {
        console.log('WebSocket disconnected');
        };

        setWs(socket);

        return () => {
        socket.close();
        };
    }, []);

    const sendMessage = () => {
        if (ws && newMessage) {
        ws.send(JSON.stringify({ content: newMessage }));
        setNewMessage('');
        }
    };

    return (
        <div className="chat-container">
        <div className="messages">
            {messages.map((msg) => (
            <div key={msg.id} className="message">{msg.content}</div>
            ))}
        </div>
        <div className="input-container">
            <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Введите сообщение..."
            />
            <button onClick={sendMessage}>Отправить</button>
        </div>
        </div>
    );
};

export default Chat;
