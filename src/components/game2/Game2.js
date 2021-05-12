import React, { forwardRef } from 'react';

import { store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import 'animate.css';

class Game2 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // size of board canvas
            canvasWidth: 1366, // 960 
            canvasHeight: 764     , // 704
           
        }
      }


  
canvasRef = React.createRef();



componentDidMount() {

    let weather =  localStorage.getItem("weather")

    // canvas initialisation
    const canvas = this.canvasRef.current;
    const ctx = canvas.getContext('2d');
    

    // global variable
    const tileSize = 64;
    const tileGap = 3;
    let minionsInterval = 600;
    let frame = 0;
    let selectedTower = "DEFAULT";
    
    var directionSelector = 1;
    var PROJECTILE_DIRECTIONS = {
        UP : {id: 0},
        RIGHT : {id: 1},
        DOWN : {id: 2},
        LEFT : {id: 3}
    }

    const BOARD_WIDTH = 960;  // 15 * 64
    const BOARD_HEIGHT = 640; // 10 * 64

    const gameGrid = []; // all cells
    const towers = []; // all towers
    const towerList = []; // all towers in the shop
    const pathTiles = []; // all paths
    const minions = []; // all minions
    const projectiles = []; // all shots
    const spawnPoint = 1 * tileSize + tileGap;// y-coordinates

    // todo: balance
    var towerSelector = "";
    var TOWERS = {
        TIER1 : {id: 1, towerColor: 'yellow', projectileColor: "black", damage: 10, speed: 2, towerCost: 100},
        TIER2 : {id: 2, towerColor: 'orange', projectileColor: "black", damage: 15, speed: 3, towerCost: 200},
        TIER3 : {id: 3, towerColor: 'red', projectileColor: "orange", damage: 20, speed: 0.5, towerCost: 400},
        TIER4 : {id: 4, towerColor: 'green', projectileColor: "blue", damage: 10, speed: 4, towerCost: 600},
        TIER5 : {id: 5, towerColor: 'purple', projectileColor: "green", damage: 10, speed: 6, towerCost: 1000},  
      };


    var MINIONS = {
        CRAWLER: {id: 1, minionColor: 'red', minionSize: 32, minionDamage: 10, minionSpeed: 4, minionHealth: 100, minionCost: 100},
        RUNNER: {id: 2, minionColor: 'orange', minionSize: 32, minionDamage: 5, minionSpeed: 5, minionHealth: 75, minionCost: 125},
        BOSS: {id: 3, minionColor: 'pink', minionSize: 60, minionDamage: 50, minionSpeed: 2, minionHealth: 500, minionCost: 1000},
    }  

    // status bar
    let score = 0;
    let HP = 100000;
    let gold = 30000;
    let gameOver = false;

    const statusBarHeight = 112; // proportions


    // game board
    const controlsBar = {
        width: canvas.width, // board width
        height: tileSize
    }

    const mouse = {
        x: 10,
        y: 10,
        width : 0.1,
        height: 0.1,
    }

    let canvasPosition = canvas.getBoundingClientRect();
    //console.log(canvasPosition);


    // EventListeners
    canvas.addEventListener('mousemove', function(e) {
        mouse.x = e.x - canvasPosition.left;
        mouse.y = e.y - canvasPosition.top;
    });

    canvas.addEventListener('mouseleave', function() {
        mouse.x = undefined;
        mouse.y = undefined;
    });

    canvas.addEventListener('click', function() {
        const gridPositionX = mouse.x - (mouse.x % tileSize) + tileGap;
        const gridPositionY = mouse.y - (mouse.y % tileSize) + tileGap;
        
        if (gridPositionY < tileSize) return; // clicked on statusbar


        // change directory
        if (1216 <= gridPositionX && gridPositionX < 1280 && 128 <= gridPositionY && gridPositionY < 192) {
            directionSelector=(directionSelector+1) % 4;
            console.log("changed directory"+directionSelector)
            return;
        }


        // different towers
        if (1000 <= gridPositionX && gridPositionX < 1064 && 128 <= gridPositionY && gridPositionY < 192) {
            towerSelector = 1;
            console.log("selected first tower")
            return;
        }

        if (1000 <= gridPositionX && gridPositionX < 1064 && 256 <= gridPositionY && gridPositionY < 320) {
            towerSelector = 2;
            console.log("selected second tower")
            return;
        }

        if (1000 <= gridPositionX && gridPositionX < 1064 && 384 <= gridPositionY && gridPositionY < 448) {
            towerSelector = 3;
            console.log("selected third tower")
            return;
        }
        if (1000 <= gridPositionX && gridPositionX < 1064 && 512 <= gridPositionY && gridPositionY < 576) {
            towerSelector = 4;
            console.log("selected fourth tower")
            return;
        }
        if (1000 <= gridPositionX && gridPositionX < 1064 && 640 <= gridPositionY && gridPositionY < 704) {
            towerSelector = 5;
            console.log("selected fifth tower")
            return;
        }

        if (gridPositionY > BOARD_HEIGHT + tileSize || gridPositionX > BOARD_WIDTH) return; // clicked outside of gameBoard

        // check if we clicked on path
        for (let i = 0; i < pathTiles.length; i++) {
            //console.log(pathTiles[i].x + "   " + gridPositionX)
            if (pathTiles[i].x + tileGap == gridPositionX && pathTiles[i].y + tileGap == gridPositionY) { return; }
        }

        // check if there is already a Tower
        for (let i = 0; i < towers.length; i++) {
            if (towers[i].x == gridPositionX && towers[i].y == gridPositionY) { return; }
        }
        //let towerCost = 100;
        let towerCost;

        switch (towerSelector) {
            case 1:
                towerCost = TOWERS.TIER1.towerCost 
                break;
            case 2:
                towerCost = TOWERS.TIER2.towerCost   
                break;
            case 3:
                towerCost = TOWERS.TIER3.towerCost     
                break;
            case 4:
                towerCost = TOWERS.TIER4.towerCost    
                break;
            case 5:
                towerCost = TOWERS.TIER5.towerCost   
                break;
        }

        if(gold >= towerCost) {
            // to to Check selected tower variable
            //towers.push(new Tower(gridPositionX, gridPositionY, 'blue', 'yellow', 500, 200, 100));
            switch(towerSelector) {
                case 1:
                    towers.push(new Tower(gridPositionX, gridPositionY, TOWERS.TIER1.towerColor, TOWERS.TIER1.projectileColor, TOWERS.TIER1.damage, TOWERS.TIER1.speed, TOWERS.TIER1.towerCost, directionSelector));
                  break;
                case 2:
                    towers.push(new Tower(gridPositionX, gridPositionY, TOWERS.TIER2.towerColor, TOWERS.TIER2.projectileColor, TOWERS.TIER2.damage, TOWERS.TIER2.speed, TOWERS.TIER2.towerCost, directionSelector));
                  break;
                case 3:
                    towers.push(new Tower(gridPositionX, gridPositionY, TOWERS.TIER3.towerColor, TOWERS.TIER3.projectileColor, TOWERS.TIER3.damage, TOWERS.TIER3.speed, TOWERS.TIER3.towerCost, directionSelector));
                  break;
                case 4:
                    towers.push(new Tower(gridPositionX, gridPositionY, TOWERS.TIER4.towerColor, TOWERS.TIER4.projectileColor, TOWERS.TIER4.damage, TOWERS.TIER4.speed, TOWERS.TIER4.towerCost, directionSelector));
                  break;
                case 5:
                    towers.push(new Tower(gridPositionX, gridPositionY, TOWERS.TIER5.towerColor, TOWERS.TIER5.projectileColor, TOWERS.TIER5.damage, TOWERS.TIER5.speed, TOWERS.TIER5.towerCost, directionSelector));
                  break;
              }
            gold -= towerCost;
        }

    });

    // fixed bug when resizing
    window.addEventListener('resize', function() {
        canvasPosition = canvas.getBoundingClientRect();
    })


    // ENTITIES

    class Tile {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.width = tileSize;
            this.height = tileSize;
        }
        draw() {
            if (collision(this, mouse)) {
                // highlight current tile
                ctx.strokeStyle = 'black';
                ctx.strokeRect(this.x, this.y, this.width, this.height)
                ctx.fillStyle = 'blue';
                ctx.font = '10px Arial';
                ctx.fillText("y:"+this.y + " x:"+this.x, this.x + 15, this.y + 25);
            }

        }
    }

    function createGrid() {
        for (let y = tileSize; y < canvas.height-64; y += tileSize) {
            for (let x = 0; x < canvas.width-406; x += tileSize) {
                gameGrid.push(new Tile(x, y));
            }
        }
    }

    class Path {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.width = tileSize;
            this.height = tileSize; 
        }

        draw() {

            /*
            var img = new Image();
  img.src = 'https://mdn.mozillademos.org/files/222/Canvas_createpattern.png';
  img.onload = function() {

    // create pattern
    var ptrn = ctx.createPattern(img, 'repeat');
    ctx.fillStyle = ptrn;
    ctx.fillRect(0, 0, 150, 150); */


            ctx.fillStyle = 'brown';
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.fillStyle = 'blue';
            ctx.font = '10px Arial';
            ctx.fillText("y:"+this.y + " x:"+this.x, this.x + 15, this.y + 25);
        }
    }

    function createPath() {

        for  (let k = 1; k <= 3; k++) {
            pathTiles.push(new Path(1*tileSize, k*tileSize));
        }

        for  (let k = 2; k <= 13; k++) {
            pathTiles.push(new Path(k*tileSize, 3*tileSize));
        }

        for  (let k = 4; k <= 5; k++) {
            pathTiles.push(new Path(13*tileSize, k*tileSize));
        }

        for  (let k = 13; k >= 6; k--) {
            pathTiles.push(new Path(k*tileSize, 5*tileSize));
        }

        for  (let k = 6; k >= 5; k--) {
            pathTiles.push(new Path(k*tileSize, 6*tileSize));
        }

        for  (let k = 5; k >= 1; k--) {
            pathTiles.push(new Path(k*tileSize, 7*tileSize));
        }

        for  (let k = 8; k <= 9; k++) {
            pathTiles.push(new Path(1*tileSize, k*tileSize));
        }

        for  (let k = 2; k <= 10; k++) {
            pathTiles.push(new Path(k*tileSize, 9*tileSize));
        }

        pathTiles.push(new Path(10*tileSize, 10*tileSize))
    }

    class Tower {
        constructor(x, y, towerColor, projectileColor, damage, speed, towerCost, direction) {
            this.x = x;
            this.y = y;
            this.width = tileSize - tileGap * 2;
            this.height = tileSize - tileGap * 2; // prevents from collisions from the edges
            this.shooting = true;
            this.health = 100;
            this.projectiles = [];
            this.timer = 0;
            this.color = towerColor;
            this.projectileColor = projectileColor;
            this.damage = damage;
            this.speed = speed;
            this.towerCost = towerCost
            this.direction = direction;
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.fillStyle = 'gold';
            ctx.font = '20px Arial';
            ctx.fillText(this.damage, this.x + 15, this.y + 25);
        }

        update() {
            this.timer++;
            if(this.timer % 100 === 0) {
 
                    projectiles.push(new Projectiles(this.x + 30, this.y + 30, this.damage, this.projectileColor, this.speed, this.direction))
                
               
                //var audio = new Audio('https://opengameart.org/sites/default/files/Laser%20Shot.mp3');
                //audio.play();
            }

        }
    }


    class Minion {
        constructor(minionColor, minionSize, minionHealth, minionSpeed) {
            // minionSize, minionColor, minionDamage, minionHP, minionSpeed, minionCost
            //this.x = canvas.width;
            //this.y = verticalPosition;
            this.x = tileSize; // spawn point
            this.y = spawnPoint; // spawn point
            this.width = tileSize - tileGap * 2;
            this.height = tileSize - tileGap * 2;
            this.minionSize = minionSize;
            this.speed = minionSpeed
            this.movement = this.speed;
            this.health = minionHealth;
            this.maxHealth = this.health;
            this.minionColor = minionColor;
        }
        update() {

            // to - do code relatively
            if (this.y < 193) {
                this.y += this.movement;
            }
            if (this.y > 190.8 && this.y < 198 && this.x < 838) {
                this.x += this.movement;
            }
            if (this.y > 193 && this.y < 323 && this.x > 832.8 && this.x < 841) {
                this.y += this.movement;
            }
            if (this.y > 320.8 && this.y < 328 && this.x > 388) {
                this.x -= this.movement;
            }
            if (this.y > 320.8 && this.y < 385 && this.x > 383 && this.x < 393.2) {
                this.y += this.movement;
            }
            if (this.y > 382.8 && this.y < 390 && this.x > 326 && this.x < 393.2) {
                this.x -= this.movement;
            }
            if (this.y > 382.8 && this.y < 449 && this.x > 321 && this.x < 326) {
                this.y += this.movement;
            }
            if (this.y > 449 && this.y < 454 && this.x > 65 && this.x < 326) {
                this.x -= this.movement;
            }
            if (this.y > 449 && this.y < 577 && this.x > 60 && this.x < 72) {
                this.y += this.movement;
            }
            if (this.y > 576 && this.y < 582 && this.x > 55 && this.x < 640) {
                this.x += this.movement;
            }
            if (this.y > 576 && this.x > 639) {
                this.y += this.movement;
            }
        }
        draw() {
            ctx.fillStyle = this.minionColor;
            ctx.beginPath();
            ctx.arc(this.x+this.minionSize/2, this.y+this.minionSize/2, this.minionSize/2, 0, Math.PI * 2);
            ctx.fill();
            //ctx.fillStyle = 'red';
            //ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.fillStyle= 'black';
            ctx.font = '30px Arial';
            ctx.fillText(Math.floor(this.health), this.x + 15, this.y + 25);
        }
    }

    class Projectiles {
        constructor(x, y, damage, projectileColor, speed, direction) {
            this.x = x;
            this.y = y;
            this.width = 10;
            this.height = 10;
            this.damage = damage;
            this.speed = speed;
            this.projectileColor = projectileColor;
            this.direction = direction;
        }

        update() {
            switch(this.direction) {
                case 0:
                    this.y += this.speed;
                    break;
                case 1:
                    this.x += this.speed;
                    break;
                case 2:
                    this.y -= this.speed;
                    break;
                case 3:
                    this.x -= this.speed;
                    break;
            }
        }

        draw() {
            ctx.fillStyle = this.projectileColor;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.width, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // handlers

    function handleGameStatus() {
        ctx.fillStyle = 'black';
        ctx.font = '30px Arial';
        ctx.fillText('Gold: ' + gold , 20, 55);
        ctx.fillText('Score: ' + score, 220, 55);
        ctx.fillText('HP: ' + HP, 420, 55);
        ctx.fillText(weather, 820, 55)

        if (gameOver) {

            // defeat screen
            ctx.beginPath();
            ctx.rect(0, 64, 960, 640);
            ctx.lineWidth = "3";
            ctx.strokeStyle = "red";
            ctx.fillStyle = 'green';
            ctx.fill();
            ctx.stroke();


            ctx.fillStyle = "red";
            ctx.font = '150px Arial';
            ctx.fillText("Gameover" , 50, 350);
            ctx.font = '80px Arial';
            ctx.fillText("you have been defeated... " , 45, 450);
            ctx.fillText("Score: " + score , 200, 550);
        }
    }

    function handleGameGrid() {
        for (let i = 0; i < gameGrid.length; i++) {
            gameGrid[i].draw();
        }
    }

    function handlePath() {
        for (let i = 0; i < pathTiles.length; i++) {
            pathTiles[i].draw();
        }
    }


    function handleTowers() {
        for (let i = 0; i < towers.length; i++) {
            towers[i].draw();
            towers[i].update();
        }
    }

    function handleMinions() {
        for (let i = 0; i < minions.length; i++) {
            minions[i].update();
            minions[i].draw();
            if (minions[i].y > 704 && minions[i].y < 708.4) {
          //if (minions[i].y > 704 && minions[i].y < 708.4) {
                HP -= minions[i].maxHealth;
                if (HP <= 0) { 
                    // remove last minion
                    minions.splice(i, 1); // remove
                    i--; // adjust loop index
                    gameOver = true; 
                }
            }
            if (minions[i].health <= 0) {
                let reward = minions[i].maxHealth/10;
                gold += reward;
                score += reward;
                // remove last minion
                minions.splice(i, 1); // remove
                i--; // adjust loop index
            }
        }

        // minion spawner
        if (frame % minionsInterval === 0) {
            // /*

            if (frame % 1500 === 0) {
                minions.push(new Minion(MINIONS.BOSS.minionColor, MINIONS.BOSS.minionSize, MINIONS.BOSS.minionHealth, MINIONS.BOSS.minionSpeed));
            }

            else if (frame % 500 === 0) {
                minions.push(new Minion(MINIONS.RUNNER.minionColor, MINIONS.RUNNER.minionSize, MINIONS.RUNNER.minionHealth, MINIONS.RUNNER.minionSpeed));
            }

            else if(frame % 100 === 0) {
                minions.push(new Minion(MINIONS.CRAWLER.minionColor, MINIONS.CRAWLER.minionSize, MINIONS.CRAWLER.minionHealth, MINIONS.CRAWLER.minionSpeed));
            }
            // */
            
            // minions.push(new Minion(MINIONS.CRAWLER.minionColor, MINIONS.CRAWLER.minionSize));
            if (minionsInterval > 120) minionsInterval -= 50;

        }
    }

    function handleProjectiles() {
        for (let i = 0; i < projectiles.length; i++) {
            projectiles[i].update();
            projectiles[i].draw();

            for (let j = 0; j < minions.length; j++) {
                if (minions[j] && projectiles[i] && collision(projectiles[i], minions[j])) { // both existing and is hit?
                    minions[j].health -= projectiles[i].damage;
                    projectiles.splice(i, 1); // remove
                    i--; // adjust for loop index
                }
            }

            if (projectiles[i] && projectiles[i].x > BOARD_WIDTH) {
                projectiles.splice(i, 1); // remove
                i--; // adjust for loop index
            }
            //console.log('projectiles ' + projectiles.length);
        }
    }


    class Shop {
        constructor() {

        }

        draw() {
        }

        update() {
        }
    }

    function handleShop() {
        // separate shop from gamebaord
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.lineWidth = 5;
        ctx.moveTo(BOARD_WIDTH + 2*tileGap, tileSize);
        ctx.lineTo(BOARD_WIDTH + 2*tileGap, tileSize*11);
        ctx.stroke();
        ctx.lineWidth = 1;


        // draw towers
        for (let i = 0; i < towerList.length; i++) {
            towerList[i].draw();
        }
        

        ctx.beginPath();
        ctx.rect(19*tileSize, 2*tileSize, 64, 64);
        ctx.font = '30px Arial';
        ctx.fillStyle = 'black';
        ctx.fillText("-->", 19*tileSize+10, 2*tileSize+38)
        ctx.stroke();
    }


    function createShop() {
        // to do: fill automatically
        for  (let k = 1; k <= 3; k++) {
            for (let j = 1; j <= 2; j++) {
                
            }
            
        }

        towerList.push(new Tower(16*tileSize, 2*tileSize, TOWERS.TIER1.towerColor, TOWERS.TIER1.projectileColor, TOWERS.TIER1.damage, TOWERS.TIER1.speed, TOWERS.TIER1.towerCost, directionSelector));
        towerList.push(new Tower(16*tileSize, 4*tileSize, TOWERS.TIER2.towerColor, TOWERS.TIER2.projectileColor, TOWERS.TIER2.damage, TOWERS.TIER2.speed, TOWERS.TIER2.towerCost, directionSelector));
        towerList.push(new Tower(16*tileSize, 6*tileSize, TOWERS.TIER3.towerColor, TOWERS.TIER3.projectileColor, TOWERS.TIER3.damage, TOWERS.TIER3.speed, TOWERS.TIER3.towerCost, directionSelector));
        towerList.push(new Tower(16*tileSize, 8*tileSize, TOWERS.TIER4.towerColor, TOWERS.TIER4.projectileColor, TOWERS.TIER4.damage, TOWERS.TIER4.speed, TOWERS.TIER4.towerCost, directionSelector));
        towerList.push(new Tower(16*tileSize, 10*tileSize, TOWERS.TIER5.towerColor, TOWERS.TIER5.projectileColor, TOWERS.TIER5.damage, TOWERS.TIER5.speed, TOWERS.TIER5.towerCost, directionSelector));

        
        


    }



    // animmation function

    function animate() {

        // create control bar
        ctx.clearRect(0,0, canvas.width, canvas.height);
        ctx.fillStyle = 'blue'
        ctx.fillRect(0,0,controlsBar.width, controlsBar.height);

        frame++;

        //console.log(frame);

        if(!gameOver) {
            requestAnimationFrame(animate);
        }
        
        handleGameGrid();
        handlePath();
        handleTowers();
        handleProjectiles();
        handleMinions();
        handleShop();
        handleGameStatus();  
    }

    // actual sequence

    createGrid();
    createPath();
    createShop();
    animate();


    // Helper functions

    function collision(first, second) {
        if (    !(  first.x > second.x + second.width ||
                    first.x + first.width < second.x ||
                    first.y > second.y + second.height ||
                    first.y + first.height < second.y)
        ) {
            return true;
        };
    };
}

    render() {
        return (
            <div>
                <canvas ref={this.canvasRef} width={this.state.canvasWidth} height={this.state.canvasHeight} id={"gameboard"}/>
            </div>
        );
    }
}
export default Game2