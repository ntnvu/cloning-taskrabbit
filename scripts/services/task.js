'use strict';

app.factory('Task', function (Auth, $firebaseObject, $firebaseArray) {
    var ref = firebase.database().ref();
    var tasks = $firebaseArray(ref.child('tasks'));
    var user = Auth.user;

    var Task = {
        all: tasks,

        getTask: function (taskId) {
            return $firebaseObject(ref.child('tasks').child(taskId));
        },

        createTask: function (task) {
            task.datetime = firebase.database.ServerValue.TIMESTAMP;
            return tasks.$add(task).then(function (newTask) {
                var obj = {
                    taskId: newTask.getKey(),
                    type: true,
                    title: task.title
                };

                $firebaseArray(ref.child('user_tasks').child(task.poster)).$add(obj);
                return newTask;
            });
        },

        createUserTask: function (taskId) {
            this.getTask(taskId).$loaded().then(function(task) {
                var obj = {
                    taskId: taskId,
                    type: false,
                    title: task.title
                };
                console.log(task);
                console.log(task.runner);
//                return $firebaseArray(ref.child('user_tasks').child(task.runner)).$add(obj);
            });
        },

        editTask: function (task) {
            var t = this.getTask(task.$id);
            return t.$loaded().then(function () {
                t.title = task.title;
                t.description = task.description;
                t.total = task.total;
                t.$save();
            })
        },

        cancelTask: function (taskId) {
            var t = this.getTask(taskId);
            return t.$loaded().then(function () {
                t.status = "cancelled";
                t.$save();
            })
        },

        isCreator: function (task) {
            return (user && user.providerData && user.uid === task.poster);
        },

        isOpen: function (task) {
            return task.status === "open";
        },

        completeTask: function (taskId) {
            var t = this.getTask(taskId);
            return t.$loaded().then(function () {
                t.status = "completed";
                t.$save();
            })
        },

        isAssignee: function (task) {
            return (user && user.providerData && user.uid === task.runner);
        },

        isCompleted: function (task) {
            return task.status === "completed";
        }
    }

    return Task;
})