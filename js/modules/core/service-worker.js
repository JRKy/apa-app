// service-worker.js - Service worker registration and management

export async function registerSW() {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service worker registered:', registration);
    } catch (error) {
      console.error('Service worker registration failed:', error);
    }
  }
} 