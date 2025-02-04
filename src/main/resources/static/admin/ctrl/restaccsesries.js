app.controller("restaccsesries", function ($scope, $http) {
    // ram máy
    $scope.items = [];
    $scope.formCreate  = [];
    $scope.accseries = {};
    // màu sắc
    $scope.colorItems = [];
    $scope.color = {};

    const jwtToken = localStorage.getItem("jwtToken")
    const token = {
        headers: {
            Authorization: `Bearer `+jwtToken
        }
    }

    $scope.message = function (mes){
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3500,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        })
        Toast.fire({
            icon: 'success',
            title: mes,
        })
    }
    $scope.error = function (err){
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
            title: err ,
        })
    }

    // hàm ram
    $scope.getAllRam = function () {
        $http.get("/rest/admin/accessoríes",token).then(resp => {
            $scope.items = resp.data;
            $scope.items.forEach(item => {
                console.log(resp.data);
            })
        });
    }
    $scope.onSubmitForm = function (event) {
        event.preventDefault();
    }
    //xóa form
    $scope.reset = function(){
        $scope.accseries ={
        }
    }

    $scope.create = function (){
        var item = angular.copy($scope.accseries);
        console.log(item);
        $http.post("/rest/admin/accessoríes",item).then(resp => {
            $scope.items.push(item);
            $scope.reset();
            $scope.message("Đã thêm thành công");
            $scope.getAllRam();
        }).catch(error => {
            $scope.error("thêm mới thất bại");
        })
    }
    $scope.delete = function(items) {
            $http.delete(`/rest/admin/accessoríes/delete/${items.idRam}`,token).then(response=> {
                $scope.items.splice($scope.items.indexOf(items), 1);
                $scope.message('xóa thành công');
                $scope.reset();
                $scope.getAllRam();
            }).catch(error=>{
                $scope.error('xóa thất bại');
            });
            console.log('I was closed by the timer')
    };

    $scope.getAllRam();
    //hàm màu
    $scope.findAll = function () {
        $http.get("/rest/admin/accessoríes/getall",token).then(resp => {
            $scope.colorItems = resp.data;
            $scope.colorItems.forEach(color => {
            })
        });
    }
    $scope.resetColor = function(){
        $scope.color ={
        }
    }
    $scope.createColor = function (){
        var item = angular.copy($scope.color);
        console.log(item);
        $http.post("/rest/admin/accessoríes/save",item,token).then(resp => {
            $scope.colorItems.push(item);
            $scope.resetColor();
            $scope.findAll();
            $scope.message('thêm mới màu thành công');
        }).catch(error => {
            alert('thêm mới lỗi');
            console.log('lỗi', error);
        })
    }
    $scope.deleteColor = function(colorItems) {
        Swal.fire({
            title: 'Bạn có chắc muốn xóa: '+ colorItems.name+'?',
            text: "Xóa không thể khôi phục lại!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                let timerInterval
                Swal.fire({
                    title: 'Đang xóa: '+colorItems.name+'!',
                    html: 'Vui lòng chờ <b></b> milliseconds.',
                    timer: 800,
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
                        $http.delete(`/rest/admin/accessoríes/deleteColor/${colorItems.idColor}`,token).then(response=> {
                            $scope.colorItems.splice($scope.colorItems.indexOf(colorItems), 1);
                            $scope.message('xóa thành công');
                            $scope.reset();
                        }).catch(error=>{
                            $scope.error("xóa thất bại");
                        });
                        console.log('I was closed by the timer')
                    }
                })

            }
        })
    };
    $scope.findAll();

    //dung lượng
    $scope.capacityItems=[];
    $scope.capacity ={};

    $scope.findAllCapacity = function () {
        $http.get("/rest/admin/accessoríes/getCapacity",token).then(resp => {
            $scope.capacityItems = resp.data;
            $scope.capacityItems.forEach(color => {
            })
        });
    }
    $scope.resetCapacity = function(){
        $scope.capacity ={
        }
    }
    $scope.createCapacity = function (){
        var capacitys = angular.copy($scope.capacity);
        console.log(capacitys);
        $http.post("/rest/admin/accessoríes/saveCapacity",capacitys,token).then(resp => {
            $scope.capacityItems.push(capacitys);
            $scope.resetCapacity();
            $scope.findAllCapacity();
            $scope.message('thêm thành công');
        }).catch(error => {
            alert('thêm mới lỗi');
            console.log('lỗi', error);
        })
    }
    $scope.deleteCapacity = function(capacityItems) {
        Swal.fire({
            title: 'Bạn có chắc muốn xóa: '+ capacityItems.name+'?',
            text: "Xóa không thể khôi phục lại!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                let timerInterval
                Swal.fire({
                    title: 'Đang xóa: '+capacityItems.name+'!',
                    html: 'Vui lòng chờ <b></b> milliseconds.',
                    timer: 800,
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
                        $http.delete(`/rest/admin/accessoríes/deleteCapacity/${capacityItems.idCapacity}`,token).then(response=> {
                            $scope.capacityItems.splice($scope.capacityItems.indexOf(capacityItems), 1);
                            $scope.message('xóa thành công');
                            $scope.reset();
                        }).catch(error=>{
                            $scope.error("xóa thất bại");
                        });
                        console.log('I was closed by the timer')
                    }
                })

            }
        })

    };
    $scope.findAllCapacity();

    // thêm ảnh
    const  url = 'http://localhost:8080/rest/files/images/products';

    $scope.url = function(fileName){
        return `${url}/`+`${fileName}`;
    }
    $scope.fileNames=[];
    $scope.img= [];
    $scope.imagePr ={};
    $scope.listFile = function(){
        $http.get(url,token).then(res=>{
            $scope.fileNames = res.data;
            console.log($scope.fileNames,' ok',res.data);
            alert("đã update");
        }).catch(err=>{
            console.log('Load files failse',err);
        })
    }

    $scope.allImage = function () {
        $http.get("/rest/admin/accessoríes/allImage",token).then(resp => {
            $scope.img = resp.data;
            $scope.img.forEach(image => {
                console.log(resp.data +'  list');
            })
        });
    }
    $scope.resetImage = function(){
        $scope.imagePr ={
        }
    }

    $scope.saveImage = function (){
        var item = angular.copy($scope.imagePr);
        $http.post("/rest/admin/accessoríes/saveImage",item,token).then(resp => {
            $scope.img.push(item);
            $scope.message('thêm ảnh thành công');
            $scope.resetImage();
            $scope.allImage();
        }).catch(error => {
            $scope.error("xóa thất bại");
        })
    }
    $scope.deleteImage = function(img) {
        Swal.fire({
            title: 'Bạn có chắc muốn xóa: '+ img.name+'?',
            text: "Xóa không thể khôi phục lại!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                let timerInterval
                Swal.fire({
                    title: 'Đang xóa: '+img.name+'!',
                    html: 'Vui lòng chờ <b></b> milliseconds.',
                    timer: 800,
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
                        $http.delete(`/rest/admin/accessoríes/${img.idImage}`,token).then(response=> {
                            $scope.img.splice($scope.img.indexOf(img), 1);
                            $scope.message('xóa thành công');
                            $scope.resetImage();
                        }).catch(error=>{
                            $scope.error("xóa thất bại");
                        });
                    }
                })

            }
        })

    };

    $scope.allImage();

})
