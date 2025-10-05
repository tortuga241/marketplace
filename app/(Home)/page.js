import Header from "../components/Header";
import styles from './page.module.css';
import { Search, ArrowRight, TrendingUp, Users, Star, Zap, Award } from "lucide-react";

import Category from "../components/UI/category";
import ProductCart from "../components/UI/product";
import SellerCart from "../components/UI/seller";
import Footer from "../components/footer";


export default function Home() {

  return (
    <div className={styles.main_container}>
      <Header />
      {/* Баннер */}
      <section className={styles.banner}>
        <div className={styles.content_banner}>
          <div className={styles.title_banner_1}>Покупайте и<br/> продовайте </div>
          <div className={styles.title_banner_2}>цифровые продукты</div>
          <div className={styles.banner_description}>Документы, статьи, видео и многое другое.<span> Присоединяйтесь к сообществу создателей и</span> <span>покупателей качественного контента.</span></div>
          <div className={styles.input_banner_container}>
            <Search className={styles.search_icon} size={18} />
            <input type="text" placeholder="Что вы ищите?" />
            <button className={styles.arrow_icon}>
              <ArrowRight size={22} />
            </button>
          </div>
          <div className={styles.tag_banner}>Популярные запросы:<span className={styles.tags}>бизнес-планы,</span> <span className={styles.tags}>курсы,</span> <span className={styles.tags}>шаблоны</span></div>
          <div className={styles.banner_buts}>
            <button className={styles.banner_butl}>Начать покупки</button>
            <button className={styles.banner_butr}>Стать продавцом</button>
          </div>
          <div className={styles.stat_container_banner}>
            <div className={styles.stat_list}>
              <span className={styles.stat_icon}><TrendingUp width={20} height={20} /> 1000+</span>
              <span className={styles.stat_txt}>Продуктов</span>
            </div>
             <div className={styles.stat_list}>
              <span className={styles.stat_icon}><Users width={20} height={20} /> 500+</span>
              <span className={styles.stat_txt}>Продавцов</span>
            </div>
             <div className={styles.stat_list}>
              <span className={styles.stat_icon}><Star width={20} height={20} /> 4.8</span>
              <span className={styles.stat_txt}>Рейтинг</span>
            </div>
          </div>
        </div>
      </section>
      {/* Баннер end */}
      {/* Категории */}
      <section className={styles.categories_section}>
        <div className={styles.section_title}>
          <Zap width={19} height={19} />
          <p className={styles.section_txt}>КАТЕГОРИИ</p>
        </div>
        <h2 className={styles.categories_title}>Найдите именно то, что нужно</h2>
        <p className={styles.categories_descript}>Широкий выбор цифровых продуктов от профессиональных создателей</p>
        <div className={styles.category_container}>
          <Category />
        </div>
        <button className={styles.category_but}>Просмотреть все категории</button>
      </section>
      {/* Категории end */}
      {/* Популярные продукты */}
      <section style={{backgroundColor: 'white'}} className={styles.categories_section}>
        <div className={styles.section_title}>
          <Star width={19} height={19} />
          <p className={styles.section_txt}>РЕКОМЕНДУЕМОЕ</p>
        </div>
        <h2 className={styles.categories_title}>Популярные продукты</h2>
        <p className={styles.categories_descript}>Самые продаваемые и высоко оцененные цифровые продукты от наших авторов</p>
        <div className={styles.product_container_cart}>
          <ProductCart/>
        </div>
        <button className={styles.button_rec}>Просмотреть все продукты</button>
      </section>
      {/* Популярные продукты end */}
      {/* Топ продавцов */}
      <section className={styles.categories_section}>
        <div className={styles.section_title}>
          <Award width={18} height={18} />
          <p className={styles.section_txt}>ТОП ПРОДАВЦЫ</p>
        </div>
        <h2 className={styles.categories_title}>Лучшие создатели контента</h2>
        <p className={styles.categories_descript}>Познакомьтесь с нашими успешными авторами и их качественными продуктами</p>
        <div className={styles.product_container_cart}>
          <SellerCart />
        </div>
        <button className={styles.category_but}>Просмотреть всеx продавцов</button>
        <div className={styles.row_container}>
          <TrendingUp width={14} height={14} color="gray" />
          <p className={styles.gray_txt}>Хотите стать продавцом? Присоеденяйтесь к нашему сообществу!</p>
        </div>
      </section>
      {/* Топ продавцов end */}
      {/* footer */}
      <Footer/>
    </div>
  );
} 
