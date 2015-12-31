(function (root) {
  var punycode = root.punycode

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
        reg = _char2reg(chars)
      }
      return '^' + str.replace(reg, '\\$&') + '$'
    }
  })()

  function UrlMatch(pattern) {
    // 结尾处的 * 表示若干层路径
    // 非结尾处的 * 表示一层路径
    var regstr = utils.str2reg(pattern, '*').replace(/\*([^\$])/g, '([^/]*)$1').replace(/\*\$/, '(.*)$')
    this.regex = new RegExp(regstr)
  }

  UrlMatch.prototype.test = function(content) {
    return this.regex.test(content)
  }

  UrlMatch.prototype.valueOf = function() {
    return this.regex
  }

  var utils = {
    $: function (selector) {
      return document.querySelector(selector)
    },

    $$: function (selector) {
      return document.querySelectorAll(selector)
    },

    getEval: function (str) {
      return eval('(' + str + ')')
    },
    getFunction: function (str) {
      var result
      try {
        result = this.getEval(str)
      } catch (e) {
      }

      if(typeof result === 'function') {
        return result
      }
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
        ask: "save",
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

    getReg: function (str) {
      var reg
      try {
        reg = new RegExp(str)
      } catch (e) {
        console.warn('正则表达式' + str + '有问题')
      }
      return reg
    },

    // 判断字符串是 regex, url-pattern 还是 url
    getPattern: function (str) {
      str = str || ''

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
        str = this.fixUrl(str).replace(/\\\*/g, '*') // \* -> *
        return {
          type: 'url',
          data: str
        }
      }
    },

    // 支持中文域名的 encodeURI
    encodeURI: function (url) {
      var schemeMatch = /^[a-zA-Z0-9\-]+:\/\// // 匹配 http://
      var domainMatch = /^.+?(?=[\/:])/ // 匹配 www.baidu.com

      var scheme = (url.match(schemeMatch) || 0)[0] || ''
      url = url.replace(schemeMatch, '')
      url = scheme + url.replace(domainMatch, function (domain) {
        domain = domain.toLowerCase()
        if (!/^[0-9a-z_\-\.]$/.test(domain)) {
          domain = punycode.toASCII(domain)
        }
        return domain
      })

      url = root.encodeURI(url)

      return url
    },

    fixUrl: function (url) {
      url = url.split('#')[0]
      if (!new RegExp('^[a-zA-Z]+:\/\/').test(url)) {
        url = 'http://' + url
      }
      if (!new RegExp(':\/\/.*/').test(url)) {
        url = url + '/'
      }

      return url
    },

    UrlMatch: UrlMatch
  }

  root.utils = utils

})(this)
