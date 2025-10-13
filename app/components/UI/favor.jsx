import styles from './styles/favor.module.css';

export default function FavoriteCard() {

    const favorite = [
        {
            id: 1,
            title: "Курсы по програмированию Python",
            type: "Видео",
            price: "40,000₸"
        },
        {
            id: 2,
            title: "Курсы по програмированию JavaScript",
            type: "Видео",
            price: "68,000₸"
        },
        {
            id: 3,
            title: "Курсы по дизайну",
            type: "Видео",
            price: "20,000₸"
        },
        {
            id: 4,
            title: "Документация к CorolDraw",
            type: "Документ",
            price: "10,000₸"
        }
    ]
    
    return (
        <>
            {favorite.map((favor) => (
                <section key={favor.id} className={styles.container_card_favor}>
                    <p className={styles.title_card_favor}>{favor.title}</p>
                    <div className={styles.type_favor}>{favor.type}</div>
                    <p className={styles.favor_price}>{favor.price}</p>
                    <button className={styles.but_favor}>Купить</button>
                </section>
            ))}
        </>
    )
}