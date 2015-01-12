function getData(name) {
  var rawdata = localStorage.getItem(name)
  try {
    return JSON.parse(rawdata)
  } catch (variable) {
    return
  }
}

function saveData(name, data) {
  localStorage.setItem(name, angular.toJson(data))
  chrome.extension.sendRequest({
      ask: "reload",
      reload: name
  })
}

function removeItem(array, item){
  var index = array.indexOf(item)
  if(index!=-1){
    array.splice(index, 1)
  }
}

function replaceItem(array, item, itemNew){
  var index = array.indexOf(item)
  array[index] = itemNew
}

var str2reg = (function(){
  var specialChars = /[\^\$\(\)\[\]\{\}\.\?\+\*\|\\\/]/g
  return function str2reg(str){
    return '^' + str.replace(specialChars, '\\$&') + '$'
  }
})()

var reg2str = (function(){
  var specialCharsSlash = /\\([\^\$\(\)\[\]\{\}\.\?\+\*\|\\])/g
  return function reg2str(regstr){
    return regstr.replace(specialCharsSlash, '$1').replace(/^\^|\$$/g,'')
  }
})()

var getEval = (function(){
  var getReturn = function (arg){
    return arg
  }
  return function (str){
    return eval('getReturn(' + str + ')')
  }
})()

function testEvalFunc(str) {
  var func
  try{
    func = getEval(str)
  }catch(e){}
  return typeof func === 'function'
}
