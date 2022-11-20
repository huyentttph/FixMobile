app.controller('rest_accessory', function($scope, $http) {
    const pathAPI = "http://localhost:8080/rest/admin/accessory";
    $scope.form = {};
    $scope.accessories = [];
    $scope.categories = [];
    $scope.index=0;
    $scope.check_first=false;
    $scope.check_last=true;
    $scope.totalPages=0;
    $scope.title={
        insert:'Thêm mới',
        update:'Cập nhật'
    };
    const jwtToken = localStorage.getItem("jwtToken")
    const token = {
        headers: {
            Authorization: `Bearer `+jwtToken
        }
    }
    $scope.checkSubmit=false;
    const now = new Date();
    $scope.loadAccessories =function (){
        $http.get(`${pathAPI}/page/0`,token).then(function(response) {
            $scope.accessories = response.data;
            console.log("access",response.data);
        }).catch(error=>{
            console.log("access error",error);
        });
        $scope.getCategories();
        $scope.getTotalPages();
    }
    $scope.getTotalPages =function (){
        $http.get(pathAPI,token).then(function(response) {
            $scope.totalPages = Math.ceil(response.data.length/10);
        }).catch(error=>{
            console.log(error);
        });
    }
    $scope.getCategories=function(){
        $http.get(`${pathAPI}/cate`,token).then(function(response) {
            $scope.categories = response.data;
        }).catch(error=>{
            console.log("error findByCate",error);
        });
    };
    $scope.onSave = function() {
        $http.post(pathAPI+'/save-file', $scope.imageFile,token).then(response => {
        })
        $scope.form.status=false;
        $scope.form.createDate=now;
        $scope.form.category ={
            idCategory: $scope.form.category
        };
        $http.post(pathAPI, $scope.form,token).then(response => {
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
            })

            Toast.fire({
                icon: 'success',
                title: 'Thêm mới thành công!',
            })
            $scope.refresh();
        }).catch(error => {
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
            })

            Toast.fire({
                icon: 'error',
                title: 'Thêm mới thất bại!',
            })
        });
    };
    $scope.changeStatus = function(accessory) {
        Swal.fire({
            title: 'Thay đổi trạng thái: '+accessory.name+'?',
            text: "Xác nhận đẻ tiếp tục!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Xác nhận!'
        }).then((result) => {
            if (result.isConfirmed) {
                $http.put(`${pathAPI}/change/${accessory.idAccessory}`,token).then(response=> {
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
                        title:'Thay đổi thành công!'
                    })
                    console.log(response.data);
                    $scope.accessories.find(item=>item.idAccessory==accessory.idAccessory).status=!accessory.status;
                }).catch(error=>{
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
                        title:'Đã xảy ra lỗi!' ,
                    })
                });
            }
        })

    };
    $scope.edit = function(accessory) {
        $scope.form = angular.copy(accessory);
        $scope.form.image = accessory.image;
        $scope.form.category = accessory.category.idCategory;
        $scope.checkSubmit=true;
        document.getElementById('manage-tab').click();
    };
    $scope.onUpdate = function() {
        if(!$scope.form.image){
            $scope.form.image='logo-mobile.png';
        }
        $scope.form.category ={
            idCategory: $scope.form.category
        };
        $http.put(pathAPI+'/'+$scope.form.idAccessory, $scope.form,token).then(response=> {
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
            })

            Toast.fire({
                icon: 'success',
                title:'Cập nhật thành công!' ,
            })

            document.getElementById('list-tab').click();
            $scope.refresh();
        }).catch(error=>{
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
            })
            console.log('error', error);
            Toast.fire({
                icon: 'error',
                title: 'Cập nhật thất bại!',
            })
        })
    };
    // submit form
    $scope.doSubmit = function() {
        if($scope.form.idAccessory) {
            let timerInterval
            Swal.fire({
                title: 'Đang cập nhật!',
                html: 'Vui lòng chờ <b></b> milliseconds.',
                timer: 1500,
                timerProgressBar: true,
                didOpen: () => {
                    Swal.showLoading()
                    const b = Swal.getHtmlContainer().querySelector('b')
                    timerInterval = setInterval(() => {
                        b.textContent = Swal.getTimerLeft()
                    }, 100)
                },
                willClose: () => {
                    clearInterval(timerInterval)
                }
            }).then((result) => {
                /* Read more about handling dismissals below */
                if (result.dismiss === Swal.DismissReason.timer) {
                    $scope.onUpdate();
                    console.log('I was closed by the timer')
                }
            })
        }else{
            let timerInterval
            Swal.fire({
                title: 'Đang lưu mới!',
                html: 'Vui lòng chờ <b></b> milliseconds.',
                timer: 1500,
                timerProgressBar: true,
                didOpen: () => {
                    Swal.showLoading()
                    const b = Swal.getHtmlContainer().querySelector('b')
                    timerInterval = setInterval(() => {
                        b.textContent = Swal.getTimerLeft()
                    }, 100)
                },
                willClose: () => {
                    clearInterval(timerInterval)
                }
            }).then((result) => {
                /* Read more about handling dismissals below */
                if (result.dismiss === Swal.DismissReason.timer) {
                    $scope.onSave();
                    console.log('I was closed by the timer')
                }
            })
        }
    };
    $scope.refresh = function() {
        $scope.form.idAccessory=null;
        $scope.form.status=false;
        $scope.form.image='logo-mobile.png';
        $scope.checkSubmit=false;
        $scope.getPageAccessories();
    };
    var urlImage=`http://localhost:8080/rest/files/images/accessories`;
    $scope.url = function(fileName){
        return `${urlImage}/`+`${fileName}`;
    }
    $scope.fileNames=[];
    $scope.listFile = function(){
        $http.get(urlImage,token).then(res=>{
            $scope.fileNames = res.data;
            console.log('ok',res);
        }).catch(err=>{
            console.log('Load files failse',err);
        })
    }
    $scope.uploadFile = function(files){
        var form = new FormData();
        form.append('file',files[0]);
        $http.post(urlImage,form,token,{
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        }).then(res=>{
            $scope.form.image=res.data.name;
            console.log('image',res);
        }).catch(err=>{
            console.log('err',err);
        })
    }
    $scope.readExcel = function(files){
        var form = new FormData();
        form.append('file',files[0]);
        let timerInterval
        Swal.fire({
            title: 'Đang thêm hàng loạt!',
            html: 'Vui lòng chờ <b></b> milliseconds.',
            timer: 3500,
            timerProgressBar: true,
            didOpen: () => {
                Swal.showLoading()
                const b = Swal.getHtmlContainer().querySelector('b')
                timerInterval = setInterval(() => {
                    b.textContent = Swal.getTimerLeft()
                }, 100)
            },
            willClose: () => {
                clearInterval(timerInterval)
            }
        }).then((result) => {
            if (result.dismiss === Swal.DismissReason.timer) {
                $http.post(pathAPI+'/read-excel',form,token,{
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
                }).then(res=>{
                    const Toast = Swal.mixin({
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                            toast.addEventListener('mouseenter', Swal.stopTimer)
                            toast.addEventListener('mouseleave', Swal.resumeTimer)
                        }
                    })

                    Toast.fire({
                        icon: 'success',
                        title: 'Thêm file Excel thành công'
                    })
                    $scope.loadAccessories();
                    console.log('excel',res);
                }).catch(err=>{
                    const Toast = Swal.mixin({
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                            toast.addEventListener('mouseenter', Swal.stopTimer)
                            toast.addEventListener('mouseleave', Swal.resumeTimer)
                        }
                    })

                    Toast.fire({
                        icon: 'error',
                        title: 'Có lỗi xảy ra!'
                    })
                    $scope.loadAccessories();
                    console.log('err',err);
                })
                console.log('I was closed by the timer')
            }
        })
    }
    $scope.loadProducts = function(){
        $http.get(urlProduct+`/page/`+$scope.index,token).then(res=>{
            $scope.products = res.data;
            console.log('Load products success',res.data)
        }).catch(err=>{
            console.log('Load products failse',err.data);
        });
    }
    // pagination
    $scope.next=function(){
        $scope.check_first=true;
        $scope.index++;
        if($scope.index>=$scope.totalPages){
            $scope.index=0;
            $scope.check_first=false;
            $scope.check_last=true;
        }
        if($scope.index==$scope.totalPages-1){
            $scope.check_first=true;
            $scope.check_last=false;
        }
        $http.get(pathAPI+`/page/`+$scope.index,token).then(res=>{
            $scope.accessories = res.data;
            console.log('Load accessories success',res.data)
        }).catch(err=>{
            console.log('Load accessories failse',err.data);
        })
    }
    $scope.prev=function(){
        $scope.check_last=true;
        $scope.index--;
        if($scope.index<0){
            $scope.index=$scope.totalPages-1;
            $scope.check_first=true;
            $scope.check_last=false;
        }
        if($scope.index==0){
            $scope.check_first=false;
            $scope.check_last=true;
        }
        $http.get(pathAPI+`/page/`+$scope.index,token).then(res=>{
            $scope.accessories = res.data;
            console.log('Load accessories success',res.data)
        }).catch(err=>{
            console.log('Load accessories failse',err.data);
        })
    }
    $scope.first=function(){
        $scope.check_first=false;
        $scope.check_last=true;
        $scope.index=0;
        $http.get(pathAPI+`/page/`+$scope.index,token).then(res=>{
            $scope.accessories = res.data;
            console.log('Load accessories success',res.data)
        }).catch(err=>{
            console.log('Load accessories failse',err.data);
        })
    }
    $scope.last=function(){
        $scope.check_first=true;
        $scope.check_last=false;
        $scope.index=$scope.totalPages-1;
        $http.get(pathAPI+`/page/`+$scope.index,token).then(res=>{
            $scope.accessories = res.data;
            console.log('Load accessories success',res.data)
        }).catch(err=>{
            console.log('Load accessories failse',err.data);
        })
    }
    $scope.getPageAccessories = function(){
        $http.get(pathAPI+`/page/`+$scope.index,token).then(res=>{
            $scope.accessories = res.data;
            console.log('Load accessories success',res.data)
        }).catch(err=>{
            console.log('Load accessories failse',err.data);
        })
    }
    $scope.loadAccessories();

});