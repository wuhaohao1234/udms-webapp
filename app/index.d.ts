import App from './app';

declare global {
  interface Window {
    app: App
  }
  
  declare var app: App;
}