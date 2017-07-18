var buildnickname = $("#buildnickname").html();
$.ajax({
    url: "http://hot.fdc.com.cn/2013zt/kft/M/Common.ashx",
    dataType: 'jsonp',
    data: { name: buildnickname },
    jsonp: 'callback',
    success: function (result) {
        if (result.date != "") {
            $("#kftpshow .f-l").html("最新活动：" + result.date);
            $("#kftpshow .f-r").html("参与活动：" + result.num);
        } else {
            $("#kftpshow").hide();
        }
    },
    timeout: 3000
});


function openKFTYY(name, averg) {
    var cc = escape(encodeURI(name));
    var dd = escape(encodeURI(averg+"元/平"));
    window.location = "http://hot.fdc.com.cn/2013zt/kft/M/appyykf.html?name=" +cc + "&avgpri=" + dd;

}