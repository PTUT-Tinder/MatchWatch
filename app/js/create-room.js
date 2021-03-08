
var btn_creer = document.getElementById("creer-salon");

btn_creer.addEventListener("click", creerCode());

function strRandom(o) {
  var a = 10,
      b = 'abcdefghijklmnopqrstuvwxyz',
      c = '',
      d = 0,
      e = ''+b;
  if (o) {
    if (o.startsWithLowerCase) {
      c = b[Math.floor(Math.random() * b.length)];
      d = 1;
    }
    if (o.length) {
      a = o.length;
    }
    if (o.includeUpperCase) {
      e += b.toUpperCase();
    }
    if (o.includeNumbers) {
      e += '1234567890';
    }
  }
  for (; d < a; d++) {
    c += e[Math.floor(Math.random() * e.length)];
  }
  return c;
}



function creerCode(){
  var code;
  code = strRandom({
    UpperCase: true,
    includeNumbers: true,
    length: 6,
    startsWithLowerCase: false
  });;
  window.alert(code);
}