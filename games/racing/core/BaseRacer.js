import * as Phaser from 'phaser';
import JuiceManager from '../../core/JuiceManager';
import { createMobileControls } from '../../core/MovementManager';

export default class BaseRacer extends Phaser.Scene {
    constructor() {
        super({ key: 'BaseRacer' });
    }

    init(config) {
        // Robust config merging
        const defaults = {
            car: { maxSpeed: 400, acceleration: 200, drag: 100, handling: 150, asset: 'spaceship/cartoonship blue.png', scale: 0.2, hp: 3 },
            background: 'background/space-Background-3.png',
            track: { laps: 3, timePerLevel: 60 },
            obstacles: { count: 5, asset: 'spaceship/alienshipnorm.png', scale: 0.1, damage: 1 },
            collectibles: { asset: '🪙', scale: 1.0, value: 50, heal: 0 }
        };

        if (!config || typeof config !== 'object') {
            this.gameConfig = defaults;
        } else {
            this.gameConfig = {
                ...defaults,
                ...config,
                car: { ...defaults.car, ...(config.car || {}) },
                track: { ...defaults.track, ...(config.track || {}) },
                obstacles: { ...defaults.obstacles, ...(config.obstacles || {}) },
                collectibles: { ...defaults.collectibles, ...(config.collectibles || {}) }
            };
        }

        this.isGameOver = false;
        this.score = 0;
        this.hp = this.gameConfig.car.hp || 3;
        this.maxHp = this.hp;
        this.timeRemaining = this.gameConfig.track.timePerLevel;
        this.isHopping = false;
    }

    preload() {
        const assetsBase = '/assets/';

        // Handle Background
        if (this.gameConfig.background) {
            this.load.image('track-bg', assetsBase + this.gameConfig.background);
        }

        // Helper to load or generate textures (Emoji support)
        const loadAsset = (key, path) => {
            if (!path) return;
            // Check if it's an emoji (single char or emoji sequence)
            const isEmoji = /\p{Emoji}/u.test(path) || path.startsWith('emoji:');
            if (isEmoji) {
                const emoji = path.replace('emoji:', '');
                const textObj = this.make.text({
                    x: 0, y: 0,
                    text: emoji,
                    style: { font: '64px serif', fill: '#fff' },
                    add: false
                });
                textObj.updateText();
                this.textures.addCanvas(key, textObj.canvas);
                textObj.destroy();
            } else {
                this.load.image(key, assetsBase + path);
            }
        };

        loadAsset('car', this.gameConfig.car?.asset);
        loadAsset('obstacle', this.gameConfig.obstacles?.asset);
        loadAsset('collectible', this.gameConfig.collectibles?.asset);

        if (this.gameConfig.borders?.left) {
            this.load.image('left-border', assetsBase + this.gameConfig.borders.left);
        }
        if (this.gameConfig.borders?.right) {
            this.load.image('right-border', assetsBase + this.gameConfig.borders.right);
        }
    }

    create() {
        // Scrolling Background
        const bgKey = 'track-bg';
        this.bg1 = this.add.tileSprite(400, 300, 800, 600, bgKey);

        if (this.textures.exists(bgKey)) {
            const bgTexture = this.textures.get(bgKey).getSourceImage();
            const scale = 800 / bgTexture.width;
            this.bg1.setTileScale(scale);
        }

        // Track Borders
        if (this.textures.exists('left-border')) {
            this.leftBorder = this.add.tileSprite(0, 300, 64, 600, 'left-border').setOrigin(0, 0.5);
            const lScale = 64 / this.textures.get('left-border').getSourceImage().width;
            this.leftBorder.setTileScale(lScale);
        }
        if (this.textures.exists('right-border')) {
            this.rightBorder = this.add.tileSprite(800, 300, 64, 600, 'right-border').setOrigin(1, 0.5);
            const rScale = 64 / this.textures.get('right-border').getSourceImage().width;
            this.rightBorder.setTileScale(rScale);
        }

        // Player Car
        this.car = this.physics.add.sprite(400, 500, 'car');
        if (this.gameConfig.car?.scale) this.car.setScale(this.gameConfig.car.scale);
        this.car.setCollideWorldBounds(true);
        this.car.setDamping(true);
        this.car.setDrag(this.gameConfig.car.drag || 0.95);

        // Groups
        this.obstacles = this.physics.add.group();
        this.collectibles = this.physics.add.group();

        // Spawners
        this.time.addEvent({ delay: 1200, callback: this.spawnObstacle, callbackScope: this, loop: true });
        this.time.addEvent({ delay: 2000, callback: this.spawnCollectible, callbackScope: this, loop: true });
        this.time.addEvent({ delay: 5000, callback: this.spawnSpeedPad, callbackScope: this, loop: true });

        // Groups
        this.speedPads = this.physics.add.group();

        // Collisions
        this.physics.add.overlap(this.car, this.obstacles, this.handleObstacleCollision, null, this);
        this.physics.add.overlap(this.car, this.collectibles, this.handleCollectibleCollision, null, this);
        this.physics.add.overlap(this.car, this.speedPads, this.handleSpeedPadOverlap, null, this);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.mobileInput = createMobileControls(this);

        // UI
        this.scoreText = this.add.text(10, 10, 'SCORE: 0', { font: 'bold 16px monospace', fill: '#00ffff' });
        this.timerText = this.add.text(10, 35, 'TIME: ' + this.timeRemaining, { font: 'bold 16px monospace', fill: '#ff00ff' });

        // Health Bar UI
        this.add.text(620, 10, 'HEALTH', { font: 'bold 12px monospace', fill: '#ffffff' });
        this.healthBarBg = this.add.rectangle(725, 17, 100, 10, 0x333333);
        this.healthBar = this.add.rectangle(725, 17, 100, 10, 0x00ff00);

        this.time.addEvent({
            delay: 1000,
            callback: () => {
                if (!this.isGameOver) {
                    this.timeRemaining--;
                    this.timerText.setText('TIME: ' + this.timeRemaining);
                    if (this.timeRemaining <= 0) this.gameOver('TIME EXPIRED');
                }
            },
            loop: true
        });

        this.juice = new JuiceManager(this);
        // Start Msg
        const readyText = this.add.text(400, 300, 'GEAR UP!', { font: 'bold 40px monospace', fill: '#fff', backgroundColor: '#000', padding: 10 }).setOrigin(0.5);
        this.tweens.add({ targets: readyText, alpha: 0, duration: 800, delay: 1000, onComplete: () => readyText.destroy() });
    }

