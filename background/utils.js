function newFunction(_str){
  var str = _str.replace(/\/\*.*?\*\//g, '');
  var functionStart = /^\s*function[\s\(]/.test(str)
  if(!functionStart){
    return
  }
  s = str.replace(/^\s*function.*\(/,'function anonymous(')
  var anonymous;
  try {
    eval(s)
  }catch(e){
  }
  return anonymous
}

function toDataUrl(data){
  return 'data:text/html,'+encodeURIComponent(data);
}
