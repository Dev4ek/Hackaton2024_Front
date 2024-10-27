import React, { useEffect, useState } from "react";
import axios from "axios";
import TaskProfile from "../main/taskContent/profile"; // Ensure this is the correct import path

interface ProfileProps {
    userId: string; // Assuming you want to fetch user info by user ID
    onClose: () => void; // Callback to close the modal
}

const Profile: React.FC<ProfileProps> = ({ userId, onClose }) => {
    const [userInfo, setUserInfo] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false); // State to track editing mode
    const [editData, setEditData] = useState<any>(null); // State for edited data

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await axios.get(`http://31.128.36.91:8082/user/me`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem("token")}`,
                    },
                    withCredentials: true,
                });
                setUserInfo(response.data); // Set fetched user info
                setEditData(response.data); // Initialize editData with fetched user info
            } catch (err) {
                setError('Ошибка при загрузке информации о пользователе. Попробуйте позже.');
                console.error('Ошибка при загрузке пользователя:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserInfo();
    }, [userId]);

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditData({ ...editData, [name]: value }); // Update editData with user input
    };

    const handleSave = async () => {
        try {
            const response = await axios.put(`http://31.128.36.91:8082/user/me`, editData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`,
                },
                withCredentials: true,
            });
            setUserInfo(response.data); // Update userInfo with saved data
            setIsEditing(false); // Exit editing mode
        } catch (err) {
            setError('Ошибка при сохранении информации. Попробуйте позже.');
            console.error('Ошибка при сохранении информации:', err);
        }
    };

    if (loading) return <div>Загрузка информации о пользователе...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="taskWin">
            <div className="taskWin__overlay" onClick={onClose}></div>
            <div className="taskWin__content">
                <div className="taskWin__close" onClick={onClose}></div>
                {isEditing ? (
                    <div>
                        <h3>Редактировать профиль</h3>
                        <input 
                            type="text" 
                            name="full_name" 
                            value={editData.full_name} 
                            onChange={handleChange} 
                            placeholder="Полное имя" 
                        />
                        <input 
                            type="email" 
                            name="email" 
                            value={editData.email} 
                            onChange={handleChange} 
                            placeholder="Email" 
                        />
                        {/* Add more fields as needed */}
                        <button onClick={handleSave}>Сохранить</button>
                        <button onClick={handleEditToggle}>Отмена</button>
                    </div>
                ) : (
                    <div>
                        <TaskProfile user={userInfo} /> {/* Pass the user info to the TaskProfile component */}
                        <button onClick={handleEditToggle}>Редактировать профиль</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
