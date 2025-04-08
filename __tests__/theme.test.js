const { initializeTheme, toggleTheme } = require('../src/js/theme');

describe('Theme Management', () => {
  let originalDocument;
  let mockLocalStorage;

  beforeEach(() => {
    // Mock document
    originalDocument = { ...global.document };
    global.document = {
      documentElement: {
        classList: {
          add: jest.fn(),
          remove: jest.fn(),
          contains: jest.fn()
        },
      },
    };

    // Mock localStorage
    mockLocalStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
    };
    global.localStorage = mockLocalStorage;
  });

  afterEach(() => {
    // Restore original objects
    global.document = originalDocument;
    delete global.localStorage;
    jest.clearAllMocks();
  });

  test('should initialize with light theme by default', () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    initializeTheme();
    expect(document.documentElement.classList.remove).toHaveBeenCalledWith('dark-mode');
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('theme');
  });

  test('should initialize with dark theme if stored', () => {
    mockLocalStorage.getItem.mockReturnValue('dark');
    initializeTheme();
    expect(document.documentElement.classList.add).toHaveBeenCalledWith('dark-mode');
  });

  test('should toggle between light and dark themes', () => {
    // Start with light theme
    mockLocalStorage.getItem.mockReturnValue(null);
    initializeTheme();

    // Toggle to dark
    document.documentElement.classList.contains.mockReturnValue(false);
    toggleTheme();
    expect(document.documentElement.classList.add).toHaveBeenCalledWith('dark-mode');
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('theme', 'dark');

    // Toggle back to light
    document.documentElement.classList.contains.mockReturnValue(true);
    toggleTheme();
    expect(document.documentElement.classList.remove).toHaveBeenCalledWith('dark-mode');
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('theme', 'light');
  });

  test('should handle theme toggle when localStorage is not available', () => {
    delete global.localStorage;
    expect(() => toggleTheme()).not.toThrow();
  });
}); 