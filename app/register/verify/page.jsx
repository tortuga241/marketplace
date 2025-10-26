"use client"

import { useState } from 'react';
import { useRouter } from "next/navigation";
import styles from './verify.module.css';

import { useApi } from '../../src/hooks/useApi';

export default function Verify() {

    const router = useRouter();
    const api = useApi();

    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    //Верификация
    const handleVerify = async () => {
        if(!code) {
            setError("Все поля обязательны!")
            return;
        }
        try {
            await api.verifyRegister({ code })
            setMessage("Почта успешно подтверждена");
            router.push("/register");
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
                    <h1 className={styles.h1}>Подтверждение почты</h1>
                    <p className={styles.txt}>Код подтверждения</p>
                    <div className={styles.input}><input type="text" placeholder='Введите код' value={code} onChange={(e) => setCode(e.target.value)} /></div>
                    <button onClick={handleVerify} className={styles.butVerify}>Подтвердить</button>
                </section>
            </div>
            {error && <div className={styles.error}>{error}</div>}
            {message && <div className={styles.message}>{message}</div>}
        </div>
    )
};