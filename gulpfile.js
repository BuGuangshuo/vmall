var {series,parallel,src,dest,watch}=require('gulp');

var clean=require('gulp-clean');
var fileInclude = require('gulp-file-include');
var webserver=require('gulp-webserver');
var sass=require('gulp-sass');
//清理dist文件夹的任务
function cleanTask(){
    return src('./dist',{allowEmpty:true})
        .pipe(clean())
}

//html的处理任务
function htmlTask(){
    return src('./src/view/*.html')
            .pipe(fileInclude({
                prefix : '@',               
                basepath : './src/view/templates'
            }))
            .pipe(dest('./dist/view'));
}

//开启web服务器(在浏览器中预览编写的代码)
function webTask(){
    return src('./dist')
              .pipe(webserver({
                host : 'localhost',
                port : 4000,
                open : './view/index.html',  // dist下的index.html
                livereload : true
              }));
}

//同步静态资源到dist
function staticTask(){
    return src('./src/static/**')
            .pipe(dest('./dist/static'));
}

//同步lib到dist
function libTask(){
    return src('./src/lib/**')
            .pipe(dest('./dist/lib'));
}

//同步api到dist
function apiTask(){
    return src('./src/api/**')
            .pipe(dest('./dist/api'));
}

//同步js到dist
function jsTask(){
    return src('./src/js/**')
            .pipe(dest('./dist/js'));
}

function sassTask(){
    return src('./src/css/*.scss')
        .pipe(sass())
        .pipe(dest('./dist/css'))
}
// 实时的把src中的代码同步到dist中，进行实时预览
function watchTask(){
    watch('./src/view/**' , htmlTask);
    watch('./src/static/**' , staticTask);
    watch('./src/lib/**' , libTask);
    watch('./src/api/**' , apiTask);
    watch('./src/js/**' , jsTask);
    watch('./src/css/**' , sassTask);
}
//提供接口
module.exports={
    //开发调用的接口
    dev:series(cleanTask,parallel(htmlTask , staticTask , libTask , apiTask,sassTask, jsTask),parallel(webTask,watchTask)),
    //生产调用的接口
    build:series(cleanTask)
}