import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // Set the root element for accessibility

const ProjectsPage: React.FC = () => {
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newProject, setNewProject] = useState({ title: '', description: '' });

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get('http://31.128.36.91:8082/project', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem("token")}`,
                    },
                    withCredentials: true,
                });
                setProjects(response.data);
            } catch (err) {
                setError('Ошибка при загрузке проектов. Попробуйте позже.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const handleCreateProject = async () => {
        try {
            await axios.post('http://31.128.36.91:8082/project', newProject, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setProjects([...projects, newProject]); // Update local state
            setIsModalOpen(false);
            setNewProject({ title: '', description: '' }); // Reset form
        } catch (err) {
            setError('Ошибка при создании проекта. Попробуйте позже.');
            console.error(err);
        }
    };

    if (loading) return <div>Загрузка...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="projects-page">
            <h1>Список проектов</h1>
            <button 
                className="add-project-button" 
                onClick={() => setIsModalOpen(true)}
            >
                Создать проект
            </button>
            <ul className="projects-list">
                {projects.map((project) => (
                    <li key={project.uuid} className="project-item">
                        <h2>{project.title}</h2>
                        <p>{project.description}</p>
                        <Link to={`/tasks/${project.uuid}`}>Перейти к задачам</Link>
                    </li>
                ))}
            </ul>

            <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                contentLabel="Создание проекта"
                className="modal"
                overlayClassName="overlay"
            >
                <h2>Создать новый проект</h2>
                <form onSubmit={(e) => { e.preventDefault(); handleCreateProject(); }}>
                    <label>
                        Название:
                        <input 
                            type="text" 
                            value={newProject.title} 
                            onChange={(e) => setNewProject({ ...newProject, title: e.target.value })} 
                            required 
                        />
                    </label>
                    <label>
                        Описание:
                        <textarea 
                            value={newProject.description} 
                            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })} 
                            required 
                        />
                    </label>
                    <button type="submit">Создать</button>
                </form>
                <button onClick={() => setIsModalOpen(false)}>Закрыть</button>
            </Modal>
        </div>
    );
};

export default ProjectsPage;
