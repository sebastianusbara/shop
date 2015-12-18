/*! [PROJECT_NAME] | Suitmedia */

;(function ( window, document, undefined ) {

    var path = {
        css: myPrefix + 'assets/css/',
        js : myPrefix + 'assets/js/vendor/'
    };

    var assets = {
        _jquery_cdn     : 'https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js',
        _jquery_local   : path.js + 'jquery.min.js',
        _fastclick      : path.js + 'fastclick.min.js'
    };

    var Site = {

        init: function () {
            Site.fastClick();
            Site.enableActiveStateMobile();
            Site.WPViewportFix();
            Site.addItem();

            window.Site = Site;
        },

        fastClick: function () {
            Modernizr.load({
                load    : assets._fastclick,
                complete: function () {
                    FastClick.attach(document.body);
                }
            });
        },

        enableActiveStateMobile: function () {
            if ( document.addEventListener ) {
                document.addEventListener('touchstart', function () {}, true);
            }
        },

        WPViewportFix: function () {
            if ( navigator.userAgent.match(/IEMobile\/10\.0/) ) {
                var style   = document.createElement("style"),
                    fix     = document.createTextNode("@-ms-viewport{width:auto!important}");

                style.appendChild(fix);
                document.getElementsByTagName('head')[0].appendChild(style);
            }
        },

        addItem: function() {
            var $button         = $('.box__button');
            var $shop           = $('.shop');
            var $orderItems     = $('.order__items');
            var $orderPrice     = $('.order__price');
            var $boxItem        = $('.box__item');
            var $boxPrice       = $('.box__price');
            var $content        = $('.box__content');
 
            $shop.on('click', '.box__button', function(event) {
                var item            = $(this).siblings($content).find($boxItem).text();
                var price           = $(this).siblings($content).find($boxPrice).text();
                var $getPrice       = $(this).siblings($content).find($boxPrice);
                var $totalPrice     = $(this).parent('main').siblings('aside').find('.order__total__price');

                $orderItems.append('<li>'+ item +'</li>');
                $orderPrice.append('<li>'+ price +'</li>');
                
                $itemPrice = $getPrice.data('harga');
                $itemTotal = $totalPrice.data('total');
                $finalPrice = $itemTotal + $itemPrice;

                $totalPrice.data('total') = $finalPrice; 
            });

        }

    };

    var checkJquery = function () {
        Modernizr.load([
            {
                test    : window.jQuery,
                nope    : assets._jquery_local,
                complete: Site.init
            }
        ]);
    };

    Modernizr.load({
        load    : assets._jquery_cdn,
        complete: checkJquery
    });

})( window, document );
