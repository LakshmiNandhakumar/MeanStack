angular.module('mainContoller',['authServices'])

.controller('mainCtrl',function($location,$timeout,Auth,$rootScope){
    const app = this;
    app.loadme = false;
     $rootScope.$on('$routeChangeStart',function(){
        if(Auth.isLoggedIn()){
            //console.log("User logged in");
            app.isLoggedIn = true;
            Auth.getUser().then(function(data){
                //console.log(data.data.username);
                app.username = data.data.username;
                app.email = data.data.email;
                app.loadme = true;
            })
        }else{
            //console.log("User not logged in");
            app.isLoggedIn = false;
            app.username = '';
            app.loadme = true;
        }   
    });

    this.loginUser = function(loginData){
        app.loading = true;
        app.errMsg = false;
        Auth.login(app.loginData).then(function(data){
            if(data.data.success){
                app.loading = false;
                app.succMsg = data.data.message + ' .....Redirecting';
                $timeout(function(){
                    $location.path('/discover');
                    app.loginData = '';
                    app.succMsg = false;
                    2000
                 });
            }
            else{
                app.loading = false;
                app.errMsg = data.data.message;
            }
        });
    };


    this.logout = function(){
        Auth.logout();
        $location.path('/logout');
        $timeout(function(){
            $location.path('/')},
            2000
        );
    };
});

