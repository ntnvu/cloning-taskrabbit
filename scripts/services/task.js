'use strict';

app.factory('Task', function (Auth, $firebaseObject, $firebaseArray) {
    var ref = firebase.database().ref();
    var tasks = $firebaseArray(ref.child('tasks'));
    var user = Auth.user;

    var Task = {
        all: tasks,

        getTask: function(taskId){
            return $firebaseObject(ref.child('tasks').child(taskId));
        },

        createTask: function(task){
            task.datetime = firebase.database.ServerValue.TIMESTAMP;
            return tasks.$add(task);
        },

        editTask: function(task){
            var t = this.getTask(task.$id);
            return t.$update({
                title: task.title,
                description: task.description,
                total: task.total
            })
        },

        cancelTask: function(taskId){
            var t = this.getTask(taskId);
            t['status'] = "canceled"
            return t.$save(t);
        },

        isCreator: function(task){
            return (user && user.providerData && user.uid === task.poster);
        },

        isOpen: function(task){
            return task.status === "open";
        }

    }

    return Task;
})