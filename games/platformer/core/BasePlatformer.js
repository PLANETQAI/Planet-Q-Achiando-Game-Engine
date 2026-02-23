
import * as Phaser from 'phaser';
import PlatformManager from './PlatformManager';
import CollisionHandler from './PlatformerCollisionHandler';
import EnvironmentManager from '../../core/EnvironmentManager';
import JuiceManager from '../../core/JuiceManager';
import { createMobileControls } from '../../core/MovementManager';

export default class BasePlatformer extends Phaser.Scene {
    constructor() {
        super({ key: 'BasePlatformer' });
    }

    init(config) {
        console.log('BasePlatformer: init start', config);
        const defaults = {
            player: {
                speed: 300,
                jumpForce: -600,
                asset: 'shooter/cyber-city/cyborg-non-shooting-transparent.png',
                scale: 0.5,
                hp: 1,
                coyoteTime: 100,
                gravity: 1200
            },
            level: {
                width: 2400,
                height: 600,
                gravity: 1200
            },
            background: 'background/space-Background-1.png',
            vibe: 'neon'
        };

        this.gameConfig = {
            ...defaults,
            ...config,
            player: { ...defaults.player, ...(config.player || {}) },
            level: { ...defaults.level, ...(config.level || {}) }
        };

        this.isGameOver = false;
        this.score = 0;
        this.lastGroundedTime = 0;
    }

    preload() {
        console.log('BasePlatformer: preload start');
        const assetsBase = '/assets/';
        if (this.gameConfig.background) this.load.image('background', assetsBase + this.gameConfig.background);
        if (this.gameConfig.player.asset) this.load.image('player', assetsBase + this.gameConfig.player.asset);

        // Load common assets with fallbacks
        this.load.image('coin', assetsBase + 'bullets/light_bullet.png');
        this.load.image('spike', assetsBase + 'bullets/red_bullet.png');
        this.load.image('bullet_light', assetsBase + 'bullets/light_bullet.png');
        this.load.image('bullet_red', assetsBase + 'bullets/red_bullet.png');
        this.load.image('goal', assetsBase + 'spaceship/ship7.png'); // Use a ship as a goal portal

        this.load.on('loaderror', (file) => {
            console.error('BasePlatformer: Load error', file.src);
        });
        this.load.on('complete', () => {
            console.log('BasePlatformer: Preload complete');
            this.createNeonTextures();
        });
    }

    createNeonTextures() {
        // Create a clean neon platform texture if it doesn't exist
        if (!this.textures.exists('neon_platform')) {
            const graphics = this.make.graphics({ x: 0, y: 0, add: false });
            graphics.lineStyle(2, 0x00ffff, 1);
            graphics.fillStyle(0x003333, 0.8);
            graphics.strokeRect(0, 0, 200, 40);
            graphics.fillRect(0, 0, 200, 40);
            graphics.generateTexture('neon_platform', 200, 40);
        }
    }

    create() {
        try {
            console.log('BasePlatformer: create start');
            // Bounds
            this.physics.world.setBounds(0, 0, this.gameConfig.level.width, this.gameConfig.level.height);
            this.cameras.main.setBounds(0, 0, this.gameConfig.level.width, this.gameConfig.level.height);

            // Background
            this.bg = this.add.tileSprite(400, 300, 800, 600, 'background').setScrollFactor(0);

            // Systems
            this.environment = new EnvironmentManager(this);
            console.log('BasePlatformer: env manager created');
            this.environment.applyVibe(this.gameConfig.vibe);
            this.juice = new JuiceManager(this);

            this.platforms = new PlatformManager(this);
            this.collisions = new CollisionHandler(this);

            // Player - ensure texture exists or use fallback
            const playerTexture = this.textures.exists('player') ? 'player' : 'bullet_light';
            this.player = this.physics.add.sprite(100, 400, playerTexture);
            this.player.setScale(this.gameConfig.player.scale);
            this.player.setCollideWorldBounds(true);
            this.player.body.setGravityY(this.gameConfig.player.gravity);

            // Setup Platforms
            console.log('BasePlatformer: generating level');
            this.platforms.generateLevel(this.gameConfig.level);

            // Collisions
            console.log('BasePlatformer: setting up collisions');
            this.collisions.setup(this.player, this.platforms.staticPlatforms, this.platforms.movingPlatforms, this.platforms.hazards, this.platforms.collectibles, this.platforms.goal);

            // Camera
            this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

            // UI
            this.createUI();

            this.cursors = this.input.keyboard.createCursorKeys();
            this.keys = this.input.keyboard.addKeys({
                jump: Phaser.Input.Keyboard.KeyCodes.SPACE,
                reset: Phaser.Input.Keyboard.KeyCodes.R
            });

            this.mobileInput = createMobileControls(this);

            console.log('BasePlatformer: create success');
        } catch (error) {
            console.error('BasePlatformer: Critical error in create:', error);
        }
    }

