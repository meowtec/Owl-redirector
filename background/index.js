/* tools */
/* download */
// 解决 download request 的递归请求
var recursionDealCache = {}
function download(url) {
  if (recursionDealCache[url]) {
    //delete recursionDealCache[url]
    return
  }
  console.log('%cdownload:', 'color:#03a9f4', url);
  recursionDealCache[url] = true
  chrome.downloads.download({
    url: url
  })
}

var urlList = {}
var regexList = {}


function loadData(name) {
  if (!name || name == 'rules') {
    var ruleList
    try {
      ruleList = JSON.parse(localStorage.getItem('rules')) || [];
    } catch (e) {
      ruleList = []
    }
    urlList = {};
    regexList = {};

    for (var i = ruleList.length - 1; i >= 0; i--) {
      var item = ruleList[i];
      if (item.inTrash || item.enable == false) {
        continue
      }
      if (item.regex) {
        if (regexList[item.url]) {
          continue
        }
        regexList[item.url] = item
        item.url = new RegExp(item.url)

      } else {
        item.url = item.url.split('#')[0] // remove hash
        ;(new RegExp('\:\/\/.*/').test(item.url)) || (item.url = item.url + '/') // add '/' after host; e.g. `http://www.baidu.com` -> `http://www.baidu.com/`
        if (urlList[item.url]) {
          continue
        }
        urlList[item.url] = item
      }
      if (item.type == 'function') {
        item.replacer = newFunction(item.replacer)
      } else if (item.type == 'data') {
        item.replacer = toDataUrl(item.replacer)
      }
    }
  }

  if (!name || name == 'global') {
    var globalSetting;
    try {
      globalSetting = JSON.parse(localStorage.getItem('global')) || {}
    } catch (e) {
      globalSetting = {}
    }
    if (globalSetting.enable) {
      ruleEnable();
    } else {
      ruleDisable();
    }
  }
}
loadData();

function replaceUrl(url, ruleItem) {
  var item = ruleItem;
  if (item.type == 'function') {
    var funcReturn = item.replacer(url)
    if (funcReturn === undefined) {
      return url
    } else {
      return item.replacer(url)
    }
  } else {
    return item.replacer
  }
}

function beforeRequest(details) {
  var url = details.url.split('#')[0]
  var redirectUrl
  if (urlList[url]) {
    redirectUrl = replaceUrl(url, urlList[url])
  } else {
    for (var r in regexList) {
      var item = regexList[r]
      if (item.url.test(url)) {
        var redirectUrl = replaceUrl(url, item)
        break
      }
    }
  }
  if (redirectUrl === '' || redirectUrl === false) {
    console.log('%ccancel:', 'color:red', url);
    return {
      cancel: true
    }
  } else if (redirectUrl && redirectUrl != url) {
    console.log('%credirect:', 'color:#ffc107', url, '\n       ->', redirectUrl);
    return {
      redirectUrl: redirectUrl
    }
  }
  console.log('%cdirect:', 'color:#8bc34a', url)
}

function ruleEnable() {
  ruleDisable();
  chrome.webRequest.onBeforeRequest.addListener(beforeRequest, {urls: ["<all_urls>"]}, ["blocking"]);
}
function ruleDisable() {
  chrome.webRequest.onBeforeRequest.removeListener(beforeRequest);
}


chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {
  if (request.ask == 'reload') {
    loadData(request.reload);
  }
});
chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {
  if (request.ask == 'reload') {
    loadData(request.reload);
  }
});
