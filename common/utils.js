(function () {

  var str2reg = (function () {
    // '.*^' -> /[\.\*\^]/
    var _char2reg = function (chars) {
      return new RegExp('[' + chars.replace(/./g, function (char) {
        return '\\' + char
      }) + ']', 'g')
    }

    var defaultChars = '/\\^$-{}[]()*.?|'
    var defaultReg = _char2reg(defaultChars)

    return function str2reg(str, escape) {
      var chars = defaultChars
      var reg = defaultReg
      if (escape) {
        // 排除 escape 中的字符
        chars = chars.replace(_char2reg(escape), '')
        console.log(_char2reg(escape))

        reg = _char2reg(chars)
      }
      return '^' + str.replace(reg, '\\$&') + '$'
    }
  })()

  function UrlMatch(pattern) {
    var regstr = utils.str2reg(pattern, '*').replace(/\*([^\$])/g, '[^/]*$1').replace(/\*\$/, '.*$')
    this.regex = new RegExp(regstr)
  }

  UrlMatch.prototype.test = function (content) {
    return this.regex.test(content)
  }

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
      } catch (e) {
      }
      return result
    },

    saveData: function (name, data) {
      var json = typeof angular === 'undefined' ? JSON.stringify(data) : angular.toJson(data)
      localStorage.setItem(name, json)
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

    str2reg: str2reg,

    reg2str: function (regstr) {
      return regstr.replace(/\\([\^\$\(\)\[\]\{\}\.\?\+\*\|\\])/g, '$1').replace(/^\^|\$$/g, '')
    },

    // 判断字符串是 regex, url-pattern 还是 url
    getPattern: function (str) {
      var isReg = /^\/(.*)\/$/
      if (isReg.test(str)) {
        return {
          type: 'regex',
          data: str.match(isReg)[1]
        }
      } else if (/([^\\]|^)\*/.test(str)) {
        return {
          type: 'url-match',
          data: str
        }
      } else {
        str = str.replace(/\\\*/g, '*')
        if (!new RegExp('^[a-zA-Z]+:\/\/').test(str)) {
          str = 'http://' + str
        }
        if (!new RegExp(':\/\/.*/').test(str)) {
          str = str + '/'
        }
        return {
          type: 'url',
          data: str
        }
      }
    },

    UrlMatch: UrlMatch
  }

  this.utils = utils

}).call(this)