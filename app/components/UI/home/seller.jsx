import { Star } from 'lucide-react';
import styles from './styles/seller.module.css';
import { Yellowtail } from 'next/font/google';

export default function SellerCart() {

    const sellers = [
        {
            id: 1,
            name: "Анна Иванова",
            avatar: "АИ",
            title: "UX/UI Designer",
            speciality: "Веб-дизайн и UX",
            rating: 4.9,
            reviews: 234,
            sales: 1543,
            products: 28,
            verified: true,
            topSeller: true,
            joinedMonths: 18,
            description: "Создаю современные дизайны для веб-приложений и мобильных интерфейсов"
        },
        {
            id: 2,
            name: "Михаил Петров",
            avatar: "МП",
            title: "Business Consultant",
            speciality: "Бизнес и стратегия",
            rating: 4.8,
            reviews: 189,
            sales: 1204,
            products: 15,
            verified: true,
            topSeller: true,
            joinedMonths: 24,
            description: "Помогаю бизнесу расти с помощью проверенных стратегий и инструментов"
        },
        {
            id: 3,
            name: "Елена Сидорова",
            avatar: "ЕС",
            title: "Data Scientist",
            speciality: "Python и аналитика",
            rating: 4.9,
            reviews: 167,
            sales: 987,
            products: 12,
            verified: true,
            topSeller: true,
            risingTalent: true,
            joinedMonths: 8,
            description: "Обучаю анализу данных и машинному обучению на Python"
        },
        {
            id: 4,
            name: "Алексей Козлов",
            avatar: "АК",
            title: "Marketing Expert",
            speciality: "Цифровой маркетинг",
            rating: 4.7,
            reviews: 142,
            sales: 756,
            products: 19,
            verified: true,
            topSeller: true,
            joinedMonths: 15,
            description: "Создаю эффективные маркетинговые стратегии для онлайн-бизнеса"
        }
    ];

    return (
        <>
            {sellers.map((seller) => (
                <div key={seller.id} className={styles.main_container_top}>
                    <div className={styles.avatar}>{seller.avatar}</div>

                    <div className={styles.badges}>
                        {seller.verified && <span className={`${styles.badge} ${styles.badgeVerified}`}>Проверен</span>}
                        {seller.topSeller && <span className={`${styles.badge} ${styles.badgeTop}`}>Топ продавец</span>}
                    </div>
                    <div className={styles.main_content_seller}>
                        <h3 className={styles.user_name}>{seller.name}</h3>
                        <p className={styles.user_type}>{seller.title}</p>
                        <p className={styles.user_descript}>{seller.speciality}</p>
                        <p className={styles.user_special}>{seller.description}</p>
                        <div className={styles.user_num_seller}>
                            <Star width={18} height={18} className={styles.icon_star}/>
                            <p className={styles.icon_num}>{seller.rating}</p>
                            <p className={styles.seller_rating_num}>({seller.reviews})</p>
                        </div>
                        <div className={styles.hr_seller} />
                        <div className={styles.info_container_seller}>
                            <div className={styles.container_info_s}>
                                <p className={styles.info_s}>{seller.sales}</p>
                                <p className={styles.info_txt_s}>Продаж</p>
                            </div>
                            <div className={styles.container_info_s}>
                                <p className={styles.info_s}>{seller.products}</p>
                                <p className={styles.info_txt_s}>Товаров</p>
                            </div>
                            <div className={styles.container_info_s}>
                                <p className={styles.info_s}>{seller.joinedMonths}</p>
                                <p className={styles.info_txt_s}>Месяцев</p>
                            </div>
                        </div>
                        <button className={styles.but_seller}>Просмотреть товары</button>
                    </div>
                </div>
            ))}
        </>
    )
}