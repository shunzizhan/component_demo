$(".btn").click(function(){$.ajax({url:"/api/user",type:"get",dataType:"json"}).done(function(a){alert(a.data.uname)}).fail(function(){}).always(function(){})});