app.controller('cart-ctrl', function ($rootScope, $scope, $http, $window,$timeout) {
    var urlOrder = `http://localhost:8080/rest/guest/order`;
    var urlImei = `http://localhost:8080/rest/guest/imei`;
    var urlAccessory = `http://localhost:8080/rest/guest/accessory`;
    var urlProduct= `http://localhost:8080/rest/guest/product`;
    var urlOrderDetail = `http://localhost:8080/rest/guest/order/detail`;
    var urlAccount = `http://localhost:8080/rest/admin/accounts`;
    var urlShippingOder = `http://localhost:8080/rest/user/address/getShipping-order`;
    const jwtToken = localStorage.getItem("jwtToken")
    const token = {
        headers: {
            Authorization: `Bearer ` + jwtToken
        }
    }
    $scope.addressAccount = {};
    $scope.info = {};
    $scope.checkBuy = null;
    $scope.categories = {};
    $scope.cart = {};
    $scope.checkAmt = null;
    $scope.to_district_id = "";
    $scope.to_ward_code = ""
    $scope.ship = "";
    $scope.counts = function () {
        return $rootScope.carts
            .map(item => item.qty)
            .reduce((total, qty) => total + qty, 0);
    }
    $scope.amounts = function () {
        return $rootScope.carts
            .map(item => item.qty * item.price)
            .reduce((total, qty) => total += qty, 0);
    }
    $scope.remove = function (item) {
        if (item.idAccessory > -1) {
            var index = $rootScope.carts.findIndex(it => it.idAccessory === item.idAccessory)
        } else if (item.idProduct > -1) {
            var index = $rootScope.carts.findIndex(it => it.idProduct === item.idProduct)
        }

        Swal.fire({
            title: 'Xóa: ' + item.name + ' khỏi giỏ hàng?',
            text: "Sau khi xóa không thể khôi phục lại!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                $rootScope.carts.splice(index, 1);
                $rootScope.qtyCart -= item.qty;
                $rootScope.saveLocalStorage();
                $rootScope.loadLocalStorage();
                $scope.loadMoneyShip();
                const Toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.addEventListener('mouseenter', Swal.stopTimer)
                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                    }
                })

                Toast.fire({
                    icon: 'success',
                    title: 'Xóa thành công!'
                })
                $window.location.href = '#!cart';
                console.log('I was closed by the timer')
            }
        })
    }
    $scope.update = function (item) {
        let index = null;
        if (item.idAccessory > -1) {
            index = $rootScope.carts.findIndex(it => it.idAccessory === item.idAccessory)
            $http.get(`${urlAccessory}/amount/${item.idAccessory}`).then(res => {
                if (item.qty > res.data) {
                    const Toast = Swal.mixin({
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 2000,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                            toast.addEventListener('mouseenter', Swal.stopTimer)
                            toast.addEventListener('mouseleave', Swal.resumeTimer)
                        }
                    })
                    Toast.fire({
                        icon: 'error',
                        title: 'Số lượng sản phẩm không đủ!'
                    })
                    item.qty = res.data;
                    $rootScope.saveLocalStorage();
                    $rootScope.loadLocalStorage();
                    $scope.loadMoneyShip();
                } else {
                    $rootScope.carts[index].qty = item.qty;
                    $rootScope.saveLocalStorage();
                    $rootScope.loadLocalStorage();
                    $scope.loadMoneyShip();
                }
            }).catch(err => {
                console.log(err)
            })
        } else if (item.idProduct > -1) {
            index = $rootScope.carts.findIndex(it => it.idProduct === item.idProduct)
            $http.get(`${urlImei}/amount/${item.idProduct}`).then(res => {
                if (item.qty > res.data) {
                    const Toast = Swal.mixin({
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 2000,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                            toast.addEventListener('mouseenter', Swal.stopTimer)
                            toast.addEventListener('mouseleave', Swal.resumeTimer)
                        }
                    })
                    Toast.fire({
                        icon: 'error',
                        title: 'Số lượng sản phẩm không đủ!'
                    })
                    item.qty = res.data;
                    $rootScope.saveLocalStorage();
                    $rootScope.loadLocalStorage();
                    $scope.loadMoneyShip();
                } else {
                    $rootScope.carts[index].qty = item.qty;
                    $rootScope.saveLocalStorage();
                    $rootScope.loadLocalStorage();
                    $scope.loadMoneyShip();
                }
            }).catch(err => {
                console.log(err)
            })
        }
        if ($rootScope.carts[index].qty <= 0) {
            $rootScope.carts[index].qty = 1;
            $rootScope.saveLocalStorage();
            $rootScope.loadLocalStorage();
            $scope.loadMoneyShip();
            console.log('I was closed by the timer')
        }
    }
    $scope.raise = function (item) {
        if (item.idAccessory > -1) {
            let index = $rootScope.carts.findIndex(it => it.idAccessory === item.idAccessory)
            $http.get(`${urlAccessory}/amount/${item.idAccessory}`).then(res => {
                if (item.qty >= res.data) {
                    const Toast = Swal.mixin({
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 2000,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                            toast.addEventListener('mouseenter', Swal.stopTimer)
                            toast.addEventListener('mouseleave', Swal.resumeTimer)
                        }
                    })
                    Toast.fire({
                        icon: 'error',
                        title: 'Số lượng sản phẩm không đủ!'
                    })
                    item.qty = res.data;
                    $rootScope.saveLocalStorage();
                    $rootScope.loadLocalStorage();
                }else{
                    $rootScope.qtyCart++;
                    $rootScope.carts[index].qty++;
                    $rootScope.saveLocalStorage();
                    $rootScope.loadLocalStorage();
                    $scope.loadMoneyShip();
                }
            }).catch(err => {
                console.log(err)
            })
        } else if (item.idProduct > -1) {
            let index = $rootScope.carts.findIndex(it => it.idProduct === item.idProduct)
            $http.get(`${urlImei}/amount/${item.idProduct}`).then(res => {
                if (item.qty >= res.data) {
                    const Toast = Swal.mixin({
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 2000,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                            toast.addEventListener('mouseenter', Swal.stopTimer)
                            toast.addEventListener('mouseleave', Swal.resumeTimer)
                        }
                    })
                    Toast.fire({
                        icon: 'error',
                        title: 'Số lượng sản phẩm không đủ!'
                    })
                    item.qty = res.data;
                    $rootScope.saveLocalStorage();
                    $rootScope.loadLocalStorage();
                    $scope.loadMoneyShip();
                } else {
                    $rootScope.carts[index].qty++;
                    $rootScope.qtyCart++;
                    $rootScope.saveLocalStorage();
                    $rootScope.loadLocalStorage();
                    $scope.loadMoneyShip();
                    console.log('add', item.qty)
                }
            }).catch(err => {
                console.log(err)
            })
        }
    }
    $scope.reduce = function (item) {
        if (item.idAccessory > -1) {
            var index = $rootScope.carts.findIndex(it => it.idAccessory === item.idAccessory)
        } else if (item.idProduct > -1) {
            var index = $rootScope.carts.findIndex(it => it.idProduct === item.idProduct)
        }
        $rootScope.carts[index].qty--;
        if ($rootScope.carts[index].qty <= 0) {
            $rootScope.saveLocalStorage();
            $rootScope.loadLocalStorage();
            $scope.loadMoneyShip();
            $rootScope.carts.splice(index, 1);
            $window.location.href = '#!cart';
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
            })

            Toast.fire({
                icon: 'success',
                title: 'Xóa thành công!'
            })
            console.log('I was closed by the timer')
        }
        $rootScope.saveLocalStorage();
        $rootScope.loadLocalStorage();
        $scope.loadMoneyShip();
        $rootScope.qtyCart--;
        console.log('add', item.qty)
    }
    $scope.totalPrice = function () {
        let total = 0;
        $rootScope.carts.forEach(item => {
            total += item.qty * item.price;
        })
        return total;
    }
    $scope.totalPriceSale1 = 0;
    $scope.totalPriceSale = function () {
        if(undefined != $scope.priceSale){
            $scope.totalPriceSale1 = 0;
            for(var i=0;i<$scope.priceSale.length;i++){
                if($scope.priceSale[i]!=-1){
                     $scope.totalPriceSale1=$scope.totalPriceSale1+$scope.priceSale[i]
                }else{
                     $scope.totalPriceSale1=$scope.totalPriceSale1+$rootScope.carts[i].price
                }
            }
            return $scope.totalPriceSale1;
        }
    }
    $scope.totals = function () {
        console.log($scope.totalPrice())
        if($scope.totalPriceSale1 !=0){
            return $scope.totalPriceSale1-$scope.priceSaleByVocher;
        }else{
            return $scope.totalPrice()-$scope.priceSaleByVocher;
        }

    }
    $scope.totalShip = function () {
        let ship = 50000;
        return ship;
    }
    $scope.refresh = function () {
        $rootScope.carts = [];
        localStorage.clear();
    }
    $scope.checkAmount=function (){
        $rootScope.carts.forEach(
            item=>{
                if(item.idAccessory){
                    $http.get(`${urlAccessory}/${item.idAccessory}`,token).then(res=>{
                        if(item.qty>res.data.quantity){
                            Swal.fire(
                                'Rất tiếc, quý khách chậm mất rồi!',
                                'Sản phẩm '+item.name+' không đủ số lượng!',
                                'error'
                            )
                            let index = $rootScope.carts.findIndex(it => it.idAccessory === item.idAccessory)
                            $rootScope.carts.splice(index, 1);
                            $rootScope.saveLocalStorage();
                            $rootScope.loadLocalStorage();
                            $scope.loadMoneyShip();
                            $scope.checkAmt=false;
                        }else{
                            $scope.checkAmt=true;
                        }
                    }).catch(err=>{
                        console.log(err)
                    })
                }else if(item.idProduct){
                    $http.get(`${urlProduct}/${item.idProduct}`,token).then(res=>{
                        $http.get(`${urlImei}/amount/${item.idProduct}`,token).then(res=>{
                            if(item.qty>=res.data){
                                Swal.fire(
                                    'Rất tiếc, quý khách chậm mất rồi!',
                                    'Sản phẩm '+item.name+' không đủ số lượng!',
                                    'error'
                                )
                                let index = $rootScope.carts.findIndex(it => it.idProduct === item.idProduct)
                                $rootScope.carts.splice(index, 1);
                                $rootScope.saveLocalStorage();
                                $rootScope.loadLocalStorage();
                                $scope.loadMoneyShip();
                                $scope.checkAmt=false;
                            }else {
                                $scope.checkAmt=true;
                            }
                        }).catch(err=>{
                            console.log(err)
                        })
                    })
                }
            }
        )
    }
    $scope.checkAmt=true;
    $scope.buyCart = function () {
        $rootScope.carts.forEach(
            item=>{
                if(item.idAccessory){
                    $http.get(`${urlAccessory}/${item.idAccessory}`,token).then(res=>{
                        if(item.qty>res.data.quantity){
                            Swal.fire(
                                'Rất tiếc, quý khách chậm mất rồi!',
                                'Sản phẩm '+item.name+' không đủ số lượng!',
                                'error'
                            )
                            let index = $rootScope.carts.findIndex(it => it.idAccessory === item.idAccessory)
                            $rootScope.carts.splice(index, 1);
                            $rootScope.saveLocalStorage();
                            $rootScope.loadLocalStorage();
                            $scope.loadMoneyShip();
                            $scope.checkAmt=false;
                        }else{
                            $scope.checkAmt=true;
                        }
                    }).catch(err=>{
                        console.log(err)
                    })
                }else if(item.idProduct){
                    $http.get(`${urlProduct}/${item.idProduct}`,token).then(res=>{
                        $http.get(`${urlImei}/amount/${item.idProduct}`,token).then(res=>{
                            if(item.qty>res.data){
                                Swal.fire(
                                    'Rất tiếc, quý khách chậm mất rồi!',
                                    'Sản phẩm '+item.name+' không đủ số lượng!',
                                    'error'
                                )
                                let index = $rootScope.carts.findIndex(it => it.idProduct === item.idProduct)
                                $rootScope.carts.splice(index, 1);
                                $rootScope.saveLocalStorage();
                                $rootScope.loadLocalStorage();
                                $scope.loadMoneyShip();
                                $scope.checkAmt=false;
                            }else{
                                $scope.checkAmt=true;
                            }
                        }).catch(err=>{
                            console.log(err)
                        })
                    })
                }
            }
        )
        if($scope.checkAmt){
            $scope.getShippingOder();
            if (!$rootScope.account) {
                $window.location.href = '/login';
            } else {
                Swal.fire({
                    title: 'Xác nhận thanh toán?',
                    text: "Xác nhận thanh toán để mua hàng!",
                    icon: 'info',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Xác nhận!'
                }).then((result) => {
                    if (result.isConfirmed) {
                        if ($scope.checkBuy) {
                            let price = ($scope.totals() / 24865).toFixed(2)
                            $http({
                                url: `http://localhost:8080/pay`,
                                method: 'POST',
                                data: price, token,
                                transformResponse: [
                                    function (data) {
                                        return data;
                                    }
                                ]
                            }).then(res => {
                                $scope.linkPaypal = res.data;
                                $scope.cart.personTake= $scope.addressAccount.personTake;
                                $scope.cart.phoneTake= $scope.addressAccount.phoneTake;
                                $scope.cart.address = $scope.addressAccount.addressDetail+", "+$scope.addressAccount.addressTake;
                                $scope.cart.total = $scope.totals()+$scope.ship;
                                $scope.cart.status = 0;
                                $scope.cart.statusBuy = 1;
                                $scope.cart.moneyShip = $scope.ship;
                                $scope.cart.type = false;
                                $http.post(urlOrder + '/add', $scope.cart, token).then(res => {
                                    if (res.data) {
                                        $http.post(urlOrderDetail + '/add', $rootScope.carts, token).then(res => {

                                            console.log("orderDetail", res.data)
                                        }).catch(err => {
                                            console.log("err orderDetail", err)
                                        })
                                        $window.location.href = $scope.linkPaypal;
                                    } else {
                                        Swal.fire(
                                            'Thanh toán thất bại!',
                                            '',
                                            'error'
                                        )
                                    }
                                }).catch(err => {
                                    Swal.fire(
                                        'Số tiền quá lớn!',
                                        '',
                                        'error'
                                    )
                                    console.log("err order", err)
                                })
                            }).catch(err => {
                                Swal.fire(
                                    'Thanh toán thất bại!',
                                    '',
                                    'error'
                                )
                                console.log("error buy cart", err)
                            })

                        } else {
                            $scope.cart.personTake= $scope.addressAccount.personTake;
                            $scope.cart.phoneTake= $scope.addressAccount.phoneTake;
                            $scope.cart.address = $scope.addressAccount.addressDetail+", "+$scope.addressAccount.addressTake;
                            $scope.cart.total = $scope.totals()+$scope.ship;
                            $scope.cart.status = 0;
                            $scope.cart.statusBuy = 0;
                            $scope.cart.moneyShip = $scope.ship;
                            $scope.cart.type = false;
                            $http.post(urlOrder + '/add', $scope.cart, token).then(res => {
                                if (res.data) {
                                    $http.post(urlOrderDetail + '/add', $rootScope.carts, token).then(res => {
                                        var urladdsaleapply=`/admin/rest/sale/addsaleapply?idSale=`+$scope.getVoucherApply;
                                        $http.post(urladdsaleapply, token).then(res => {

                                        })
                                        $window.location.href = '/views/cart/buy-cod-success.html';
                                    }).catch(err => {
                                        console.log("err orderDetail", err)
                                    })
                                }

                            }).catch(err => {
                                Swal.fire(
                                    'Thanh toán thất bại!',
                                    '',
                                    'error'
                                )
                                console.log("err order", err)
                            })
                        }
                    }

                })
            }
        }
    }
    $scope.checkBuyPaypal = function () {
        $scope.checkBuy = true;
    }
    $scope.checkBuyCOD = function () {
        $scope.checkBuy = false;
    }
    $scope.getAddressAcountActive = function () {
        if ($rootScope.account != null) {
            $http.get(urlAccount + "/getAddress", token).then(function (respon) {
                $scope.addressAccount = respon.data;
                $scope.to_district_id = $scope.addressAccount.districtId;
                $scope.to_ward_code = $scope.addressAccount.wardId;
                $scope.getShippingOder();
                console.log($scope.to_district_id, $scope.to_ward_code)
                console.log($scope.addressDefault)

            }).catch(err => {
                Swal.fire({
                    icon: 'error',
                    text: 'Vui lòng thêm địa chỉ!!!',
                })
                console.log(err)
                $window.location.href = '#!address';
            })
        }
    }
    $scope.getShippingOder = function () {
        $http.get(urlShippingOder + "?from_district_id=1542&service_id=53320&to_district_id="
            + $scope.to_district_id + "&to_ward_code=" + $scope.to_ward_code
            + "&weight=200&insurance_value=" + $scope.totalPrice(), token).then(function (respon) {

            $scope.ship = respon.data.body.data.total;
            console.log(respon.data.body.data.total)
        })
        $http.get(urlShippingOder + "?from_district_id=1542&service_id=53321&to_district_id="
            + $scope.to_district_id + "&to_ward_code=" + $scope.to_ward_code
            + "&weight=200&insurance_value=" + $scope.totalPrice(), token).then(function (respon) {
            $scope.ship = respon.data.body.data.total;
            console.log(respon.data.body.data.total)
        })
        $http.get(urlShippingOder + "?from_district_id=1542&service_id=53322&to_district_id="
            + $scope.to_district_id + "&to_ward_code=" + $scope.to_ward_code
            + "&weight=200&insurance_value=" + $scope.totalPrice(), token).then(function (respon) {
            $scope.ship = respon.data.body.data.total;
            console.log(respon.data.body.data.total)
        })
    }
    $scope.loadMoneyShip= function () {
        $timeout(function () {
            $scope.getShippingOder();
        }, 2000);
    }
    $scope.getAddressAcountActive();
    $scope.loadMoneyShip();
    $rootScope.loadQtyCart();
    $rootScope.loadLocalStorage();
    $scope.listVoucherSale=[];
    $scope.getVoucherSale=function (money){
        console.log(money)
        let url = `http://localhost:8080/admin/rest/sale/getvoucher?money=`+money
        $http.post(url, $rootScope.carts, token).then(res => {
            $scope.listVoucherSale=res.data;
            console.log($scope.listVoucherSale);
        }).catch(err => {
            console.log(err)
        })
    }
    $scope.getVoucherApply=0;
    $scope.listProductApplySale=[];
    $scope.listAccessoryApplySale=[];
    $scope.priceSaleByVocher=0;
    $scope.getSaleApply=function (x){
        $scope.getVoucherApply=x;
        console.log(x);
        let urlsale = `http://localhost:8080/admin/rest/sale/getsale/`+$scope.getVoucherApply;
        $http.get(urlsale, token).then(res => {
            var price=0;
            if(res.data.typeSale==1 || res.data.typeSale==4 || (res.data.typeSale==3 && res.data.userType==1)){
               let urlsaledetail=`http://localhost:8080/admin/rest/sale/getsaledetail/`+$scope.getVoucherApply;
                $http.get(urlsaledetail, token).then(res1 => {

                    console.log(res.data.typeSale)
                    if(res.data.typeSale==1){
                        price=0;
                        for (var i=0;i<res1.data.length;i++) {
                            $scope.listProductApplySale.push(res1.data[i].idProduct)
                            $rootScope.carts.forEach(item => {
                                if(item.idProduct == res1.data[i].idProduct){
                                    price+=item.qty * item.price
                                }
                            })
                        }
                        if(null!=res.data.moneySale) {
                            if (price <= res.data.moneySale) {
                                $scope.priceSaleByVocher = price;
                            }else{
                                $scope.priceSaleByVocher=res.data.moneySale;
                            }
                        }
                        if(null!=res.data.percentSale){
                            $scope.priceSaleByVocher=price*res.data.percentSale/100;
                        }
                    }
                    if(res.data.typeSale ==4 ){
                        for (var i=0;i<res1.data.length;i++) {
                            price=0;
                            $scope.listAccessoryApplySale.push(res1.data[i].idAccessory)
                            $rootScope.carts.forEach(item => {
                                if(item.idAccessory == res1.data[i].idAccessory){
                                    price+=item.qty * item.price;
                                }
                            })
                            console.log(res.data.moneySale,res.data.percentSale,"hihihihihahhaha")
                            console.log(price,$scope.priceSaleByVocher);
                            if(0==price){
                                $scope.priceSaleByVocher=$scope.priceSaleByVocher;
                            }else{
                                if(null!=res.data.moneySale) {
                                    if (price <= res.data.moneySale) {
                                        $scope.priceSaleByVocher = price;
                                    }else{
                                        $scope.priceSaleByVocher=res.data.moneySale;
                                    }
                                }
                                if(null!=res.data.percentSale){
                                    $scope.priceSaleByVocher=price*res.data.percentSale/100;
                                }
                            }
                        }
                    }

                    console.log($rootScope.carts)
                    console.log($scope.listProductApplySale);
                    console.log($scope.listAccessoryApplySale)
                }).catch(err => {
                    console.log(err)
                })
            }else{
                if(null!=res.data.moneySale) {
                    if ($scope.totalPriceSale1 <= res.data.moneySale) {
                        $scope.priceSaleByVocher = $scope.totalPriceSale1;
                    }else{
                        $scope.priceSaleByVocher=res.data.moneySale;
                    }
                }
                if(null!=res.data.percentSale){
                    $scope.priceSaleByVocher=$scope.totalPriceSale1*res.data.percentSale/100;
                }
            }
            console.log($scope.priceSaleByVocher+"hihihihi")
        }).catch(err => {
            console.log(err)
        })
    }
})