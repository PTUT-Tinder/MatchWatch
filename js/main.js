$(document).ready(() => {
	$(".hamburger").click((evt) => {
		$(".responsive-container").toggleClass("active");
		$(".hamburger").toggleClass("is-active");
	});
});