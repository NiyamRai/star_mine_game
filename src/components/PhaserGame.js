// src/components/PhaserGame.js
import React, { useEffect, useRef } from "react";
import Phaser from "phaser";
import { bomb, sky, dude, ground, star } from "../Assets";

const PhaserGame = () => {
  const gameContainerRef = useRef(null);

  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: gameContainerRef.current,
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 300 },
          debug: false,
        },
      },
      scene: {
        preload: preload,
        create: create,
        update: update,
      },
    };

    const game = new Phaser.Game(config);

    function preload() {
      this.load.image("sky", sky);
      this.load.image("star", star);
      this.load.image("bomb", bomb);
      this.load.image("ground", ground);
      this.load.spritesheet("dude", dude, {
        frameWidth: 32,
        frameHeight: 48,
      });
    }

    let platforms;
    let player;
    let cursors;
    let stars;
    let bombs;
    var score = 0;
    var scoreText;
    var gameOver = false;

    function create() {
      this.add.image(400, 300, "sky");

      platforms = this.physics.add.staticGroup();
      platforms.create(400, 568, "ground").setScale(2).refreshBody();

      platforms.create(600, 400, "ground");
      platforms.create(50, 250, "ground");
      platforms.create(750, 220, "ground");

      player = this.physics.add.sprite(100, 450, "dude");

      player.setBounce(0.2);
      player.setCollideWorldBounds(true);

      player.body.setGravityY(300);

      cursors = this.input.keyboard.createCursorKeys();

      this.anims.create({
        key: "left",
        frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1,
      });

      this.anims.create({
        key: "turn",
        frames: [{ key: "dude", frame: 4 }],
        frameRate: 20,
      });

      this.anims.create({
        key: "right",
        frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1,
      });

      this.physics.add.collider(player, platforms);

      stars = this.physics.add.group({
        key: "star",
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 },
      });

      stars.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
      });

      function collectStar(player, star) {
        star.disableBody(true, true);

        score += 10;
        scoreText.setText("Score: " + score);

        if (stars.countActive(true) === 0) {
          stars.children.iterate(function (child) {
            child.enableBody(true, child.x, 0, true, true);
          });

          var x =
            player.x < 400
              ? Phaser.Math.Between(400, 800)
              : Phaser.Math.Between(0, 400);

          var bomb = bombs.create(x, 16, "bomb");
          bomb.setBounce(1);
          bomb.setCollideWorldBounds(true);
          bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        }
      }

      this.physics.add.collider(stars, platforms);
      this.physics.add.overlap(player, stars, collectStar, null, this);

      scoreText = this.add.text(16, 16, "score: 0", {
        fontSize: "32px",
        fill: "#000",
      });

      function hitBomb(player, bomb) {
        this.physics.pause();

        player.setTint(0xff0000);

        player.anims.play("turn");

        gameOver = true;
      }

      bombs = this.physics.add.group();

      this.physics.add.collider(bombs, platforms);

      this.physics.add.collider(player, bombs, hitBomb, null, this);
    }

    function update() {
      if (cursors.left.isDown) {
        player.setVelocityX(-160);
      } else if (cursors.right.isDown) {
        player.setVelocityX(160);
      } else {
        player.setVelocityX(0);
      }
      if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-500);
      }
    }

    // Cleanup the Phaser game instance when the component unmounts
    return () => {
      game.destroy(true);
    };
  }, []);

  return <div ref={gameContainerRef}></div>;
};

export default PhaserGame;
