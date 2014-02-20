(function () {
    'use strict';
    var controllerId = 'tickets';
    angular.module('app').controller(controllerId, ['common', 'datacontext', tickets]);

    function tickets(common, datacontext) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var vm = this;
        vm.tickets = [];
        vm.title = 'Tickets';

        activate();

        function activate() {
            common.activateController([getTickets()], controllerId)
                .then(function () { log('Activated Tickets View'); });
        }

        function getTickets() {
            return datacontext.getTickets().then(function (data) {
                return vm.tickets = data;
            });
        }
    }
})();