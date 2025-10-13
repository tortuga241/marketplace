"use client"

import styles from './styles/becomeF.module.css';
import Link from 'next/link';
import { Store, FileText, Video, BookOpen, ArrowRight, ArrowLeft } from "lucide-react";
import { useState, useEffect } from 'react';

export default function BecomeF({ onChange, onNext, onBack, formData }) {

    const [selectedType, setSelectedType] = useState(formData.type || "");
    const [error, setError] = useState('');

    useEffect(() => {
        if (formData.type) setSelectedType(formData.type);
    }, [formData.type]);

    const handleNext = () => {
        if (!selectedType) {
            setError('Все поля обязательны для заполнения');
        } else {
            setError('');
            onNext();
        }
    };
    
    const handleSelect = (type) => {
        setSelectedType(type);
        onChange("type", type);
        setError('');
    };

    return (
        <section className={styles.main_container_f}>
            <div className={styles.title_f}>
                <h3 className={styles.title_become_f}>Основная информация</h3>
                <p className={styles.title_txt_f}>Расскажите о своем магазине</p>
            </div>
            <div className={styles.type_f_container}>
                <p className={styles.type_f_txt}>Вид деятельности:</p>
                <div className={styles.grid_container}>
                    {/* Первая карточка */}
                    <div className={`${styles.card_f} ${selectedType === 'Продажа кода' ? styles.active_card : ''}`}
                        onClick={() => handleSelect("Продажа кода")}>
                        <FileText width={24} height={24} style={{color: '#7c3aed'}}/>
                        <p className={styles.txt_card_f}>Продажа кода</p>
                    </div>
                    {/* Вторая карточка */}
                    <div className={`${styles.card_f} ${selectedType === 'Продажа видео' ? styles.active_card : ''}`}
                        onClick={() => handleSelect("Продажа видео")}>
                        <Video width={24} height={24} style={{color: '#7c3aed'}}/>
                        <p className={styles.txt_card_f}>Продажа видео</p>
                    </div>
                    {/* Третья карточка */}
                    <div className={`${styles.card_f} ${selectedType === 'Продажа статей' ? styles.active_card : ''}`}
                        onClick={() => handleSelect("Продажа статей")}>
                        <BookOpen width={24} height={24} style={{color: '#7c3aed'}}/>
                        <p className={styles.txt_card_f}>Продажа статей</p>
                    </div>
                    {/* Четвертая карточка */}
                    <div className={`${styles.card_f} ${selectedType === 'Продажа документов' ? styles.active_card : ''}`}
                        onClick={() => handleSelect("Продажа документов")}>
                        <Store width={24} height={24} style={{color: '#7c3aed'}}/>
                        <p className={styles.txt_card_f}>Продажа документов</p>
                    </div>
                </div>
            </div>
            <div className={styles.row_container_f}>
                <Link href="/"><button className={styles.but_f}><ArrowLeft width={16} height={16} />Назад</button></Link>
                <button onClick={handleNext} className={styles.but_f}>Вперед <ArrowRight width={16} height={16} /></button>
            </div>
        </section>
    )
}