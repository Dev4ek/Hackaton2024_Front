import React from 'react';

interface UserProfile {
    id: number;
    full_name: string;
    role: string;
    avatar_image: string;
    created_at: string;
}

interface TaskProfileProps {
    user: UserProfile;
}

const TaskProfile: React.FC<TaskProfileProps> = ({ user }) => {
    const registrationDate = new Date(user.created_at).toLocaleDateString('ru-RU');

    return (
        <div className="taskWin__profile active">
            <div className="profile-content">
                <h4 className="profle-title">{user.full_name}</h4>
                <div className="profile-spec">
                    <div className="profile-spec__item">{user.role}</div>
                </div>
                <div className="profile-date">
                    <span>Зарегистирован</span>
                    <span className="date">{registrationDate}</span>
                </div>
            </div>
            <div className="profile-images">
                <picture>
                    <source srcSet={`http://31.128.36.91:8082/${user.avatar_image}`} type="image/webp" />
                    <img src={`http://31.128.36.91:8082/${user.avatar_image}`} alt="profile" />
                </picture>
            </div>
        </div>
    );
};

export default TaskProfile;
