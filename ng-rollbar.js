(function(angular){
  angular.module('tandibar/ng-rollbar', []);

  angular.module('tandibar/ng-rollbar').config(['$provide', function($provide) {
    $provide.decorator('$exceptionHandler', ['$delegate', '$injector', '$window', function($delegate, $injector, $window) {
      return function (exception, cause) {
        if($window.Rollbar) {
          $window.Rollbar.error(exception, {cause: cause}, function(err, data) {
            var $rootScope = $injector.get('$rootScope');
            $rootScope.$emit('rollbar:exception', {
              exception: exception,
              err: err,
              data: data.result
            });
          });
        }
        $delegate(exception, cause);
      };
    }]);
  }]);

  angular.module('tandibar/ng-rollbar').provider('Rollbar', function RollbarProvider() {
    var rollbarProvider = this;
    var rollbarActivated = true;

    this.init = function(config) {
      var _rollbarConfig = config;
      if (rollbarActivated) {
        /* jshint ignore:start */
        /* rollbar client lib start */
        // https://raw.githubusercontent.com/rollbar/rollbar.js/v2.3.3/dist/rollbar.snippet.js
        404: Not Found

        /* rollbar client lib end */
        /* jshint ignore:end */
      }
    };

    this.deinit = function () {
      rollbarActivated = false;
    };

    getter.$inject = ['$log', '$window'];
    function getter($log, $window) {

      function _bindRollbarMethod(methodName) {
        return function() {
          $window.Rollbar[methodName].apply($window.Rollbar, arguments);
        };
      }

      var service = {
        Rollbar: logInactiveMessage,

        configure: logInactiveMessage,

        critical: logInactiveMessage,
        error: logInactiveMessage,
        warning: logInactiveMessage,
        info: logInactiveMessage,
        debug: logInactiveMessage,

        scope: logInactiveMessage,

        verbose: logInactiveMessage,
        enable: logInactiveMessage,
        disable: logInactiveMessage
      };

      if (rollbarActivated) {
        service.Rollbar = $window.Rollbar;

        // bind the native Rollbar methods
        service.configure = _bindRollbarMethod('configure');
        service.critical = _bindRollbarMethod('critical');
        service.error = _bindRollbarMethod('error');
        service.warning = _bindRollbarMethod('warning');
        service.info = _bindRollbarMethod('info');
        service.debug = _bindRollbarMethod('debug');
        service.scope = _bindRollbarMethod('scope');

        service.verbose = function (boolean) {
          if (boolean === undefined) { boolean = true; }
          $window.Rollbar.configure({ verbose: boolean });
        };

        service.enable = function () {
          $window.Rollbar.configure({ enabled: true });
        };

        service.disable = function () {
          $window.Rollbar.configure({ enabled: false });
        };
      }

      function logInactiveMessage() {
        $log.warn("Rollbar is deactivated");
      }

      return service;
    }

    this.$get = getter;
  });

})
(angular);
