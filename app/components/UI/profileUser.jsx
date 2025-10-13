"use client"
import axios from 'axios';
import styles from './styles/profileUser.module.css';
import { User, LogOut } from 'lucide-react';
import { useState, useEffect } from "react"; 

export default function ProfileUser() {

   const [login, setLogin] = useState(false);
   const [profile, setProfile] = useState({
        login: "...Загрузка",
        email: "...Загрузка"
   });

   const port = 'http://localhost:3001';
   
   //Выход из аккаунта
    const handleLogout = async () => {
        try {
            await axios.post(`${port}/user/logout`, {}, { withCredentials: true });
            setLogin(false);
            window.location.href = "/";
        } catch(error) {
            console.error("Ошибка при выходе", error);
            setLogin(false);
            window.location.href = "/";
        }
    };

    //useEffect на вывод информации о пользователе
    useEffect(() => {
    const fetchProfile = async () => {
        try {
            const res = await axios.get(`${port}/user/profile`, { withCredentials: true }); 
            setLogin(true);
            setProfile({
                login: res.data.login,
                email: res.data.email,
            });

        } catch (error) {
            if (error.response && error.response.status === 401) {
                setLogin(false);
            } else {
                console.error("Ошибка при получении профиля:", error);
                setLogin(false);
            }
        }
    };
    fetchProfile();
   }, [port]);

    return (
        <section className={styles.profile_container}>
            <div className={styles.avatar_profile}>AI</div>
            <div className={styles.user_info}>
                <p className={styles.user_name}>{profile.login}</p>
                <p className={styles.account_status}><User width={13} height={13} /> Пользователь</p>
                <p className={styles.user_email}>{profile.email}</p>
            </div>
            <button onClick={handleLogout} className={styles.but_logout}><LogOut width={15} height={15} />Выход</button>
        </section>
    )
}