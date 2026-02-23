
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
        this.jumpCount = 0;
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
        // Removed direct loading of coin, spike, goal, bullet_light, bullet_red as they are now generated or not needed.

        this.load.on('loaderror', (file) => {
            console.error('BasePlatformer: Load error', file.src);
        });
        this.load.on('complete', () => {
            console.log('BasePlatformer: Preload complete');
            this.createGeneratedTextures();
        });
    }

    createGeneratedTextures() {
        // Neon Platform
        if (!this.textures.exists('neon_platform')) {
            const g = this.make.graphics({ x: 0, y: 0, add: false });
            g.lineStyle(2, 0x00ffff, 1);
            g.fillStyle(0x003333, 0.8);
            g.strokeRect(0, 0, 200, 40);
            g.fillRect(0, 0, 200, 40);
            g.generateTexture('neon_platform', 200, 40);
        }

        // Shape-based Coin (Gold Circle)
        if (!this.textures.exists('coin')) {
            const g = this.make.graphics({ x: 0, y: 0, add: false });
            g.fillStyle(0xffff00, 1);
            g.lineStyle(2, 0xffaa00, 1);
            g.fillCircle(16, 16, 14);
            g.strokeCircle(16, 16, 14);
            g.generateTexture('coin', 32, 32);
        }

        // Shape-based Spike (Red Triangle)
        if (!this.textures.exists('spike')) {
            const g = this.make.graphics({ x: 0, y: 0, add: false });
            g.fillStyle(0xff0000, 1);
            g.fillTriangle(16, 2, 2, 30, 30, 30);
            g.generateTexture('spike', 32, 32);
        }

        // Shape-based Goal (Cyan Diamond/Ring)
        if (!this.textures.exists('goal')) {
            const g = this.make.graphics({ x: 0, y: 0, add: false });
            g.lineStyle(4, 0x00ffff, 1);
            g.strokeCircle(32, 32, 28);
            g.lineStyle(2, 0x00ffff, 0.5);
            g.strokeCircle(32, 32, 18);
            g.generateTexture('goal', 64, 64);
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
            const playerTexture = this.textures.exists('player') ? 'player' : 'bullet_light'; // bullet_light is not loaded, consider a fallback generated texture or a default asset
            this.player = this.physics.add.sprite(100, 400, playerTexture);

            // Intelligently cap the visual scale if the asset is an absolute unit (e.g. 1024px height)
            let finalScale = this.gameConfig.player.scale || 0.5;
            const maxDesiredHeight = 100;
            const currentDisplayHeight = this.player.height * finalScale;

            if (currentDisplayHeight > maxDesiredHeight) {
                finalScale = maxDesiredHeight / this.player.height;
            }

            this.player.setScale(finalScale);
            this.gameConfig.player.scale = finalScale; // update for references

            // Fix collision box for large assets with transparency
            const desiredWidth = 35;
            const desiredHeight = 70;
            // Unscaled physics body size calculation
            const unscaledWidth = desiredWidth / finalScale;
            const unscaledHeight = desiredHeight / finalScale;

            this.player.body.setSize(unscaledWidth, unscaledHeight);

            // Center X and push Y towards the bottom (so feet touch ground)
            this.player.body.setOffset(
                (this.player.width - unscaledWidth) / 2,
                this.player.height - unscaledHeight - (this.player.height * 0.05)
            );

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

            this.coinsCollected = 0;
            this.totalCoins = this.platforms.totalCoinsNeeded || 0;
            if (this.gameConfig.type === 'collect-athon') {
                this.updateCollectUI();
            }

            // UI
            this.createUI();

            if (this.gameConfig.type === 'math-platformer') {
                this.createMathUI();
            }

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

        this.categoryText = this.add.text(40, 130, `TYPE: ${this.gameConfig.type?.toUpperCase() || 'PLATFORMER'}`, {
            font: '12px monospace',
            fill: '#00ffff',
            alpha: 0.6
        }).setScrollFactor(0);

        if (this.gameConfig.type === 'collect-athon') {
            this.collectProgressText = this.add.text(40, 150, '', {
                font: 'bold 18px monospace',
                fill: '#ffff00'
            }).setScrollFactor(0);
        }
    }

    updateCollectUI() {
        if (this.collectProgressText) {
            this.collectProgressText.setText(`DATA: ${this.coinsCollected}/${this.totalCoins}`);
        }
    }

    createMathUI() {
        this.mathPrompt = this.add.text(400, 100, '', {
            font: 'bold 32px monospace',
            fill: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5, 0).setScrollFactor(0);
        this.updateMathQuestion();
    }

    updateMathQuestion() {
        if (this.gameConfig.type !== 'math-platformer') return;
        const a = Phaser.Math.Between(1, 10);
        const b = Phaser.Math.Between(1, 10);
        this.currentAnswer = a + b;
        this.mathPrompt.setText(`${a} + ${b} = ?`);
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
            this.jumpCount = 0;
        }

        // Wall Sliding
        if (onWall && !onGround && this.player.body.velocity.y > 0) {
            this.player.setVelocityY(100); // Slow slide
            if (this.juice && Math.random() > 0.8) this.juice.explode(this.player.x, this.player.y, 'sparks');
        }

        const maxJumps = this.gameConfig.player.maxJumps || 1;
        const canJump = onGround || (this.time.now - this.lastGroundedTime < this.gameConfig.player.coyoteTime) || (this.jumpCount > 0 && this.jumpCount < maxJumps);
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
                this.jumpCount++;
                if (!onGround && this.time.now - this.lastGroundedTime >= this.gameConfig.player.coyoteTime) {
                    if (this.juice) this.juice.explode(this.player.x, this.player.y + 20, 'sparks'); // Double jump effect
                } else {
                    if (this.juice) this.juice.flash(this.player, 50, 0x00ffff);
                }
                this.lastGroundedTime = 0;
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

        if (this.gameConfig.type === 'collect-athon') {
            this.coinsCollected++;
            this.updateCollectUI();
        }
    }

    handleLabelOverlap(label) {
        if (this.gameConfig.type !== 'math-platformer' || label.used) return;

        if (label.isCorrect) {
            this.score += 500;
            this.scoreText.setText('SCORE: ' + this.score);
            this.juice.flash(this.player, 100, 0x00ff00);
            this.updateMathQuestion();
            label.setStyle({ fill: '#00ff00' });
            label.used = true;
        } else {
            this.juice.shake(200, 0.02);
            this.player.setVelocityY(-400); // Bounce back
            this.player.setVelocityX(-200);
            label.setStyle({ fill: '#ff0000' });
            this.time.delayedCall(500, () => label.setStyle({ fill: '#ffffff' }));
        }
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
