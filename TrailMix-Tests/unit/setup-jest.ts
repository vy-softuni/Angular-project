import 'jest-preset-angular/setup-jest';
// Make JSDOM location writable for code that sets window.location.href
Object.defineProperty(window, 'location', {
  writable: true,
  value: { href: 'http://localhost/' }
});
// Basic localStorage shim is provided by jsdom; nothing else needed here.