/**
 * This spec tests the Rollbar service and its binding to the native Rollbar
 * object.
 */

describe('Service: Rollbar', function() {
    var target;

    var $windowMock,
        nativeRollbarSpy;

        // Spies and configuration
        beforeEach(module(function($provide, $exceptionHandlerProvider) {

            // $window Mock
            $provide.service('$window', function() {
                $windowMock = {
                    Rollbar: nativeRollbarSpy
                };
                return $windowMock;
            });

            // Rollbar spy
            nativeRollbarSpy = jasmine.createSpyObj('Rollbar', ['error']);

            // Configure exception handling
            $exceptionHandlerProvider.mode('log');

        }));

        // Instantiate the module
        beforeEach(module('tandibar/ng-rollbar'));

        // Get a reference to the target service (in this case the Rollbar service)
        beforeEach(inject(function(Rollbar) {
            target = Rollbar;
        }));

        /***************
         * Begin tests
         **************/

        // describe()
});
