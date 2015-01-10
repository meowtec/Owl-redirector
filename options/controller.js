var ruleTpl = {
  url: '',
  replacer: '',
  regex: false,
  type: 'url', // url, data, function
  enable: true,
  inTrash: false
}

function owlController($scope, $timeout) {
  $scope.version = window.OWL.version || ''
  $scope.rules = getData('rules')||[]
  $scope.globalSetting = getData('global')||{
    enable: true
  }
  $scope.editAble = false

  $scope.trashCount = 0
  $scope.rules.forEach(function(rule){
    if(rule.inTrash){
      $scope.trashCount++
    }
  })

  $scope.showAddClick = function(){
    this.stage = angular.copy(ruleTpl)
    this.editAble = true
    this.editType = 0
  }
  $scope.editCloseClick = function(){
    this.editAble = false
  }
  $scope.deleteItemClick = function(item){
    item.dropping = true
    $timeout(function(){
      item.inTrash = true
      $scope.trashCount ++
      $scope.latestTrash = item
      item.dropping = false
    }, 400)

  }
  $scope.editItemClick = function(item){
    $scope.stage = angular.copy(item)
    $scope.editAble = true
    $scope.editType = 1
    $scope.editingItem = item
  }
  $scope.editSubmitClick = function(){
    var stage = this.stage
    var rules = this.rules
    if(!stage.url) return
    if(!stage.regex){
      if(!new RegExp('^[a-zA-Z]+:\/\/').test(stage.url)){
        stage.url = 'http://' + stage.url
      }
      if(!new RegExp('\:\/\/.*/').test(stage.url)){
        stage.url = stage.url + '/'
      }
    }
    if(this.editType === 0){
      var prevented
      var exist = rules.some(function(rule, index) {
        if(rule.url === stage.url && rule.regex === stage.regex && !rule.inTrash){
          if(confirm('已经存在相同的规则，确认要导入吗？')){
            rules[index] = stage
          }else{
            prevented = true
          }
          return true
        }
      })
      if(prevented) return
      !exist && rules.push(stage)
    }else{
      replaceItem(rules, this.editingItem, stage)
    }
    this.editAble = false
    saveData('rules', angular.copy(this.rules))
  }
  $scope.itemUrlClick = function(rule){
    if(!rule.regex){
      window.open(rule.url)
    }
  }
  $scope.itemReplacerClick = function(rule){
    if(rule.type == 'url'){
      window.open(rule.replacer)
    }
  }
  // 0清空， 1恢复
  $scope.dealTrash = function(type){
    var rules = $scope.rules

    if(type == 0){
      $scope.rules = rules.filter(function(item){
        return !item.inTrash
      })
      $scope.trashCount = 0
    }else if(type == 1){
      rules.forEach(function(item){
        item.inTrash = false
      })
      $scope.trashCount = 0
    }else if(type == 2){
      if($scope.latestTrash){
        $scope.latestTrash.inTrash = false
        $scope.trashCount--
      }
    }
  }

  $scope.$watch('globalSetting.enable',
    function(to, from){
      saveData('global', $scope.globalSetting)
    }
  )
  $scope.$watch('rules',
    function(to, from){
      saveData('rules', angular.copy($scope.rules))
    },true
  )
  $scope.regstrExchange = function(){
    var stage = $scope.stage
    var regex = stage.regex,
      url = stage.url
    if(stage.url === ''){
      return
    }

    if(regex === true){
      stage.url = str2reg(stage.url)
    }else{
      stage.url = reg2str(stage.url)
    }
  }

  $scope.messages = {
    settingTitle: chrome.i18n.getMessage('settingTitle'),
    helpTitle: chrome.i18n.getMessage('helpTitle'),
    aboutTitle: chrome.i18n.getMessage('aboutTitle'),
    ruleListTitle: chrome.i18n.getMessage('ruleListTitle'),
    textareaplaceholder: {
      'url': chrome.i18n.getMessage('textareaPlaceholder_url'),
      'function': chrome.i18n.getMessage('textareaPlaceholder_function'),
      'data': chrome.i18n.getMessage('textareaPlaceholder_data')
    },
    regex: {
      true: chrome.i18n.getMessage('inputPlaceholder_regex'),
      false: chrome.i18n.getMessage('inputPlaceholder_url')
    },
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
