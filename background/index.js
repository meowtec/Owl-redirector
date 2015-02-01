/*
 * background 主文件
 * 读取 localstorage， 控制请求 redirect
 * 监听 options 等页面发来的通信信息，并重新读取
 * */
(function () {
  var utils = this.utils
  // download
  // 解决 download request 的递归请求
  var recursionDealCache = {}

  this.download = function download(url) {
    if (recursionDealCache[url]) {
      // TODO 是否移除 recursionDealCache[url]
      return
    }
    console.log('%cdownload:', 'color:#03a9f4', url)
    recursionDealCache[url] = true
    chrome.downloads.download({
      url: url
    })
  }

  var urlList, patternList, globalSetting

  function loadData(name) {
    if (!name || name === 'rules') {
      var ruleList = utils.getData('rules')
      urlList = {}
      patternList = []

      for (var i = ruleList.length - 1; i >= 0; i--) {
        var item = ruleList[i]
        if (item.inTrash || item.enable === false) {
          continue
        }
        if (item.urlType === 'url') { // url dict
          item.url = item.url.split('#')[0] // remove hash
          ;
          (new RegExp(':\/\/.*/').test(item.url)) || (item.url = item.url + '/') // add '/' after host; e.g. `http://www.baidu.com` -> `http://www.baidu.com/`
          if (urlList[item.url]) {
            continue
          }
          urlList[item.url] = item
        } else { // pattern
          patternList.push(item)

          // 如果是 regex pattern, 则转化为 RegExp 对象
          if (item.urlType === 'regex') {
            item.url = utils.getReg(item.url) || /^$/
          }

          // 如果是 url match pattern, 则转化为 UrlMatch
          if (item.urlType === 'url-match') {
            item.url = new utils.UrlMatch(item.url)
          }
        }

        if (item.type === 'function') {
          item.replacer = utils.getEval(item.replacer)
        } else if (item.type === 'data') {
          item.replacer = utils.toDataUrl(item.replacer)
        }
      }
    }

    if (!name || name === 'global') {
      globalSetting = utils.getData('global')
      if (globalSetting.enable) {
        ruleEnable()
      } else {
        ruleDisable()
      }
    }
  }

  function replaceUrl(url, item) {
    if (!item) {
      return
    }
    if (item.type === 'function') {
      var funcReturn = item.replacer(url)
      // 重定向
      if (funcReturn && typeof funcReturn === 'string' && funcReturn !== url) {
        return funcReturn
      }
      // 阻止
      if (funcReturn === '' || funcReturn === false) {
        return false
      }
      // 其他情况通过

    } else {
      return item.replacer || false
    }
  }

  // 获取匹配的规则
  function getMatchItem(url) {
    // 先从 URL 列表中掉
    if (urlList[url]) {
      return urlList[url]
    }
    // 再从匹配列表中找
    for (var i = 0; i < patternList.length; i++) {
      var item = patternList[i]
      if (item.url.test(url)) {
        return item
      }
    }
  }

  function beforeRequest(details) {
    var url = details.url.split('#')[0]
    var redirectUrl = replaceUrl(url, getMatchItem(url))
    // 重定向
    if (redirectUrl) {
      console.log('%credirect:', 'color:#ffc107', url, '\n        ->', redirectUrl)
      return {
        redirectUrl: redirectUrl
      }
    }
    // 被阻止
    if (redirectUrl === false) {
      console.log('%ccancel:', 'color:red', url)
      return {
        cancel: true
      }
    }
    // 直接请求
    console.log('%cdirect:', 'color:#8bc34a', url)
  }

  // 全局启用
  function ruleEnable() {
    ruleDisable()
    chrome.webRequest.onBeforeRequest.addListener(beforeRequest, {urls: ["<all_urls>"]}, ["blocking"])
  }

  // 全局禁用
  function ruleDisable() {
    chrome.webRequest.onBeforeRequest.removeListener(beforeRequest)
  }

  chrome.extension.onRequest.addListener(function (request) {
    if (request.ask === 'reload') {
      loadData(request.reload)
    }
  })
  chrome.extension.onRequest.addListener(function (request) {
    if (request.ask === 'reload') {
      loadData(request.reload)
    }
  })

  loadData()

}).call(this)
