# Growth
Growth is a game about living. In the wilderness.  
**DISCLAIMER: THE CODE ISN'T GOOD; I NEVER EXPECTED THE PROJECT TO BE THIS BIG.**  
**I REPEAT, DO NOT TAKE ADVICE FROM THIS CODE**  

# Requirements
* NodeJS >= v0.12.0 (recommended)
* The modules for the game

## Downloading Node
In Ubuntu/Linux, you usually build NodeJS from source, rather than
downloading it from a package manager such as `apt-get`.

First, download the NodeJS source and extract it.
```sh
wget http://nodejs.org/dist/v0.12.0/node-v0.12.0.tar.gz
tar -xvf node-v0.12.0.tar.gz
```

## Building Node
Then, `cd` into the directory, configure, and build, and install!
```sh
cd node-v0.12.0
./configure --prefix=/usr/local/
make
sudo make install
```

## Downloading the Modules
Don't worry, it isn't *that* painful.
Simply type this in the repository directory:
```sh
npm install
```
It should only take a few seconds.

## Playing the Game
To jump into the game, execute this:
```sh
node src/Game.js
```

But help?
In the game, type help (">" not included):
```sh
> help
```

And that's all you will need to play Growth.
Have fun.
