// 保持发布使用相对路径
// fis.hook('relative');

//域
// 测试环境
fis.set('domain_test', '..'); //开发环境静态资源
// 预发布环境
fis.set('domain_pre', '..');
// 线上环境
fis.set('domain_build', '..');
// 定义版本号
fis.set('version', '1.0.0');

// // 排除指定目录和文件
// fis.set('project.files', [
//     '.git/**',
//     '.svn/**',
//     'node_modules/**',
//     '*.bat',
//     '*.cmd',
//     '*.log',
//     'fis-conf.js',
//     "package.json",
//     "**/___*.png", //过滤三下划线开头的预览图片
//     '**/*.less'
// ]);
// 过滤指定的文件类型
fis.set('project.files', [
  '*.css',
  '*.js',
  '*.{png,jpg,gif}',
  '*.html',
  '*.htm',
  'flvplayer/**'
  // 'mock/**',
  // 'map/**',
  // 'data_test/**'
]);

fis.match("*", {
        // domain: "${domain_pre}",
        relative: true
    })
    .match('lib/**', {
      release:"js/$0"
    })
    .match('/({**,!core})/(*.less)', {
        parser: fis.plugin('less'),
        rExt: '.css',
        useSprite: true,
        optimizer: fis.plugin('clean-css'),
        preprocessor: fis.plugin('cssprefixer', {
          "browsers": ["FireFox > 1", "Chrome > 1", "ie >= 8"],
          "cascade": true
        }),
        release: '/css/$2'
    })
    // 压缩图片
    .match('*.png', {
        optimizer: fis.plugin('png-compressor', {
            type: 'pngquant'
        })
    })
    // 将合成的雪碧图直接放在images/sprite文件中
    .match('({tpl,css,less})/(**.{png,jpg,gif})', {
      //发布到/images/sprite/xxx目录下
      release: '/images/sprite/$1'
    })
    // .match('/({**,!lib/**})/(*.js)', {
    .match('/({js/,tpl/**})(*.js)', {
      // 启用hash值
      // useHash: true,
      // 压缩文件
      optimizer: fis.plugin('uglify-js', {
        mangle: {
          except: 'lib, exports, module, require, define,$' //不需要混淆的关键字
        },
        compress: {
          drop_console: true //自动删除console
        }
      }),
      release: "js/$2"
    })
    .match('tpl/**.html', {
      release: false
    })
    .match('/*.html', {
      release: "html/$0"
    })
    .match('::package', {
      spriter: fis.plugin('csssprites', {
        htmlUseSprite: true, //开启模板内联css处理,默认关闭
        styleReg: /(<style(?:(?=\s)[\s\S]*?["'\s\w\/\-]>|>))([\s\S]*?)(<\/style\s*>|$)/ig,
        margin: 15 //图之间的边距
      }),
      postpackager: fis.plugin('loader', {
        allInOne: {
          ignore:['lib/**'],
          sourceMap:true,
          js: function (file) {
            // return "/"+proName+"_"+v+"/js/" + file.filename + "_aio.js";
            return "/js/" + file.filename + "_aio.js";
          },
          css: function (file) {
            return "/css/" + file.filename + "_aio.css";
          }
        }
      })
    })

    // .match('**', {
    //   deploy: [
    //     fis.plugin('skip-packed', {
    //       // 配置项
    //       skipPackedToCssSprite:true,
    //       skipPackedToPkg:true,
    //       skipPackedToAIO:true
    //     })
    //   ]
    // })

// 测试开发
fis.media('test')
    .match("*", {
        domain: "${domain_test}",
    });

fis.media('webapp')
    .match("*", {
        domain: "${domain_test}"
        //release: "F:/fdc_java_master/home-nh/home-nh-web/src/main/webapp",
    })
    .match("tpl/**", {
        // release: false
    })
    .match('**', {
      deploy: [
        fis.plugin('skip-packed', {
          // 配置项
          skipPackedToCssSprite:true,
          skipPackedToPkg:true,
          skipPackedToAIO:true
        }),

        fis.plugin('local-deliver', {
          // to: 'F:/fdc_java_master/fdc/home-nh/home-nh-web/src/main/webapp'
          // to: 'F:/fdc_home-nh/home-nh-web/src/main/webapp'
          to:'../webapp'
        })
      ]
    })


// 预发布
fis.media('pre')
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
    .match('*', {
      domain: "${domain_build}"
    })
