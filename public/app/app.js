angular.module('UserApp',['appRoutes','userControllers','userServices','mainContoller','authServices'])

.config(function($httpProvider){
    $httpProvider.interceptors.push('AuthInterceptors');
})