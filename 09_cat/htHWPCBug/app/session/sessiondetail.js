(function () {
    'use strict';

    var controllerId = 'sessiondetail';

    angular.module('app').controller(controllerId,
        ['$location', '$scope', '$routeParams', '$window',
            'bootstrap.dialog', 'common', 'config', 'datacontext', 'helper', 'model', sessiondetail]);

    function sessiondetail($location, $scope, $routeParams, $window,
            bsDialog, common, config, datacontext, helper, model) {
        var vm = this;
        var entityName = model.entityNames.session;
        var logError = common.logger.getLogFn(controllerId, 'error');
        var $q = common.$q;
        var wipEntityKey = undefined;

        vm.cancel = cancel;
        vm.deleteSession = deleteSession;
        vm.goBack = goBack;
        vm.hasChanges = false;
        vm.isSaving = false;
        vm.rooms = [];
        vm.save = save;
        vm.session = undefined;
        vm.speakers = [];
        vm.timeslots = [];
        vm.tracks = [];

        activate();

        Object.defineProperty(vm, 'canSave', { get: canSave });

        function activate() {
            initLookups();
            onDestroy();
            onHasChanges();
            common.activateController([getRequestedSession()], controllerId)
                .then(onEveryChange);
        }

        function autoStoreWip(immediate) {
            common.debouncedThrottle(controllerId, storeWipEntity, 1000, immediate);
        }

        function cancel() {
            datacontext.cancel();
            removeWipEntity();
            helper.replaceLocationUrlGuidWithId(vm.session.id);

            if (vm.session.entityAspect.entityState.isDetached()) {
                gotoSessions();
            }
        }

        function canSave() { return vm.hasChanges && !vm.isSaving; }

        function deleteSession() {
            return bsDialog.deleteDialog('Session')
                .then(confirmDelete);

            function confirmDelete() {
                datacontext.markDeleted(vm.session);
                vm.save().then(success, failed);

                function success() {
                    removeWipEntity();
                    gotoSessions();
                }

                function failed(error) {
                    cancel(); // Makes the entity available to edit again
                }
            }
        }

        function getRequestedSession() {
            var val = $routeParams.id;
            if (val === 'new') { return vm.session = datacontext.session.create(); }

            return datacontext.session.getEntityByIdOrFromWip(val)
                .then(function (data) {
                    // Will either get back an entity or an {entity:, key:}
                    wipEntityKey = data.key;
                    vm.session = data.entity || data;
                }, function (error) {
                    logError('Unable to get session from WIP ' + val);
                    gotoSessions();
                });
        }

        function goBack() { $window.history.back(); }

        function gotoSessions() { $location.path('/sessions'); }

        function initLookups() {
            var lookups = datacontext.lookup.lookupCachedData;
            vm.rooms = lookups.rooms;
            vm.timeslots = lookups.timeslots;
            vm.tracks = lookups.tracks;
            vm.speakers = datacontext.speaker.getAllLocal(true);
        }

        function onEveryChange() {
            $scope.$on(config.events.entitiesChanged,
                function (event, data) {
                    autoStoreWip();
                });
        }

        function onDestroy() {
            $scope.$on('$destroy', function () {
                autoStoreWip(true);
                datacontext.cancel();
            });
        }

        function onHasChanges() {
            $scope.$on(config.events.hasChangesChanged,
                function (event, data) {
                    vm.hasChanges = data.hasChanges;
                });
        }

        function removeWipEntity() {
            datacontext.zStorageWip.removeWipEntity(wipEntityKey);
        }

        function save() {
            if (!canSave()) { return $q.when(null); } // Must return a promise

            vm.isSaving = true;
            return datacontext.save().then(function (saveResult) {
                vm.isSaving = false;
                datacontext.speaker.calcIsSpeaker();
                removeWipEntity();
                helper.replaceLocationUrlGuidWithId(vm.session.id);
            }, function (error) {
                vm.isSaving = false;
            });
        }

        function storeWipEntity() {
            if (!vm.session) return;
            var description = vm.session.title || '[New Session]' + vm.session.id;
            wipEntityKey = datacontext.zStorageWip.storeWipEntity(vm.session, wipEntityKey, entityName, description);
        }
    }
})();