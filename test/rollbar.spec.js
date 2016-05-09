/**
 * This spec tests the Rollbar service and its binding to the native Rollbar
 * object.
 */

/* jshint loopfunc: true */

describe('[Rollbar Service]', function() {
    var target,
        targetProvider;

    var nativeRollbarMethods = ['configure', 'critical', 'error', 'warning', 'info', 'debug', 'scope'];

    var $logSpy,
        $windowMock,
        nativeRollbarSpy;

        // Spies and configuration
        beforeEach(module(function($provide, $exceptionHandlerProvider) {

            // $log Spy
            $provide.service('$log', function() {
                $logSpy = jasmine.createSpyObj('$log', ['warn']);
            });

            // $window Mock
            $provide.service('$window', function() {
                $windowMock = {
                    Rollbar: nativeRollbarSpy
                };
                return $windowMock;
            });

            // Rollbar spy
            nativeRollbarSpy = jasmine.createSpyObj('Rollbar', nativeRollbarMethods);

            // Configure exception handling
            $exceptionHandlerProvider.mode('log');

        }));

        // Initialize the module and capture a reference to the provider
        beforeEach(module('tandibar/ng-rollbar', function(RollbarProvider) {
            targetProvider = RollbarProvider;
        }));


        /***************
         * Begin tests
         **************/

        describe('When Rollbar is active', function() {

            // Get a reference to the target service (in this case the Rollbar service)
            beforeEach(inject(function(Rollbar) {
                target = Rollbar;
            }));

            // these tests will loop over the methods that are wrappers around the native object
            for (var i=0; i<nativeRollbarMethods.length; i++) {
                var method = nativeRollbarMethods[i];

                describe('and the `' + method + '` method is run', function() {
                    beforeEach(function() {
                        target[method]('ARGUMENT 1', 'ARGUMENT 2', 'ARGUMENT 3');
                    });

                    it('should call the method on the native Rollbar object', function() {
                        expect(nativeRollbarSpy[method]).toHaveBeenCalled();
                    });

                    it('should pass all of the arguments to the native function', function() {
                        expect(nativeRollbarSpy[method].calls.argsFor(0)).toEqual(['ARGUMENT 1', 'ARGUMENT 2', 'ARGUMENT 3']);
                    });
                });
            }

            describe('and verbose mode is implicitly enabled', function() {
                beforeEach(function() {
                    target.verbose();
                });

                it('should enable Rollbar\'s verbose mode', function() {
                    expect(nativeRollbarSpy.configure).toHaveBeenCalledWith({ verbose: true });
                });
            });

            describe('and verbose mode is explicitly enabled', function() {
                beforeEach(function() {
                    target.verbose(true);
                });

                it('should enable Rollbar\'s verbose mode', function() {
                    expect(nativeRollbarSpy.configure).toHaveBeenCalledWith({ verbose: true });
                });
            });

            describe('and verbose mode is explicitly disabled', function() {
                beforeEach(function() {
                    target.verbose(false);
                });

                it('should disable Rollbar\'s verbose mode', function() {
                    expect(nativeRollbarSpy.configure).toHaveBeenCalledWith({ verbose: false });
                });
            });

            describe('and the service is enabled', function() {
                beforeEach(function() {
                    target.enable();
                });

                it('should enable Rollbar', function() {
                    expect(nativeRollbarSpy.configure).toHaveBeenCalledWith({ enabled: true });
                });
            });

            describe('and the service is disabled', function() {
                beforeEach(function() {
                    target.disable();
                });

                it('should enable Rollbar', function() {
                    expect(nativeRollbarSpy.configure).toHaveBeenCalledWith({ enabled: false });
                });
            });
        });

});
