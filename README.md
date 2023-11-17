# BattleShip

## Table of Contents
- [BattleShip](#battleship)
  - [Table of Contents](#table-of-contents)
  - [Screenshots](#screenshots)
  - [Description](#description)
- [Getting Started](#getting-started)
    - [Live Demo](#live-demo)
    - [Building and running on localhost](#building-and-running-on-localhost)
    - [Running](#running)
    - [Testing](#testing)
- [Game Rules](#game-rules)
    - [Ships](#ships)
  - [Features](#features)
  - [How to Play](#how-to-play)
  - [Technologies Used](#technologies-used)
  - [Credits](#credits)
  - [License](#license)




## Screenshots

![BattleShip](./src/view/assets/examples/battleship-1.png)
![BattleShip](./src/view/assets/examples/Screenshot%202023-11-17%20at%2012.52.49.png)
![BattleShip](./src/view/assets/examples/Screenshot%202023-11-17%20at%2012.53.45.png)

## Description
This is a simple implementation of the classic Battleship game that you can play directly in your web browser.

Based on [Project: Battleship](https://www.theodinproject.com/lessons/node-path-javascript-battleship) from [The Odin Project](https://www.theodinproject.com/) cubiculum.

Play around and let me know your opinions! 

# Getting Started

To play the game, you can either download the source code and host it locally or access the live demo online.

### Live Demo
👉🏻 [Live Demo](https://hideny.github.io/Battleship/) !
 

### Building and running on localhost

First install dependencies:

```sh
npm install
```

To create a production build:

```sh
npm run build-prod
```

To create a development build:

```sh
npm run build-dev
```

### Running

```sh
node dist/bundle.js
```

### Testing

To run unit tests:

```sh
npm test
```


# Game Rules
The Battleship game is a two-player strategy game where each player takes turns to guess the coordinates of their opponent's ships on a grid. 
The goal is to sink all of the opponent's ships before they sink yours.

### Ships
- Aircraft Carrier (5 spaces)
- Battleship (4 spaces)
- Cruiser (3 spaces)
- 2x Destroyer  (2 spaces)
- 2x Submarine (1 space)

## Features
- Realistic grid layout for the game board.
- Interactive interface for placing ships and making guesses.
- Visual representation of hits, misses, and sunk ships.
- End-of-game notification and option to restart.


## How to Play
- Open the game in your web browser.
- Select your name.
- Organize your ships.
- Take turns guessing the coordinates to locate and sink the opponent's ships. 
- The game continues until one player sinks all of the opponent's ships.
- A winner is declared, and players have the option to restart the game.


## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- Webpack
- Babel
- Eslint
- Favicons-webpack-plugin
- Html-webpack-plugin
- Normalize.css
  
## Credits

Made with [createapp.dev](https://createapp.dev/)
Special thanks to the following:

- [Icons8](https://icons8.com) for icons.
- [Unsplash](https://unsplash.com/) for background images.


## License

BattleShip is open-source software licensed under the [MIT License](LICENSE). 
Feel free to use, modify, and distribute it as per the terms of the license.
