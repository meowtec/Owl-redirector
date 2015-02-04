// 更新
(function () {
  var globalSetting = utils.getData('global') || {}
  var rules = utils.getData('rules') || this.DEFALUT_RULES

  // 如果 globalSetting 中没有 build，或者没有 global setting
  // 说明是 1.1.3 版本以及以前
  // 则写入 build，并且升级 ruleList，即将 regex 字段改为 urlType
  if (!globalSetting.build) {
    rules.forEach(function (rule) {
      rule.urlType = rule.regex ? 'regex' : 'url'
      delete rule.regex
    })

    // 通知 options 页面重新加载
    setTimeout(function () {
      chrome.extension.sendRequest({
        ask: 'reload'
      })
    }, 0)
  }

  globalSetting.build = OWL.build

  if (globalSetting.enable == null) {
    globalSetting.enable = true
  }

  utils.saveData('global', globalSetting)
  utils.saveData('rules', rules)

}).call(this)
