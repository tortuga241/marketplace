"use client"
import styles from './styles.module.css';
import Header from '../components/Header';
import { Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react'; 
import axios from 'axios';
import { useSearchParams } from 'next/navigation';

//Import comps
import CardProduct from '../components/UI/catalog/cardProduct';
import Footer from '../components/footer';

export default function CatalogPage() {

    const searchParams = useSearchParams();
    const searchQuery = searchParams.get('q');

    const [allProducts, setAllProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const port = "http://localhost:3001";

    //GET запрос на вывод информации о всех товарах
    useEffect(() => {
      const fetchAllLots = async () => {
        try { 
          const response = await axios.get(`${port}/lots`);
          const productsWithGrades = response.data.map(lot => ({
            ...lot,
            price: lot.cost, 
            grade: lot.grade || (Math.random() * (5 - 3) + 3).toFixed(1),
            gradeNum: lot.gradeNum || Math.floor(Math.random() * 150) + 1,
          }));
          setAllProducts(productsWithGrades);
          setError(null);
        } catch (err) {
                console.error("Ошибка при загрузке каталога:", err);
                setError("Не удалось загрузить каталог товаров.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchAllLots();
    }, []);

const parsePrice = (priceString) => {
    return parseInt(priceString.replace(/\D/g, ''), 10);
};

  const [filters, setFilters] = useState({
    contentType: {
      video: false,
      document: false,
      article: false,
      code: false,
      audio: false
    },
    sortBy: 'newest',
    minRating: 'any',
    isExpanded: {
      type: true,
      sort: true,
      rating: true
    }
  });

  const toggleFilter = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      contentType: { 
          ...prev.contentType,
          [value]: !prev.contentType[value]
      }
    }));
  };

  const toggleSection = (section) => {
    setFilters(prev => ({
      ...prev,
      isExpanded: {
        ...prev.isExpanded,
        [section]: !prev.isExpanded[section]
      }
    }));
  };

  const handleSortChange = (value) => {
    setFilters(prev => ({
      ...prev,
      sortBy: value
    }));
  };

  const handleRatingChange = (value) => {
    setFilters(prev => ({
      ...prev,
      minRating: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      contentType: {
        video: false,
        document: false,
        article: false,
        code: false,
        audio: false
      },
      sortBy: 'newest',
      minRating: 'any',
      isExpanded: {
        type: true,
        sort: true,
        rating: true
      }
    });
  };

  

  const FilterCheckbox = ({ label, checked, onChange, value }) => (
    <label className={styles.filterCheckbox}>
      <input
        type="checkbox"
        checked={checked}
        // Изменяем onChange, чтобы он вызывал toggleFilter с правильными аргументами
        onChange={() => onChange('contentType', value)} 
        className={styles.checkboxInput}
      />
      <span className={styles.checkmark}></span>
      {label}
    </label>
  );

  const FilterRadio = ({ label, checked, onChange, value, name }) => (
    <label className={styles.filterRadio}>
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={() => onChange(value)}
        className={styles.radioInput}
      />
      <span className={styles.radiomark}></span>
      {label}
    </label>
  );

  // --- ЛОГИКА ФИЛЬТРАЦИИ И СОРТИРОВКИ ---
  const getFilteredAndSortedProducts = () => {
    let currentProducts = [...allProducts]; // Копируем массив для мутаций

    //Поиск из header через URL
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        currentProducts = currentProducts.filter(product =>
        product.title.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      );
    }

    // 1. ФИЛЬТРАЦИЯ ПО ТИПУ КОНТЕНТА
    const activeContentTypes = Object.keys(filters.contentType).filter(
      key => filters.contentType[key]
    );

    if (activeContentTypes.length > 0) {
      currentProducts = currentProducts.filter(product =>
        activeContentTypes.includes(product.type)
      );
    }

    // 2. ФИЛЬТРАЦИЯ ПО МИНИМАЛЬНОМУ РЕЙТИНГУ
    const minRatingValue = filters.minRating === 'any' ? 0 : parseFloat(filters.minRating);

    if (minRatingValue > 0) {
      currentProducts = currentProducts.filter(product =>
        product.grade >= minRatingValue
      );
    }

    // 3. СОРТИРОВКА
    switch (filters.sortBy) {
      case 'price_asc':
        currentProducts.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
        break;
      case 'price_desc':
        currentProducts.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
        break;
      case 'rating':
        // Сортировка по рейтингу (от большего к меньшему). 
        // Если рейтинг одинаковый, используем gradeNum для стабильности/вторичной сортировки.
        currentProducts.sort((a, b) => {
            if (b.grade !== a.grade) {
                return b.grade - a.grade;
            }
            return b.gradeNum - a.gradeNum; // Например, по количеству оценок
        });
        break;
      case 'newest':
      default:
        // В реальном приложении 'newest' требовал бы метку времени или ID
        // Пока оставляем как есть, что соответствует исходному порядку (по ID).
        currentProducts.sort((a, b) => a.id - b.id);
        break;
    }

    return currentProducts;
  };
  
  // Используем useMemo для кеширования результатов фильтрации/сортировки
  const finalProducts = useMemo(() => getFilteredAndSortedProducts(), [filters, allProducts, searchQuery]);

  // --- КОНЕЦ ЛОГИКИ ФИЛЬТРАЦИИ И СОРТИРОВКИ ---


  return (
    <div className={styles.main_container_cp}>
      <Header />
      <div className={styles.row_container_cp}>
        <div className={styles.filter_col_container}>
          <div className={styles.filter_txt_title}>
            <Filter size={20} color='purple'/> Фильтры
          </div>

          {/* Тип контента */}
          <div className={styles.type_filter_cp}>
            <div 
              className={styles.filterHeader}
              onClick={() => toggleSection('type')}
            >
              <span>Тип контента</span>
              {filters.isExpanded.type ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </div>
            
            {filters.isExpanded.type && (
              <div className={styles.filterContent}>
                <FilterCheckbox
                  label="Видео"
                  checked={filters.contentType.video}
                  onChange={toggleFilter}
                  value="video"
                />
                <FilterCheckbox
                  label="Документ"
                  checked={filters.contentType.document}
                  onChange={toggleFilter}
                  value="document"
                />
                <FilterCheckbox
                  label="Статья"
                  checked={filters.contentType.article}
                  onChange={toggleFilter}
                  value="article"
                />
                <FilterCheckbox
                  label="Код"
                  checked={filters.contentType.code}
                  onChange={toggleFilter}
                  value="code"
                />
                <FilterCheckbox
                  label="Аудио"
                  checked={filters.contentType.audio}
                  onChange={toggleFilter}
                  value="audio"
                />
              </div>
            )}
          </div>

          {/* Сортировка */}
          <div className={styles.sort_filter_cp}>
            <div 
              className={styles.filterHeader}
              onClick={() => toggleSection('sort')}
            >
              <span>Сортировка</span>
              {filters.isExpanded.sort ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </div>
            
            {filters.isExpanded.sort && (
              <div className={styles.filterContent}>
                <FilterRadio
                  label="Сначала новые"
                  checked={filters.sortBy === 'newest'}
                  onChange={handleSortChange}
                  value="newest"
                  name="sort"
                />
                <FilterRadio
                  label="Цена: по возрастанию"
                  checked={filters.sortBy === 'price_asc'}
                  onChange={handleSortChange}
                  value="price_asc"
                  name="sort"
                />
                <FilterRadio
                  label="Цена: по убыванию"
                  checked={filters.sortBy === 'price_desc'}
                  onChange={handleSortChange}
                  value="price_desc"
                  name="sort"
                />
                <FilterRadio
                  label="По рейтингу"
                  checked={filters.sortBy === 'rating'}
                  onChange={handleSortChange}
                  value="rating"
                  name="sort"
                />
              </div>
            )}
          </div>

          {/* Минимальный рейтинг */}
          <div className={styles.rating_filter_cp}>
            <div 
              className={styles.filterHeader}
              onClick={() => toggleSection('rating')}
            >
              <span>Минимальный рейтинг</span>
              {filters.isExpanded.rating ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </div>
            
            {filters.isExpanded.rating && (
              <div className={styles.filterContent}>
                <FilterRadio
                  label="Любой"
                  checked={filters.minRating === 'any'}
                  onChange={handleRatingChange}
                  value="any"
                  name="rating"
                />
                <FilterRadio
                  label="3+"
                  checked={filters.minRating === '3'}
                  onChange={handleRatingChange}
                  value="3"
                  name="rating"
                />
                <FilterRadio
                  label="4+"
                  checked={filters.minRating === '4'}
                  onChange={handleRatingChange}
                  value="4"
                  name="rating"
                />
                <FilterRadio
                  label="4.5+"
                  checked={filters.minRating === '4.5'}
                  onChange={handleRatingChange}
                  value="4.5"
                  name="rating"
                />
              </div>
            )}
          </div>

          <button className={styles.drop_filter} onClick={resetFilters}>
            Сбросить фильтры
          </button>
        </div>

        <div className={styles.product_container_cp}>
          <div className={styles.title_container_cp}>
            <h1 className={styles.title_txt_cp}>Каталог товаров</h1>
            {/* Обновляем количество найденных товаров */}
            <p className={styles.txt_title_cp}>Найдено {finalProducts.length} товаров</p>
          </div>
          <div className={styles.cards_container_cp}>
            {/* Динамическое отображение отфильтрованных и отсортированных товаров */}
            {finalProducts.map(product => (
                <CardProduct 
                    key={product.id}
                    product={product}
                />
            ))}
            {finalProducts.length === 0 && (
                <p className={styles.noResults}>
                    По вашим фильтрам ничего не найдено. Попробуйте изменить критерии поиска.
                </p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}