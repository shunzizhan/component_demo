

var serverpath = "http://house.m.fdc.com.cn";//新房服务路径
//var path = "http://mt.fdc.com.cn";
var path = "http://member.fdc.com.cn";
var path1 = "http://hd.fdc.com.cn";
//var path1 = "http://hdmanage.fdc.com.cn";

//活动报名 activityname活动类型拼音简写，用来判断跳转
function signup(username, tel, purposeBuild, purposeHouse, usermsg, activitytype, signstyle, verify, pwd, signOption, userQuestion, activityname,flag,userid)
{
    var flag;
    if(flag){
        url = "http://house.m.fdc.com.cn/ajax/PhpFunction.ashx";
    }else{
        url = "/ajax/PhpFunction.ashx";
    }
   // var unionid = GetCookieValue(cookie.Get("loginStatusUserInfo"), "userOpenID");
    $.ajax({
        type: "post",
        async: false,
        url: url,
        data: {
            cmd: "Signup",
            //urldata: "?jsonCallback=jQuery111108563805262092501_1441885973809&username"+username+"&tel="+tel+"&purposeBuild="+purposeBuild+"&purposeHouse="+purposeHouse+"&signOption="+signOption+"&userMsg="+usermsg+"&activitytype="+activitytype + "&signstyle="+signstyle+"&userQuestion="+userQuestion,    
            username: username,
            tel: tel,
            purposeBuild: purposeBuild,
            purposeHouse: purposeHouse,
            signOption: signOption,
            userMsg: usermsg,
            activitytype: activitytype,
            signstyle: signstyle,
            //password:pwd,
            userQuestion: userQuestion,
            //unionid:unionid
            sso_userid: userid
        },
        success: function (result) {
            var obj = $.parseJSON(result);
            if (obj.status == 1) {
                if (activityname == 'wwjf') {//为我荐房跳转到个人中心为我荐房
                    $(".shade-revolve, .ico-loading").hide().css("opacity","0");
                    $(".shade").show().css("opacity","1");
                    $("#succesdialog").show();
                } else if (activityname == 'kptz' || activityname == "yzplrly" || activityname == "yzpl")//开盘通知和业主评论以及业主评论回复刷新当前页面
                {
                    $(".shade-revolve, .ico-loading").hide().css("opacity","0");
                    $(".shade").show().css("opacity","1");
                    $("#succesdialog").show();
                }else if(activityname=="lpwd")//楼盘问答跳转到个人中心楼盘问答
                {
                    $(".shade-revolve, .ico-loading").hide().css("opacity","0");
                    $(".shade").show().css("opacity","1");
                    $("#succesdialog").show();
                }
                else {//其他的活动跳转个人中心我的活动
                    $(".shade-revolve, .ico-loading").hide().css("opacity","0");
                    $(".shade").show().css("opacity","1");
                    $("#succesdialog").show();
                }
            }
            else {
                alert(obj.msg);
                return;
            }
        }
    });
}

//用户名密码登录
function login_u(username, pwd, noverify, tipobj, s) {
    $.ajax({
        type: "get",
        //async: false,
        url: path + "/Home/Member/OutwardLogin?callback=?",
        dataType: "jsonp",
        data: {
            username: username,
            password: pwd
            //noverify: noverify

        },
        success: function (result) {
            var obj = eval(result);
            if (obj.status == 1) {
                tipobj.hide();
                syn(obj);
                s();
                return true;
            }
            else {
                alert(obj.msg);
                return false;
            }
        }
    });
}

//电话登录
function login_tel(tel, code, activitytype, tipobj, s,flag) {
    //var tel = $(".phone input").val();
    //var code = $(".code input").val();
    $.ajax({
        type: "get",
        //async: false,
        url: path + "/Home/Member/OutwardPhoneLogin?callback=?",
        dataType: "jsonp",
        data: {
            phone: tel,
            verify: code,
            activitytype: activitytype
        },
        success: function (result) {
            var obj = eval(result);
            if (obj.status == 1) {
                syn(obj,flag);
                // parent.location.reload();
                s(obj.data.userid);
                return true;
            }
            else {
                $(".shade-revolve, .ico-loading").hide().css("opacity","0");
                $(".shade").hide();
                alert(obj.msg);
                return false;
            }
        }
    });
}

//2.1发送验证码到用户手机号码
function sendVerifyToPhone(tel) {
    //var tel = document.getElementById('phone').value;
    $.post(path + '/Home/Member/GetPhoneVerify', { phone: tel, ajax: "1" }, function (_returnData) {
        if (_returnData.status == '1') {//60秒后重新获取
            alert(_returnData.msg);
            $('#sendVerify').text('60秒后重新获取');
        } else {
            alert('验证码发送失败!请稍后重试');
        }
    }, "json");
}

//同步登录本站
function syn(obj,flag) {
    var url;
    if(flag){
        url = "http://house.m.fdc.com.cn/ajax/SynLogin.aspx";
    }else{
        url = "/ajax/SynLogin.aspx";
    }
    $.ajax({
        type: "post",
        async: false,
        url: url,
        dataType: "json",
        data: {
            act: "syn",
            unionid: obj.data.unionid,
            username: obj.data.username,
            email: obj.data.email,
            phone: obj.data.phone,
            token: obj.data.token,
            sso_userid:obj.data.userid
        },
        success: function (result) {
            //alert(result);
        }
    });
}

