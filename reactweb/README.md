# HOW TO #
First version

## Installing node and npm on linux with nvm
- Install nvm to manage node versions

```
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.8/install.sh | bash
```
- Verify nvm is installed
```
command -v nvm      // Expected output nvm
```
### If the command doesn't generate any output close the actual terminal and open a new one and test again

```
nvm install v6.10.2
```

**Local Run
**

You need NodeJS installed to run the demo.
Download the latest version of NodeJS (recommended 6.3.1 or above) from here: http://nodejs.org/

Once you have NodeJS installed
---------

$ cd /path/to/my-project

Then install all NPM dependencies:

$ npm install

Once installed, run the demo like so:

$ npm run dev -s

## If you get this error when running this command

``` shell
] events.js:160
[2]       throw er; // Unhandled 'error' event
[2]       ^
[2] 
[2] Error: watch /home/oscraker/fluttr/reactweb/demo/tmp/ ENOSPC
[2]     at exports._errnoException (util.js:1018:11)
[2]     at FSWatcher.start (fs.js:1443:19)
[2]     at Object.fs.watch (fs.js:1470:11)
[2]     at Gaze._watchDir (/home/oscraker/fluttr/reactweb/demo/node_modules/gaze/lib/gaze.js:288:30)
[2]     at /home/oscraker/fluttr/reactweb/demo/node_modules/gaze/lib/gaze.js:361:10
[2]     at iterate (/home/oscraker/fluttr/reactweb/demo/node_modules/gaze/lib/helper.js:69:5)
[2]     at Object.forEachSeries (/home/oscraker/fluttr/reactweb/demo/node_modules/gaze/lib/helper.js:83:3)
[2]     at Gaze._initWatched (/home/oscraker/fluttr/reactweb/demo/node_modules/gaze/lib/gaze.js:357:10)
[2]     at Gaze.add (/home/oscraker/fluttr/reactweb/demo/node_modules/gaze/lib/gaze.js:176:8)
[2]     at new Gaze (/home/oscraker/fluttr/reactweb/demo/node_modules/gaze/lib/gaze.js:74:10)
```
It's a problem of system inotify watchers, don't worry about the theory just run this command bellow ot look for more info on this thread: https://github.com/guard/listen/wiki/Increasing-the-amount-of-inotify-watchers#the-technical-details
``` shell
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
```

After the startup compilation finishes, you should get a message in your terminal saying "Node.js app is running at http://localhost:8081". Once you get the message, navigate to http://localhost:8081 in your browser.

**Creating distributable static version**

cd /path/to/my-project

and run "npm run dist -s"

** Zip **
cd /dist
zip -r react-23-10-2017.zip .

** Send file on the Server **
sendFile.sh react-23-10-2017.zip

cd react/dist
rm -rf *
cp ~/react-23-10-2017.zip .
unzip ract-23-10-2017
chmod -R 775 .

** test **

** cache **
find . -exec touch {} \;

**Rubix Bootstrap**

$ cd path/to/rubix-bootstrap

Then run the following command:

$ npm install

$ npm run build -s

The above command will generate a dist folder which you can publish to NPM or npm link to your own project.


if there is some problem about cors after nginx installation :
sudo apt-get install nginx-extras
