'use strict';

app.factory('Comment', function($firebaseArray){
    var ref = firebase.database().ref();

    var Comment = {
        comments: function(taskID){
            return $firebaseArray(ref.child('comments').child(taskID));
        },

        addComment: function(taskId, comment){
            var task_comments = this.comments(taskId);
            comment.datetime = firebase.database.ServerValue.TIMESTAMP;

            if(task_comments){
                return task_comments.$add(comment);
            }
        }
    };



    return Comment;
})