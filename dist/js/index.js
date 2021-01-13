define('modules/banner',['jquery'],function($){
    var $bannerList=$('.banner-list');
    function initBanner(data){
        //console.log(data);
        $bannerList.html(`
        <ul>
            ${
                data.map((v,i)=>{
                    return `
                        <li class="${ i==0 ? 'show' : '' }"><a href="${v.imgLink}"><img src="${v.imgUrl}" alt=""></a></li>
                    `;
                }).join('')
            }
        </ul>
        <ol>
                ${
                    data.map((v,i)=>{
                        return `
                            <li class="${ i==0 ? 'active' : '' }"></li>
                        `;
                    }).join('')
                }
            </ol>
        `);
        bindBanner();
    }

    function bindBanner(){

        var $ulLi = $bannerList.find('ul li');
        var $btn_pre=$('#banner .button-slider-prev');
        var $btn_next=$('#banner .button-slider-next');
        var $olLi=$bannerList.find('ol li');
        var $img=$bannerList.find('ul li img');
        var now=0;
        var timer;
        autoBanner();
        $bannerList.on('mouseover','ol li',function(){
            $(this).attr('class','active').siblings().attr('class','');
            $ulLi.eq( $(this).index() ).attr('class','show').siblings().attr('class','');
            now=$(this).index();       
        })

        $bannerList.on('mouseover',function(){
            clearInterval(timer);
        })

        $bannerList.on('mouseout',function(){
            autoBanner();
        })

        $btn_pre.on('click',function(){
            now--;
            if(now==-1){
                now=$ulLi.length-1;
            }
            $ulLi.eq(now).attr('class','show').siblings().attr('class','');
            $olLi.eq(now).attr('class','active').siblings().attr('class','');
        });
    
        $btn_next.on('click',function(){
            now++;
            if(now==$ulLi.length&&now==$olLi.length){
                now=0;
            }
            $ulLi.eq(now).attr('class','show').siblings().attr('class','');
            $olLi.eq(now).attr('class','active').siblings().attr('class','');
        });    

        function autoBanner(){
            timer=setInterval(function() {
            now++;
            if(now==$ulLi.length&&now==$olLi.length){
                now=0;
            }
            $ulLi.eq(now).attr('class','show').siblings().attr('class','');
            $olLi.eq(now).attr('class','active').siblings().attr('class','');
        }, 5000);
    }
        
    }
    
    return initBanner;
});
//统一处理vmall中的所有数据接口
define('../api/server',['jquery'],function($){
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
});
requirejs.config({
    paths : {
        'jquery' : '/lib/jquery-3.4.1.min'
    }
});

//绝对路径需要带后缀名
// ['jquery','/js/modules/banner.js' , '/api/server.js']
define('index',['jquery','./modules/banner' , '../api/server'],function($, initBanner , { BannerData , goodsData }){
    //console.log($);
    BannerData().then((res)=>{
        if(res.code==0){
            //让数据跟跟功能结合
            initBanner(res.banner_list)
        }
    });

    goodsData('phone').then((res)=>{
        if(res.code == 0){
            initGoods('#phone' , res);
        }
    });

    goodsData('book').then((res)=>{
        if(res.code == 0){
            initGoods('#book' , res);
        }
    });
    goodsData('pad').then((res)=>{
        if(res.code == 0){
            initGoods('#pad' , res);
        }
    });
    // 商品列表的渲染
    function initGoods(id,res){
        var $con=$(id);
        $con.html(`
        <h2 class="goods_title">${res.title}</h2>
        <ul class="goods_list clearfix">
            ${
                res.goods_list.map((v,i)=>{
                    return `
                        <li>
                            <a href="/view/detail.html?type=${res.type}&id=${v.goodsId}" target="_blank">
                                <div><img src="${v.goodsImg}" alt=""></div>
                                <h3>${v.goodsName}</h3>
                                <p>¥${v.goodsPrice}</p>
                            </a>
                        </li> 
                    `;
                }).join('').repeat(3)
            }
        </ul>
        `);
    }
});
