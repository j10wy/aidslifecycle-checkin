//Include after app-check-in.js
onlineCheckin.controller('rsvpSearch', function ($scope, $log, $http, $rootScope, $uibModal) {

    if ($rootScope.loggedIn === false) {
        alert("You are not logged in!");
        window.location.href = '#!/';
    }

    $scope.preventDefault = function(form) {
        console.log(form);
    }

    $scope.members = {};
    $scope.loading = false;

    $scope.$watch("searchBox", function (newValue, oldValue) {
        if (newValue === undefined) {
            delete $scope.searchBox;
        }
    });

    //Token
    var sso_auth_token = "&sso_auth_token=" + $rootScope.sso_auth_token,
        luminateServlet = "CRConsAPI";

    //ALC Options
    var header = {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        uri = "https://actnow.tofighthiv.org/site/",
        postdata = "&api_key=" + luminate_config.api_key + "&v=1.0&response_format=json";

    $http({
        method: 'POST',
        url: uri + luminateServlet,
        data: "method=getGroupMembers&api_key=" + luminate_config.api_key + "&v=1.0&response_format=json&group_id=" + luminate_config.group_id + sso_auth_token,
        headers: header
    }).then(function (responseData) {

        $log.info("Received group information");
        $log.info(responseData.data.getGroupMembersResponse.member);
        $scope.members = angular.copy(responseData.data.getGroupMembersResponse.member);
        $scope.loading = true;
    }, function (responseData) {

        $log.error("Could not get RSVP Group");
        $log.info(responseData);
    });

    $scope.open = function (size, participant) {

        consId = "&cons_id=" + participant.cons_id,
            modalInstance = {};

        //$log.info(consId);

        $http({
            method: 'POST',
            url: uri + luminateServlet,
            data: "method=getUser" + postdata + consId + sso_auth_token,
            headers: header
        }).then(function (responseData) {
            //Success
            $log.info(responseData.data.getConsResponse);

            //You'll need to update this based on the response of $log.info above
            participant.consInfo = responseData.data.getConsResponse;

            modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'views/participant-information-modal.html',
                controller: 'participantInformation',
                size: size,
                resolve: {
                    participant: function () {
                        return participant;
                    }
                }
            });
            //End Success function

            if (modalInstance.result) {

                modalInstance.result.then(function (selectedItem) {
                    $log.info(selectedItem.name.first + " " + selectedItem.name.last + " checked in at " + new Date());
                }, function (message) {
                    $log.warn('Modal dismissed at: ' + new Date() + " | Reason:" + message);

                });
            } else {
                $log.warn("Not connected. Can't open window.");
                alert("Session timed out. Please login.");
                window.location.href = '#!/';
            }
        });

    }; //End open function

});