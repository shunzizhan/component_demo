var jiathis_config={
	url:'',
	summary:"",
	title:"",
	shortUrl:true,
	hideMore:true
}

var newhouse={
	flag:true,
	info:function(){
		$(".condition-txt .endtime").countDown(1);
		this.houseSlide();
		this.houseShare();
		this.houseCheck();
	},
	houseSlide:function(){
		$(".newhouse-box .checktxt-box").click(function(){
			if(this.flag){
				$(this).removeClass("on");
				$(this).find(".select-icon").removeClass("select-up").addClass("select-down");

				$(this).find(".checktxt").html("购房流程");
			}else{
				$(this).addClass("on");
				$(this).find(".checktxt").html("收起");
				$(this).find(".select-icon").removeClass('select-down').addClass("select-up");				
			}
			$(".newhouse-box .buypath").slideToggle();
			this.flag=!this.flag;				
		})
	},

	houseShare:function(){
		var oleft=null;
		var otop=null;
		$(".hs-share").click(function(event){
			event.stopPropagation();
			oleft=$(this).offset().left;
			otop=$(this).offset().top;
            jiathis_config={};
            var title=$(this).attr("data-title");
            var url=$(this).attr("data-url");
            setShare(title,url);
            $(".hs-sharelist").show().offset({left:oleft,top:otop+20});

		});
		$(window).scroll(function(){ 
            $(".hs-sharelist").offset({left:oleft,top:otop+20});
		});
		function setShare(title, url) {
            jiathis_config.title = title;
            jiathis_config.url = url;
        }

		$("body").click(function(){
			$(".hs-sharelist").hide();
		})
	},
	houseCheck:function(){
		$(".condition-item li").click(function(){
			if($(this).hasClass('active')){
				$(this).removeClass('active');
			}else{
				$(this).addClass('active');
			}
		})
	}	
}
newhouse.info();



