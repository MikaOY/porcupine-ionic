Porcupine
=====================

Todo app made with Ionic 3 and Angular 4. 

Contributors:
--------
Coded with <3 by [@MikaOY](https://github.com/MikaOY) and [@omnikitty](https://github.com/omnikitty).

UPDATES:
--------
*2017-06-28: Massive changes!*

After trying to use Karma + Mocha + Chai + Sinon to implement testing in app, we ran into a roadblock. We could not get Mocha and Angular/Ionic to play nice together. So we're switching to Karma + Jasmine, which is more well-documented.

Get started
-------------------------------
Clone the repository, and...
```
npm install
npm install ionic cordova -g
```

Debugging commands
----------------------
`npm serve` launches Ionic Labs with console logs and live reload

`npm start` launches ios simulator

`npm test` runs unit tests with Karma

`npm ls -gp --depth=0 | awk -F/ '/node_modules/ && !/\/npm$/ {print $NF}' | xargs npm -g rm` for a fresh start

E2E tests (Browser-only)
----------------------

To serve the app, run `npm serve`.

To run the end-to-end tests, run (while the app is being served) `npm run e2e`.

See the example end-to-end test in `e2e/app.e2e-spec.ts`.
