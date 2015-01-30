(function () {
  var ruleTpl = {
    url: '',
    replacer: '',
    urlType: 'url',
    type: 'url', // url, data, function
    enable: true,
    inTrash: false
  }

  function owlController($scope, $timeout) {
    $scope.version = window.OWL.version || ''
    $scope.rules = utils.getData('rules') || []
    $scope.globalSetting = utils.getData('global') || {
      enable: true
    }
    $scope.editBoxShow = false

    // 如果是正则，自动加上斜杠
    $scope.rules.forEach(function (item) {
      if (item.urlType === 'regex') {
        item.$url = '/' + (item.url || '') + '/'
      } else {
        item.$url = item.url
      }
    })

    $scope.trashCount = 0
    $scope.rules.forEach(function (rule) {
      if (rule.inTrash) {
        $scope.trashCount++
      }
    })

    $scope.showAddClick = function () {
      this.stage = angular.copy(ruleTpl)
      this.editBoxShow = true
      this.editType = 0
    }
    $scope.editCloseClick = function () {
      this.editBoxShow = false
    }
    $scope.deleteItemClick = function (item) {
      item.dropping = true
      $timeout(function () {
        item.inTrash = true
        $scope.trashCount++
        $scope.latestTrash = item
        item.dropping = false
      }, 400)

    }
    $scope.editItemClick = function (item) {
      $scope.stage = angular.copy(item)
      $scope.editBoxShow = true
      $scope.editType = 1
      $scope.editingItem = item
    }
    $scope.editSubmitClick = function () {
      var stage = this.stage
      var rules = this.rules
      if (!stage.$url) {
        return
      }

      var pattern = utils.getPattern(stage.$url)

      // 如果是正则，则需要检查是否合法
      if (pattern.type === 'regex' && !utils.getReg(pattern.data)) {
        return alert('你输入的正则不合法！')
      }

      stage.url = pattern.data
      stage.urlType = pattern.type

      if (stage.type === 'url') {
        if (/\s/.test(stage.replacer) && !window.confirm(chrome.i18n.getMessage('replacerUrlWrap'))) {
          return
        }
        stage.replacer = stage.replacer.replace(/\s/g, '')
      }

      if (stage.type === 'function' && !utils.testEvalFunc(stage.replacer)) {
        return window.alert(chrome.i18n.getMessage('functionError'))
      }

      if (this.editType === 0) {
        var prevented
        var exist = rules.some(function (rule, index) {
          if (rule.url === stage.url && rule.regex === stage.regex && !rule.inTrash) {
            if (window.confirm(chrome.i18n.getMessage('overwrite'))) {
              rules[index] = stage
            } else {
              prevented = true
            }
            return true
          }
        })
        if (prevented) {
          return
        }
        !exist && rules.push(stage)
      } else {
        utils.replaceItem(rules, this.editingItem, stage)
      }
      this.editBoxShow = false
      utils.saveData('rules', angular.copy(this.rules))
    }
    $scope.itemUrlClick = function (rule) {
      if (!rule.regex) {
        window.open(rule.url)
      }
    }
    $scope.itemReplacerClick = function (rule) {
      if (rule.type === 'url') {
        window.open(rule.replacer)
      }
    }
    // 0清空， 1恢复
    $scope.dealTrash = function (type) {
      var rules = $scope.rules

      if (type === 0) {
        $scope.rules = rules.filter(function (item) {
          return !item.inTrash
        })
        $scope.trashCount = 0
      } else if (type === 1) {
        rules.forEach(function (item) {
          item.inTrash = false
        })
        $scope.trashCount = 0
      } else if (type === 2) {
        if ($scope.latestTrash) {
          $scope.latestTrash.inTrash = false
          $scope.trashCount--
        }
      }
    }

    $scope.$watch('globalSetting.enable',
      function () {
        utils.saveData('global', $scope.globalSetting)
      }
    )
    $scope.$watch('rules',
      function () {
        utils.saveData('rules', angular.copy($scope.rules))
      }, true
    )
    $scope.toRegex = function () {
      $scope.stage.$url = '/' + utils.str2reg($scope.stage.$url || '') + '/'
    }

    $scope.messages = {
      settingTitle: chrome.i18n.getMessage('settingTitle'),
      helpTitle: chrome.i18n.getMessage('helpTitle'),
      aboutTitle: chrome.i18n.getMessage('aboutTitle'),
      ruleListTitle: chrome.i18n.getMessage('ruleListTitle'),
      textareaPlaceholder: {
        'url': chrome.i18n.getMessage('textareaPlaceholder_url'),
        'function': chrome.i18n.getMessage('textareaPlaceholder_function'),
        'data': chrome.i18n.getMessage('textareaPlaceholder_data')
      },
      urlPlaceholder: '输入URL/正则/URLMatch',
      submitButton: {
        0: chrome.i18n.getMessage('add'),
        1: chrome.i18n.getMessage('update')
      },
      itemEnable: {
        true: chrome.i18n.getMessage('toggleDisable'),
        false: chrome.i18n.getMessage('toggleEnable')
      },
      globalEnable: {
        true: chrome.i18n.getMessage('toggleDisableGlobal'),
        false: chrome.i18n.getMessage('toggleEnableGlobal')
      },
      author: chrome.i18n.getMessage('author'),
      homePage: chrome.i18n.getMessage('homePage'),
      version: chrome.i18n.getMessage('version'),
      'import': chrome.i18n.getMessage('import'),
      'export': chrome.i18n.getMessage('export'),
      close: chrome.i18n.getMessage('close'),
      bodyData: chrome.i18n.getMessage('bodyData'),
      'function': chrome.i18n.getMessage('function'),
      ruleEmptyTip: chrome.i18n.getMessage('ruleEmptyTip'),
      addNew: chrome.i18n.getMessage('addNew'),
      regex: chrome.i18n.getMessage('regex'),
      'delete': chrome.i18n.getMessage('delete'),
      'edit': chrome.i18n.getMessage('edit')
    }
  }

  this.owlController = owlController
}).call(this)
