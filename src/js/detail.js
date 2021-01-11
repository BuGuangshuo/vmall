

requirejs.config({
    paths : {
        'jquery' : '/lib/jquery-3.4.1.min'
    }
});


define(['jquery','/js/modules/banner.js','/api/server.js'] , function($ , initBanner , { Banner2Data }){

    Banner2Data().then((res)=>{
        if(res.code == 0){
            initBanner( res.banner_list );
        }
    });    

});