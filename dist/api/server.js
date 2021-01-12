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

    function detailData(type , id){
        var promise = new Promise((resolve,reject)=>{
            $.ajax(`/api/mock/${type}.json`).then((res)=>{
                if(res.code == 0){
                    for(var i=0;i<res.goods_list.length;i++){
                        if( res.goods_list[i].goodsId == id ){
                            resolve(res.goods_list[i]);
                        }
                    }
                }
            });
        });
        return promise;
    }
    return {
        BannerData,
        Banner2Data,
        goodsData,
        detailData
    }
})