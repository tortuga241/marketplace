import { FileText, Video, BookOpen, Code, Briefcase, Palette, TrendingUp } from 'lucide-react';
import styles from './styles/category.module.css';

export default function Category() {
    const categories = [
        {
            icon: FileText,
            title: "Документы",
            description: "Шаблоны, формы, презентации",
            count: "250+ товаров",
            color: "#3B82F6",
        },
        {
            icon: Video,
            title: "Видео курсы",
            description: "Обучающие материалы и уроки",
            count: "180+ курсов",
            color: "#EF4444", 
        },
        {
            icon: BookOpen,
            title: "Статьи и гайды",
            description: "Подробные руководства",
            count: "320+ статей",
            color: "#22C55E",
        },
        {
            icon: Code,
            title: "Код и скрипты",
            description: "Готовые решения и библиотеки",
            count: "150+ проектов",
            color: "#A855F7", 
        },
        {
            icon: Briefcase,
            title: "Бизнес",
            description: "Планы, стратегии, анализы",
            count: "120+ материалов",
            color: "#F97316",
        },
        {
            icon: Palette,
            title: "Дизайн",
            description: "Макеты, иконки, ресурсы",
            count: "200+ ресурсов",
            color: "#EC4899",
        }
    ];

    return (
        <>
            {categories.map((category, index) => {
                const Icon = category.icon;
                return (
                    <section key={index} className={styles.main_categor_cart}>
                        <div className={styles.container_categor_cart}>
                            <div className={`${styles.icon_categor_cart}`}>
                                <Icon size={25} style={{ color: category.color }}/>
                            </div>
                            <div className={styles.categor_cart_txt}>
                                <h4 className={styles.h4_categor_cart}>{category.title}</h4>
                                <p className={styles.categor_tags}>{category.description}</p>
                            </div>
                        </div>
                        <div className={styles.decoration_container}></div>
                        <div className={styles.container_bot_categor}>
                            <p className={styles.product_number_categor}>{category.count}</p>
                            <TrendingUp className={styles.icon_left} width={18} height={18}/>
                        </div>
                    </section>
                )
            })}
        </>
    )
}
