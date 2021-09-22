const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;

var engine, world;
var jerry,jerryImg,bg,path;
var ground,invisibleGround;
var ground1;
var tom;
var butch;
var cheese,cheeseImg,cheeseGroup;
var obstacle,obstacle1, obstacle2, obstacle3, obstacleGroup;
var PLAY = 1;
var END = 0;
var gamestate = PLAY;
var gameover, gameoverImg;
var restart, restartImg;
var score = 0;
var sound;

function preload(){
bg = loadImage("bg 3.png");
jerryImg = loadImage("Jerry 3.png");
obstacle1 = loadImage("Tom.png");
obstacle2 = loadImage("Butch 1.png");
obstacle3 = loadImage("Butch 2.png");
gameoverImg = loadImage("Gameover 2.png");
restartImg = loadImage("restart.png");
sound = loadSound("tom__jerry_8-bit.mp3");

cheeseImg = loadImage("Cheese.png");

}

function setup() {
  var canvas = createCanvas(windowWidth,windowHeight);
  engine = Engine.create();
  world = engine.world;

  ground = createSprite(300, 200, windowWidth,windowHeight-200);
  ground.addImage(bg);
  ground.scale = 2.0;


  jerry = createSprite(50,200);
  jerry.addImage(jerryImg);
  jerry.depth = 3;
  jerry.scale = 0.7;
  jerry.setCollider("circle",0,0,60);

  invisibleGround = createSprite(400,windowHeight,windowWidth,20);
  invisibleGround.visible = false;

  gameover = createSprite(windowWidth/2, windowHeight/2);
  gameover.addImage(gameoverImg);
  gameover.scale = 1;

  restart = createSprite(windowWidth/2, windowHeight/2+55);
  restart.addImage(restartImg);
  restart.depth = 4;

  obstacleGroup = createGroup();
  cheeseGroup = createGroup();
}


function draw() {
  background(0);
  gameover.visible = false;
  restart.visible = false;
  if(gamestate ===PLAY){
    ground.velocityX = -3;
    sound.play();
    if(ground.x<displayWidth/2){
      ground.x = ground.width/1;
     }
  
     if(keyDown("space")&& jerry.y>=300){
       jerry.velocityY = -10;
     }
    jerry.velocityY = jerry.velocityY + 0.8;
    if(keyDown("up")){
      jerry.y = jerry.y - 5;
    }
    if(keyDown("down")){
      jerry.y = jerry.y + 5;
    }
    spawnCheese();
    spawnObstacles();
    if(cheeseGroup.isTouching(jerry)){
    score = score+1;
    cheeseGroup.destroyEach();
    }
    if(obstacleGroup.isTouching(jerry)){
      gamestate = END;
    }
  }
  else if(gamestate ===END){
    sound.stop();
    gameover.visible = true;
    restart.visible = true;
    ground.velocityX = 0;
    jerry.velocityY = 0;
    cheeseGroup.setVelocityXEach(0);
    obstacleGroup.setVelocityXEach(0);
    cheeseGroup.setLifetimeEach(-1);
    obstacleGroup.setLifetimeEach(-1);
    if(mousePressedOver(restart)){
      reset();
    }

  } 
  jerry.collide(invisibleGround);

  
  drawSprites();
  textSize(30);
  fill("white");
  text("Score: "+score,50,30);
}

function spawnCheese(){
  if(frameCount%200===0){
    cheese = createSprite(800,Math.round(random(windowHeight-200,windowHeight-40)),40,10);
    cheese.depth = 2;
    cheese.addImage(cheeseImg);
    cheese.velocityX = -6;
    cheese.scale = 0.2;
    cheese.lifetime = 400;
    cheeseGroup.add(cheese);
  }
}

function spawnObstacles(){
  if(frameCount%350===0){
    obstacle = createSprite(800,windowHeight-100,10,40);
    obstacle.debug = false;
    obstacle.setCollider("circle",0,0,170);
    obstacle.depth = 1;
    var r = Math.round(random(1,3));
    switch(r){
      case 1:obstacle.addImage(obstacle1);
          obstacle.scale = 0.5;
          break;
      case 2:obstacle.addImage(obstacle2);

          break;
      case 3:obstacle.addImage(obstacle3);
          obstacle.scale = 1.5;
          break;
      default:break;
    }
    
    obstacle.velocityX = -6;
    obstacle.scale = 0.2;
    obstacle.lifetime = 400;
    obstacleGroup.add(obstacle);
  }
  
}
function reset(){
  sound.stop();
  gamestate = PLAY;
  gameover.visible = false;
  restart.visible = false;
  obstacleGroup.destroyEach();
  cheeseGroup.destroyEach();
  score = 0; 
}