    createUI() {
        // Positioned below the VibeCoder header (approx 80px)
        this.scoreText = this.add.text(40, 100, 'SCORE: 0', {
            font: 'bold 28px monospace',
            fill: '#00ffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setScrollFactor(0);

        this.add.text(40, 130, 'CATEGORY: PLATFORMER', {
            font: '12px monospace',
            fill: '#00ffff',
            alpha: 0.6
        }).setScrollFactor(0);
    }

    update() {
        if (!this.player || !this.player.body || this.isGameOver) {
            if (this.isGameOver && Phaser.Input.Keyboard.JustDown(this.keys.reset)) {
                this.scene.restart();
            }
            return;
        }

        const onGround = this.player.body.blocked.down || this.player.body.touching.down;
        const onWallLeft = this.player.body.blocked.left || this.player.body.touching.left;
        const onWallRight = this.player.body.blocked.right || this.player.body.touching.right;
        const onWall = onWallLeft || onWallRight;

        if (onGround) {
            this.lastGroundedTime = this.time.now;
            this.isWallJumping = false;
        }

        // Wall Sliding
        if (onWall && !onGround && this.player.body.velocity.y > 0) {
            this.player.setVelocityY(100); // Slow slide
            if (this.juice && Math.random() > 0.8) this.juice.explode(this.player.x, this.player.y, 'sparks');
        }

        const canJump = onGround || (this.time.now - this.lastGroundedTime < this.gameConfig.player.coyoteTime);
        const canWallJump = onWall && !onGround;

        // Horizontal Movement
        if (this.cursors.left.isDown || this.mobileInput.left) {
            this.player.setVelocityX(-this.gameConfig.player.speed);
            this.player.flipX = true;
        } else if (this.cursors.right.isDown || this.mobileInput.right) {
            this.player.setVelocityX(this.gameConfig.player.speed);
            this.player.flipX = false;
        } else {
            this.player.setVelocityX(0);
        }

        // Jump
        if (Phaser.Input.Keyboard.JustDown(this.keys.jump) || this.mobileInput.justAction) {
            if (canJump) {
                this.player.setVelocityY(this.gameConfig.player.jumpForce);
                this.lastGroundedTime = 0;
                if (this.juice) this.juice.flash(this.player, 50, 0x00ffff);
            } else if (canWallJump) {
                const jumpDir = onWallLeft ? 1 : -1;
                this.player.setVelocityY(this.gameConfig.player.jumpForce * 0.9);
                this.player.setVelocityX(this.gameConfig.player.speed * 1.5 * jumpDir);
                this.isWallJumping = true;
                this.time.delayedCall(200, () => { this.isWallJumping = false; });
                if (this.juice) this.juice.shake(100, 0.01);
            }
        }

        // Death by bottom pit
        if (this.player.y > this.gameConfig.level.height - 20) {
            this.handleDeath();
        }

        try {
            this.platforms.update();
        } catch (e) {
            console.error('BasePlatformer: Error in platforms update:', e);
        }
        this.bg.tilePositionX = this.cameras.main.scrollX * 0.5;

        // Reset just button events
        if (this.mobileInput) this.mobileInput.justAction = false;
    }

    collectItem(player, item) {
        item.destroy();
        this.score += 100;
        this.scoreText.setText('SCORE: ' + this.score);
        if (this.juice) this.juice.flash(player, 50, 0xffff00);
    }

    handleWin() {
        if (this.isGameOver) return;
        this.isGameOver = true;
        this.score += 500;
        this.scoreText.setText('SCORE: ' + this.score);

        const winText = this.add.text(400, 300, 'LEVEL COMPLETE!\nScore: ' + this.score + '\nPress R to Restart', {
            font: 'bold 40px monospace',
            fill: '#00ffff',
            align: 'center',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5).setScrollFactor(0);

        this.physics.pause();
        this.player.setTint(0x00ffff);
        if (this.juice) this.juice.shake(500, 0.05);
    }

    handleDeath() {
        if (this.isGameOver) return;
        this.isGameOver = true;
        this.cameras.main.shake(500, 0.03);
        this.player.setTint(0xff0000);

        const deathText = this.add.text(400, 300, 'GAME OVER\nPress R to Restart', {
            font: 'bold 40px monospace',
            fill: '#ffffff',
            align: 'center'
        }).setOrigin(0.5).setScrollFactor(0);

        this.physics.pause();
    }
}
