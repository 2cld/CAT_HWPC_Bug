﻿(function () {
    'use strict';

    var app = angular.module('app');

    // Configure Toastr
    toastr.options.timeOut = 4000;
    toastr.options.positionClass = 'toast-bottom-right';

    var keyCodes = {
        backspace: 8,
        tab: 9,
        enter: 13,
        esc: 27,
        space: 32,
        pageup: 33,
        pagedown: 34,
        end: 35,
        home: 36,
        left: 37,
        up: 38,
        right: 39,
        down: 40,
        insert: 45,
        del: 46
    };

    // For use with the HotTowel-Angular-Breeze add-on that uses Breeze
    var remoteServiceName = 'breeze/Breeze';

    var imageSettings = {
        imageBasePath: '../content/images/photos/',
        unknownPersonImageSource: 'unknown_person.jpg'
    };

    var events = {
        controllerActivateSuccess: 'controller.activateSuccess',
        hasChangesChanged: 'datacontext.hasChangesChanged',
        entitiesChanged: 'datacontext.entitiesChanged',
        spinnerToggle: 'spinner.toggle',
        storage: {
            error: 'store.error',
            storeChanged: 'store.changed',
            wipChanged: 'wip.changed'
        }
    };

    var config = {
        appErrorPrefix: '[CC Error] ', //Configure the exceptionHandler decorator
        docTitle: 'CC: ',
        events: events,
        imageSettings: imageSettings,
        keyCodes: keyCodes,
        remoteServiceName: remoteServiceName,
        version: '2.0.0'
    };

    app.value('config', config);
    
    app.config(['$logProvider', function ($logProvider) {
        // turn debugging off/on (no info or warn)
        if ($logProvider.debugEnabled) {
            $logProvider.debugEnabled(true);
        }
    }]);
    
    //#region Configure the common services via commonConfig
    app.config(['commonConfigProvider', function (cfg) {
        cfg.config.controllerActivateSuccessEvent = config.events.controllerActivateSuccess;
        cfg.config.spinnerToggleEvent = config.events.spinnerToggle;
    }]);
    //#endregion

    //#region Configure the zStorage and zStorageWip services via zStorageConfig
    app.config(['zStorageConfigProvider', function (cfg) {
        cfg.config = {
            // zStorage
            enabled: true,
            key: 'CCAngularBreeze',
            events: events.storage,
            appErrorPrefix: config.appErrorPrefix,
            version: config.version,
            // zStorageWip
            wipKey: 'CCAngularBreeze.wip',
            newGuid: breeze.core.getUuid
        };
    }]);
    //#endregion

    //#region Configure the Breeze Validation Directive
    app.config(['zDirectivesConfigProvider', function (cfg) {
        cfg.zValidateTemplate =
                     '<span class="invalid"><i class="icon-warning-sign"></i>' +
                     'Inconceivable! %error%</span>';
        //cfg.zRequiredTemplate =
        //    '<i class="icon-asterisk icon-asterisk-invalid z-required" title="Required"></i>';
    }]);

    // Learning Point:
    // Can configure during config or app.run phase
    //app.run(['zDirectivesConfig', function(cfg) {
    //    cfg.zValidateTemplate =
    //                 '<span class="invalid"><i class="icon-warning-sign"></i>' +
    //                 'Inconceivable! %error%</span>';
    //}]);
    //#endregion
})();