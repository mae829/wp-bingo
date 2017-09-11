(function(){
    'use strict';

    // Need these items for all functionality below
    var bingoItems  = document.getElementsByClassName('wp-bingo__item');
    var itemName    = 'wp-bingo';

    // if browser supports localStorage use it (IE8<)
    if ( typeof( Storage ) !== 'undefined' ) {

        var storeCard   = false;

        /**
         * Check if our item exists in storage
         * - if it does, then replace the values in the squares that were loaded server side
         *   AND add the active status if it already had it
         * - else, if the item does not exist in storage, save it
         */
        if ( localStorage.getItem( itemName ) ) {

            var storedData  = JSON.parse( localStorage.getItem( itemName ) );
            var cardData    = JSON.parse( storedData.cardData );
            var now         = new Date().getTime().toString();
            var expirationTimestamp = storedData.expirationTimestamp;

            // if it's been more than the expiration date, store the new card
            if ( now > expirationTimestamp ) {
                storeCard   = true;
            } else {

                for ( var i = 0; i < bingoItems.length; i++ ) {

                    if ( i in cardData ) {

                        bingoItems[i].innerHTML = cardData[i].html;

                        if ( cardData[i].status != '' ) {
                            bingoItems[i].classList.add('active');
                        }

                    }

                }

            }

        } else {
            storeCard   = true;
        }

        if ( storeCard ) {

            // Expiration time variables
            var d               = new Date();
            var days            = 1;
            var expirationTime  = d.getTime() + ( days * 24 * 60 * 60 * 1000 );

            // Create array of bingoItems text to store into storage
            var bingoItemsArray = [];

            for ( var i = 0; i < bingoItems.length; i++ ) {
                var singleItemData  = {};

                singleItemData.html  = bingoItems[i].innerHTML;

                if ( bingoItems[i].classList.contains('active') ) {
                    singleItemData.status  = 'active';
                } else {
                    singleItemData.status  = '';
                }

                bingoItemsArray.push( singleItemData );
            }

             // iOS 8.3+ Safari Private Browsing mode throws a quota exceeded JS error with localStorage.setItem
            try {

                 var bingoObject   = {
                    cardData: JSON.stringify( bingoItemsArray ),
                    expirationTimestamp: expirationTime
                };

                localStorage.setItem( itemName, JSON.stringify( bingoObject ) );

            } catch ( error ) {
                // Do nothing with localStore if iOS 8.3+ Safari Private Browsing mode, because whatever.
            }

        }

    }

    /**
     * Toggle class of element when clicked
     * and save new
     */
    for ( var i = 0; i < bingoItems.length; i++ ) {

        bingoItems[i].onclick = function() {

            this.classList.toggle('active');

            /**
             * Attempt to save the active status to storage item/data
             * toggle status of 'active'
             * if browser supports localStorage use it (IE8<)
             * and if the item exists
             */
            if ( typeof( Storage ) !== 'undefined' && localStorage.getItem( itemName ) ) {

                var indexNumber = [].indexOf.call(this.parentNode.children, this);

                var storedData  = JSON.parse( localStorage.getItem( itemName ) );
                var cardData    = JSON.parse( storedData.cardData );

                // Manipulate the existing data and save it again
                cardData[indexNumber].status = this.classList.contains('active') ? 'active' : '';

                 // iOS 8.3+ Safari Private Browsing mode throws a quota exceeded JS error with localStorage.setItem
                try {

                     var bingoObject   = {
                        cardData: JSON.stringify( cardData ),
                        expirationTimestamp: storedData.expirationTimestamp
                    };

                    localStorage.setItem( itemName, JSON.stringify( bingoObject ) );

                } catch ( error ) {
                    // Do nothing with localStore if iOS 8.3+ Safari Private Browsing mode, because whatever.
                }

            }

            checkWin();

        };

    }

    function checkWin() {
        /**
         * If Bingo has been achieved, display confetti on screen to celebrate!
         */
        var row1 = 0, row2 = 0, row3 = 0, row4 = 0, row5 = 0;
        var col1 = 0, col2 = 0, col3 = 0, col4 = 0, col5 = 0;
        var diag1 = 0, diag2 = 0;

        /**
         * Increment the values of the rows, columns, or diagonals
         * We will test if any add up to 5 to declare winner
         */
        for ( var i = 0; i < bingoItems.length; i++ ) {

            if ( bingoItems[i].classList.contains('active') ) {

                if ( i < 5 )
                    ++row1;
                else if ( i >= 5 && i < 10 )
                    ++row2;
                else if ( i >= 10 && i < 15 )
                    ++row3;
                else if ( i >= 15 && i < 20 )
                    ++row4;
                else if ( i >= 20 && i < 25 )
                    ++row5;

                if ( i % 5 == 0 )
                    ++col1;
                else if ( ( i - 1 ) % 5 == 0 )
                    ++col2;
                else if ( ( i - 2 ) % 5 == 0 )
                    ++col3;
                else if ( ( i - 3 ) % 5 == 0 )
                    ++col4;
                else if ( ( i - 4 ) % 5 == 0 )
                    ++col5;

                if ( i % 6 == 0 )
                    ++diag1;
                if ( i != 0 && i % 4 == 0 )
                    ++diag2;

            }

        }

        if ( row1 == 5 || row2 == 5 || row3 == 5 || row4 == 5 || row5 == 5 || col1 == 5 || col2 == 5 || col3 == 5  || col4 == 5  || col5 == 5 || diag1 == 5 || diag2 == 5 ) {
            launchConfetti();
        }

    }

})();

