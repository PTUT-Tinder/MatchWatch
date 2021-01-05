$(document).ready(() => {
	$(".active-bar").click((evt) => {
		$(".responsive-container").toggleClass("active");
		$(".hamburger").toggleClass("is-active");
	});
});