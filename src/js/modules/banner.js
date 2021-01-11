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

        $bannerList.on('mouseover','ol li',function(){
            $(this).attr('class','active').siblings().attr('class','');
            $ulLi.eq( $(this).index() ).attr('class','show').siblings().attr('class','');
        })
    }
    return initBanner;
})