    spawnObstacle() {
        if (this.isGameOver) return;
        const x = Phaser.Math.Between(100, 700);
        const obstacle = this.obstacles.create(x, -50, 'obstacle');
        if (this.gameConfig.obstacles?.scale) obstacle.setScale(this.gameConfig.obstacles.scale);
        obstacle.setVelocityY(Phaser.Math.Between(200, 450));
    }

    spawnCollectible() {
        if (this.isGameOver) return;
        const x = Phaser.Math.Between(100, 700);
        const coin = this.collectibles.create(x, -50, 'collectible');
        if (this.gameConfig.collectibles?.scale) coin.setScale(this.gameConfig.collectibles.scale);
        coin.setVelocityY(300);
    }

    spawnSpeedPad() {
        if (this.isGameOver) return;
        const x = Phaser.Math.Between(150, 650);
        const pad = this.add.rectangle(x, -50, 80, 40, 0xffff00, 0.6);
        this.physics.add.existing(pad);
        this.speedPads.add(pad);
        pad.body.setVelocityY(400);
        pad.multiplier = 2; // Default speed boost

        // Add arrow indicators
        const arrows = this.add.text(x, -50, '>>>>', { font: 'bold 20px monospace', fill: '#000' }).setOrigin(0.5);
        this.tweens.add({ targets: arrows, y: 700, duration: 2000, onComplete: () => arrows.destroy() });
    }

    spawnMudZone() {
        if (this.isGameOver) return;
        const x = Phaser.Math.Between(150, 650);
        const mud = this.add.rectangle(x, -100, 150, 80, 0x4b3621, 0.7);
        this.physics.add.existing(mud);
        this.speedPads.add(mud); // Reuse speedPads group
        mud.body.setVelocityY(300);
        mud.multiplier = 0.4; // Slow down
        mud.isMud = true;
    }

    handleObstacleCollision(car, obstacle) {
        if (obstacle.hit || this.isHopping) return;
        obstacle.hit = true;
        obstacle.setTint(0xff0000);

        this.hp -= (this.gameConfig.obstacles.damage || 1);
        this.updateHealthBar();

        if (this.juice) {
            this.juice.shake(300, 0.02);
            this.juice.explode(this.car.x, this.car.y, 'fire');
            this.juice.hitStop(100);
        }

        if (this.hp <= 0) {
            this.gameOver('VEHICLE DESTROYED');
        }

        obstacle.destroy();
    }

    handleSpeedPadOverlap(car, pad) {
        if (pad.used) return;
        pad.used = true;

        this.juice.shake(100, 0.01);
        this.juice.explode(car.x, car.y, 'sparks');

        // Speed/Handling Multiplier
        const originalHandling = this.gameConfig.car.handling;
        this.gameConfig.car.handling *= (pad.multiplier || 2);

        if (pad.isMud) {
            this.car.setTint(0x795548);
        } else {
            this.cameras.main.flash(500, 255, 255, 0);
        }

        this.time.delayedCall(pad.isMud ? 1000 : 2000, () => {
            this.gameConfig.car.handling = originalHandling;
            if (pad.isMud) this.car.clearTint();
        });

        pad.destroy();
    }

