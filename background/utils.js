var getEval = (function(){
  var getReturn = function (arg){
    return arg
  }
  return function (str){
    return eval('getReturn(' + str + ')')
  }
})()
function toDataUrl(data) {
  return 'data:text/html,' + encodeURIComponent(data)
}
