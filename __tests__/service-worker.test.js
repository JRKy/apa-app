const { registerSW } = require('../src/js/service-worker');

describe('Service Worker', () => {
  let mockNavigator;

  beforeEach(() => {
    // Mock navigator.serviceWorker
    mockNavigator = {
      serviceWorker: {
        register: jest.fn().mockResolvedValue({}),
      },
    };
    global.navigator = mockNavigator;
  });

  afterEach(() => {
    delete global.navigator;
    jest.clearAllMocks();
  });

  test('should register service worker when supported', async () => {
    await registerSW();
    expect(mockNavigator.serviceWorker.register).toHaveBeenCalledWith('/sw.js');
  });

  test('should handle service worker registration error', async () => {
    const error = new Error('Registration failed');
    mockNavigator.serviceWorker.register.mockRejectedValue(error);

    // Mock console.error to prevent test output pollution
    const originalConsoleError = console.error;
    console.error = jest.fn();

    await registerSW();
    expect(console.error).toHaveBeenCalledWith('Service worker registration failed:', error);

    // Restore console.error
    console.error = originalConsoleError;
  });

  test('should not attempt registration when service workers are not supported', async () => {
    delete global.navigator.serviceWorker;
    await registerSW();
    expect(mockNavigator.serviceWorker?.register).not.toHaveBeenCalled();
  });
}); 