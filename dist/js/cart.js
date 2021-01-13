

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


requirejs.config({
    paths : {
        'jquery' : '/lib/jquery-3.4.1.min'
    }
});
//['jquery','/js/modules/cartStorage.js']
define('cart',['jquery','./modules/cartStorage'],function($ , { getCartStorage , setCartStorage }){

    var storageData;
    var $cart_title_selectAll = $('.cart_title_selectAll');
    initCartList();
    //初始化购物车
    function initCartList(){
        var $cart_list=$('.cart_list');
        var $cart_title_selectAll = $('.cart_title_selectAll');
        var $cart_computed_price_p = $('.cart_computed_price p');
        var moneyAll = 0;
        var numberAll = 0;

        storageData=getCartStorage();
        $cart_list.html(
            storageData.map((v,i)=>{
                return `
                    <li>
                        <div>
                            ${
                                v.goodsChecked ? '<input class="cart_list_cb" type="checkbox" checked>' : '<input class="cart_list_cb" type="checkbox">'
                            }
                        </div>
                        <div>${v.goodsName} ( ${v.goodsColor} )</div>
                        <div>¥ ${v.goodsPrice}.00</div>
                        <div>
                            <span class="cart_list_reduce">-</span>
                            <input class="cart_list_text" type="text" value="${v.goodsNumber}">
                            <span class="cart_list_add">+</span>
                        </div>
                        <div>¥ ${ v.goodsPrice * v.goodsNumber }.00</div>
                        <div class="cart_list_remove">删除</div>
                    </li>
                `;
            }).join('')
        );
        $cart_title_selectAll.get(0).checked = storageData.every((v)=>{
            return v.goodsChecked == true;
        });

        storageData.forEach((v,i)=>{
            if( v.goodsChecked ){
                moneyAll += v.goodsPrice * v.goodsNumber;
                numberAll += v.goodsNumber;
            }
        });

        $cart_computed_price_p.eq(0).html(`总计：¥ ${moneyAll}.00`);
        $cart_computed_price_p.eq(1).html(`已选择 ${numberAll} 件商品`);

        
        bindCardList();
    }

    function bindCardList(){
        var $cart_list_add = $('.cart_list_add');
        var $cart_list_reduce = $('.cart_list_reduce');
        var $cart_list_remove = $('.cart_list_remove');
        var $cart_list_cb = $('.cart_list_cb');

        $cart_list_add.off().click(function(){
            var index=$(this).closest('li').index()
            storageData[index].goodsNumber++;
            setCartStorage(storageData);
            initCartList();
        });
        $cart_list_reduce.off().click(function(){
            var index = $(this).closest('li').index();
            if(storageData[index].goodsNumber > 0){
                storageData[index].goodsNumber--;
                setCartStorage(storageData);
                initCartList();
            }
        });

        $cart_list_remove.off().click(function(){
            var index = $(this).closest('li').index();
            storageData.splice( index , 1 );
            setCartStorage(storageData);
            initCartList();
        });

        $cart_list_cb.off().click(function(){
            var index = $(this).closest('li').index();
            storageData[index].goodsChecked = !storageData[index].goodsChecked;
            setCartStorage(storageData);
            initCartList();
        });

        $cart_title_selectAll.off().click(function(){
            for(var i=0;i<storageData.length;i++){
                storageData[i].goodsChecked = this.checked;
            }
            setCartStorage(storageData);
            initCartList();
        });
    }
});
