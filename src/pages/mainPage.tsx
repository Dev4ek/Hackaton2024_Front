import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import BoardMain from '../components/main/board';
import Task from '../components/main/taskContent/task';
import Profile from '../components/header/profile';
import Chat from '../components/chats/chat';

const Mainpage: React.FC = () => {
    const { projectId } = useParams<{ projectId?: string }>();
    const [infoUser, setInfoUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedTask, setSelectedTask] = useState<any | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [responsiblePerson, setResponsiblePerson] = useState('');
    const [profileOpen, setProfileOpen] = useState<boolean>(false);
    const [chatOpen, setChatOpen] = useState<boolean>(false);

    const navigate = useNavigate();

    console.log(infoUser)
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await axios.get('http://31.128.36.91:8082/user/info', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem("token")}`,
                    },
                    withCredentials: true,
                });
                setInfoUser(response.data);
                localStorage.setItem("role", response.data.role);
                if (response.status === 403) {
                    localStorage.removeItem("token");
                    window.location.href = "/login";
                }
            } catch (error) {
                setError("Ошибка при получении информации о пользователе");
                console.error("Ошибка при получении информации о пользователе:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserInfo();
    }, []);

    if (loading) {
        return <div>Загрузка...</div>;
    }
    if (error) {
        return <div>{error}</div>;
    }

    const OpenProfile = () => setProfileOpen(true);
    const CloseProfile = () => setProfileOpen(false);
    const toggleChat = () => setChatOpen(prev => !prev);

    const execel = async (projectId: any) => {
        try {
            const response = await axios.get(`http://31.128.36.91:8082/project/${projectId}/tasks.xlsx`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`,
                },
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `tasks_${projectId}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Ошибка при выгрузке в Excel:", error);
        }
    };

    return (
        <>
            <div className="board">
                <div className="board__header">
                    <div className="container">
                        <div className="board__header-wrap">
                            <div className="board__logo"><span>СМИ лучшие ребятки</span></div>
                            <div className='admin_btn' onClick={() => navigate('/admin')} style={{backgroundColor: 'red', padding: 10}}>Панель администратора</div>
                            <div className='exel'style={{backgroundColor: 'red', padding: 10}} onClick={() => execel(projectId)}>Выгрузка в EXCEL</div>
                        </div>

                        <div className="board__filter">
                            <form className="filter-search" onSubmit={(e) => e.preventDefault()}>
                                <input
                                    className="filter-search__field"
                                    type="text"
                                    aria-label="Задачи поиска"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    style={{ color: 'black', backgroundColor: 'white', padding: 10, marginTop: 10 }}
                                />
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    style={{ color: 'black', backgroundColor: 'white', padding: 10, marginTop: 10, marginLeft: 5 }}
                                />
                                <input
                                    type="text"
                                    placeholder="Ответственный"
                                    value={responsiblePerson}
                                    onChange={(e) => setResponsiblePerson(e.target.value)}
                                    style={{ color: 'black', backgroundColor: 'white', padding: 10, marginTop: 10, marginLeft: 5 }}
                                />
                            </form>
                            <a className="filter-prof" href="#" aria-label="Ссылка профиля" onClick={OpenProfile}></a>
                        </div>
                    </div>
                </div>
                <div className="container">
                    {projectId && (
                        <BoardMain
                            projectId={projectId}
                            setSelectedTask={setSelectedTask}
                            searchQuery={searchQuery}
                            startDate={startDate}
                            endDate={endDate}
                            responsiblePerson={responsiblePerson}
                        />
                    )}
                </div>
            </div>

            {/* Иконка чата */}
            <div className="chat-icon" onClick={toggleChat}>
                <i className="fas fa-comments"></i>
            </div>

            {selectedTask && (
                <div className="taskWin">
                    <div className="taskWin__overlay" onClick={() => setSelectedTask(null)}></div>
                    <div className="taskWin__content">
                        <div className="taskWin__close" onClick={() => setSelectedTask(null)}></div>
                        <Task task={selectedTask} onClose={() => setSelectedTask(null)} />
                    </div>
                </div>
            )}
            {profileOpen && (
                <Profile userId='3232' onClose={CloseProfile}/>
            )}
            {chatOpen && (
                <div className="chat-window">
                    <Chat/>
                    <button onClick={toggleChat}>Закрыть чат</button>
                </div>
            )}
        </>
    );
};

export default Mainpage;
