'use client';

import { useState, useRef } from 'react';
import styles from './styles.module.css';

import QRCodeGenerator from '../components/UI/buyProduct/qr';

export default function BuyProduct() {
    const [currentStep, setCurrentStep] = useState(1); // Начинаем с первого шага
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [canResend, setCanResend] = useState(true);
    const [resendText, setResendText] = useState('Отправить код повторно');
    const inputRefs = useRef([]);

    const totalSteps = 3;
    const userEmail = 'example@gmail.com';

    // Обновление прогресс-бара
    const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

    // Обработка ввода кода
    const handleCodeInput = (value, index) => {
        if (!/^\d?$/.test(value)) return;

        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        // Автопереход к следующему полю
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    // Обработка Backspace
    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    // Вставка из буфера обмена
    const handlePaste = (e) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData('text').slice(0, 6);
        const newCode = [...code];
        
        pasteData.split('').forEach((char, i) => {
            if (/^\d$/.test(char) && i < 6) {
                newCode[i] = char;
            }
        });
        
        setCode(newCode);
        
        // Фокус на последнее заполненное поле
        const lastFilledIndex = newCode.findIndex(val => val === '');
        const focusIndex = lastFilledIndex === -1 ? 5 : Math.min(lastFilledIndex, 5);
        inputRefs.current[focusIndex]?.focus();
    };

    // Проверка заполненности кода
    const isCodeComplete = code.every(digit => digit !== '');

    // Отправка кода повторно
    const handleResendCode = () => {
        if (!canResend) return;

        setCanResend(false);
        setResendText('Код отправлен!');

        // Сброс через 30 секунд
        setTimeout(() => {
            setCanResend(true);
            setResendText('Отправить код повторно');
        }, 30000);
    };

    // Навигация
    const nextStep = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const previousStep = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
        }
    };

    // Рендер шагов прогресса
    const renderSteps = () => {
        return Array.from({ length: totalSteps }, (_, i) => i + 1).map(step => (
            <div
                key={step}
                className={`${styles.step} ${
                    step < currentStep 
                        ? styles.completed 
                        : step === currentStep 
                        ? styles.active 
                        : ''
                }`}
            >
                {step < currentStep ? '✓' : step}
            </div>
        ));
    };

    // Рендер контента для текущего шага
    const renderStepContent = () => {
        switch (currentStep) {
            case 1: // Теперь это первый шаг - подтверждение email
                return (
                    <div className={styles.step_content}>
                        <h2>Подтверждение Email</h2>
                        <p className={styles.subtitle}>
                            Код отправлен на: <span className={styles.email_highlight}>{userEmail}</span>
                        </p>
                        <p className={styles.subtitle}>
                            Введите 6-значный код из письма для подтверждения покупки
                        </p>

                        <div className={styles.code_inputs}>
                            {code.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={el => inputRefs.current[index] = el}
                                    type="text"
                                    className={`${styles.code_input} ${digit ? styles.filled : ''}`}
                                    value={digit}
                                    maxLength={1}
                                    onChange={(e) => handleCodeInput(e.target.value, index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    onPaste={handlePaste}
                                />
                            ))}
                        </div>

                        <div className={styles.resend_link}>
                            <button 
                                onClick={handleResendCode}
                                disabled={!canResend}
                                className={canResend ? '' : styles.disabled}
                            >
                                {resendText}
                            </button>
                        </div>

                        <div className={styles.buttons}>
                            <button className={styles.btn_back} onClick={previousStep} disabled={currentStep === 1}>
                                Назад
                            </button>
                            <button 
                                className={styles.btn_next} 
                                onClick={nextStep}
                                disabled={!isCodeComplete}
                            >
                                Далее →
                            </button>
                        </div>
                    </div>
                );
            
            case 2:
                return (
                    <div className={styles.step_content}>
                        <h2>Данные доставки</h2>
                        <p className={styles.subtitle}>Укажите адрес и способ доставки</p>
                        <div className={styles.buttons}>
                            <button className={styles.btn_back} onClick={previousStep}>
                                Назад
                            </button>
                            <button className={styles.btn_next} onClick={nextStep}>
                                Далее →
                            </button>
                        </div>
                    </div>
                );
            
            case 3:
                return (
                    <div className={styles.step_content}>
                        <h2>Способ оплаты</h2>
                        <div className={styles.subtitle}><QRCodeGenerator /></div>
                        <div className={styles.buttons}>
                            <button className={styles.btn_back} onClick={previousStep}>
                                Назад
                            </button>
                            <button className={styles.btn_next} onClick={nextStep}>
                                Далее →
                            </button>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className={styles.main_buy_product}>
            <div className={styles.obertka_container}>
                <div className={styles.progress_container}>
                    <div className={styles.progress_line}></div>
                    <div 
                        className={styles.progress_fill} 
                        style={{ width: `${progressPercentage}%` }}
                    ></div>
                    {renderSteps()}
                </div>

                {renderStepContent()}
            </div>
        </div>
    );
}