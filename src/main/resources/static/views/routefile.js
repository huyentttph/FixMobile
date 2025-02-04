var app = angular.module("app_module",["ngRoute"]);
app.config(function($routeProvider){
	$routeProvider
        .when("/home/index",{
            templateUrl:"home/view.html",
            controller: "home-ctrl",
            controller: "view_product_ctrl"
        })
	    .when("/cart",{
            templateUrl:"cart/cart.html",
            controller: "cart-ctrl"
        })
        .when("/accessory/detail",{
            templateUrl:"accessory/list_detail.html",
            controller: "view_accessory_ctrl",
            controller: "home-ctrl",
            controller: "view_product_ctrl",

        })
        .when("/product/detail",{
            templateUrl:"product/list_detail.html",
            controller: "home-ctrl",
        })
        .when("/order",{
            templateUrl:"order/view.html",
            controller: "order-ctrl"
        })
        .when("/order-detail",{
            templateUrl:"order/detail/view.html",
            controller: "order-detail-ctrl",
        })

        .when("/product",{
            templateUrl:"product/product.html",
            controller: "home-ctrl",
            controller: "view_product_ctrl"

        })
        .when("/accessoryDetail",{
            templateUrl:"accessory/view_detail.html",
            controller: "view_accessory_ctrl"
        })
        .when("/login",{
            templateUrl:"/views/login/form.html",
            controller: "login-ctrl" 
        })
        .when("/register",{
            templateUrl:"/views/register/form.html",
            controller: "register-ctrl" 
        })
        .when("/profile", {
            templateUrl:"profile/profile.html",
            controller:"profile-ctl"
        })
        .when("/address", {
            templateUrl:"address/addressTable.html",
            controller:"address-form-ctrl"
        })
        .when("/contact",{
            templateUrl:"/views/shop/contact.html",
            // controller: "register-ctrl"
        })
        .when("/changePassword",{
            templateUrl:"/views/changePassword/form.html",
            controller: "changePassword-ctrl"
        })

        .when("/forgetPassword",{
            templateUrl:"forgetPassword/form.html",
            controller: "forgetPassword-ctrl",

        })
        .when("/productchange",{
            templateUrl:"order/detail/productchange.html",
            controller: "productchange-ctrl",
        })



});

