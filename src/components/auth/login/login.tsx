import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './login.css';

const LoginForm: React.FC = () => {
    const navigate = useNavigate();
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        console.log("Логин:", login, "Пароль:", password);
        
        try {
            const response = await axios.post(
                `http://31.128.36.91:8082/user/signin`,
                { login, password },
                { withCredentials: true } 
            );
            console.log(response)
            
            if (response.status === 200) {
                localStorage.setItem("token", response.data.token);
                navigate('/');
            }            
        } catch (error) {
            // Обработка ошибок
            if (axios.isAxiosError(error) && error.response) {
                if (error.response.status === 401) {
                    setError("Неправильный логин или пароль.");
                } else {
                    setError("Ошибка сервера. Попробуйте позже.");
                }
            } else {
                setError("Ошибка сети. Проверьте соединение.");
            }
            console.error("Ошибка при авторизации:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleNavigateToSignup = () => {
        navigate("/signup");
    };

    return (
        <section className="auth">
            <div className="container">
                <div className="auth__wrap">
                    <h1 className="auth__title">Авторизация</h1>
                    <form className="auth__form" onSubmit={handleLogin}>
                        <div className="auth__form-item">
                            <label htmlFor="login">Логин</label>
                            <input
                                className="auth__form-field"
                                id="login"
                                type="text"
                                value={login}
                                onChange={(e) => setLogin(e.target.value)}
                                required
                            />
                        </div>
                        <div className="auth__form-item">
                            <label htmlFor="pass">Пароль</label>
                            <input
                                className="auth__form-field"
                                id="pass"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {error && <div className="error-message">{error}</div>}
                        <button className="auth__form-btn btn-blick" type="submit" disabled={loading}>
                            {loading ? "Загрузка..." : "Войти"}
                        </button>
                    </form>
                    <div className="signup-link">
                        <p>Нет аккаунта? <button onClick={handleNavigateToSignup}>Зарегистрируйтесь</button></p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LoginForm;
