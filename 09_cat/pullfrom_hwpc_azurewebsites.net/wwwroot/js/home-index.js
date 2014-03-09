// home-index.js
var homeIndexModule = angular.module("homeIndex", ["ngRoute"]);
//-CAT- RouteConfig
homeIndexModule.config(["$routeProvider", function ($routeProvider) {
    $routeProvider.when("/", {
        controller: "ticketsController",
        templateUrl: "/templates/ticketsView.html"
    });
    $routeProvider.when("/newticket", {
        controller: "newTicketController",
        templateUrl: "/templates/newTicketView.html"
    });
    $routeProvider.when("/ticket/:id", {
        controller: "singleTicketController",
        templateUrl: "/templates/singleTicketView.html"
    });
    $routeProvider.otherwise({ redirectTo: "/" });
}]);
//-CAT- dataService
homeIndexModule.factory("dataService", ["$http", "$q", function ($http, $q) {
    var _tickets = [];
    var _isInit = false;
    var _isReady = function () { return _isInit; }
    var _getTickets = function () {
        var deferred = $q.defer();
        $http.get("/api/v1/tickets?includeMemos=true")
          .then(function (result) { // Successful
              angular.copy(result.data, _tickets);
              _isInit = true;
              deferred.resolve();
          },
          function () { deferred.reject(); }); // Error
        return deferred.promise;
    };
    var _addTicket = function (newTicket) {
        var deferred = $q.defer();
        $http.post("/api/v1/tickets", newTicket)
         .then(function (result) { // success
             var newlyCreatedTicket = result.data;
             _tickets.splice(0, 0, newlyCreatedTicket);
             deferred.resolve(newlyCreatedTicket);
         },
         function () { deferred.reject(); }); // Error
        return deferred.promise;
    };
    function _findTicket(id) {
        var found = null;
        $.each(_tickets, function (i, item) {
            if (item.id == id) {
                found = item;
                return false;
            }
        });
        return found;
    }
    var _getTicketById = function (id) {
        var deferred = $q.defer();
        if (_isReady()) {
            var ticket = _findTicket(id);
            if (ticket) { deferred.resolve(ticket);
            } else { deferred.reject(); }
        } else {
            _getTicket()
              .then(function () { // success
                  var ticket = _findTicket(id);
                  if (ticket) { deferred.resolve(ticket);
                  } else { deferred.reject(); }
              },
              function () {  deferred.reject(); });
        }
        return deferred.promise;
    };
    var _saveMemo = function (ticket, newMemo) {
        var deferred = $q.defer();
        $http.post("/api/v1/tickets/" + ticket.id + "/memos", newMemo)
          .then(function (result) { // success
              if (ticket.memos == null) ticket.memos = [];
              ticket.memos.push(result.data);
              deferred.resolve(result.data);
          },
          function () { deferred.reject(); });
        return deferred.promise;
    };
    //-CAT- Return the dataService
    return {
        tickets: _tickets,
        getTickets: _getTickets,
        addTicket: _addTicket,
        isReady: _isReady,
        getTicketById: _getTicketById,
        saveMemo: _saveMemo
    };
}]);
//-CAT- ticketsContrller
var ticketsController = ["$scope", "$http", "dataService",
  function ($scope, $http, dataService) {
      $scope.data = dataService;
      $scope.isBusy = false;
      if (dataService.isReady() == false) {
          $scope.isBusy = true;
          dataService.getTickets()
            .then(function () { }, //success
            function () { alert("could not load topics"); }) //error
            .then(function () {
                $scope.isBusy = false;
            });
      }
  }];
//-CAT- newTicketController
var newTicketController = ["$scope", "$http", "$window", "dataService",
  function ($scope, $http, $window, dataService) {
      $scope.newTicket = {};
      $scope.save = function () {
          dataService.addTicket($scope.newTicket)
            .then(function () { $window.location = "#/"; }, //success
            function () { alert("could not save the new topic"); }); //error
      };
  }];
//-CAT- singleTicketController
var singleTicketController = ["$scope", "dataService", "$window", "$routeParams",
  function ($scope, dataService, $window, $routeParams) {
      $scope.ticket = null;
      $scope.newMemo = {};
      dataService.getTicketById($routeParams.id)
        .then(function (ticket) { $scope.ticket = ticket; }, //success
        function () { $window.location = "#/"; }); //error
      $scope.addMemo = function () {
          dataService.saveMemo($scope.ticket, $scope.newMemo)
            .then(function () { $scope.newMemo.body = ""; }, //success
            function () {alert("Could not save the new memo"); }); //error
      };
  }];