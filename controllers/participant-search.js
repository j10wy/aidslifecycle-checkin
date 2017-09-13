//Include after app-check-in.js
onlineCheckin.controller('participantSearch', function($scope, $log, $http, $rootScope, $uibModal) {

    //ALC Options
    var header = {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        uri = "https://actnow.tofighthiv.org/site/",
        postdata = "&api_key="+luminate_config.api_key+"&v=1.0&response_format=json";

    //Load TeamRaiser JSON
    $scope.searchResults = $rootScope.teamRaiserData.data;
    //Token
    sso_auth_token = "&sso_auth_token=" + $rootScope.sso_auth_token;

    $scope.open = function(size, participant) {

        var luminateServlet = "CRConsAPI",
            luminateMethod = "method=getUser",
            consId = "&cons_id=" + participant.consId,
            modalInstance = {};

        //$log.info(consId);

        $http({
            method: 'POST',
            url: uri + luminateServlet,
            data: luminateMethod + postdata + consId + sso_auth_token,
            headers: header
        }).then(function(responseData) {
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
                    participant: function() {
                        return participant;
                    }
                }
            });
            //End Success function
        }, function(responseData) {

            if (modalInstance.result) {

                modalInstance.result.then(function (selectedItem) {
                    $log.info(selectedItem.name.first + " " + selectedItem.name.last + " checked in at " + new Date());
                }, function (message) {
                    $log.warn('Modal dismissed at: ' + new Date() + " | Reason:" + message);

                });
            } else {
                //Error
                $log.error(responseData);
                $log.warn("Not connected. Can't open window.");
                alert("You have been logged out. Please log in.");
                window.location.href = '#!/';
            }

        });

    }; //End open function

});
