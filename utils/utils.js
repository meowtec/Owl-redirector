var utils = {
  getEval: function  (str){
    return eval('(' + str + ')')
  },
  toDataUrl: function (str) {
    return 'data:text/plain;charset=utf-8;base64,' + btoa(window.unescape(encodeURIComponent(str)))
  }
}

window && (window.utils = utils)
