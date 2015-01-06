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
  $scope.rules = getData('rules')||[];
  $scope.globalSetting = getData('global')||{
    enable: true
  }
  $scope.editAble = false

  $scope.trashCount = 0;
  $scope.rules.forEach(function(rule){
    if(rule.inTrash){
      $scope.trashCount++;
    }
  })

  $scope.showAddClick = function(){
    this.stage = angular.copy(ruleTpl);
    this.editAble = true
    this.editType = 0
  }
  $scope.editCloseClick = function(){
    this.editAble = false;
  }
  $scope.deleteItemClick = function(item){
    item.dropping = true
    $timeout(function(){
      item.inTrash = true
      $scope.trashCount ++;
      $scope.latestTrash = item;
      item.dropping = false;
    }, 400)

  }
  $scope.editItemClick = function(item){
    $scope.stage = angular.copy(item);
    $scope.editAble = true;
    $scope.editType = 1;
    $scope.editingItem = item;
  }
  $scope.editSubmitClick = function(){
    var stage = this.stage
    for(var i=0;i<this.rules.length;i++){
      var rule = this.rules[i]
      if(rule.url == stage.url && rule.regex == stage.regex){
        // repeat
      }
    }
    if(this.editType == 0){
      this.rules.push(stage);
    }else{
      replaceItem(this.rules, this.editingItem, stage);
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
    var rules = $scope.rules;

    if(type == 0){
      $scope.rules = rules.filter(function(item){
        return !item.inTrash
      })
      $scope.trashCount = 0;
    }else if(type == 1){
      rules.forEach(function(item){
        item.inTrash = false
      })
      $scope.trashCount = 0;
    }else if(type == 2){
      if($scope.latestTrash){
        $scope.latestTrash.inTrash = false
        $scope.trashCount--
      }
    }
  }

  $scope.$watch('globalSetting.enable',
    function(to, from){
      saveData('global', $scope.globalSetting);
    }
  );
  $scope.$watch('rules',
    function(to, from){
      saveData('rules', angular.copy($scope.rules))
    },true
  );
  $scope.regstrExchange = function(){
    var stage = $scope.stage
    var regex = stage.regex,
      url = stage.url;
    if(stage.url === ''){
      return
    }

    if(regex === true){
      stage.url = str2reg(stage.url)
    }else{
      stage.url = reg2str(stage.url)
    }
  }

  $scope.writing = {
    textareaplaceholder: {
      'url': '输入替换后的 url，如果什么都不填则表示被阻止访问',
      'function': '输入要替换原 url 的函数，函数参数 url 为原 url，函数返回值为替换后的新 url，如:\n\nfunction(url){\n  return url+\'#myhash\'\n}',
      'data': '输入新的 body 数据。此数据将被编码为 data URL，并将原来的请求重定向到这个 data URL。\n你可以使用此功能直接修改网页中的外链 css 或者 js（含 jsonp）。\n由于 ajax 默认不能跨域访问 data URL，你无法使用本功能直接修改 ajax 数据。'
    },
    regex: {
      true: '输入正则，符合此正则的请求将被重定向',
      false: '输入url，此url将被重定向'
    },
    submitButton: {
      0: '添加',
      1: '更新'
    },
    itemEnable: {
      true: '点击禁用',
      false: '点击启用'
    },
    globalEnable: {
      true: '点击全局禁用',
      false: '点击全局启用'
    }
  }
}
