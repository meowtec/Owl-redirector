// 默认设置
window.DEFALUT_RULES = [{
  "url": "^https?://www.google.com(\\..+)?/url*",
  "replacer": "/* Google 结果页面直接跳转 */\nfunction (url){\n  var matchResult = url.match(/&url=([^&]+).*/)\n  var urlArg = matchResult && decodeURIComponent(matchResult[1])\n  if (/^http/.test(urlArg)) {return urlArg}\n}",
  "urlType": "regex",
  "type": "function"
}, {
  "url": "^https?:\\/\\/(((ajax|fonts)\\.googleapis\\.com)|(themes\\.googleusercontent\\.com)|(fonts\\.gstatic\\.com))\\/",
  "replacer": "/* Google 资源国内 CDN */\nfunction (url){\n  return url.replace('googleapis.com', 'lug.ustc.edu.cn')\n            .replace('themes.googleusercontent.com', 'google-themes.lug.ustc.edu.cn')\n            .replace('fonts.gstatic.com', 'fonts-gstatic.lug.ustc.edu.cn')\n}",
  "urlType": "regex",
  "type": "function"
}, {
  "url": "http://fc.5sing.com/*",
  "replacer": "function (url){\n  var matchResult = url.match(/^http:\\/\\/fc\\.5sing\\.com\\/(\\d+)\\.html.*$/)\n  return 'http://5sing.kugou.com/fc/' + matchResult[1] + '.html'\n}",
  "urlType": "url-match",
  "type": "function"
}, {
  "url": "http://www.google-analytics.com/analytics.js",
  "replacer": "",
  "urlType": "url",
  "type": "url"
}, {
  "url": "http*://hm.baidu.com/h.js*",
  "replacer": "",
  "urlType": "url-match",
  "type": "url"
}, {
  "url": "http://w.cnzz.com/*",
  "replacer": "",
  "urlType": "url-match",
  "type": "url"
}, {
  "url": "http://pagead2.googlesyndication.com/pagead/show_ads.js",
  "replacer": "",
  "urlType": "url",
  "type": "url"
}, {
  "url": "http://www.badu.com/",
  "replacer": "http://www.baidu.com",
  "urlType": "url",
  "type": "url"
}, {
  "url": "http://a.example.com/",
  "replacer": "function(url){\n  console.log(url) // 'http://a.example.com/'\n  \n  // 1. 返回 undefined，不跳转:\n  // return\n\n  // 2. 返回字符串，跳转到字符串所指的URL:\n  // return 'http://b.example.com/' \n\n  // 3. 返回''或者false，请求被阻止:\n  // return ''\n  // return false\n\n  return false\n}",
  "urlType": "url",
  "type": "function"
}]
