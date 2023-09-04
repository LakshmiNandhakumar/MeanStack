angular.module('userControllers',['userServices'])

.controller('regCtrl',function($location,$timeout,User){

    const app = this;
    this.regUser = function(regData){
        app.loading = true;
        app.errMsg = false;
        //console.log("form submitted");
        //console.log(this.regData);
        //$http.post('/api/users',this.regData)
        User.create(app.regData).then(function(data){
            //console.log(data.data.success);
            //console.log(data.data.message);
            if(data.data.success){
                //success msg
                app.loading = false;
                app.succMsg = data.data.message + ' .....Redirecting';
                //redirect to home
                $timeout(function(){
                    $location.path('/')},
                    2000
                );
            }
            else{
                //error msg
                app.loading = false;
                app.errMsg = data.data.message;
            }
        })
    };
});
    


