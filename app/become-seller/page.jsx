"use client";

import { useState } from "react";
import styles from "./style.module.css";
import { CheckCircle2 } from "lucide-react"; 
import axios from "axios";

import BecomeF from "../components/UI/becomeShop/becomeF";
import BecomeS from "../components/UI/becomeShop/becomeS";
import BecomeT from "../components/UI/becomeShop/becomeT";

export default function BecomeSeller() {

  const host = process.env.NEXT_PUBLIC_HOST;

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    type: "",
    category: "",
    title: "",
    description: "",
    phone: "",
  })

  // смена шага
  const handleNext = () => step < 3 && setStep(step + 1);
  const handlePrev = () => step > 1 && setStep(step - 1);

  // обновление данных формы
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };


const handleSubmit = async () => {
  try {
    const response = await axios.post(`${host}/shop/create`,
      {
        type: formData.type,
        category: formData.category,
        title: formData.title,
        description: formData.description,
        phone: formData.phone,
      },
      {
        withCredentials: true, 
      }
    );

    console.log("Магазин создан:", response.data);
    alert("Магазин успешно создан!");
  } catch (error) {
    console.error("Ошибка при создании магазина:", error);
    if (error.response?.status === 401) {
      alert("Не авторизован. Войдите в систему.");
      window.location.href = '/register';
    } else {
      alert("Ошибка при создании магазина");
    }
  }
};



  // выбор шага
  const renderStep = () => {
    switch (step) {
      case 1:
        return <BecomeF onNext={handleNext} onChange={handleChange} formData={formData}/>;
      case 2:
        return <BecomeS onNext={handleNext} onBack={handlePrev} onChange={handleChange} formData={formData}/>;
      case 3:
        return <BecomeT onBack={handlePrev} onSubmit={handleSubmit} onChange={handleChange} formData={formData}/>;
      default:
        return null;
    }
  };

  return (
    <div className={styles.main_become}>
      <div className={styles.main_container_become}>
        <div className={styles.title_container}>
          <h1 className={styles.title_become}>Начать продавать</h1>
          <p className={styles.title_txt_become}>
            Создайте свой магазин и начните зарабатывать на цифровых товарах
          </p>
        </div>

        {/* Прогресс */}
        <div className={styles.decor_container_become}>
          {[1, 2, 3].map((num) => (
            <div key={num} className={styles.step_wrapper}>
              <div
                className={`${styles.curcle_decor} ${
                  step === num
                    ? styles.curcle_active
                    : step > num
                    ? styles.curcle_done
                    : ""
                }`}
              >
                {step > num ? (
                  <CheckCircle2 size={20} color="white" />
                ) : (
                  num
                )}
              </div>
              {num !== 3 && (
                <div
                  className={`${styles.decor_container} ${
                    step > num ? styles.line_active : ""
                  }`}
                ></div>
              )}
            </div>
          ))}
        </div>

        <div className={styles.step_content}>{renderStep()}</div>
      </div>
    </div>
  );
}
