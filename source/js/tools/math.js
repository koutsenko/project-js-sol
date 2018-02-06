/**
 * https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Math/random
 * Метод возвращает случайное целое число [min, max). Это версия БЕЗ псевдорандома.
 */
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min)) + min;

export default { getRandomInt };
