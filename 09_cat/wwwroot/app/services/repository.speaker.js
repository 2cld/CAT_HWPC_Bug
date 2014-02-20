(function () {
    'use strict';

    var serviceId = 'repository.speaker';
    angular.module('app').factory(serviceId,
        ['model', 'repository.abstract', 'zStorage', 'zStorageWip', RepositorySpeaker]);

    function RepositorySpeaker(model, AbstractRepository, zStorage, zStorageWip) {
        var entityName = model.entityNames.speaker;
        var EntityQuery = breeze.EntityQuery;
        var orderBy = 'firstName, lastName';
        var Predicate = breeze.Predicate;

        function Ctor(mgr) {
            this.serviceId = serviceId;
            this.entityName = entityName;
            this.manager = mgr;
            this.zStorage = zStorage;
            this.zStorageWip = zStorageWip;
            // Exposed data access functions
            this.calcIsSpeaker = calcIsSpeaker;
            this.create = create;
            this.getAllLocal = getAllLocal;
            this.getById = getById;
            this.getTopLocal = getTopLocal;
            this.getPartials = getPartials;
        }

        AbstractRepository.extend(Ctor);

        return Ctor;

        function calcIsSpeaker() {
            // Call this when you need to reset the isSpeaker flag.
            // EX:  session changes (maybe we changed the speaker).
            //      session is deleted (speaker may not have sessions anymore)
            var self = this;

            var persons = self.manager.getEntities(model.entityNames.person);
            var sessions = self.manager.getEntities(model.entityNames.session);

            //var persons = EntityQuery.from('Persons')
            //    .using(self.manager).executeLocally();
            //var sessions = EntityQuery.from('Sessions')
            //    .using(self.manager).executeLocally();

            // clear isSpeaker value for all persons, then
            // reassign based on who has a session now (excluding the nullo)
            persons.forEach(function (s) { s.isSpeaker = false; });
            sessions.forEach(function (s) { s.speaker.isSpeaker = (s.speakerId !== 0); });
        }

        function create() { return this.manager.createEntity(entityName); }

        // Formerly known as datacontext.getLocal()
        function getAllLocal(includeNullo) {
            var predicate = Predicate.create('isSpeaker', '==', true);
            if (includeNullo) {
                predicate = predicate.or(this._predicates.isNullo);
            }
            return this._getAllLocal(entityName, orderBy, predicate);
        }
        
        function getById(id, forceRemote) {
            return this._getById(entityName, id, forceRemote);
        }

        // Formerly known as datacontext.getSpeakerPartials()
        function getPartials(forceRemote) {
            var self = this;
            var predicate = Predicate.create('isSpeaker', '==', true);
            var speakerOrderBy = 'firstName, lastName';
            var speakers = [];

            if (!forceRemote) {
                speakers = self._getAllLocal(entityName, speakerOrderBy, predicate);
                return self.$q.when(speakers);
            }

            return EntityQuery.from('Speakers')
                .select('id, firstName, lastName, imageSource')
                .orderBy(speakerOrderBy)
                .toType(entityName)
                .using(self.manager).execute()
                .to$q(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                speakers = data.results;
                for (var i = speakers.length; i--;) {
                    speakers[i].isPartial = true;
                    speakers[i].isSpeaker = true;
                }
                self.log('Retrieved [Speaker Partials] from remote data source', speakers.length, true);
                self.zStorage.save();
                return speakers;
            }
        }

        // Formerly known as datacontext.getSpeakersTopLocal()
        function getTopLocal() {
            var self = this;
            var predicate = Predicate.create('lastName', '==', 'Papa')
                .or('lastName', '==', 'Guthrie')
                .or('lastName', '==', 'Bell')
                .or('lastName', '==', 'Hanselman')
                .or('lastName', '==', 'Lerman')
                .and('isSpeaker', '==', true);

            return self._getAllLocal(entityName, orderBy, predicate);
        }
    }
})();