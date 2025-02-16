if($.browser.mozilla||$.browser.opera){document.removeEventListener("DOMContentLoaded",$.ready,false);document.addEventListener("DOMContentLoaded",function(){$.ready()},false)}$.event.remove(window,"load",$.ready);$.event.add( window,"load",function(){$.ready()});$.extend({includeStates:{},include:function(url,callback,dependency){if(typeof callback!='function'&&!dependency){dependency=callback;callback=null}url=url.replace('\n','');$.includeStates[url]=false;var script=document.createElement('script');script.type='text/javascript';script.onload=function(){$.includeStates[url]=true;if(callback)callback.call(script)};script.onreadystatechange=function(){if(this.readyState!="complete"&&this.readyState!="loaded")return;$.includeStates[url]=true;if(callback)callback.call(script)};script.src=url;if(dependency){if(dependency.constructor!=Array)dependency=[dependency];setTimeout(function(){var valid=true;$.each(dependency,function(k,v){if(!v()){valid=false;return false}});if(valid)document.getElementsByTagName('head')[0].appendChild(script);else setTimeout(arguments.callee,10)},10)}else document.getElementsByTagName('head')[0].appendChild(script);return function(){return $.includeStates[url]}},readyOld:$.ready,ready:function(){if($.isReady) return;imReady=true;$.each($.includeStates,function(url,state){if(!state)return imReady=false});if(imReady){$.readyOld.apply($,arguments)}else{setTimeout(arguments.callee,10)}}});
$.include('js/superfish.js')
$.include('js/jquery.hoverIntent.minified.js')
$.include('js/tms-0.4.1.js')
$.include('js/uCarousel.js')
$.include('js/jquery.easing.1.3.js')
$.include('js/jquery.jqtransform.js')
$.include('js/jquery.ui.datepicker.js')
$.include('js/jquery.ui.core.js')
$(function(){	
	if($('#form1').length)$.include('js/forms.js');
	if($('.lightbox-image').length)$.include('js/jquery.prettyPhoto.js');
// Carausel
	$('.carousel').uCarousel({show:4,pageStep:1,buttonClass:'car-button'})
	$('.carousel1').uCarousel({show:2,pageStep:1,buttonClass:'car-button'})
	$('.carousel2').uCarousel({show:1,pageStep:1,buttonClass:'car-button'})
	$('.carousel3').uCarousel({show:1,pageStep:1,buttonClass:'car-button'})
	// Main Slider
	$('.slider')._TMS({
		show:0,
		pauseOnHover:false,
		duration:1000,
		preset:'simpleFade',
		prevBu:'.prev',
		nextBu:'.next',
		pagination:false,
		pagNums:false,
		slideshow:700000,
		numStatus:false,
		banners:'fade',// fromLeft, fromRight, fromTop, fromBottom
		waitBannerAnimation:false})	
		$("form.jqtransform").jqTransform();
		$( "#datepicker" ).datepicker({
			showOn: "button",
			showAnim: "fadeIn",
			buttonImage: "images/calendar.png",
			buttonImageOnly: true
		});
		$( "#datepicker1" ).datepicker({
			showOn: "button",			
			showAnim: "fadeIn",
			buttonImage: "images/calendar.png",
			buttonImageOnly: true
		});
});
function onAfter(curr, next, opts, fwd){var $ht=$(this).height();$(this).parent().animate({height:$ht})}
