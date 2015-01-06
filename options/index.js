window.OWL = {
  version: '0.1.1',
  build: 1
}
$(function(){
  $('body').on('mousedown', 'button,input[type="radio"]', function(e){
    e.preventDefault();
  })
  /*  nav  */
  var $mainSections = $('#main-container .main-section');
  var $navItems = $('#nav-list li');
  $('#nav-list').on('click', 'button', function() {
    var target = $(this).attr('tab-target');
    $mainSections.hide();
    $(target).show();
    $navItems.removeClass('selected');
    $(this).parent().addClass('selected');
    $(window).focus();
  });

  $('#J-backup-import input').change(function(){
    var file = $(this)[0].files[0]
    var reader = new FileReader()
    reader.readAsText(file)
    reader.onload = function(){
      var text = reader.result
      var data = null
      try{
        data = JSON.parse(text)
      }catch(e){}

      if(!data || !data.build){
        alert('备份文件无效！')
        return
      }
      if(!window.confirm('请不要随便导入未知文件，除非你能够确定它是安全的。你确定导入该文件吗？')){
        return
      }
      var rules = []
      try{
        rules = JSON.parse(localStorage.getItem('rules'))
      }catch(e){}
      rules = rules.concat(data.rules)
      localStorage.setItem('rules', JSON.stringify(rules))
      document.location.reload()
    }
  })

  $('#J-backup-export').click(function(){
    var rules = []
    try{
      rules = JSON.parse(localStorage.getItem('rules'))
    }catch(e){}
    rules = rules.filter(function(rule){
      return !rule.inTrash
    })
    var data = {
      build: window.OWL.build,
      rules: rules
    }
    var text = JSON.stringify(data)
    var dataUrl = 'data:text/plain;charset=utf-8;base64,' + btoa(unescape(encodeURIComponent(text)))
    var link = document.createElement('a')
    link.download = 'owl-' + new Date().toISOString() + '.bac'
    link.href = dataUrl
    link.click()
  })
})
