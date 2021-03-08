
var btn_creer = document.getElementById("creer-salon");

btn_creer.addEventListener("click", creerCode(e));

function makeid() {
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

	for (var i = 0; i < 6; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length));

	return text;
}

function creerCode(){
	var code;
	code = makeid()
	window.alert(code);
}