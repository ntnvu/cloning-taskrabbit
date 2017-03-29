'use strict';

app.controller('DashboardController', function($scope, Dashboard, Auth, $firebaseAuth){
    var auth = $firebaseAuth();
    $scope.taskRunner = [];
    $scope.taskPoster = [];


    auth.$onAuthStateChanged(function () {
        var uid = Auth.user.uid;
        Dashboard.getTasksForUser(uid).then(function(tasks){
            for(var i = 0; i < tasks.length; i++){
                tasks[i].type? $scope.taskPoster.push(tasks[i]) : $scope.taskRunner.push(tasks[i])
            }

            $scope.numPoster = $scope.taskPoster.length;
            $scope.numRunner = $scope.taskRunner.length;
        })
    });


})