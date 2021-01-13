

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
