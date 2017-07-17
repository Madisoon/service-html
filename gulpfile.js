/**
 * Created by Msater Zg on 2017/1/6.
 */
var gulp = require('gulp');
var scss = require('gulp-scss');
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var cssmin = require('gulp-clean-css');
var autoprefixer = require('gulp-autoprefixer');
var imagemin = require('gulp-imagemin');
var babel = require("gulp-babel");
var concatJs = require('gulp-concat');


// 压缩所有 static html
gulp.task('minifyHtml', function () {
    var options = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    };
    gulp.src(['static/**/*.html'])
        .pipe(htmlmin(options))
        .pipe(gulp.dest('htmlcompress/static'));
});

// 将es6 js转成 es5
gulp.task("babelEs6", function () {
    return gulp.src(['static/**/*.js'])// ES6 源码存放的路径
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('htmlcompress/static')); //转换成 ES5 存放的路径
});


//压缩js的方法
gulp.task('minifyJs', function () {
    gulp.src(['static/**/*.js'])
        .pipe(uglify({
            //mangle: true,//类型：Boolean 默认：true 是否修改变量名
            mangle: {except: ['require', 'exports', 'module', '$']}//排除混淆关键字
        }))
        .pipe(gulp.dest('htmlcompress/static'));
});
// 合并js的方法
gulp.task('testConcat', function () {
    gulp.src('src/js/*.js')
        .pipe(concatJs('all.js'))//合并后的文件名
        .pipe(gulp.dest('dist/js')); // 保存的路径
});
// 压缩css
gulp.task('minifyCss', function () {
    gulp.src(['static/**/*.css'])
        .pipe(cssmin())
        .pipe(gulp.dest('htmlcompress/static'));
});
// 将scss转成css
gulp.task('transFormScss', function () {
    gulp.src(['static/header.scss'])
        .pipe(scss())
        .pipe(gulp.dest('htmlcompress/static'));
});

// 压缩img
gulp.task('minifyImage', function () {
    gulp.src('static/img/*.{png,jpg,gif,ico}')
        .pipe(imagemin({
            optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
            progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
            interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
            multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
        }))
        .pipe(gulp.dest('htmlcompress/static/img'));
});


gulp.task('finishTask', ['minifyHtml', 'minifyJs', 'minifyCss', 'minifyImage'], function () {
    console.log("执行完成");
});

/*// 转为css


 // 压缩css
 gulp.task('testCssmin', function () {
 gulp.src('src/css/!*.css')
 .pipe(cssmin({
 advanced: false,//类型：Boolean 默认：true [是否开启高级优化（合并选择器等）]
 compatibility: 'ie7',//保留ie7及以下兼容写法 类型：String 默认：''or'*' [启用兼容模式； 'ie7'：IE7兼容模式，'ie8'：IE8兼容模式，'*'：IE9+兼容模式]
 keepBreaks: true,//类型：Boolean 默认：false [是否保留换行]
 keepSpecialComments: '*'
 //保留所有特殊前缀 当你用autoprefixer生成的浏览器前缀，如果不加这个参数，有可能将会删除你的部分前缀
 }))
 .pipe(gulp.dest('dist/css'));
 });


 //浏览器兼容问题
 gulp.task('testAutoFx', function () {
 gulp.src('src/css/index.css')
 .pipe(autoprefixer({
 browsers: ['last 2 versions', 'Android >= 4.0'],
 cascade: true, //是否美化属性值 默认：true 像这样：
 //-webkit-transform: rotate(45deg);
 //        transform: rotate(45deg);
 remove: true //是否去掉不必要的前缀 默认：true
 }))
 .pipe(gulp.dest('dist/css'));
 });
 /!*
 ● last 2 versions: 主流浏览器的最新两个版本
 ● last 1 Chrome versions: 谷歌浏览器的最新版本
 ● last 2 Explorer versions: IE的最新两个版本
 ● last 3 Safari versions: 苹果浏览器最新三个版本
 ● Firefox >= 20: 火狐浏览器的版本大于或等于20
 ● iOS 7: IOS7版本
 ● Firefox ESR: 最新ESR版本的火狐
 ● > 5%: 全球统计有超过5%的使用率*!/*/



