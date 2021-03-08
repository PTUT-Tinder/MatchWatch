
var btn_creer = document.getElementById("creer-salon");

btn_creer.addEventListener("click", creerCode());


strRandom({
    UpperCase: true,
    includeNumbers: false,
    length: 6,
    startsWithLowerCase: false
  });

function creerCode(){
  var code;
  code = strRandom();
  window.alert(code);
}