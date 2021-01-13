requirejs.config({
    paths : {
        'jquery' : '/lib/jquery-3.4.1.min'
    }
});

//绝对路径需要带后缀名
// ['jquery','/js/modules/banner.js' , '/api/server.js']
define(['jquery','./modules/banner' , '../api/server'],function($, initBanner , { BannerData , goodsData }){
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