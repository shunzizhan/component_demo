
//项目配置，将name、version独立配置，统管全局
var proName = 'house',v='1.0.2';
fis.set('name', proName);
fis.set('version', v);
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
// fis.set('project.files', [

//   '*.css',
//   '*.js',
//   '*.html',
//   '*.{png,jpg,gif}'
// ]);
// 排除指定目录和文件
fis.set('project.ignore', [
    '.git/**',
    '.svn/**',
    '{node_modules,_pre,_build,components}/**',
    
    // '_pre/**',
    // '_build/**',
    // 'components/**',
    '*.{cmd,md,zip,rar}',
    "{package,map}.json",
    "fis-conf.js"
]);


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
    // useSprite: true,
    optimizer: fis.plugin('clean-css'),
    preprocessor: fis.plugin('cssprefixer', {
        "browsers": ["FireFox > 1", "Chrome > 1", "ie >= 8"],
        "cascade": true
    }),
    release: '/public/css/$1'
  })
  .match(/^\/public\/js\/(.*)$/i, {
    id : '$1',
    release: '/public/js/$1'
  })
  .match(/^\/public\/tpl\/(.*)$/i, {
    release: false
  })
  // ************************************
  // *********组件*******************
  // ************************************
  .match(/^\/components\/\w+\/(\w+)\.less$/i, {
    parser: fis.plugin('less'),
    rExt: '.css',
    // useHash: true,
    useSprite: true,
    optimizer: fis.plugin('clean-css'),
    preprocessor: fis.plugin('cssprefixer', {
        "browsers": ["FireFox > 1", "Chrome > 1", "ie >= 8"],
        "cascade": true
    }),
    release: '/${name}_${version}/css/c/$1'
  })
  .match(/^\/components\/\w+\/(\w+)\.js$/i, {
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
    release: '/${name}_${version}/js/c/$1'
  })
  .match('/components/**.{html,tpl}', {
    release: false
  })
  // ************************************
  // *********业务逻辑*******************
  // ************************************
  // less
  .match(/^\/pages\/\w+\/(\w+)\.less$/i, {
    parser: fis.plugin('less'),
    rExt: '.css',
    // useHash: true,
    // useSprite: true,
    optimizer: fis.plugin('clean-css'),
    preprocessor: fis.plugin('cssprefixer', {
        "browsers": ["FireFox > 1", "Chrome > 1", "ie >= 8"],
        "cascade": true
    }),
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
    // isViews : true
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
    }),
    postpackager: fis.plugin('loader', {
      allInOne: {
        ignore:['/libs/**','/public/**'],
        js: function (file) {
          return "/"+proName+"_"+v+"/js/" + file.filename + "_aio.js";
        },
        css: function (file) {
          return "/"+proName+"_"+v+"/css/" + file.filename + "_aio.css";
        }
      }   
    })
  })
  .match('**.png', {
    optimizer: fis.plugin('png-compressor', {
        type: 'pngquant'
    })
  })

// 测试开发
fis.media('test')
    .match("*", {
        domain: "${domain_test}",
    })
     // Mock 假数据模拟 
    // https://github.com/fex-team/fis3/blob/dev/doc/docs/node-mock.md
    .match('/mock/**', {
      release: '$0'
    })
    .match('/mock/server.conf', {
      release: '/config/server.conf'
    });

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
        ignoreWords:['ko','ignore','STYLE_PLACEHOLDER','SCRIPT_PLACEHOLDER'], //删除注释时，需要过滤的字眼，主要排除模板引擎自带的注释
        minifier:false //是否压缩
      })
    })
    .match('/mock/server.conf', {
      release: '/config/server.conf'
    })
    .match('*', {
      deploy: [
        fis.plugin('skip-packed', {
          // 配置项
          skipPackedToCssSprite:true,
          skipPackedToPkg:true
          // skipPackedToAIO:true
        }),
        fis.plugin('local-deliver', {
          to:'./_build'
        })
      ]
    })

