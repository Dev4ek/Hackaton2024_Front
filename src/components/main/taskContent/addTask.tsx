import React, { useEffect, useState } from 'react';
import './addTask.css';
import axios from 'axios';

interface AddTaskProps {
    onClose: () => void;
    projectId: string; // Добавляем projectId как пропс
}

const AddTask: React.FC<AddTaskProps> = ({ onClose, projectId }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [userId, setUserId] = useState<number | null>(null);
    const [users, setUsers] = useState<any[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://31.128.36.91:8082/user/list', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem("token")}`,
                    },
                    withCredentials: true,
                });
                setUsers(response.data);
            } catch (err) {
                setError('Ошибка при загрузке пользователей. Попробуйте позже.');
                console.error(err);
            } finally {
                setLoadingUsers(false);
            }
        };

        fetchUsers();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (userId === null) {
            console.error("Пользователь не выбран");
            return;
        }

        try {
            const response = await axios.post('http://31.128.36.91:8082/task', {
                title,
                description,
                user_id: userId, // Используем выбранный user_id
                project_uuid: projectId,
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`,
                },
                withCredentials: true,
            });

            console.log("Задача добавлена", response.data);
            onClose(); // Закрываем модальное окно после добавления задачи
        } catch (error) {
            console.error("Ошибка при добавлении задачи:", error);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Добавить задачу</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="taskName">Название задачи:</label>
                        <input 
                            type="text" 
                            id="taskName" 
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)} 
                            required 
                        />
                    </div>
                    <div>
                        <label htmlFor="taskDescription">Описание:</label>
                        <textarea 
                            id="taskDescription" 
                            value={description} 
                            onChange={(e) => setDescription(e.target.value)} 
                        ></textarea>
                    </div>
                    <div>
                        <label htmlFor="userSelect">Выберите пользователя:</label>
                        {loadingUsers ? (
                            <p>Загрузка пользователей...</p>
                        ) : error ? (
                            <p>{error}</p>
                        ) : (
                            <select 
                                id="userSelect" 
                                value={userId ?? ''} 
                                onChange={(e) => setUserId(Number(e.target.value))}
                                required
                            >
                                <option value="">-- Выберите пользователя --</option>
                                {users.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.full_name}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                    <button type="submit">Добавить</button>
                    <button type="button" onClick={onClose}>Закрыть</button>
                </form>
            </div>
        </div>
    );
};

export default AddTask;
