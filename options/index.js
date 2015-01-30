$(function () {
  $('body').on('mousedown', 'button,input[type="radio"]', function (e) {
    e.preventDefault()
  })

  /*  nav  */
  var $mainSections = $('#main-container').find('.main-section')
  var $nav = $('#nav-list')
  var $navItems = $nav.find('li')
  $nav.on('click', 'button', function () {
    var target = $(this).attr('tab-target')
    $mainSections.hide()
    $(target).show()
    $navItems.removeClass('selected')
    $(this).parent().addClass('selected')
    $(window).focus()
  })

  $('#J-backup-import').find('input').change(function () {
    var file = $(this)[0].files[0]
    var reader = new FileReader()
    reader.readAsText(file)
    reader.onload = function () {
      var text = reader.result
      var data = null
      try {
        data = JSON.parse(text)
      } catch (e) {
      }

      if (!data || !data.build) {
        window.alert(chrome.i18n.getMessage('importError'))
        return
      }
      if (!window.confirm(chrome.i18n.getMessage('importWarn'))) {
        return
      }
      var rules = []
      try {
        rules = JSON.parse(localStorage.getItem('rules'))
      } catch (e) {
      }

      // >= 0.1.3 升级到 0.2.0
      if (data.build <= 3) {
        data.rules.forEach(function (rule) {
          rule.urlType = rule.regex ? 'regex' : 'url'
          delete rule.regex
        })
      }
      // end

      rules = rules.concat(data.rules)
      localStorage.setItem('rules', JSON.stringify(rules))
      document.location.reload()
    }
  })

  $('#J-backup-export').click(function () {
    var rules = []
    try {
      rules = JSON.parse(localStorage.getItem('rules'))
    } catch (e) {
    }
    rules = rules.filter(function (rule) {
      return !rule.inTrash
    })
    var data = {
      build: window.OWL.build,
      rules: rules
    }
    var text = JSON.stringify(data)
    var dataUrl = utils.toDataUrl(text)
    var link = document.createElement('a')
    link.download = 'owl-' + new Date().toISOString() + '.bac'
    link.href = dataUrl
    link.click()
  })
  $('#J-trash').html(chrome.i18n.getMessage('trash'))
})

// 应用升级时需要重新加载 options 页面
chrome.extension.onRequest.addListener(function (request) {
  if (request.ask === 'reload') {
    location.reload()
  }
})
