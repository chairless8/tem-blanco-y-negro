/*  ---------------------------------------------------
    Template Name: Violet
    Description: Violet ecommerce Html Template
    Author: Colorlib
    Author URI: https://colorlib.com/
    Version: 1.0
    Created: Colorlib
---------------------------------------------------------  */

'use strict';

(function ($) {

    /*------------------
        Preloader
    --------------------*/
    $(window).on('load', function () {
        $(".loader").fadeOut();
        $("#preloder").delay(200).fadeOut("slow");

        /*------------------
		    Product filter
	    --------------------*/
        if ($('#product-list').length > 0) {
            var containerEl = document.querySelector('#product-list');
            var mixer = mixitup(containerEl);
        }
    });

    /*------------------
        Background Set
    --------------------*/
    $('.set-bg').each(function () {
        var bg = $(this).data('setbg');
        $(this).css('background-image', 'url(' + bg + ')');
    });

    /*------------------
		Navigation
	--------------------*/
    $(".mobile-menu").slicknav({
        appendTo: '.header-section',
        allowParentLinks: true,
        closedSymbol: '<i class="fa fa-angle-right"></i>',
		openedSymbol: '<i class="fa fa-angle-down"></i>'
    });

    /*------------------
		Search model
	--------------------*/
	$('.search-trigger').on('click', function() {
		$('.search-model').fadeIn(400);
	});

	$('.search-close-switch').on('click', function() {
		$('.search-model').fadeOut(400,function(){
			$('#search-input').val('');
		});
	});

    /*------------------
        Magnific Popup
    --------------------*/
    $('.pop-up').magnificPopup({
        type: 'image'
    });

    /*-------------------
		Sort Select
	--------------------- */
    $('.sort').niceSelect();

    /*-------------------
		Cart Select
	--------------------- */
    $('.cart-select').niceSelect();

    /*-------------------
		Quantity change
	--------------------- */
    var proQty = $('.pro-qty');
    proQty.prepend('<span class="dec qtybtn">-</span>');
    proQty.append('<span class="inc qtybtn">+</span>');
    proQty.on('click', '.qtybtn', function () {
        var $button = $(this);
        var oldValue = $button.parent().find('input').val();
        if ($button.hasClass('inc')) {
            var newVal = parseFloat(oldValue) + 1;
        } else {
            // Don't allow decrementing below zero
            if (oldValue > 0) {
                var newVal = parseFloat(oldValue) - 1;
            } else {
                newVal = 0;
            }
        }
        $button.parent().find('input').val(newVal);
    });

    /*-------------------
		Radio Btn
	--------------------- */
    $(".shipping-info .cs-item label").on('click', function () {
        $(".shipping-info .cs-item label").removeClass('active');
        $(this).addClass('active');
    });

    $(".checkout-form .diff-addr label").on('click', function () {
        $(this).toggleClass('active');
    });

    $(".payment-method ul li label").on('click', function () {
        $(this).toggleClass('active');
    });

    /*------------------
        Mobile Menu Fix
    --------------------*/
    // Cerrar menú móvil al hacer click en un enlace
    $(document).on('click', '.slicknav_nav a', function() {
        // Solo cerrar si es un enlace de navegación (no un submenu)
        if ($(this).attr('href') && $(this).attr('href').indexOf('#') !== 0) {
            $('.slicknav_btn').click();
        }
    });

    // Cerrar menú móvil al hacer click fuera del menú
    $(document).on('click', function(e) {
        // Solo aplicar en dispositivos móviles (cuando el menú slicknav está visible)
        if ($('.slicknav_menu').is(':visible')) {
            var $target = $(e.target);
            var $menu = $('.slicknav_menu');

            // Si el click no fue en el menú ni en sus elementos hijos
            if (!$target.closest('.slicknav_menu').length &&
                !$target.closest('.header-section').length &&
                $menu.find('.slicknav_nav').is(':visible')) {
                $('.slicknav_btn').click();
            }
        }
    });

    // Cerrar menú móvil cuando se redimensiona la ventana a desktop
    $(window).on('resize', function() {
        if ($(window).width() > 767) {
            // Si el menú móvil está abierto, cerrarlo
            if ($('.slicknav_nav').is(':visible')) {
                $('.slicknav_btn').click();
            }
        }
    });

})(jQuery);