### 模块化模板
@[模块化|资源定向|正则|]

本文参照于 http://www.infoq.com/cn/articles/talk-front-end-integrated-solution-part2/，依赖与fis3,涉及文件的压缩、md5、资源重定向等
#### 安装html处理插件
> npm install -g `fis3-parser-html-replaceurl`

**说明**如果没有使用到html静态资源处理，该插件不需要安装

#### 目录结构
##### 编译前
![enter image description here](https://cloud.githubusercontent.com/assets/7811369/19230978/14d354c4-8f0a-11e6-9497-aa832fa91d60.png)
##### 编译后
![enter image description here](https://cloud.githubusercontent.com/assets/7811369/19230996/2ceb1fc4-8f0a-11e6-9079-e7c4dc6d5748.png)
##### 目录结构简介
- **component_demo** 项目名称
  - **libs** 存放第三方库文件 最后编译到`public`中的`libs`中
    - **jq**
    - **XXX**
  - **pages** 存放业务模块与功能模块
    - **weather** 具体的某一个业务模块或功能模块
      - **img** 业务对应的图片文件夹，编译后到`proj_x.x.x/images/weather/`中
      - *less* 具体业务或功能所对应的特有样式文件，最后编译到`proj_x.x.x/css/`中
      - *js*  具体业务或功能所对应的特有脚本文件，最后编译到`proj_x.x.x/js/`中
      - *html*业务模块则会生成到`proj_x.x.x/`
    - **search**与`weather`相类似
  - **public** 通用文件，包含对外提供
    - **less**存放基础的通用样式文件，其中包含`core/variables.less`,编译至`public/css/`
    - **js**存放通用的js文件，以及对外提供的js文件，最后编译至`public/js/`
    - **img** 通用的图片文件，包含但不限于`public/less/`中使用的图片，最后生成至`public/images/`
    
> **说明**
 -  proj_x.x.x为`项目名称_版本号`,名称和版本号都在fis-conf.js中配置，每一次升级，只需修改版本号`fis.set('version', '1.0.0')`即可，程序会自动打包到对应的版本目录中，对以前的版本不会破坏，以保证在发布失败后，能迅速回滚到指定的版本
 -  public 文件夹中的文件之所以不受版本控制，是考虑对外提供的js,若带有版本区别，则需每次去其他项目进行修改，理想情况下，一个公司只需有一个public库，这里只存放具有高度抽象和被重复使用到的文件，譬如公司的logo、公司项目顶部、底部通用样式、以及整站登录等文件