export default {
  /**
   * Перевод прошедшего UNIX времени в виде "00:00", для отображения в таймере
   * Второй параметр обычно Date.now
   */
  calculateElapsedTime: function(startTime, endTime) {
    let elapsedSeconds  = Math.floor((endTime - startTime)/1000);
    let elapsedMinutes  = Math.floor(elapsedSeconds/60);
  
    if (elapsedMinutes > 99) {
      return '99:99';
    } else {
      return ('0' + elapsedMinutes).slice(-2) + ':' + ('0' + (elapsedSeconds-elapsedMinutes*60)).slice(-2);
    }
  },
  /**
   * Получение актуального UNIX времени старта, для загрузки сохраненки
   * Первый параметр обычно Date.now
   */
  calculateUnixTimeBefore: function(currentUnix, elapsedSeconds) {
    return currentUnix - elapsedSeconds*1000;
  },
  /**
   * Перевод прошедшего UNIX времени в кол-во секунд, для выгрузки в сохраненку
   * Второй параметр обычно Date.now
   */
  calculateElapsedSeconds: function(startTime, endTime) {
    return Math.floor((endTime - startTime)/1000);
  }
}