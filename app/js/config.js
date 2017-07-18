/*
 *   说明 : 公用配置Js
 *   依赖 : 
 *   编写 : 张志成
 *   时间 : 2016-04-25
 *   @param  {[string]}  index              [首页地址]
 *   @param  {[string]}  house              [新房地址]
 *   @param  {[string]}  newhouse_api       [新房主站数据接口]
 *   @param  {[string]}  newhouse_api_fz    [新房分站数据接口]
 *   @param  {[string]}  oldhouse               [二手房、租房主站地址]
 *   @param  {[string]}  oldhouse_fz            [二手房、租房分站地址]
 *   @param  {[string]}  oldhouse_api       [二手房、租房主站数据接口]
 *   @param  {[string]}  oldhouse_api_fz    [二手房、租房分站数据接口]
 *   @param  {[string]}  news                       [资讯地址]
 *   @param  {[string]}  news_api               [资讯数据接口]
 *   @param  {[string]}  bbs                    [大家都在聊模块论坛接口]
 *   @param  {[string]}  member_api         [首页会员数量接口]
 *   @param  {[string]}  adver_api            [首页广告接口]
 *   @param  {[string]}  img_size           [图片尺寸]
 */
var index = "http://m.fdc.com.cn",
    house = "http://house.m.fdc.com.cn",
    newhouse_api = "http://house.m.api.fdc.com.cn",
    newhouse_api_fz = "http://fzhouse.m.api.fdc.com.cn",
    oldhouse = "http://oldhouse.m.fdc.com.cn",
    zufang = "http://zufang.m.fdc.com.cn",
    oldhouse_api = "http://oldhouse.m.api.fdc.com.cn",
    oldhouse_api_fz = "http://fzoldhouse.m.api.fdc.com.cn",
    news_index = "http://news.m.fdc.com.cn",
    news_api = "http://news.m.api.fdc.com.cn",
    bbs = "http://gw.fdc.com.cn/router/rest",
    member_api = "http://gw.fdc.com.cn/router/rest",
    ucurl = "http://gw.fdc.com.cn/router/rest",
    adver_api = "http://query.yahooapis.com/v1/public/yql";

/*
 *  zzc  测试环境配置
 *  @param  {[string]}  secApi      二手房api地址
 *  @param  {[string]}  newApi      新房api地址
 *  @param  {[string]}  uc_login    用户中心登录地址
 *  @param  {[string]}  secHref     二手房域名
 */
var secApi = "http://gw.fdc.com.cn/router/rest",
    newApi = "http://gw.fdc.com.cn/router/rest",
    uc_login = "http://uc.m.fdc.com.cn/userlogin.html",
    newHref = "http://house.m.fdc.com.cn";


var img_size = ["@115w_84h_1e_1c","@332w_230h_1e_1c","@240w_180h_1e_1c","@311w_150h_1e_1c","@640w"];