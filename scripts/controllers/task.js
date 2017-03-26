'use strict';

app.controller("TaskController",
    function ($scope, $firebaseArray, $firebaseObject, $location, $routeParams, toaster) {
        var ref = firebase.database().ref();
        var fbTasks = $firebaseArray(ref.child("tasks"));
        var taskId = $routeParams.taskId;

        if(taskId){
            $scope.selectedTask = getTask(taskId);
        }

        function getTask(taskId){
            return $firebaseObject(ref.child("tasks").child(taskId));
        }

        $scope.updateTask = function(task){
            $scope.selectedTask.$save(task);
            $location.path('/browse');
        }

        $scope.tasks = fbTasks;

        $scope.postTask = function (task) {
            fbTasks.$add(task);
            toaster.pop("success", "Task is created.");
            $location.path('/browse');
        }
    })