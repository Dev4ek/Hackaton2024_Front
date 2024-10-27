import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignupForm: React.FC = () => {
    const navigate = useNavigate();
    const [fullName, setFullName] = useState("");
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Логика проверки и регистрации
        if (fullName.trim() === "" || !/^[А-ЯЁа-яё\s-]+$/.test(fullName)) {
            setError("Введите корректное ФИО.");
            return;
        }
        if (password !== confirmPassword) {
            setError("Пароли не совпадают.");
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post(
                'http://31.128.36.91:8082/user/signup',
                {
                    full_name: fullName,
                    login: login,
                    password: password,
                    confirm_password: confirmPassword,
                },
                { withCredentials: true } // чтобы куки принимались
            );

            if (response.status === 200) {
                navigate('/');
            } else if (response.status === 409) {
                // Здесь проверяем формат ответа
                setError(response.data.message || "Этот логин уже занят.");
                return;
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                // Обработка ошибок сервера
                setError(error.response.data.message || "Ошибка сервера. Попробуйте позже.");
            } else {
                setError("Ошибка сети. Проверьте соединение.");
            }
            console.error("Ошибка при регистрации:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="auth">
            <div className="container">
                <div className="auth__wrap">
                    <h1 className="auth__title">Введите данные для регистрации</h1>
                    <form className="auth__form" onSubmit={handleSubmit}>
                        <div className="auth__form-item">
                            <label htmlFor="fio">Введите ФИО</label>
                            <input
                                className="auth__form-field"
                                id="fio"
                                type="text"
                                name="fio"
                                placeholder="Иванов Иван Иванович"
                                required
                                maxLength={50}
                                pattern="[А-ЯЁа-яё\s-]+"
                                aria-label="Введите ФИО"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                            />
                        </div>
                        <div className="auth__form-item">
                            <label htmlFor="login">Введите логин</label>
                            <input
                                className="auth__form-field"
                                id="login"
                                type="text"
                                name="login"
                                placeholder="ivanov"
                                required
                                maxLength={20}
                                aria-label="Введите логин"
                                value={login}
                                onChange={(e) => setLogin(e.target.value)}
                            />
                        </div>
                        <div className="auth__form-item">
                            <label htmlFor="password">Введите пароль</label>
                            <input
                                className="auth__form-field"
                                id="password"
                                type="password"
                                name="password"
                                placeholder="Введите пароль"
                                required
                                maxLength={20}
                                aria-label="Введите пароль"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="auth__form-item">
                            <label htmlFor="passwordConfirm">Повторите пароль</label>
                            <input
                                className="auth__form-field"
                                id="passwordConfirm"
                                type="password"
                                name="password-confirm"
                                placeholder="Повторите пароль"
                                required
                                maxLength={20}
                                aria-label="Повторите пароль"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                        {error && <div className="error-txt">{error}</div>}

                        <button className="auth__form-btn btn-blick" type="submit" disabled={loading}>
                            {loading ? "Загрузка..." : "Зарегистрироваться"}
                        </button>                        
                    </form>
                </div>
            </div>
        </section>
    );
};

export default SignupForm;
