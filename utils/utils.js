var utils = {

  getEval: function (str) {
    return eval('(' + str + ')')
  },

  toDataUrl: function (str) {
    return 'data:text/plain;charset=utf-8,' + encodeURIComponent(str)
  },

  getData: function (name) {
    var result
    try {
      result = JSON.parse(localStorage.getItem(name))
    } catch (e) {}
    return result
  },

  saveData: function (name, data) {
    localStorage.setItem(name, angular.toJson(data))
    chrome.extension.sendRequest({
      ask: "reload",
      reload: name
    })
  },

  removeItem: function (array, item) {
    var index = array.indexOf(item)
    if (index !== -1) {
      array.splice(index, 1)
    }
  },

  replaceItem: function (array, item, itemNew) {
    var index = array.indexOf(item)
    array[index] = itemNew
  },

  str2reg: function (str) {
    return '^' + str.replace(/[\^\$\(\)\[\]\{\}\.\?\+\*\|\\\/]/g, '\\$&') + '$'
  },

  reg2str: function (regstr) {
    return regstr.replace(/\\([\^\$\(\)\[\]\{\}\.\?\+\*\|\\])/g, '$1').replace(/^\^|\$$/g, '')
  }

}
window && (window.utils = utils)
