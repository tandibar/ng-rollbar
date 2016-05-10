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
                return $logSpy;
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

        // Initialization
        function initializeModule(triggerDeinit) {

            // initialize the ng-rollbar module
            module('tandibar/ng-rollbar');

            // capture the provider and optionally deinit
            module(function(RollbarProvider) {
                targetProvider = RollbarProvider;
                if (triggerDeinit) {
                    RollbarProvider.deinit();
                }
            });

            // inject the Rollbar service and capture a reference
            inject(function(Rollbar) {
                target = Rollbar;
            });
        }


        /***************
         * Begin tests
         **************/

        describe('When Rollbar is active', function() {

            beforeEach(function() {
                initializeModule();
            });

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

        describe('When Rollbar is deactivated', function() {
            beforeEach(function() {
                initializeModule(true);
            });

            // these tests will loop over the methods that are wrappers around the native object
            nativeRollbarMethods.forEach(function(method) {

                describe('and the `' + method + '` method is run', function() {
                    beforeEach(function() {
                        target[method]('ARGUMENT 1', 'ARGUMENT 2', 'ARGUMENT 3');
                    });

                    it('should NOT call the method on the native Rollbar object', function() {
                        expect(nativeRollbarSpy[method]).not.toHaveBeenCalled();
                    });

                    it('should log a warning', function() {
                        expect($logSpy.warn).toHaveBeenCalled();
                    });
                });

            });

            // these will test additional disabled methods
            var disabledConfigMethods = ['verbose', 'enable', 'disable'];
            disabledConfigMethods.forEach(function(method) {

                describe('and the `' + method + '` config method is run', function() {
                    beforeEach(function() {
                        target[method]();
                    });

                    it('should NOT configure the native Rollbar object', function() {
                        expect(nativeRollbarSpy.configure).not.toHaveBeenCalled();
                    });

                    it('should log a warning', function() {
                        expect($logSpy.warn).toHaveBeenCalled();
                    });
                });

            });
        });
});
