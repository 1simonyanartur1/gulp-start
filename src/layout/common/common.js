// import { header } from "../blocks/header/template.js";

document.addEventListener("DOMContentLoaded", function (event) {

	function addPhoneMask() {
		var telephone = document.querySelectorAll('input[type="tel"]');
		var im = new Inputmask("+7 (999) 999-99-99");
		im.mask(telephone);
	}
	function tabs() {
		let tabNav = document.querySelectorAll('.tabs-list__link'),
			tabContent = document.querySelectorAll('.tabs-tab'),
			tabName;

		tabNav.forEach(item => {
			item.addEventListener('click', selectTabNav)
		});

		function selectTabNav(e) {
			e.preventDefault();
			tabNav.forEach(item => {
				item.classList.remove('active');
			});
			this.classList.add('active');
			tabName = this.getAttribute('data-tab');
			selectTabContent(tabName);
		}

		function selectTabContent(tabName) {
			tabContent.forEach(item => {
				if (item.getAttribute('data-tab') == tabName) {
					item.classList.add('active');
				} else {
					item.classList.remove('active');
				}
			})
		}
	}

	addPhoneMask();
	tabs();
});