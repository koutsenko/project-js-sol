/**
 * Предполагается, что я задаю допустимые варианта хэша:
 *   - #deal:SEED
 *   - #load:CONFIG
 *   - #dump
 * Эта функция вернет deal, load, dump или то, что выйдет при разборе недопустимого варианта.
 */
const getHashCmd = () => window.location.hash.substr(1, window.location.hash.length-1).split(':')[0];

/**
 * Вернет SEED, CONFIG или то, что выйдет при разборе недопустимого варианта.
 */
const getHashParm = () => window.location.hash.substr(window.location.hash.indexOf(':')+1);

export default { getHashCmd, getHashParm };
