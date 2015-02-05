(function (root) {
  angular.module('owlApp', []).filter('listFilter', function () {
    return function (items) {
      var trashCount = 0
      var returnList = []
      items.forEach(function (item) {
        if (!item.inTrash) {
          returnList.unshift(item)
        } else {
          trashCount++
        }
      })
      items.trashCount = trashCount
      return returnList
    }
  }).filter(
    'to_trusted', ['$sce', function ($sce) {
      return function (text) {
        return $sce.trustAsHtml(text)
      }
    }]
  )
})(this)
