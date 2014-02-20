﻿(function () {
    'use strict';
    
    var controllerId = 'wip';
    angular.module('app').controller(controllerId,
        ['$scope', '$location',
            'bootstrap.dialog', 'common', 'config', 'datacontext', wip]);

    function wip($scope, $location, bsDialog, common, config, datacontext) {
        var vm = this;

        vm.cancelAllWip = cancelAllWip;
        vm.gotoWip = gotoWip;
        vm.predicate = '';
        vm.reverse = false;
        vm.setSort = setSort;
        vm.title = 'Work in Progress';
        vm.wip = [];

        activate();

        function activate() {
            common.activateController([getWipSummary()], controllerId);

            $scope.$on(config.events.storage.wipChanged, function (event, data) {
                vm.wip = data;
            });
        }

        function cancelAllWip() {
            vm.isDeleting = true;

            return bsDialog.deleteDialog('Work in Progress')
                .then(confirmDelete, cancelDelete);

            function cancelDelete() { vm.isDeleting = false; }

            function confirmDelete() {
                datacontext.zStorageWip.clearAllWip();
                vm.isDeleting = false;
            }
        }

        function getWipSummary() { vm.wip = datacontext.zStorageWip.getWipSummary(); }

        function gotoWip(wipData) {
            $location.path('/' + wipData.routeState + '/' + wipData.key);
        }
        
        function setSort(prop) {
            vm.predicate = prop;
            vm.reverse = !vm.reverse;
        }
    }
})();