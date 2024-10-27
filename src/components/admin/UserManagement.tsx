import React, { useState, useEffect } from 'react';
import { Paper, Typography, Select, MenuItem, FormControl, InputLabel, Grid } from '@mui/material';
import axios from 'axios';

interface User {
    id: number;
    full_name: string;
    role: string;
    avatar_image: string;
}

const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://31.128.36.91:8082/user/list', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem("token")}`,
                    },
                    withCredentials: true,
                }); // Исправленный URL
                setUsers(response.data);
            } catch (error) {
                console.error('Ошибка при получении пользователей:', error);
            }
        };

        fetchUsers();
    }, []);

    const handleRoleChange = async (userId: number, newRole: string) => {
        const token = localStorage.getItem("token");
        try {
            await axios.put(`http://31.128.36.91:8082/user/id/${userId}?role=${newRole}`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });
            // Обновление локального состояния после изменения роли
            setUsers(users.map(user => 
                user.id === userId ? { ...user, role: newRole } : user
            ));
        } catch (error: any) {
            console.error('Ошибка при обновлении роли пользователя:', error.response?.data || error);
        }
    };

    return (
        <Paper style={{ padding: 20, margin: '20px 0' }}>
            <Typography variant="h5">Управление пользователями</Typography>
            {users.map(user => (
                <Grid container key={user.id} alignItems="center">
                    <Grid item xs={6}>
                        <Typography>{user.full_name} - {user.role}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl variant="outlined" fullWidth>
                            <InputLabel>Роль</InputLabel>
                            <Select
                                value={user.role}
                                onChange={(e) => handleRoleChange(user.id, e.target.value)}
                            >
                                <MenuItem value="guest">Гость</MenuItem>
                                <MenuItem value="member">Участник</MenuItem>
                                <MenuItem value="admin">Админ</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            ))}
        </Paper>
    );
};

export default UserManagement;
