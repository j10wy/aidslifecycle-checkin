//Include after app module and participant-search.js
onlineCheckin.controller('participantInformation', function($scope, $http, $rootScope, $log, $uibModalInstance, participant) {

    //ALC Options
    var header = {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        uri = "https://actnow.tofighthiv.org/site/",
        postdata = "&api_key="+luminate_config.api_key+"&v=1.0&response_format=json";

    $scope.checkInButtonDisable = true;
    $scope.selected = participant;
    $rootScope.badgeInformation = {

        firstName: $scope.selected.consInfo.name.first,
        lastName: $scope.selected.consInfo.name.last,
        partType: $scope.selected.partType,
        teamName: $scope.selected.teamName,
        isTeamCaptain: true,
        isRoadieCaption: false,
        roadieTeamAssignment: "Rest Stop 1"

    };

    $scope.displayBadge = function() {

        switch ($scope.selected.consInfo.custom.string[0].content) {
            case "STAFF":
                $scope.badgeSrc = "img/lanyard-alc-staff.jpg";
                break;
            case "ROADIE":
                $scope.badgeSrc = "img/lanyard-roadie.jpg";
                break;
            case "VIRTUAL CYCLIST":
                $scope.badgeSrc = "img/lanyard-virtual-cyclist.jpg";
                break;                
            default:
                $scope.badgeSrc = "img/sf-expo.png";
        }
    };

    $scope.displayBadge();

    $scope.printBadge = function() {
        window.print();
        $scope.checkInButtonDisable = false;
    };

    $scope.ok = function() {

        $rootScope.badgeInformation = {};

        var luminateServlet = "CRConsAPI",
            luminateMethod = "method=logInteraction",
            sso_auth_token = "&sso_auth_token=" + $rootScope.sso_auth_token,
            //What is the consId?
            consId = "&cons_id=" + $scope.selected.consInfo.cons_id,
            interactionTypeId = "&interaction_type_id=1000",
            interactionSubject = "&interaction_subject=Event check-in",
            interactionBody = "&interaction_body=Check-in at NC Expo.";

        $http({
            method: 'POST',
            url: uri + luminateServlet,
            data: luminateMethod + postdata + interactionTypeId + interactionSubject + interactionBody + consId + sso_auth_token,
            headers: header
        }).then(function(responseData) {
            //Success
            $log.info("Log Interaction Successful for cons: " + $scope.selected.consInfo.cons_id);
            $log.info(responseData);
            $uibModalInstance.close($scope.selected);
        }, function(responseData) {
            //Error
            $log.error("Log Interaction Unsuccessful");
            $log.error(responseData);
        });
    };

    $scope.cancel = function() {
        $rootScope.badgeInformation = {};
        $uibModalInstance.dismiss('cancel');
    };
});
