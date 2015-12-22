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
        _fastclick      : path.js + 'fastclick.min.js',
        _autonumeric    : path.js + 'autoNumeric.min.js'
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

        
            $shop.on('click', '.box__button', function(event) {
                var item    = $(this).data('nama');
                var price   = $(this).data('harga');
                var vTotal  = Number($totalPrice.attr('data-total'));
                var getID   = $(this).attr('id');

                $(this).toggleClass(disableBtn);
                $(this).attr('disabled', true);

                $orderItems.append('<li class="show">'+ 
                    '<span class="order__items__item">' + item + '</span>' +
                    '<span class="order__items__price">' + price + '</span>' 
                    +'<button class="btn-close" data-id="'+getID+'">' + 'X' 
                    + '</button>' + '</li>');

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
            $('.shop').on('click', '.loadBtn' , function(event) {
                $('.loadBtn').removeClass('btn--blue');
                $('.loadBtn').attr('disabled', true);
                $('.loadBtn').text('Wait Loading data...');

                $.getJSON('dev/js/format-data.json', function(json, textStatus) {
                    $('.bzg_c').each(function(index, el) {
                        var $orderItems     = $('.order__items');
                        var item            = json.data[index].name;
                        var price           = json.data[index].price;
                        var getID           = index;
                        var url             = json.data[index].imgUrl;

                        $('.shop .bzg').append(
                            '<div class="bzg_c" data-col="m6 l4">' + 
                            '<div class="box js_box">' +
                            '<div class="box__content">' +
                            '<figure class="box__img">' +
                            '<img src="'+url+'" alt="'+item+'">'+'</figure>'
                            + '<div class="box__item">' + '<b>' + item + '</b>' 
                            + '</div>' + '<div class="box__price">'  
                            + price + '</div>' + '</div>' +
                            '<button id="'+getID+'" class="box__button box__button--blue" data-harga="'+price+'" data-nama="'+item+'">'
                            + 'Add to Cart' +'</button>'+ '</div>' + '</div>');

                        $('.js_box').ready(function() {
                            $('.loadBtn').addClass('btn--blue');
                            $('.loadBtn').attr('disabled', false);
                            $('.loadBtn').text('Load Data');
                            $('.box__price').autoNumeric();
                        });
                    });
                });
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