    handleCollectibleCollision(car, coin) {
        coin.destroy();
        this.score += (this.gameConfig.collectibles.value || 50);
        this.scoreText.setText('SCORE: ' + this.score);

        if (this.gameConfig.collectibles.heal > 0) {
            this.hp = Math.min(this.maxHp, this.hp + this.gameConfig.collectibles.heal);
            this.updateHealthBar();
        }

        this.tweens.add({ targets: this.scoreText, scale: 1.2, duration: 100, yoyo: true });
    }

    updateHealthBar() {
        const percent = Math.max(0, this.hp / this.maxHp);
        this.healthBar.width = 100 * percent;

        if (percent < 0.3) this.healthBar.setFillStyle(0xff0000);
        else if (percent < 0.6) this.healthBar.setFillStyle(0xffff00);
        else this.healthBar.setFillStyle(0x00ff00);
    }

    gameOver(reason) {
        if (this.isGameOver) return;
        this.isGameOver = true;
        this.physics.pause();
        this.car.setTint(0xff0000);

        this.add.text(400, 250, 'GAME OVER', { font: '64px monospace', fill: '#ff0000', style: 'bold' }).setOrigin(0.5);
        this.add.text(400, 320, reason, { font: '32px monospace', fill: '#ffffff' }).setOrigin(0.5);
        this.add.text(400, 380, 'FINAL SCORE: ' + this.score, { font: '24px monospace', fill: '#00ff00' }).setOrigin(0.5);

        const restartBtn = this.add.text(400, 450, 'RESTART', {
            font: '20px monospace',
            fill: '#000000',
            backgroundColor: '#ffffff',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive();

        restartBtn.on('pointerdown', () => this.scene.restart());
    }

    update() {
        if (this.isGameOver) return;

        const { maxSpeed, acceleration, handling } = this.gameConfig.car;

        // Visual scrolling effect
        const scrollSpeed = 5;
        this.bg1.tilePositionY -= scrollSpeed;
        if (this.leftBorder) this.leftBorder.tilePositionY -= scrollSpeed;
        if (this.rightBorder) this.rightBorder.tilePositionY -= scrollSpeed;

        // Steering & Tilting
        if (this.cursors.left.isDown || this.mobileInput.left) {
            this.car.setVelocityX(-handling);
            this.car.setAngle(Phaser.Math.Interpolation.Linear([this.car.angle, -20], 0.1));
            this.car.setScale(this.gameConfig.car.scale * 0.9, this.gameConfig.car.scale * 1.1); // Squash
        } else if (this.cursors.right.isDown || this.mobileInput.right) {
            this.car.setVelocityX(handling);
            this.car.setAngle(Phaser.Math.Interpolation.Linear([this.car.angle, 20], 0.1));
            this.car.setScale(this.gameConfig.car.scale * 0.9, this.gameConfig.car.scale * 1.1); // Squash
        } else {
            this.car.setVelocityX(0);
            this.car.setAngle(Phaser.Math.Interpolation.Linear([this.car.angle, 0], 0.2));
            this.car.setScale(this.gameConfig.car.scale);
        }

        // Acceleration/Braking
        if (this.cursors.up.isDown || this.mobileInput.up) {
            this.car.setVelocityY(-handling * 0.5);
            // Speed Warp Effect
            if (this.juice) {
                this.cameras.main.setZoom(Phaser.Math.Interpolation.Linear([this.cameras.main.zoom, 1.05], 0.05));
                if (Math.random() > 0.8) this.juice.explode(this.car.x, this.car.y + 30, 'sparks');
            }
        } else if (this.cursors.down.isDown || this.mobileInput.down) {
            this.car.setVelocityY(handling * 0.5);
            this.cameras.main.setZoom(Phaser.Math.Interpolation.Linear([this.cameras.main.zoom, 0.95], 0.05));
        } else {
            this.car.setVelocityY(0);
            this.cameras.main.setZoom(Phaser.Math.Interpolation.Linear([this.cameras.main.zoom, 1.0], 0.1));
        }

        // Jump/Hop Logic
        if ((Phaser.Input.Keyboard.JustDown(this.spaceKey) || this.mobileInput.justAction) && !this.isHopping) {
            this.executeHop();
        }

        // Cleanup groups
        this.obstacles.children.each(obs => {
            if (obs.y > 650) {
                obs.destroy();
                this.score += 5;
                this.scoreText.setText('SCORE: ' + this.score);
            }
        });
        this.collectibles.children.each(item => {
            if (item.y > 650) item.destroy();
        });

        // Reset just action
        if (this.mobileInput) this.mobileInput.justAction = false;
    }

    executeHop() {
        this.isHopping = true;

        // Visual feedback for jump
        this.tweens.add({
            targets: this.car,
            scaleX: this.gameConfig.car.scale * 1.5,
            scaleY: this.gameConfig.car.scale * 1.5,
            duration: 250,
            yoyo: true,
            ease: 'Custom',
            onComplete: () => {
                this.isHopping = false;
                this.car.setScale(this.gameConfig.car.scale);
            }
        });

        if (this.juice) {
            this.juice.shake(100, 0.005);
        }
    }
}
