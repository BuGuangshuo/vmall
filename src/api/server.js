//统一处理vmall中的所有数据接口
define(['jquery'],function($){
    function BannerData(){
        //返回的是一个promise对象
        return $.ajax('/api/mock/banner.json');
    }

    function Banner2Data(){
        //返回的是一个promise对象
        return $.ajax('/api/mock/banner2.json');
    }

    function goodsData(type){
        return $.ajax(`/api/mock/${type}.json`);
    }
    return {
        BannerData,
        Banner2Data,
        goodsData
    }
})