/**
 * Confetti code from https://codepen.io/linrock/pen/Amdhr
 */
function launchConfetti() {

    var canvas = document.createElement('canvas');
    canvas.setAttribute( 'id', 'confetti' );
    document.body.appendChild( canvas );

    var COLORS, Confetti, NUM_CONFETTI, PI_2, confetti, context, drawCircle, i, range, resizeWindow, xpos;

    NUM_CONFETTI = 350;

    COLORS = [[85, 71, 106], [174, 61, 99], [219, 56, 83], [244, 92, 68], [248, 182, 70]];

    PI_2 = 2 * Math.PI;

    canvas = document.getElementById("confetti");

    context = canvas.getContext("2d");

    window.w = 0;

    window.h = 0;

    resizeWindow = function() {
        window.w = canvas.width = document.body.clientWidth;
        return window.h = canvas.height = document.body.clientHeight;
    };

    window.addEventListener('resize', resizeWindow, false);

    window.onload = function() {
        return setTimeout(resizeWindow, 0);
    };

    range = function(a, b) {
        return (b - a) * Math.random() + a;
    };

    drawCircle = function(x, y, r, style) {
        context.beginPath();
        context.arc(x, y, r, 0, PI_2, false);
        context.fillStyle = style;
        return context.fill();
    };

    xpos = 0.5;

    window.requestAnimationFrame = (function() {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
            return window.setTimeout(callback, 1000 / 60);
        };
    })();

    Confetti = (function() {
        function Confetti() {
            this.style = COLORS[~~range(0, 5)];
            this.rgb = "rgba(" + this.style[0] + "," + this.style[1] + "," + this.style[2];
            this.r = ~~range(2, 6);
            this.r2 = 2 * this.r;
            this.replace();
        }

        Confetti.prototype.replace = function() {
            this.opacity = 0;
            this.dop = 0.03 * range(1, 4);
            this.x = range(-this.r2, w - this.r2);
            this.y = range(-20, h - this.r2);
            this.xmax = w - this.r;
            this.ymax = h - this.r;
            this.vx = range(0, 2) + 8 * xpos - 5;
            return this.vy = 0.7 * this.r + range(-1, 1);
        };

        Confetti.prototype.draw = function() {
            var ref;
            this.x += this.vx;
            this.y += this.vy;
            this.opacity += this.dop;
            if (this.opacity > 1) {
                this.opacity = 1;
                this.dop *= -1;
            }
            if (this.opacity < 0 || this.y > this.ymax) {
                this.replace();
            }
            if (!((0 < (ref = this.x) && ref < this.xmax))) {
                this.x = (this.x + this.xmax) % this.xmax;
            }
            return drawCircle(~~this.x, ~~this.y, this.r, this.rgb + "," + this.opacity + ")");
        };

        return Confetti;

    })();

    confetti = (function() {
        var j, ref, results;
        results = [];
        for (i = j = 1, ref = NUM_CONFETTI; 1 <= ref ? j <= ref : j >= ref; i = 1 <= ref ? ++j : --j) {
            results.push(new Confetti);
        }
        return results;
    })();

    window.step = function() {
        var c, j, len, results;
        requestAnimationFrame(step);
        context.clearRect(0, 0, w, h);
        results = [];
        for (j = 0, len = confetti.length; j < len; j++) {
            c = confetti[j];
            results.push(c.draw());
        }
        return results;
    };

    step();

    resizeWindow();

}
