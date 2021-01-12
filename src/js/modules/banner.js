define(['jquery'],function($){
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
})