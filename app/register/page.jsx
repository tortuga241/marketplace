"use client";
import { cache, useState } from "react";
import styles from './register.module.css';
import { Eye, EyeOff } from "lucide-react";
import axios from 'axios';
import { useRouter } from "next/navigation";

export default function Register() {

    const router = useRouter()

    const [ isLogin, setIsLogin ] = useState(true);
    const [showPassword, setShowPassword] = useState(false);

    //useState для хранения данных
    const [login, setLogin] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [code, setCode] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const port = 'http://localhost:3001';

    //Вход в аккаунт
    const handleLogin = async () => {
        if(!email || !password) {
            setError("Все поля обязательны!")
            return;
        }
        try {
            const res = await axios.post(`${port}/user/login`, {
                email,
                password,
            }, { withCredentials: true });

            const data = res.data;
            router.push("/")
            console.log("Ответ сервера при логине:", data);
        } catch (err) {
            if (err.response) {
                if (err.response.status === 404 || err.response.status === 400 || err.response.status === 401) {
                    setError("Аккаунт не найден. Хотите зарегистрироваться?");
                } else {
                    setError(err.response.data.message || "Ошибка входа");
                }
            } else {
                setError("Ошибка сети");
            }
        }
     };

    //Регистрация аккаунта
    const handleReg = async () => {
        if(!email || !login || !password) {
            setError("Все поля обязательны!")
            return;
        }
        try {   
            const res = await axios.post(`${port}/user/request-register`, {
                login,
                email,
                password
            }, { withCredentials: true });
            setMessage(res.data.message);
            const data = res.data;
            router.push("/register/verify")
        } catch (err) {
            if (err.response) {
                setError(err.response.data.message || "Ошибка регистрации");
            } else {
                setError("Ошибка сети");
            }
        }
    };

    //Верификация
    const handleVerify = async () => {
        if(!email || !code) {
            setError("Все поля обязательны!")
            return;
        }
        try {
            const res = await axios.post(`${port}/user/verify-register`, {
                email,
                code
            });
            setMessage(res.data.message);
            
        } catch (err) {
            if (err.response) {
                setError(err.response.data.message || "Ошибка подтверждения");
            } else {
                setError("Ошибка сети");
            }
        }
    };



    return (
        <div className={styles.main}>
            <div className={styles.main_container}>
                <section className={styles.container}>
                    <div className={styles.title}>
                        <h1 className={styles.h1}>Добро пожаловать</h1>
                        <h4 className={styles.h4}>Войдите или создайте новый аккаунт</h4>
                    </div>
                    <div className={styles.switch_container}>
                        <button onClick={() => setIsLogin(true)} className={`${styles.butLogin} ${isLogin ? styles.butLoginActive : ""}`}>Вход</button>
                        <button onClick={() => setIsLogin(false)} className={`${styles.butReg} ${!isLogin ? styles.butRegActive : ""}`}>Регистрация</button>
                    </div>

                {isLogin && (
                    <section className={styles.container_login}>
                        <div className={styles.input_container}>
                            <div className={styles.input_txt}>Email</div>
                            <div className={styles.input}><input type="text" placeholder='example@gmail.com' value={email} onChange={(e) => setEmail(e.target.value)}/></div>
                            <div className={styles.input_txt}>Пароль</div>
                            <div className={styles.input}><input type={showPassword ? "text" : "password"} placeholder='*****' value={password} onChange={(e) => setPassword(e.target.value)} /><span className={styles.icon} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}</span></div>
                        </div>
                        <button onClick={handleLogin} className={styles.button_click}>Войти</button>
                    </section>
                )}
                
                {!isLogin && (
                    <section className={styles.container_reg}>
                        <div className={styles.input_container}>
                            <div className={styles.input_txt}>Логин</div>
                            <div className={styles.input}><input type="text" placeholder='Имя пользователя' value={login} onChange={(e) => setLogin(e.target.value)} /></div>
                            <div className={styles.input_txt}>Почта</div>
                            <div className={styles.input}><input type="text" placeholder='example@gmail.com' value={email} onChange={(e) => setEmail(e.target.value)} /></div>
                            <div className={styles.input_txt}>Пароль</div>
                            <div className={styles.input}><input type={showPassword ? "text" : "password"} placeholder='*****' value={password} onChange={(e) => setPassword(e.target.value)} /><span className={styles.icon} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}</span></div>
                        </div>
                        <button onClick={handleReg} className={styles.button_click}>Зарегистрироваться</button>
                    </section>
                )}
                </section>
            </div>
            {error && <div className={styles.error}>{error}</div>}
            {message && <div className={styles.message}>{message}</div>}
        </div>
    )
};