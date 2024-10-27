import axios from 'axios';
import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles

interface TaskProps {
    task: {
        uuid: string;
        title: string;
        description: string;
        status: string;
        comment: string;
    };
    onClose: () => void; // Function to close the task view
}

const Task: React.FC<TaskProps> = ({ task, onClose }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ 
        title: task.title, 
        description: task.description || '', 
        status_task: task.status, 
        comment: task.comment || '' 
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleEditToggle = () => {
        setIsEditing(prev => !prev);
    };

    const deleteTask = async () => {
        try {
            await axios.delete(`http://31.128.36.91:8082/task/${task.uuid}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`,
                }
            });
            // Handle successful delete (e.g., notify user, close task view)
            onClose(); // Optionally close the task view
        } catch (error) {
            console.error(error);
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams({
            title: formData.title,
            description: formData.description,
            status_task: formData.status_task,
            comment: formData.comment
        }).toString();

        try {
            const response = await axios.put(`http://31.128.36.91:8082/task/${task.uuid}?${params}`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (response.status === 200) {
                setIsEditing(false);
            }
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    return (
        <div className="taskWin__task active">
            <div className="taskWin__title-wrap">
                <h4 className="taskWin__title">{task.title}</h4>
            </div>
            {isEditing ? (
                <form onSubmit={handleSubmit}>
                    <div className="taskWin__title">
                        <h2>Название задачи</h2>
                        <input 
                            type="text" 
                            name="title" 
                            value={formData.title} 
                            onChange={handleChange} 
                            placeholder="Название задачи" 
                        />
                    </div>
                    <div className="taskWin__desc">
                        <h2>Описание к задаче</h2>
                        <ReactQuill 
                            value={formData.description}
                            onChange={(value: any) => setFormData(prev => ({ ...prev, description: value }))}
                            placeholder="Описание"
                        />
                    </div>
                    <div className="taskWin__textarea">
                        <ReactQuill 
                            value={formData.comment}
                            onChange={(value: any) => setFormData(prev => ({ ...prev, comment: value }))}
                            placeholder="Комментарий"
                        />
                    </div>
                    <select 
                        name="status_task"
                        value={formData.status_task}
                        onChange={handleChange}
                    >
                        <option value="todo">Бэклог</option>
                        <option value="in_progress">В процессе</option>
                        <option value="done">Завершено</option>
                    </select>
                    <button type="submit" className="taskWin-btn save active">Сохранить</button>
                </form>
            ) : (
                <>
                    <div className="taskWin__desc">
                        <p dangerouslySetInnerHTML={{ __html: task.description || 'Нет описания' }} />
                    </div>
                    <div className="taskWin__desc">
                        <p>{task.comment || 'Нет комментария'}</p>
                    </div>
                </>
            )}
            <div className="taskWin__actns">
                <div className="taskWin__menu">
                    <div className="taskWin__menu-vis">
                        <div className="taskWin__menu-ic"></div>
                        <span className="taskWin__menu-title">Меню</span>
                    </div>
                    <div className="taskWin__menu-list-wrap">
                        <ul className="taskWin__menu-list">
                            <li><a href="">что-то хз что</a></li>
                            <li><a href="">что-то хз что</a></li>
                            <li><a href="">что-то хз что</a></li>
                        </ul>
                    </div>
                </div>
                <button onClick={handleEditToggle} className="taskWin-btn" style={{backgroundColor: 'blue'}}>
                    {isEditing ? 'Отменить' : 'Редактировать'}
                </button>
                <button className="taskWin-btn del" title="Удалить" onClick={deleteTask}></button>
            </div>
        </div>
    );
};

export default Task;
