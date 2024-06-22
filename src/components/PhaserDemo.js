// src/PheserDemo.js
import React, { useEffect, useRef } from "react";
import Phaser from "phaser";
import { dude, ground } from "../Assets";

const PheserDemo = () => {
  const gameContainerRef = useRef(null);

  useEffect(() => {
    // Phaser game configuration
    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: gameContainerRef.current,
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 300 }, // gravity affects the y-axis
          debug: false, // set to true to see the collision boxes
        },
      },
      scene: {
        preload: preload,
        create: create,
        update: update,
      },
    };

    // Initialize the Phaser game
    const game = new Phaser.Game(config);

    let sprite;
    let grounds;

    // Preload function to load assets
    function preload() {
      this.load.image("sprite", dude, {
        frameWidth: 32,
        frameHeight: 48,
      });
      this.load.image("ground", ground); // Load the ground image
    }

    // Create function to add the sprite and ground to the game
    function create() {
      // Add ground as a static physics object
      grounds = this.physics.add.staticImage(400, 580, "ground");
      grounds.setScale(2).refreshBody(); // Scale and refresh the hitbox

      // Add bouncing sprite as a dynamic physics object
      sprite = this.physics.add.sprite(400, 300, "sprite");
      sprite.setBounce(0.9); // Set bounce factor
      sprite.setCollideWorldBounds(true); // Confine the sprite to the game bounds

      // Add collision between sprite and ground
      this.physics.add.collider(sprite, grounds);
    }

    // Update function for continuous game logic (not used here)
    function update() {}

    // Clean up the Phaser game on component unmount
    return () => {
      game.destroy(true);
    };
  }, []);

  return (
    <div ref={gameContainerRef} style={{ width: "800px", height: "600px" }} />
  );
};

export default PheserDemo;
