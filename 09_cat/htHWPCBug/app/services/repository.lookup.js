﻿(function () {
    'use strict';

    var serviceId = 'repository.lookup';

    angular.module('app').factory(serviceId,
        ['model', 'repository.abstract', 'zStorage', RepositoryLookup]);

    function RepositoryLookup(model, AbstractRepository, zStorage) {
        var entityName = 'lookups';
        var entityNames = model.entityNames;
        var EntityQuery = breeze.EntityQuery;

        function Ctor(mgr) {
            this.serviceId = serviceId;
            this.entityName = entityName;
            this.manager = mgr;
            this.zStorage = zStorage;
            // Exposed data access functions
            this.getAll = getAll;
            this.setLookups = setLookups;
        }
        
        // Allow this repo to have access to the Abstract Repo's functions,
        // then put its own Ctor back on itself.
        //Ctor.prototype = new AbstractRepository(Ctor);
        //Ctor.prototype.constructor = Ctor;
        AbstractRepository.extend(Ctor);

        return Ctor;

        // Formerly known as datacontext.getLookups()
        function getAll() {
            var self = this;
            return EntityQuery.from('Lookups')
                .using(self.manager).execute()
                .to$q(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                model.createNullos(self.manager);
                self.zStorage.save();
                self.log('Retrieved [Lookups]', data, true);
                return true;
            }
        }

        // Formerly known as datacontext.setLookups()
        function setLookups() {
            this.lookupCachedData = {
                rooms: this._getAllLocal(entityNames.room, 'name'),
                tracks: this._getAllLocal(entityNames.track, 'name'),
                timeslots: this._getAllLocal(entityNames.timeslot, 'start')
            };
        }


    }
})();