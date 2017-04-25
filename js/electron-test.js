// The app needs to run in both the browser and Electron
// The if statement below is true, we're using Electron and we'll use require to load jQuery
if (window && window.process && window.process.type) {
    window.$ = window.jQuery = require('./node_modules/jquery/dist/jquery.min.js');
}