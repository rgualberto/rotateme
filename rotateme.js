
/************************************************************
 ************* Rodrigo Gualberto ****************************
 ************* RotateMe 1/31/13  ****************************
 ************************************************************
 */

(function( $ ){

  $.fn.rotateme = function() {
  	var track = false;
    var oldX = 0;
    var oldY = 0;
    var lastmove;
    var increment = 3;
    //var center = false;
    
    var options = $.extend({
        stop: function() {}
    }, arguments[0] || {});

    
	function getRotationDegrees(obj) {
	    var matrix = obj.css("-webkit-transform") ||
	    obj.css("-moz-transform")    ||
	    obj.css("-ms-transform")     ||
	    obj.css("-o-transform")      ||
	    obj.css("transform");
	    if(matrix !== 'none') {
	        var values = matrix.split('(')[1].split(')')[0].split(',');
	        var a = values[0];
	        var b = values[1];
	        var angle = Math.round(Math.atan2(b, a) * (180/Math.PI));
	    } else { var angle = 0; }
	    return angle;
	}
	
	function rotate(obj, curVal) {		
		this.clock = function(){
			lastmove = "clock";
			var newVal = curVal + increment;
			obj.css("-webkit-transform", 'rotate(' + newVal + 'deg)');
			obj.css("-mos-transform", 'rotate(' + newVal + 'deg)');
			obj.css("-ms-transform", 'rotate(' + newVal + 'deg)');
			obj.css("-o-transform", 'rotate(' + newVal + 'deg)');
			obj.css("transform", 'rotate(' + newVal + 'deg)');
		}
		
		this.counter = function(){
			lastmove = "counter";			
			var newVal = curVal - increment;
			obj.css("-webkit-transform", 'rotate(' + newVal + 'deg)');
			obj.css("-mos-transform", 'rotate(' + newVal + 'deg)');
			obj.css("-ms-transform", 'rotate(' + newVal + 'deg)');
			obj.css("-o-transform", 'rotate(' + newVal + 'deg)');
			obj.css("transform", 'rotate(' + newVal + 'deg)');
		}
	}
	
    this.each(function() {
    	
    	var left = $(this).width()/2 - 10;
    	var top = $(this).height()/2 - 10;
    	
    	var _rotater = $('<div>').css('top', top).css('left', left);
    	_rotater.addClass('rotateme-pivot');
    	_rotater.css('position', 'absolute');
    	$(this).css('position', 'relative');
      	$(this).append(_rotater);
    });
   
    $(this).on({
    	mousedown: function(e) {
    		var el = $(this).find('.rotateme-pivot');
    		var thisL = el.offset().left;
    		var thisR = el.offset().left + el.width();
    		var thisT = el.offset().top;
    		var thisB = el.offset().top + el.height();
    		
    		if(e.pageX >= thisL && e.pageX <= thisR && e.pageY >= thisT && e.pageY <= thisB)
			{
				//start rotate
				track = true;			
			}
    		
	    },
	    mouseup: function() {
	    	
	    	if(track == true){
	    		//call stop
	    		options.stop.call(this);
	    	}
	    	//stop rotate
	        track = false;
	    },
	    
	    mousemove: function(e) {
	    	var el = $(this).find('.rotateme-pivot');
	    	
	        if (track) {
	        	//rotate
	        	var relX = (e.pageX - el.offset().left) - (el.width()/2);
    			var relY = (e.pageY - el.offset().top) - (el.height()/2);	    
	        	var SlopeToO = Math.abs((oldY)/(oldX));
	            var SlopeToN = Math.abs((oldY - relY)/(oldX - relX));	            
	            /*
	        	if(!center){
					center = {
						left: relX,
						top: relY
					};
	    		}*/
	    		$('#debug').html(e.pageX +', '+ e.pageY + '<br>' + relX + ', ' + relY + '<br>' + oldX + ', ' + oldY + '<br>' + SlopeToO + ', ' + SlopeToN);
	            
	            //get current transform
	            var move = new rotate($(this), getRotationDegrees($(this)));
	            
	            if(relX >= 0){
	            	if(relY >= 0){
	            		//quad 1
	            		if(oldX < relX){
	            			if(oldY > relY){
	            				move.counter();
	            				lastmove = "counter";
	            			}
	            			else{
	            				//repeat last move (uncertain quad move)
	            				if(lastmove == "counter")
	            					move.counter();
	            				else
	            					move.clock();
	            			}
	            		}
	            		else{
	            			if(oldY < relY)
	            				move.clock();
	            			else{
	            				if(SlopeToN > SlopeToO)
	            					move.counter();
	            				else
	            					move.clock();
	            			}
	            		}
	            	}
	            	else{
	            		//quad 2
	            		if(oldX < relX){
	            			if(oldY < relY)
	            				move.clock();
	            			else{
	            				//repeat last move (uncertain quad move)
	            				if(lastmove == "counter")
	            					move.counter();
	            				else
	            					move.clock();
	            			}
	            		}
	            		else{
	            			if(oldY > relY)
	            				move.counter();
	            			else{
	            				if(SlopeToN > SlopeToO)
	            					move.clock();
	            				else
	            					move.counter();
	            			}
	            		}	
	            	}
	            }
	            else{
	            	if(relY < 0){
	            		//quad 3
	            		if(oldX > relX){
	            			if(oldY < relY)
	            				move.counter();
	            			else{
	            				//repeat last move (uncertain quad move)
	            				if(lastmove == "counter")
	            					move.counter();
	            				else
	            					move.clock();
	            			}
	            		}
	            		else{
	            			if(oldY > relY)
	            				move.clock();
	            			else{
	            				if(SlopeToN > SlopeToO)
	            					move.counter();
	            				else
	            					move.clock();
	            			}
	            		}
	            	}
	            	else{
	            		//quad 4
	            		if(oldX > relX){
	            			if(oldY > relY)
	            				move.clock();
	            			else{
	            				//repeat last move (uncertain quad move)
	            				if(lastmove == "counter")
	            					move.counter();
	            				else
	            					move.clock();
	            			}
	            		}
	            		else{
	            			if(oldY < relY)
	            				move.counter();
	            			else{
	            				if(SlopeToN < SlopeToO)
	            					move.counter();
	            				else
	            					move.clock();
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