"use strict";

const ipcRenderer = require('electron').ipcRenderer;

angular
    .module('login', ["firebase"])
    .controller('loginController', function ($scope, $firebaseObject) {
        var ref = new Firebase("https://electrontest-hay.firebaseio.com/chat");

        $scope.user = {
            email: 'georgeshay@example.com',
            password: ''
        };

        $scope.wait = false;

        $scope.connect = function () {
            $scope.wait = true;
            if ($scope.user.email && $scope.user.password) {
                ref.authWithPassword({
                    email: $scope.user.email,
                    password: $scope.user.password
                }, function (error, authData) {
                    if (error) {
                        console.log("Login Failed!", error);
                    } else {

                        var newUser = new $firebaseObject(ref);
                        newUser[$scope.user.email.substring(0, $scope.user.email.indexOf("@"))] = {mail: authData.password.email, id: authData.auth.uid};
                        newUser.$save().then(function () {
                            ipcRenderer.send('closeLogin', authData);
                        })

                    }
                });
            }

        };

        $scope.pleaseOpenDevtools = function() {
            ipcRenderer.send("please-open-devtools-login");
        };

    });