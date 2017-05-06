# porcupine-ionic
Todo app made with Ionic 3 and Angular 4. 

# Setup on local machine
# Project, Debugging, Basic:
npm install
cordova platform add ios
cordova platform add android

# Libraries + Dependencies:
npm install tedious --save
typings install dt~tedious --save --global
(Add typings main.d.ts to tsconfig.json files array)
Source:https://mhartington.io/post/ionic2-external-libraries/