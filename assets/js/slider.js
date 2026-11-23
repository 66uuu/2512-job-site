/*$(function(){
	$('#number li').mouseover(function(){
		$("#"+this.id).addClass("selected").siblings().removeClass("selected");
		$('.slider1 li img').fadeIn(4000).attr("src","images/"+(this.id)+".jpg");
		});
	});*/
	
/*首页广告效果*/
$(function(){
     var len  = $(".lb_num > li").length;
	 var index = 1;
	 var adTimer;
	 $(".lb_num li").mouseover(function(){
		index  =   $(".lb_num li").index(this);
		showImg(index);
	 }).eq(0).mouseover();	
	 //滑入 停止动画，滑出开始动画.
	 $('.lb_ad').hover(function(){
			 clearInterval(adTimer);
		 },function(){
			 adTimer = setInterval(function(){
			    showImg(index)
				index++;
				//if(index==len){index=0;}
			  } , 5000);
	 }).trigger("mouseleave");
	 // 通过控制top ，来显示不同的幻灯片
	function showImg(){
        var adWidth = $(".lb_content_right .lb_ad").width();
		if(index==1) {
			$(".lb_slider").css("left","0px");
		}
		$(".lb_slider").stop(true,false).animate({left : -adWidth*index},1000);
		if(index==len) {
			
			index=0;
		}
		$(".lb_num li").removeClass("lb_on")
			.eq(index).addClass("lb_on");
}
})

	
