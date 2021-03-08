
var btn_creer = document.getElementById("creer-salon");

btn_creer.addEventListener("click", creerCode());

function makeid() {
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

	for (var i = 0; i < 6; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length));

	return text;
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