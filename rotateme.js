
/************************************************************
 ************* Rodrigo Gualberto ****************************
 ************* RotateMe 1/31/13  ****************************
 ************************************************************
 */

(function( $ ){

  $.fn.rotateme = function () {
    var track = false,
        oldX = 0,
        oldY = 0,
        lastmove,
        increment = 3,
        options = $.extend({
            stop: function () {}
        }, arguments[0] || {});


    function calculateRotation ($rotateEl) {
        var matrix = $rotateEl.css("-webkit-transform") ||
                     $rotateEl.css("-moz-transform")    ||
                     $rotateEl.css("-ms-transform")     ||
                     $rotateEl.css("-o-transform")      ||
                     $rotateEl.css("transform"),
            values,
            a,
            b,
            angle;

            if (matrix !== 'none') {
                values = matrix.split('(')[1].split(')')[0].split(',');
                a = values[0];
                b = values[1];
                angle = Math.round(Math.atan2(b, a) * (180/Math.PI));
            }
            else {
                angle = 0;
            }

            return angle;
    }

    function getRotationDegrees ($rotateEl) {
        var rotationDegrees = $rotateEl.data('rotatemeAngle');

        if (rotationDegrees === undefined) {
            rotationDegrees = calculateRotation($rotateEl);
        }

        return rotationDegrees;
    }

    function updateRotation ($rotateEl, value) {
        $rotateEl.css("-webkit-transform", 'rotate(' + value + 'deg)');
        $rotateEl.css("-mos-transform", 'rotate(' + value + 'deg)');
        $rotateEl.css("-ms-transform", 'rotate(' + value + 'deg)');
        $rotateEl.css("-o-transform", 'rotate(' + value + 'deg)');
        $rotateEl.css("transform", 'rotate(' + value + 'deg)');
    }

    function rotate ($rotateEl, curVal) {
        this.clock = function () {
            var newVal = curVal + increment;

            lastmove = "clock";
            updateRotation($rotateEl, newVal);
        };

        this.counter = function () {
            var newVal = curVal - increment;

            lastmove = "counter";
            updateRotation($rotateEl, newVal);
        };
    }

    this.each(function () {
        var left = $(this).width()/2 - 10,
            top = $(this).height()/2 - 10,
            _rotater = $('<div>').css('top', top).css('left', left);

        _rotater.addClass('rotateme-pivot');
        _rotater.css('position', 'absolute');
        $(this).css('position', 'relative');
        $(this).append(_rotater);
    });
   
    $(this).on({
        mousedown: function (e) {
            var $clickedEl = $(e.target);

            if ($clickedEl.is('.rotateme-pivot')) {
                //start rotate
                track = true;
            }
        },

        mouseup: function (e) {
            var $clickedEl = $(e.target);

            if (track === true) {
                //call stop
                options.stop.call(this);
            }

            //stop rotate
            track = false;
            $clickedEl.data('rotatemeAngle');
        },

        mousemove: function (e) {
            var el = $(this).find('.rotateme-pivot');

            if (track) {
                //rotate
                var relX = (e.pageX - el.offset().left) - (el.width()/2),
                    relY = (e.pageY - el.offset().top) - (el.height()/2),
                    SlopeToO = Math.abs((oldY)/(oldX)),
                    SlopeToN = Math.abs((oldY - relY)/(oldX - relX)),
                    move = new rotate($(this), getRotationDegrees($(this)));

                if (relX >= 0) {
                    if (relY >= 0) {
                        //quad 1
                        if (oldX < relX) {
                            if (oldY > relY) {
                                move.counter();
                                lastmove = "counter";
                            }
                            else {
                                //repeat last move (uncertain quad move)
                                if (lastmove == "counter") {
                                    move.counter();
                                }
                                else {
                                    move.clock();
                                }
                            }
                        }
                        else {
                            if (oldY < relY) {
                                move.clock();
                            }
                            else {
                                if (SlopeToN > SlopeToO) {
                                    move.counter();
                                }
                                else {
                                    move.clock();
                                }
                            }
                        }
                    }
                    else {
                        //quad 2
                        if (oldX < relX) {
                            if (oldY < relY) {
                                move.clock();
                            }
                            else {
                                //repeat last move (uncertain quad move)
                                if (lastmove == "counter") {
                                    move.counter();
                                }
                                else {
                                    move.clock();
                                }
                            }
                        }
                        else {
                            if (oldY > relY) {
                                move.counter();
                            }
                            else {
                                if (SlopeToN > SlopeToO) {
                                    move.clock();
                                }
                                else {
                                    move.counter();
                                }
                            }
                        }
                    }
                }
                else {
                    if (relY < 0) {
                        //quad 3
                        if (oldX > relX) {
                            if (oldY < relY) {
                                move.counter();
                            }
                            else {
                                //repeat last move (uncertain quad move)
                                if (lastmove == "counter") {
                                    move.counter();
                                }
                                else {
                                    move.clock();
                                }
                            }
                        }
                        else {
                            if (oldY > relY) {
                                move.clock();
                            }
                            else {
                                if (SlopeToN > SlopeToO) {
                                    move.counter();
                                }
                                else {
                                    move.clock();
                                }
                            }
                        }
                    }
                    else {
                        //quad 4
                        if (oldX > relX) {
                            if (oldY > relY) {
                                move.clock();
                            }
                            else {
                                //repeat last move (uncertain quad move)
                                if (lastmove == "counter") {
                                    move.counter();
                                }
                                else {
                                    move.clock();
                                }
                            }
                        }
                        else {
                            if (oldY < relY) {
                                move.counter();
                            }
                            else {
                                if (SlopeToN < SlopeToO) {
                                    move.counter();
                                }
                                else {
                                    move.clock();
                                }
                            }
                        }
                    }
                }
                oldY = relY;
                oldX = relX;
            }
        }
    });

  };
})( jQuery );