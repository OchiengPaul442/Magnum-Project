// jest.setup.ts

// Add custom matchers for DOM nodes
import '@testing-library/jest-dom/extend-expect';

// Suppress specific warnings in tests
jest.spyOn(global.console, 'warn').mockImplementation((message) => {
  if (message.includes('Warning:')) return;
  console.warn(message);
});

// Mock a global fetch API
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
  }),
) as jest.Mock;
