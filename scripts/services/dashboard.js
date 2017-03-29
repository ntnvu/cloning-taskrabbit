'use strict';

app.factory('Dashboard', function($q, $firebaseArray){
    var ref = firebase.database().ref();

    var Dashboard = {
        getTasksForUser: function(uid){
            var defer = $q.defer();
            $firebaseArray(ref.child('user_tasks').child(uid)).$loaded().then(function(tasks){
                defer.resolve(tasks);
            }, function(err){
                defer.reject();
            })

            return defer.promise;
        }

    }

    return Dashboard;
})