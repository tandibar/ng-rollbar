/**
 * This spec tests the module instantiation and the $exceptionHandler
 * decorator logic.
 */

describe('[ng-rollbar Module]', function() {
    var $exceptionHandler;

    var $rootScopeSpy,
        $windowMock,
        RollbarSpy;

    // Spies and configuration
    beforeEach(module(function($provide, $exceptionHandlerProvider) {

        // $rootScope spy
        $provide.service('$rootScope', function() {
            $rootScopeSpy = jasmine.createSpyObj('$rootScope', ['$emit']);
            return $rootScopeSpy;
        });

        // $window Mock
        $provide.service('$window', function() {
            $windowMock = {
                Rollbar: RollbarSpy
            };
            return $windowMock;
        });

        // Rollbar spy
        RollbarSpy = jasmine.createSpyObj('Rollbar', ['error']);

        // Configure exception handling
        $exceptionHandlerProvider.mode('log');

    }));

    // Instantiate the module
    beforeEach(module('tandibar/ng-rollbar'));

    // Capture a reference to the exception handler
    beforeEach(inject(function(_$exceptionHandler_) {
        $exceptionHandler = _$exceptionHandler_;
    }));

    /***************
     * Begin tests
     **************/

    describe('When initializing the module', function() {
        it('should declare the module object', function() {
            expect(typeof angular.module('tandibar/ng-rollbar')).toEqual('object');
        });
    });

    describe('When throwing an error', function() {
        var eventMock = {
            exception: 'MY EXCEPTION',
            err: 'MY ERR',
            data: 'MY DATA'
        };

        beforeEach(function() {
            // pass data to $exceptionHandler
            $exceptionHandler('MY EXCEPTION', 'MY CAUSE');

            // manually run the callback from the Rollbar spy
            RollbarSpy.error.calls.argsFor(0)[2]('MY ERR', {result: 'MY DATA'});
        });

        it('should log the error via Rollbar', function() {
            expect(RollbarSpy.error).toHaveBeenCalledWith('MY EXCEPTION', {cause: 'MY CAUSE'}, jasmine.any(Function));
        });

        it('should emit a rollbar event on $rootScope', function() {
            expect($rootScopeSpy.$emit).toHaveBeenCalledWith('rollbar:exception', eventMock);
        });
    });

});
