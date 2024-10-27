import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddTask from './taskContent/addTask'; 
import TaskProfile from './taskContent/profile';

interface BoardMainProps {
    projectId: string; 
    setSelectedTask: (task: any) => void; 
    searchQuery: string; 
    startDate: string;
    endDate: string;
    responsiblePerson: string;
}

const BoardMain: React.FC<BoardMainProps> = ({ projectId, setSelectedTask, searchQuery, startDate, endDate, responsiblePerson }) => {
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAddTaskOpen, setAddTaskOpen] = useState(false);
    const [isAddProfile, setAddProfile] = useState(false);
    const [selectedProfile, setSelectedProfile] = useState<any>(null);
    const userRole = localStorage.getItem('role');

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await axios.get(`http://31.128.36.91:8082/project/${projectId}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem("token")}`,
                    },
                    withCredentials: true,
                });

                setTasks(Array.isArray(response.data.tasks) ? response.data.tasks : []);
            } catch (err) {
                setError('Ошибка при загрузке задач. Попробуйте позже.');
                console.error('Ошибка при загрузке задач:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, [projectId]);

    const handleClickTask = async (uuid: string) => {
        try {
            const response = await axios.get(`http://31.128.36.91:8082/task/${uuid}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`,
                },
                withCredentials: true,
            });
            setSelectedTask(response.data);
        } catch (err) {
            console.error('Ошибка при загрузке задачи:', err);
        }
    };

    const handleProfileClick = (task: any) => {
        setSelectedProfile(task.user); // Store the selected user's data
        setAddProfile(true); // Open the profile modal
    };

    const closeModal = () => {
        setAddTaskOpen(false);
        setAddProfile(false); // Close the profile modal
        setSelectedProfile(null); // Clear the selected profile
    };

    const filterTasks = () => {
        return tasks.filter(task => {
            const matchesTitle = task.title.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesResponsible = task.user.full_name.toLowerCase().includes(responsiblePerson.toLowerCase());

            const taskDate = new Date(task.created_at);
            const matchesDateRange = (!startDate || taskDate >= new Date(startDate)) && (!endDate || taskDate <= new Date(endDate));

            return matchesTitle && matchesResponsible && matchesDateRange;
        });
    };

    const filteredTasks = filterTasks();

    const handleDragStart = (event: React.DragEvent, task: any) => {
        if (userRole !== 'guest') { 
            event.dataTransfer.setData("task", JSON.stringify(task));
        }
    };

    const handleDrop = async (event: React.DragEvent, status: string) => {
        event.preventDefault();
        if (userRole === 'guest') return;

        const taskData = event.dataTransfer.getData("task");
        const task = JSON.parse(taskData);
        
        try {
            const response = await axios.put(`http://31.128.36.91:8082/task/${task.uuid}?status_task=${status}`, {}, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`,
                },
                withCredentials: true,
            });
    
            if (Array.isArray(response.data.tasks)) {
                setTasks(response.data.tasks);
            } else {
                setTasks(prevTasks =>
                    prevTasks.map(t => t.uuid === task.uuid ? { ...t, status } : t)
                );
            }
        } catch (error: any) {
            if (error.response && error.response.status === 401) {
                setError('Необходима авторизация. Пожалуйста, войдите в систему.');
            } else {
                console.error('Ошибка при обновлении задачи:', error);
                setError('Ошибка при обновлении задачи. Попробуйте позже.');
            }
        }
    };

    const handleDragOver = (event: React.DragEvent) => {
        event.preventDefault();
    };

    if (loading) return <div>Загрузка задач...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="board__content">
            <h2>Задачи проекта</h2>
            <div className="board__cards">
                {['todo', 'in_progress', 'done'].map((status, index) => (
                    <div 
                        key={index} 
                        className={`board__card ${status === 'todo' ? 'backlog' : status === 'in_progress' ? 'dur' : 'done'}`}
                        onDrop={(event) => handleDrop(event, status)}
                        onDragOver={handleDragOver}
                    >
                        <h3 className="board__card-title">{status === 'todo' ? 'Бэклог' : status === 'in_progress' ? 'В процессе' : 'Выполнено'}</h3>
                        {filteredTasks.filter(task => task.status === status).map(task => (
                            <div 
                                className="board__card-task" 
                                key={task.uuid}
                                draggable={userRole !== 'guest'}
                                onDragStart={(event) => handleDragStart(event, task)}
                                onClick={() => handleClickTask(task.uuid)} 
                            >   
                                <h4>{task.title}</h4>
                                <span className="board__card-ex" onClick={(e) => { e.stopPropagation(); handleProfileClick(task); }}>
                                    <img src={`http://31.128.36.91:8082/${task.user.avatar_image}`} height={20} width={20} style={{borderRadius: 10}}/>
                                    {task.user?.full_name || 'Неизвестный'}
                                </span>  
                            </div>
                        ))}
                        {userRole === 'admin' && status === 'todo' && (
                            <button className="board__card-btn" onClick={() => setAddTaskOpen(true)}>Добавить задачу</button>
                        )}

                    </div>
                ))}
            </div>

            {isAddTaskOpen && <AddTask onClose={closeModal} projectId={projectId} />}

            {isAddProfile && selectedProfile && (
                <>
                    <div className="taskWin">
                        <div className="taskWin__overlay" onClick={closeModal}></div>
                        <div className="taskWin__contentt">
                            <div className="taskWin__close" onClick={closeModal}></div>
                            <TaskProfile user={selectedProfile} /> {/* Pass the selected user to TaskProfile */}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default BoardMain;
