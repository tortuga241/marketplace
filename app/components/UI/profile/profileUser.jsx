// "use client"
// import axios from 'axios';
// import styles from './styles/profileUser.module.css';
// import { User, LogOut } from 'lucide-react';
// import { useState, useEffect } from "react"; 

// export default function ProfileUser() {

//    const [login, setLogin] = useState(false);
//    const [profile, setProfile] = useState({
//         login: "...Загрузка",
//         email: "...Загрузка"
//    });

//    const port = 'http://localhost:3001';
   
//    //Выход из аккаунта
//     const handleLogout = async () => {
//         try {
//             await axios.post(`${port}/user/logout`, {}, { withCredentials: true });
//             setLogin(false);
//             window.location.href = "/";
//         } catch(error) {
//             console.error("Ошибка при выходе", error);
//             setLogin(false);
//             window.location.href = "/";
//         }
//     };

//     //useEffect на вывод информации о пользователе
//     useEffect(() => {
//     const fetchProfile = async () => {
//         try {
//             const res = await axios.get(`${port}/user/profile`, { withCredentials: true }); 
//             setLogin(true);
//             setProfile({
//                 login: res.data.login,
//                 email: res.data.email,
//             });

//         } catch (error) {
//             if (error.response && error.response.status === 401) {
//                 setLogin(false);
//             } else {
//                 console.error("Ошибка при получении профиля:", error);
//                 setLogin(false);
//             }
//         }
//     };
//     fetchProfile();
//    }, [port]);

//     //Функция для нормального аватара
//     const getAvatarInitial = (login) => {
//         if (!login || login.includes("...")) {
//             return "";
//         }
//         return login.charAt(0).toUpperCase();
//     };

//     return (
//         <section className={styles.profile_container}>
//             <div className={styles.avatar_profile}>{getAvatarInitial(profile.login)}</div>
//             <div className={styles.user_info}>
//                 <p className={styles.user_name}>{profile.login}</p>
//                 <p className={styles.account_status}><User width={13} height={13} /> Пользователь</p>
//                 <p className={styles.user_email}>{profile.email}</p>
//             </div>
//             <button onClick={handleLogout} className={styles.but_logout}><LogOut width={15} height={15} />Выход</button>
//         </section>
//     )
// }




// components/UI/profile/profileUser.js (Ваш оригинальный ProfileUser)

"use client"
import axios from 'axios';
import styles from './styles/profileUser.module.css';
import { User, LogOut } from 'lucide-react';
import { useState, useEffect } from "react"; 

// Принимаем user и isOwner
export default function ProfileUser({ user, isOwner }) { // <--- Принимаем props

   const port = 'http://localhost:3001';
   
   // Используем данные из props
   const profile = {
        login: user?.login || "...Загрузка",
        email: user?.email || "...Загрузка"
   };
   
   // Выход из аккаунта
    const handleLogout = async () => {
        try {
            // Вызываем logout и сбрасываем токен в cookies
            await axios.post(`${port}/user/logout`, {}, { withCredentials: true });
            window.location.href = "/"; // Перенаправляем на главную
        } catch(error) {
            console.error("Ошибка при выходе", error);
            window.location.href = "/"; // Перенаправляем даже при ошибке для сброса состояния
        }
    };

    // Функция для нормального аватара
    const getAvatarInitial = (login) => {
        if (!login || login.includes("...")) {
            return "";
        }
        return login.charAt(0).toUpperCase();
    };

    // ВНИМАНИЕ: СТАРАЯ ЛОГИКА useEffect УДАЛЕНА И ЗАМЕНЕНА НА ИСПОЛЬЗОВАНИЕ PROPS
    
    return (
        <section className={styles.profile_container}>
            <div className={styles.avatar_profile}>{getAvatarInitial(profile.login)}</div>
            <div className={styles.user_info}>
                <p className={styles.user_name}>{profile.login}</p>
                <p className={styles.account_status}><User width={13} height={13} /> Пользователь</p>
                <p className={styles.user_email}>{profile.email}</p>
            </div>
            {/* Скрываем кнопку Выход, если это не владелец аккаунта */}
            {isOwner && (
                <button onClick={handleLogout} className={styles.but_logout}><LogOut width={15} height={15} />Выход</button>
            )}
        </section>
    )
}