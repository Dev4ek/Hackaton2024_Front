import React from 'react';
import { AppBar, Toolbar, Typography, Container } from '@mui/material';
import UserManagement from './UserManagement';

const AdminDashboard: React.FC = () => {
    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6">Панель администратора</Typography>
                </Toolbar>
            </AppBar>
            <Container>
                <UserManagement />
            </Container>
        </div>
    );
};

export default AdminDashboard;
