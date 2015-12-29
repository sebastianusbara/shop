/*! [PROJECT_NAME] | Suitmedia */

;(function ( window, document, undefined ) {
    
    var disableBtn  = 'box__button--blue box__button--disabled';
    var loadBtn     = '<button class="btn btn--block btn--blue loadBtn">Load More</button>';

    var path = {
        css: myPrefix + 'assets/css/',
        js : myPrefix + 'assets/js/vendor/'
    };

    var assets = {
        _jquery_cdn     : 'https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js',
        _jquery_local   : path.js + 'jquery.min.js',
        _handlebars     : path.js + 'handlebars.min.js',
        _fastclick      : path.js + 'fastclick.min.js',
        _autonumeric    : path.js + 'autoNumeric.min.js',
        _slick          : path.js + 'slick.min.js'
    };

    var Site = {

        init: function () {
            Site.fastClick();
            Site.enableActiveStateMobile();
            Site.WPViewportFix();
            Site.autoNumeric();
            Site.addItem();
            Site.deleteItem();
            Site.loadData();
            Site.mainSlider();
            Site.fixedSidebar();

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

        autoNumeric: function () {
            Modernizr.load({
                load    : assets._autonumeric
            });
        },

        addItem: function() {
            var $shop           = $('.shop');
            var $orderItems     = $('.order__items');
            var $boxItem        = $('.box__item');
            var $boxPrice       = $('.box__price');
            var $content        = $('.box__content');
            var $orderTotal     = $('.order__total');
            var $totalPrice     = $('.order__total__price');
            var source          = $('#orderTemplate').html();
            var template        = Handlebars.compile(source); 

        
            $shop.on('click', '.box__button', function(event) {
                var item    = $(this).data('nama');
                var price   = $(this).data('harga');
                var vTotal  = Number($totalPrice.attr('data-total'));
                var getID   = $(this).attr('id');
                var getData = {item: item, price: price, id: getID};
                var targetData  = template(getData);

                $(this).toggleClass(disableBtn);
                $(this).attr('disabled', true);

                $orderItems.append(targetData);

                $('.order__items__price').autoNumeric();
                $('.order__total__price').autoNumeric('destroy');

                $finale = $totalPrice.attr('data-total', price+vTotal);
                $dataFinale = $finale.attr('data-total');
                
                $('.order__total__price').text($dataFinale).autoNumeric();
            });    
        },

        deleteItem: function() {
            var $order  = $('.order__items');
            var close   = '.btn-close';

            $order.on('click', close , function(event) {
                var $total    = $('.order__total__price').attr('data-total');
                var $itemVal  = $(this).siblings('.order__items__price').text();
                var $priceInt = parseInt($itemVal) + '000';
                var $getPrice = Number($priceInt);
                var dataID   = $(this).attr('data-id');
                var $getBtn   = $('#'+ dataID);

                $('.order__total__price').autoNumeric('destroy');
                
                if (window.confirm("Apakah anda yakin akan menghapus data?")) { 
                    
                    $(this).parent().remove();
                    $getBtn.toggleClass(disableBtn);
                    $getBtn.attr('disabled', false);

                    $getTotal = $('.order__total__price')
                                .attr('data-total', $total-$getPrice);
                    $stringTotal = $('.order__total__price').attr('data-total');
                    
                    $('.order__total__price').text($stringTotal).autoNumeric();
                }

            });
        },

        loadData: function() {

            var $btn        = $('.loadBtn');
            var $page       = $(window);
            var source      = $('#template').html();
            var template    = Handlebars.compile(source); 

            $('.shop').on('click', '.loadBtn' , function(event) {
                $btn.removeClass('btn--blue');
                $btn.attr('disabled', true);
                $btn.text('Wait Loading data...');

                var url = $(this).attr('data-load');

                $.getJSON(url, function(json, textStatus) {
                    var targetData  = template(json);   
                    
                    $('.shop .bzg').append(targetData);
                    $btn.attr('data-load', json.next);

                    $btn.addClass('btn--blue');
                    $btn.attr('disabled', false);
                    $btn.text('Load Data');
                    $('.box__price').autoNumeric();

                    if (!json.next) {
                        $btn.remove();
                    }
                });
            });

            $page.scroll(function() {
               if($page.scrollTop() + $page.height() === $(document).height()) {
                   $btn.trigger('click');
               }
            });
        },

        mainSlider: function() {
            $('.main__slider').slick({
                arrows: false,
                dots: true,
                customPaging: function(slider, i) {
                    return '<button type="button" data-role="none" role="button" aria-required="false" tabindex="0"></button>';
                }
            });
        },

        fixedSidebar: function() {
            var sticky = document.querySelector('.sidebar');
            var origOffsetY = sticky.offsetTop;

            function onScroll(e) {
                if ( window.scrollY >= origOffsetY ) {
                    $(sticky).addClass('sidebar__fixed');
                } else {
                    $(sticky).removeClass('sidebar__fixed');
                }
            }

            document.addEventListener('scroll', onScroll);
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

    Modernizr.load([
        {
            load    : assets._jquery_cdn,
        },
        {
            load    : assets._slick,
        },
        {   
            load    : assets._handlebars,
            complete: checkJquery
        }
    ]);

})( window, document );
