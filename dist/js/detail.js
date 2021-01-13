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


define('modules/cartStorage',['jquery'],function($){

    var key='cartList';
    function addCartStorage(data,cb){
       //console.log(data);  //打印添加购物车的商品数据
       var storageData=getCartStorage();
       var flag=true;
       var index=0;
       for(var i=0;i<storageData.length;i++){
            if(storageData[i].goodsName == data.goodsName && storageData[i].goodsColor == data.goodsColor ){
                flag=false;
                index=i;
            }
       }

       if(flag){        //添加新数据
            storageData.push(data);
            setCartStorage(storageData);
       }else{           //要累加一条数据
            storageData[index].goodsNumber+=data.goodsNumber;
            setCartStorage(storageData);
       }
        cb();
    }

    function setCartStorage(arr){
        localStorage.setItem(key,JSON.stringify(arr));
    }

    function getCartStorage(){
        return JSON.parse(localStorage.getItem(key) || '[]');
    }

    return {
        addCartStorage,
        setCartStorage,
        getCartStorage
    }
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

//['jquery','/js/modules/banner.js', '/js/modules/cartStorage.js' ,'/api/server.js']
define('detail',['jquery','./modules/banner','./modules/cartStorage','../api/server'] , 
function($ , initBanner ,{addCartStorage},{ Banner2Data,detailData}){

    Banner2Data().then((res)=>{
        if(res.code == 0){
            initBanner( res.banner_list );
        }
    });    


    var type=location.href.match(/type=([^&]+)/)[1];
    var id=location.href.match(/id=([^&]+)/)[1];
    // console.log(type,id)
    detailData(type,id).then((data)=>{
        // console.log(data)
        initDetail(data);
    })

    function initDetail(data){
        var $detail = $('#detail');
        var $detailGoods = $('#detailGoods');

        $detail.html(`
        <div class="detail_gallery l">
            <div class="detail_gallery_normal">
                <img src="${data.photoNormal}" alt="">
                <span></span>
            </div>
            <div class="detail_gallery_large">
                <img src="${data.photoLarge}" alt="">
            </div>
        </div>
        <div class="detail_message l">
            <h2>${data.goodsName}</h2>
            <p>价 格 <span class="detail_message_price">¥${data.goodsPrice}.00</span></p>
            <p>选择颜色 
                ${
                    data.chooseColor.map((v,i)=>{
                        return `<span class="detail_message_box">${v}</span>`;
                    }).join('')
                }
            </p>
            <div class="detail_message_btn clearfix">
                <div class="detail_message_num l">
                    <input type="text" value="1">
                    <span>+</span>
                    <span>-</span>
                </div>
                <div class="detail_message_cart l"><a href="javascript:;">加入购物车</a></div>
                <div class="detail_message_computed l"><a href="/view/cart.html">立即下单</a></div>
            </div>
        </div>
    `);
    $detailGoods.html(`
    <h3>-- 商品详情 --</h3>
    ${
        data.goodsInfo.map((v,i)=>{
            return `<img src="${v}" alt="">`;
        }).join('')
    }
`);

    bindGallery();
    chooseInfo(data);
    function bindGallery(){
        var $detail_gallery_normal = $('.detail_gallery_normal');
        var $detail_gallery_normal_span = $detail_gallery_normal.find('span');
        var $detail_gallery_large = $('.detail_gallery_large');
        var $detail_gallery_large_img = $detail_gallery_large.find('img');

        $detail_gallery_normal.hover(function(){            //hover 鼠标移入移出 第一个回调为移入，第二个回调为移出
            $detail_gallery_normal_span.show();
            $detail_gallery_large.show();
        },function(){
            $detail_gallery_normal_span.hide();
            $detail_gallery_large.hide();
        }).mousemove(function(ev){

            var L = ev.pageX - $detail_gallery_normal.offset().left - $detail_gallery_normal_span.width()/2;
            var T = ev.pageY - $detail_gallery_normal.offset().top - $detail_gallery_normal_span.height()/2;

            if(L < 0){
                L = 0;
            }
            else if(L > $detail_gallery_normal.width() - $detail_gallery_normal_span.width()){
                L = $detail_gallery_normal.width() - $detail_gallery_normal_span.width();
            }

            if(T < 0){
                T = 0;
            }
            else if(T > $detail_gallery_normal.height() - $detail_gallery_normal_span.height()){
                T = $detail_gallery_normal.height() - $detail_gallery_normal_span.height();
            }

            $detail_gallery_normal_span.css({
                left : L,
                top : T
            });

            var scaleX = L / ($detail_gallery_normal.width() - $detail_gallery_normal_span.width());
            var scaleY = T / ($detail_gallery_normal.height() - $detail_gallery_normal_span.height());

            $detail_gallery_large_img.css({
                left : - scaleX * ( $detail_gallery_large_img.width() - $detail_gallery_large.width() ),
                top : - scaleY * ( $detail_gallery_large_img.height() - $detail_gallery_large.height() )
            });

        });
    }

    function chooseInfo(data){  // 右侧信息的交互
        var $detail_message_box = $('.detail_message_box');
        var $span = $('.detail_message_num span');
        var $input = $('.detail_message_num input');
        var $detail_message_cart = $('.detail_message_cart');
        var goodsData={};
        $detail_message_box.click(function(){
            $(this).addClass('active').siblings().removeClass('active');
        });
        $span.eq(0).click(function(){
            $input.val(Number($input.val()) + 1);
        });
        $span.eq(1).click(function(){
            if( $input.val() > 1 ){
                $input.val(Number($input.val()) - 1);
            }
        });
        $input.on('input',function(){
            if( isNaN(Number($(this).val())) ){
                $(this).val(1);
            }
        });

        //添加购物车按钮
        $detail_message_cart.click(function(){
            goodsData.goodsName = data.goodsName;
            goodsData.goodsPrice = data.goodsPrice;
            goodsData.goodsColor = $detail_message_box.filter('.active').html();        //filter jq中过滤方法
            goodsData.goodsNumber = Number($input.val());
            goodsData.goodsChecked = true;

            addCartStorage(goodsData,function(){
                alert('添加成功');
            });
        });
    }
    
    }

    
});
