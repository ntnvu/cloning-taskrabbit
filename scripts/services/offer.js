'use strict';

app.factory('Offer', function ($firebaseArray, $q, Auth, $firebaseObject, Task) {
    var ref = firebase.database().ref();
    var user = Auth.user;

    var Offer = {
        offers: function (taskId) {
            return $firebaseArray(ref.child('offers').child(taskId));
        },

        makeOffer: function (taskId, offer) {
            var task_offers = this.offers(taskId);
            if (task_offers) {
                return task_offers.$add(offer);
            }
        },

        isOfferred: function (taskId) {
            var d = $q.defer();

            $firebaseArray(ref.child('offers').child(taskId).orderByChild("uid").equalTo(user.uid))
                .$loaded().then(function (data) {
                    d.resolve(data.length > 0);
                }, function () {
                    d.reject(false);
                })

            return d.promise;
        },

        isMaker: function (offer) {
            return (user && user.providerData && user.uid === offer.uid);
        },

        getOffer: function (taskId, offerId) {
            return $firebaseObject(ref.child('offers').child(taskId).child(offerId));
        },

        cancelOffer: function (taskId, offerId) {
            return this.getOffer(taskId, offerId).$remove();
        },

        acceptOffer: function (taskId, offerId, runnerId) {
            var o = this.getOffer(taskId, offerId);
            return o.$loaded().then(function () {
                o.accepted = true;
                o.$save().then(function () {
                    var t = Task.getTask(taskId);
                    return t.$loaded().then(function () {
                        t.status = "assigned";
                        t.runner = runnerId;
                        t.$save();
                    })
                });
            })
                .then(function(){
                    return Task.createUserTask(taskId);
                })
        }
    };

    return Offer;
})