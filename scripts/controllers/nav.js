'use strict'

app.controller('NavController', function($scope, $location, Auth, $firebaseAuth){
    var auth = $firebaseAuth();

    $scope.signedIn = Auth.signedIn;

    $scope.logout = function(){
        Auth.logout();
        $location.path('/');
    }


    auth.$onAuthStateChanged(function (authData) {
        $scope.currentUser = authData;
    })


});

