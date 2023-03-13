var month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
getDateAndTime = function getDateAndTime(str) {
  let date = new Date(str);
  return 
    `${date.getDate()} ${month[date.getMonth()]}, ${date.getHours()}:${date.getMinutes()}`
}