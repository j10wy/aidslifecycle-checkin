//Include after app-check-in.js
onlineCheckin.controller('rsvpSearch', function($scope, $log, $http, $rootScope, $uibModal) {

    $scope.members = {};

    $scope.$watch("searchBox", function(newValue, oldValue) {
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
        postdata = "&api_key="+luminate_config.api_key+"&v=1.0&response_format=json";

    // The group id of the email group created by Convio for the event (the group has the same name as the event)
    var eventRSVPGroupId = '141780'

    $http({
        method: 'POST',
        url: uri + luminateServlet,
        data: "method=getGroupMembers&api_key="+luminate_config.api_key+"&v=1.0&response_format=json&group_id=" + eventRSVPGroupId + sso_auth_token,
        headers: header
    }).then(function(responseData) {

        $log.info("Received group information");
        $log.info(responseData.data.getGroupMembersResponse.member);
        $scope.members = angular.copy(responseData.data.getGroupMembersResponse.member);

    }, function(responseData) {

        $log.error("Could not get RSVP Group");
        $log.info(responseData);
    });

    $scope.open = function(size, participant) {

        consId = "&cons_id=" + participant.cons_id,
        modalInstance = {};

        //$log.info(consId);

        $http({
            method: 'POST',
            url: uri + luminateServlet,
            data: "method=getUser" + postdata + consId + sso_auth_token,
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
            //Error
            $log.error("Log Interaction Unsuccessful");
            $log.error(responseData);
            //End Error function
        });

        if (modalInstance.result) {

            modalInstance.result.then(function(selectedItem) {
                $log.info(selectedItem.name.first + " " + selectedItem.name.last + " checked in at " + new Date());
            }, function(message) {
                $log.warn('Modal dismissed at: ' + new Date() + " | Reason:" + message);

            });
        } else {
            $log.warn("Not connected. Can't open window.");
        }


    }; //End open function

});
