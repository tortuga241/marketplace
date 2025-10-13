"use client";

import styles from "./styles/becomeS.module.css";
import { useState } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";

export default function BecomeS({ onBack, onSubmit, onChange, onNext, formData }) {
  const [description, setDescription] = useState(formData.description || "");
  const [category, setCategory] = useState(formData.category || "");
  const maxChars = 80;

  const categories = [
    "Образование",
    "Бизнес",
    "Технологии",
    "Маркетинг",
    "Дизайн",
    "Здоровье",
    "Личностный рост",
    "Финансы",
  ];

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    if (value.length <= maxChars) {
      setDescription(value);
      onChange("description", value);
    }
  };

  const handleNext = () => {
    if (description && category && onNext) {
      onNext();
    }
    onChange("discription", description);
    onChange("title", category);
  };

  return (
    <section className={styles.main_container_s}>
      <div className={styles.title_s}>
        <h3 className={styles.title_become_s}>О вашем магазине</h3>
        <p className={styles.title_txt_s}>Добавьте детали для покупателей</p>
      </div>
      <div className={styles.form_content}>
        <label className={styles.label_s}>Описание магазина <span>*</span></label>
        <textarea
          className={styles.textarea_s}
          placeholder="Расскажите, что вы продаете и почему покупатели должны выбрать вас..."
          value={description}
          onChange={handleDescriptionChange}
        />
        <p className={`${styles.char_count} ${ description.length === maxChars ? styles.limit_reached : "" }`}>
          {description.length}/{maxChars} символов
        </p>
        <label className={styles.label_s}> Категория <span>*</span></label>
        <select className={styles.select_s} value={category} onChange={(e) => {setCategory(e.target.value); onChange("category", e.target.value)}}>
          <option value="">Выберите категорию</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <div className={styles.btns_block}>
          <button onClick={onBack} className={styles.back_btn}><ArrowLeft size={18} /> Назад</button>
          <button className={styles.next_btn} onClick={handleNext} disabled={!description || !category}> Далее <ArrowRight size={18} /></button>
        </div>
      </div>
    </section>
  );
}
