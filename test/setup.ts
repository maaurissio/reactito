import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

// Limpia después de cada test
afterEach(() => {
  cleanup();
  localStorage.clear();
});
