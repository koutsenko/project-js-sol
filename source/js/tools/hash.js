/**
 * Предполагается, что я задаю два допустимых варианта хэша:
 *   - #deal:SEED
 *   - #load:CONFIG
 * Эта функция вернет deal, load или то, что выйдет при разборе недопустимого варианта.
 */
const getHashCmd = function() {
  return window.location.hash.substr(1, window.location.hash.length-1).split(':')[0];
};

/**
 * Вернет SEED, CONFIG или то, что выйдет при разборе недопустимого варианта.
 */
const getHashParm = function() {
  return window.location.hash.substr(1, window.location.hash.length-1).split(':')[1];
};

export { getHashCmd, getHashParm };