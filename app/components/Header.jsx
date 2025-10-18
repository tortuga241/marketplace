"use client";

import { Search, Bell, User, ShoppingCart } from "lucide-react";
import { useState, useEffect, use } from "react";
import styles from './Header.module.css';
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Header() {
  const [login, setLogin] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [ searchText, setSearchText ] = useState("");

  const port = 'http://localhost:3001';

  const router = useRouter();

  //Проверка на авторизацию пользователя
  useEffect(() => {
    const checkAuthStatus = async () => {
    try {
      const res = await axios.get(`${port}/user/profile`, { withCredentials: true });

      if (res.status === 200 && res.data) {
        setLogin(true);
        setCurrentUser(res.data);
      } else {
        setLogin(false);
        setCurrentUser(null);
      }
    } catch (error) {
        if (error.response && error.response.status === 401) {
          setLogin(false);
          setCurrentUser(null);
        } else {
          console.error("Ошибка при проверке статуса сессии:", error);
          setLogin(false);
          setCurrentUser(null);
        }
      }
    }
    checkAuthStatus();
  }, [port])


  //Обработка поиска
  const handleSearch = (e) => {
    e.preventDefault();

    const trimmedText  = searchText.trim();

    if(trimmedText) {
      router.push(`/catalog?q=${encodeURIComponent(trimmedText)}`);
    }

    else {
      router.push(`/catalog`);
    }
    setSearchText('')
  }

  //Кнопка ENTER
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  const handleProfileClick = (e) => {
    if (!login || !currentUser) return;
    router.push(`/profile/${currentUser.id}`);
  }

  const isUserSeller = currentUser && currentUser.shop !== null;
  const shouldShowBecomeSeller = login && !isUserSeller;


  return (
    <header className={styles.header_main}>
      <Link href="/"> <div className={styles.header_logo}>
        <div className={styles.m}>M</div>
        <div className={styles.title_header}>MarketPlace</div>
      </div></Link>

      <div className={styles.input_search}>
        <button className={styles.icon_button} onClick={handleSearch}>
          <Search className={styles.icon_search} width={17} height={17} />
        </button>
        <input
          className={styles.input_header}
          type="text"
          placeholder="Поиск документов, статей, видео..."
          value={searchText} 
          onChange={(e) => setSearchText(e.target.value)} 
          onKeyPress={handleKeyPress}
        />
      </div>

      <div className={styles.row_container_header}>
        <Link href='/catalog'><p className={styles.menu_header_txt}>Каталог</p></Link>
        <p className={styles.menu_header_txt}>Продавцы</p>
        <p className={styles.menu_header_txt}>Как продавать</p>
      </div>

      <div className={styles.icon_header}>
        <Bell className={styles.icon_header_bell} width={15} height={15} />
        <ShoppingCart className={styles.icon_header_bascket} width={15} height={15} />
      </div>

      <div className={styles.but_header}>
        {login ? (
          <>
              <button className={styles.but_singin} onClick={handleProfileClick}>
                <User width={15} height={15} /> Личный Кабинет
              </button>
            
            {/* Условный рендеринг: показываем кнопку, только если пользователь НЕ является продавцом */}
            {shouldShowBecomeSeller && (
                <Link href="/become-seller">
                    <button className={styles.but_sale}>
                        Начать продавать
                    </button>
                </Link>
            )}
          </>
        ) : (
          <>
            <Link href="/register">
              <button className={styles.but_singin}>
                <User width={15} height={15} /> Войти
              </button>
            </Link>
            {/* Кнопка "Начать продавать" для неавторизованных пользователей */}
            <Link href="/register"><button className={styles.but_sale}>Начать продавать</button></Link>
          </>
        )}
      </div>
    </header>
  );
}
