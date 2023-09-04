angular.module('authServices',[])

.factory('Auth',function($http,AuthToken){
    const authFactory = {};

    authFactory.login = function(loginData){
        return $http.post('/api/authenticate',loginData).then(function(data){
            AuthToken.setToken(data.data.token);
            return data;
        });
    };

    authFactory.isLoggedIn = function(){
        if(AuthToken.getToken()){
            return true;
        }
        else{
            return false;
        }
    };

    //get User

    authFactory.getUser = function(){
        if(AuthToken.getToken()){
            return $http.post('/api/currentuser');
        }
        else{
            $q.reject({message:'User has no token'});
        }
    }

    authFactory.logout = function(){
       AuthToken.setToken();  
    };

    return authFactory;
})

.factory('AuthToken',function($window){
    const authFactoryToken ={};

    authFactoryToken.setToken = function(token){
        if(token){
            $window.localStorage.setItem('token',token);
        }else{
            $window.localStorage.removeItem('token');
        }
    }

    authFactoryToken.getToken = function(){
       return $window.localStorage.getItem('token');
    }

    return authFactoryToken;
})

.factory('AuthInterceptors',function(AuthToken){
    const authFactoryInterceptors ={};

    authFactoryInterceptors.request = function(config){
        const token = AuthToken.getToken();

        if(token){
            config.headers['x-access-token'] = token;
        }
    return config;
    }

    return authFactoryInterceptors;
})