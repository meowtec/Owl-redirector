function getEval (str){
  return eval('(' + str + ')')
}
function toDataUrl(data) {
  return 'data:text/html,' + encodeURIComponent(data)
}
