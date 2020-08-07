var trex,trex_end, trex_running, trex_collided, PLAY = 1,
  END = 0,
  gameState = PLAY,
  reset, gameOver;
var ground, invisibleGround, groundImage, gameOverImg, resetImg;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;


function preload() {
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_collided = loadImage("trex_collided.png");

  gameOverImg = loadImage("gameOver.png");
  resetImg = loadImage("restart.png");

  groundImage = loadImage("ground2.png");

  cloudImage = loadImage("cloud.png");

  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
}

function setup() {
  createCanvas(600, 200);

  trex = createSprite(50, 180, 20, 50);
  trex.addAnimation("running", trex_running);
  trex.scale = 0.5;

  trex_end = createSprite(50, 160, 20, 50);
  trex_end.addImage("trex_collided",trex_collided);
  trex_end.scale = 0.5;

  
  ground = createSprite(200, 180, 400, 20);
  ground.addImage("ground", groundImage);
  ground.x = ground.width / 2;
  ground.velocityX = -4;

  invisibleGround = createSprite(200, 190, 400, 10);
  invisibleGround.visible = false;

  cloudsGroup = new Group();
  obstaclesGroup = new Group();

  gameOver = createSprite(300, 100, 10, 10);
  reset = createSprite(300, 140, 10, 10);
  gameOver.addImage("gameOver", gameOverImg);
  gameOver.scale = 0.5;
  reset.addImage("restart", resetImg);
  reset.scale = 0.5;


  score = 0;
}

function draw() {
  background(180);
  
  trex_end.y=trex.y-10;

  if (gameState === PLAY) {
    
    trex.visible=true;
    trex_end.visible=false;
    
    gameOver.visible = false;
    reset.visible = false;

    ground.velocityX = -(6 + 3 * score / 100);

    if (keyDown("space")&&trex.y>155) {
      trex.velocityY = -12;
    }

    spawnClouds();
    spawnObstacles();

    if (trex.isTouching(obstaclesGroup)) {
      gameState = END;
    }

    score = score + Math.round(getFrameRate() / 60);

    trex.velocityY = trex.velocityY + 0.8

    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }
    trex.collide(invisibleGround);
    
  } else if (gameState === END) {
    gameOver.visible = true;
    reset.visible = true;

    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);

    trex.visible=false;
    trex_end.visible=true;

    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);

    if (mousePressedOver(reset)) {
      restart();
    }

  }


  text("Score: " + score, 500, 50);



  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600, 120, 40, 10);
    cloud.y = Math.round(random(80, 120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;

    //assign lifetime to the variable
    cloud.lifetime = 200;

    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;

    //add each cloud to the group
    cloudsGroup.add(cloud);
  }

}

function spawnObstacles() {
  if (frameCount % 60 === 0) {
    var obstacle = createSprite(600, 165, 10, 40);
    obstacle.velocityX = ground.velocityX;

    //generate random obstacles
    var rand = Math.round(random(1, 6));
    switch (rand) {
      case 1:
        obstacle.addImage(obstacle1);
        break;
      case 2:
        obstacle.addImage(obstacle2);
        break;
      case 3:
        obstacle.addImage(obstacle3);
        break;
      case 4:
        obstacle.addImage(obstacle4);
        break;
      case 5:
        obstacle.addImage(obstacle5);
        break;
      case 6:
        obstacle.addImage(obstacle6);
        break;
      default:
        break;
    }

    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function restart() {
  gameState = PLAY;

  gameOver.visible = false;
  reset.visible = false;

  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();

  trex.addAnimation("trex");

  score = 0;

}