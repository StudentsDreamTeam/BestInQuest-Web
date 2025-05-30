/**
 * Форматирует ISO строку или объект Date в 'ДД.ММ.ГГГГ ЧЧ:ММ'.
 * @param {string | Date} dateInput - Дата в виде ISO строки или объекта Date.
 * @returns {string} Отформатированная строка или "Не выбран" / "Ошибка даты".
 */
export const formatDeadlineForDisplay = (dateInput) => {
  if (!dateInput) return "Не выбран";
  try {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return "Ошибка даты";
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).replace(',', '');
  } catch (e) {
    console.error("Error formatting deadline for display:", e);
    return "Ошибка даты";
  }
};

/**
 * Форматирует ISO строку или объект Date в формат для datetime-local input ('YYYY-MM-DDTHH:mm').
 * Использует UTC компоненты даты для независимости от часового пояса.
 * @param {string | Date} isoString - Дата в виде ISO строки или объекта Date.
 * @returns {string} Строка для input[type="datetime-local"] или пустая строка.
 */
export const formatDateTimeForInput = (isoString) => {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return '';
    // Используем UTC методы для получения компонентов
    const year = date.getUTCFullYear();
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = date.getUTCDate().toString().padStart(2, '0');
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  } catch (e) {
    console.error("Error formatting date for input:", e);
    return '';
  }
};

/**
 * Конвертирует общее количество секунд в строку "ЧЧ:ММ".
 * @param {number} totalSeconds - Общее количество секунд.
 * @returns {string} Строка "ЧЧ:ММ" или "00:00".
 */
export const secondsToHHMM = (totalSeconds) => {
  if (totalSeconds === null || totalSeconds === undefined || totalSeconds < 0 || isNaN(totalSeconds)) return "00:00";
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

/**
 * Конвертирует строку "ЧЧ:ММ" в общее количество секунд.
 * @param {string} hhmmString - Строка в формате "ЧЧ:ММ".
 * @returns {number} Общее количество секунд или 0.
 */
export const hhMMToSeconds = (hhmmString) => {
  if (!hhmmString || typeof hhmmString !== 'string') return 0;
  const parts = hhmmString.split(':');
  if (parts.length !== 2) return 0;
  
  const hoursStr = parts[0];
  const minutesStr = parts[1];

  // Проверка, что строки содержат только цифры и имеют корректную длину
  if (!/^\d{1,2}$/.test(hoursStr) || !/^\d{2}$/.test(minutesStr)) {
    return 0;
  }

  const hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);

  // Дополнительная проверка на NaN (хотя regex уже должен это покрыть) и на диапазоны
  if (isNaN(hours) || isNaN(minutes) || hours < 0 || minutes < 0 || minutes > 59) {
    return 0;
  }
  // Часы могут быть > 23, если это просто подсчет общего времени, но для формата ЧЧ:ММ обычно 0-23.
  // Для большей строгости можно добавить hours > 23 (или hours > 99 если допускаем много часов) -> return 0
  // Оставим пока как есть, так как функция просто конвертирует.

  return hours * 3600 + minutes * 60;
};

/**
 * Форматирует продолжительность в секундах для отображения (напр., "1 ч 30 мин").
 * @param {number} totalSeconds - Общее количество секунд.
 * @returns {string} Отформатированная строка или "Не выбрана" / "0 мин".
 */
export const formatDurationForDisplay = (totalSeconds) => {
  if (typeof totalSeconds !== 'number' || isNaN(totalSeconds) || totalSeconds < 0) {
    return "Не выбрана";
  }
  if (totalSeconds === 0) return "0 мин";

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  let parts = [];
  if (hours > 0) parts.push(`${hours} ч`);
  if (minutes > 0) parts.push(`${minutes} мин`);

  return parts.length > 0 ? parts.join(' ') : "0 мин";
};

/**
 * Форматирует дату для отображения создания/обновления задачи (напр., "15 мая 2025, 18:54").
 * @param {string | Date} dateString - Дата в виде ISO строки или объекта Date.
 * @returns {string} Отформатированная строка или "Неверная дата".
 */
export const formatFullDateTime = (dateString) => {
    if (!dateString) return 'неизвестно';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Неверная дата'; // Проверка на валидность даты
    try {
        return date.toLocaleString('ru-RU', { // Используем объект date, который уже создан
            day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    } catch (e) {
        // Этот catch может быть достигнут, если toLocaleString сам по себе выдаст ошибку
        // на уже валидном объекте Date, что маловероятно для стандартных опций.
        console.error("Error in formatFullDateTime with toLocaleString:", e);
        return 'Неверная дата'; 
    }
};

/**
 * Форматирует дату для отображения в карточке задачи (напр., "мая 15, 18:54").
 * @param {string | Date} dateString - Дата в виде ISO строки или объекта Date.
 * @returns {string} Отформатированная строка или "Нет дедлайна" / исходная строка при ошибке.
 */
export const formatTaskCardDateTime = (dateString) => {
    if (!dateString) return 'Нет дедлайна';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) { // Проверка на валидность даты
        console.error("Invalid date input for formatTaskCardDateTime:", dateString);
        return dateString; // Возвращаем исходную строку, как и было в catch
    }
    try {
      return date.toLocaleString('ru-RU', { // Используем объект date
        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      });
    } catch (e) {
      console.error("Error formatting task card date:", e);
      return dateString; // fallback
    }
  };

/**
 * Форматирует продолжительность для карточки задачи (напр., "1 ч 30 мин", "45 мин", "5 сек").
 * @param {number} seconds - Продолжительность в секундах.
 * @returns {string} Отформатированная строка.
 */
export const formatTaskCardDuration = (seconds) => {
    if (typeof seconds !== 'number' || isNaN(seconds) || seconds < 0) {
      seconds = 0;
    }

    if (seconds < 60) {
      return `${seconds} сек`;
    }

    const hours = Math.floor(seconds / 3600);
    const remainingSeconds = seconds % 3600;
    const minutes = Math.floor(remainingSeconds / 60);

    if (hours > 0) {
      if (minutes > 0) {
        return `${hours} ч ${minutes} мин`;
      } else {
        return `${hours} ч`;
      }
    } else {
      return `${minutes} мин`;
    }
};