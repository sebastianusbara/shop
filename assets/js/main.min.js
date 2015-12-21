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
            var $shop           = $('.shop');
            var $orderItems     = $('.order__items');
            var $orderPrice     = $('.order__price');
            var $boxItem        = $('.box__item');
            var $boxPrice       = $('.box__price');
            var $content        = $('.box__content');
            var $totalPrice     = $('.order__total__price');
            
            $shop.on('click', '.box__button', function(event) {

                $.fn.digits = function(){ 
                    return this.each(function(){ 
                    $(this).text( $(this).text()
                    .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") ); 
                    })
                }

                var item   = $(this).siblings($content).find($boxItem).text();
                var price  = $(this).siblings($content).find($boxPrice).text();
                var vItem  = $(this).siblings($content)
                             .find($boxPrice).data('harga');
                var vTotal  = Number($totalPrice.attr('data-total'));

                $orderItems.append('<li>'+ item +'</li>');
                $orderPrice.append('<li>'+ price +'</li>');

                $finale = $totalPrice.attr('data-total', vItem+vTotal);
                $dataFinale = $finale.attr('data-total');
                
                $totalPrice.text($dataFinale).digits();
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
