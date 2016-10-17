
//项目配置，将name、version独立配置，统管全局
fis.set('name', 'proj');
fis.set('version', '1.0.1');
// 测试环境
fis.set('domain_test', ''); //开发环境静态资源
// 预发布环境
fis.set('domain_pre', '');
// 线上环境
// fis.set('domain_build', 'http://img3.fdc.com.cn');
fis.set('domain_build', '');
// 定义不同域的url
var domain_url = {
  test:{
    "csdn_url":"http://blog.test.csdn.net",
    "github_url":"https://github.test.com",
    "fdc_img3_url":"http://img3.test.fdc.com.cn"
  },
  pre:{
    "csdn_url":"http://preblog.csdn.net",
    "github_url":"https://pregithub.com",
    "fdc_img3_url":"http://preimg3.fdc.com.cn"
  },
  build:{
    "csdn_url":"http://blog.csdn.net",
    "github_url":"https://github.com"
  }
}

// 过滤指定的文件类型
fis.set('project.files', [
  '*.css',
  '*.js',
  '*.html',
  '*.{png,jpg,gif}'
]);
// 排除指定目录和文件
fis.set('project.ignore', [
    '.git/**',
    '.svn/**',
    'node_modules/**',
    '*.cmd',
    '_pre/**',
    '_build/**',
    "package.json",
    "fis-conf.js"
]);


//postpackager插件接受4个参数，
//ret包含了所有项目资源以及资源表、依赖树，其中包括：
//   ret.src: 所有项目文件对象
//   ret.pkg: 所有项目打包生成的额外文件
//   reg.map: 资源表结构化数据
//其他参数暂时不用管
var createFrameworkConfig = function(ret, conf, settings, opt){
    var map = {};
    map.deps = {};
    fis.util.map(ret.src, function(subpath, file){
      if(file.subdirname =="/pages/search"){
        console.log("/////////////////////////////////");
        console.log(file.id);
        console.log("????????????")
        // console.log(file);
        console.log(file.requires);
        console.log("/////////////////////////////////");
      }
      if(file.requires && file.requires.length){
          map.deps[file.id] = file.requires;
      }
    });
    //把配置文件序列化
    var stringify = JSON.stringify(map, null, opt.optimize ? null : 4);

    //再次遍历文件，找到isViews标记的文件
    //替换里面的__FRAMEWORK_CONFIG__钩子
    fis.util.map(ret.src, function(subpath, file){
        //有isViews标记，并且是js或者html类文件，才需要做替换
        if(file.isViews && (file.isJsLike || file.isHtmlLike)){
            var content = file.getContent();
            //替换文件内容
            content = content.replace(/\b__FRAMEWORK_CONFIG__\b/g, stringify);
            file.setContent(content);
        }
    });
};
//在modules.postpackager阶段处理依赖树，调用插件函数
fis.config.set('modules.postpackager', [createFrameworkConfig]);

fis
  // ********静态资源**********************
  // **包含第三方库文件，通用的js/css/img**
  // **************************************
  .match(/^\/libs\/(.*)$/i, {
    id : '/public/libs/$1',
    release: '/public/libs/$1'
  })
  .match(/^\/public\/img\/(.*)$/i, {
    release: '/public/images/$1'
  })
  .match(/^\/public\/less\/(\w+)\.less$/i, {
    parser: fis.plugin('less'),
    // rExt: '.css'
    rExt: '.css',
    id : '/public/css/$1',
    useSprite: true,
    optimizer: fis.plugin('clean-css'),
    release: '/public/css/$1'
  })
  // .match(/^\/public\/css\/(\w+)\.css$/i, {
  //   useSprite: true,
  //   optimizer: fis.plugin('clean-css')
  //   // release: '/public/css/$1?v=${version}'
  // })
  .match(/^\/public\/js\/(.*)$/i, {
    id : '$1',
    release: '/public/js/$1'
  })
  .match(/^\/public\/tpl\/(.*)$/i, {
    release: false
  })
  // ************************************
  // *********业务逻辑*******************
  // ************************************
  // less
  .match(/^\/pages\/\w+\/(\w+)\.less$/i, {
    parser: fis.plugin('less'),
    rExt: '.css',
    useHash: true,
    useSprite: true,
    optimizer: fis.plugin('clean-css'),
    id : '$1.css',
    isViews : true,
    release: '/${name}_${version}/css/$1'
  })
  // js
  .match(/^\/pages\/\w+\/(\w+)\.js$/i, {
    // 启用hash值
    // useHash: true,
    // 压缩文件
    optimizer: fis.plugin('uglify-js', {
        mangle: {
          except: 'exports, module, require, define' //不需要混淆的关键字
        },
        compress: {
          drop_console: true //自动删除console
        }
    }),
    id : '$1.js',
    isViews : true,
    release: '/${name}_${version}/js/$1'
  })
  // 图片
  .match(/^\/pages\/(\w+)\/img\/(.*)$/i, {
    // 启用hash值
    useHash: true,
    release: '/${name}_${version}/images/$1/$2'
  })
  // html
  .match(/^\/pages\/\w+\/(\w+)\.html$/i, {
    release: '/${name}_${version}/views/$1'
  })
  // ************通用***************
  // *******************************
  // 雪碧图
  .match('::package', {
    spriter: fis.plugin('csssprites', {
      htmlUseSprite: true, //开启模板内联css处理,默认关闭
      styleReg: /(<style(?:(?=\s)[\s\S]*?["'\s\w\/\-]>|>))([\s\S]*?)(<\/style\s*>|$)/ig,
      margin: 5 //图之间的边距
    })
  })


// 测试开发
fis.media('test')
    .match("*", {
        domain: "${domain_test}",
    })

// 预发布
fis.media('pre')
    .match('*.html', {
      parser: fis.plugin('html-replaceurl', {
        newWords:domain_url.pre,
        removeComments:true, //是否删除注释
        ignoreWords:['ko'], //删除注释时，需要过滤的字眼，主要排除模板引擎自带的注释
        minifier:true //是否压缩
      })
    })
    .match("*", {
      domain: "${domain_pre}",
      // deploy: [
      //   fis.plugin('skip-packed', {
      //     // 配置项
      //     skipPackedToCssSprite:true
      //   }),
      //   fis.plugin('http-push', {
      //     // receiver: 'http://192.168.1.9:8999/receiver',
      //     // //远端目录
      //     // to: '/root/fis_test/test/'
      //   })
      // ]
    });

// 线上
fis.media('build')
    .match("*", {
        domain: "${domain_build}",
    })
    .match('*.html', {
      // npm install -g fis3-parser-html-replaceurl
      parser: fis.plugin('html-replaceurl', {
        newWords:domain_url.build,
        removeComments:true, //是否删除注释
        ignoreWords:['ko'], //删除注释时，需要过滤的字眼，主要排除模板引擎自带的注释
        minifier:false //是否压缩
      })
    });
    // .match('*', {
    //   domain: "${domain_build}"
    // })
    // .match('*.html', {
    //   deploy: fis.plugin('http-push', {
    //     receiver: 'http://192.168.1.9:8999/receiver',
    //     //远端目录
    //     to: '/root/fis_test/html/'
    //   })
    // })
    // .match('/{js,css,images}/**', {
    //   deploy: [
    //     fis.plugin('skip-packed', {
    //       // 配置项
    //       skipPackedToCssSprite:true
    //     }),
    //     fis.plugin('http-push', {
    //       receiver: 'http://192.168.1.9:8999/receiver',
    //       //远端目录
    //       to: '/root/fis_test/other/'
    //     })
    //   ]
    // })

