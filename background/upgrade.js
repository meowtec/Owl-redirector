// 更新
(function (root) {
  var utils = root.utils

  var globalSetting = utils.getData('global') || {}
  var rules = utils.getData('rules') || root.DEFALUT_RULES

  if (globalSetting.build !== root.OWL.build) {
    /* 修复 google url 问题*/
    rules.some(function(rule) {
      if (rule.replacer === '/* Google 结果页面直接跳转 */\nfunction (url){\n  var matchResult = url.match(/&url=([^&]+).*/)\n  return matchResult && decodeURIComponent(matchResult[1])\n}') {
        rule.replacer = DEFALUT_RULES[0].replacer
        setTimeout(function () {
          chrome.extension.sendRequest({
            ask: 'reload'
          })
        }, 0)
        return true
      }
    })  
  }

  globalSetting.build = root.OWL.build

  if (globalSetting.enable == null) {
    globalSetting.enable = true
  }

  utils.saveData('global', globalSetting)
  utils.saveData('rules', rules)

})(this)
