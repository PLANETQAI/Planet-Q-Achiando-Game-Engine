
import * as Phaser from 'phaser';
import WeaponSystem from './WeaponSystem';
import SpawnManager from './SpawnManager';
import CollisionHandler from './CollisionHandler';

export default class BaseShooter extends Phaser.Scene {
    constructor() {
        super({ key: 'BaseShooter' });
    }

    init(config) {
        const defaults = {
            player: { speed: 300, asset: 'spaceship/ship1.png', scale: 0.5 },
            weapon: { fireRate: 300, bulletSpeed: 400, type: 'bullet', asset: 'bullet' },
            spawn: { type: 'grid', count: 5, spacing: 60, asset: 'spaceship/alienshipnorm.png', scale: 0.15 },
            background: 'background/space-Background-1.png',
            levelThreshold: 10,
            orientation: 'vertical'
        };

        if (!config || typeof config !== 'object') {
            this.gameConfig = defaults;
        } else {
            this.gameConfig = {
                ...defaults,
                ...config,
                player: { ...defaults.player, ...(config.player || {}) },
                weapon: { ...defaults.weapon, ...(config.weapon || {}) },
                spawn: { ...defaults.spawn, ...(config.spawn || {}) },
                levelThreshold: config.levelThreshold || defaults.levelThreshold,
                orientation: config.orientation || defaults.orientation
            };
        }
    }

    preload() {
        const assetsBase = '/assets/';
        const bulletsBase = assetsBase + 'bullets/';

        if (this.gameConfig.background) {
            this.load.image('background', assetsBase + this.gameConfig.background);
        }

        if (this.gameConfig.player?.asset) {
            this.load.image('player', assetsBase + this.gameConfig.player.asset);
        }

        if (this.gameConfig.spawn?.asset) {
            const assets = Array.isArray(this.gameConfig.spawn.asset)
                ? this.gameConfig.spawn.asset
                : [this.gameConfig.spawn.asset];

            assets.forEach(assetPath => {
                this.load.image(assetPath, assetsBase + assetPath);
            });
        }

        if (this.gameConfig.sounds?.fire) {
            this.load.audio('fire_sound', assetsBase + this.gameConfig.sounds.fire);
        }

        // Load Realistic Projectiles
        this.load.image('bullet', bulletsBase + 'bullet.png');
        this.load.image('missile', bulletsBase + 'Rocket_TX.png');
        this.load.image('bullet_red', bulletsBase + 'red_bullet.png');
        this.load.image('bullet_light', bulletsBase + 'light_bullet.png');
        this.load.image('bullet_blue', bulletsBase + 'bulet_3.png');
        this.load.image('bomb', bulletsBase + 'Bomb.png');

        // Fallback bullet texture in case images fail
        this.make.graphics({ x: 0, y: 0, add: false })
            .fillStyle(0xffff00, 1).fillRect(0, 0, 4, 10)
            .generateTexture('default_bullet', 4, 10);
    }

    create() {
        // Initial State
        this.isGameOver = false;
        this.score = 0;
        this.level = 1;
        this.enemiesDefeated = 0;
        this.hp = this.gameConfig.player.hp || 3;
        this.maxHp = this.hp;

        // Background
        if (this.gameConfig.background) {
            const isHorizontal = this.gameConfig.orientation === 'horizontal';
            if (isHorizontal) {
                this.bg = this.add.tileSprite(400, 300, 800, 600, 'background');
                // Auto-scale tile based on texture width
                const texture = this.textures.get('background').getSourceImage();
                const scale = 600 / texture.height;
                this.bg.setTileScale(scale);
            } else {
                const bg = this.add.image(400, 300, 'background');
                const scaleX = 800 / bg.width;
                const scaleY = 600 / bg.height;
                bg.setScale(Math.max(scaleX, scaleY));
            }
        }

        // Initialize Systems
        this.weapons = new WeaponSystem(this);
        this.spawner = new SpawnManager(this);
        this.collisions = new CollisionHandler(this);

        // Create Player
        const pConfig = this.gameConfig.player;
        const isHorizontal = this.gameConfig.orientation === 'horizontal';

        const startX = isHorizontal ? 100 : 400;
        const startY = isHorizontal ? 300 : 550;

        this.player = this.physics.add.sprite(startX, startY, 'player');
        if (pConfig?.scale) this.player.setScale(pConfig.scale);
        this.player.setCollideWorldBounds(true);

        if (isHorizontal) {
            this.player.setRotation(Math.PI / 2); // Rotate to face right
        }

        // Setup Collisions - now using 'projectiles' group
        this.collisions.setup(this.player, this.spawner.enemies, this.weapons.projectiles);

        // Event Listeners
        this.events.on('playerHit', this.handlePlayerHit, this);

        // Spawn Initial Wave
        this.spawner.spawnWave(this.gameConfig.spawn);

        this.cursors = this.input.keyboard.createCursorKeys();

        // UI Layer
        this.createUI();

        // Get Ready Message
        const readyText = this.add.text(400, 300, 'ENGINE ONLINE', {
            font: 'bold 40px monospace',
            fill: '#00ffff'
        }).setOrigin(0.5).setDepth(100);

        this.tweens.add({
            targets: readyText,
            alpha: 0,
            scale: 1.5,
            duration: 1000,
            delay: 1000,
            onComplete: () => readyText.destroy()
        });
    }

    createUI() {
        // Score & Level
        this.scoreText = this.add.text(10, 10, 'SCORE: 0', {
            font: '16px "Press Start 2P", monospace',
            fill: '#00ffff'
        });

        this.levelText = this.add.text(10, 30, 'LEVEL: 1', {
            font: '16px "Press Start 2P", monospace',
            fill: '#ffff00'
        });

        // Instructions
        const controls = this.gameConfig.orientation === 'horizontal'
            ? 'UP/DOWN: MOVE | SPACE: SHOOT'
            : 'LEFT/RIGHT: MOVE | SPACE: SHOOT';

        this.add.text(10, 50, controls, {
            font: '10px monospace',
            fill: '#00ffff'
        });

        // Health Bar UI
        this.add.text(620, 10, 'INTEGRITY', { font: 'bold 12px monospace', fill: '#ffffff' });
        this.healthBarBg = this.add.rectangle(725, 17, 100, 10, 0x333333);
        this.healthBar = this.add.rectangle(725, 17, 100, 10, 0x00ff00);
    }

    handlePlayerHit() {
        if (this.isGameOver) return;

        this.hp--;
        this.updateHealthBar();

        if (this.hp <= 0) {
            this.gameOver('HULL BREACHED');
        }
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
        this.player.setTint(0xff0000);

        this.add.text(400, 250, 'GAME OVER', { font: 'bold 64px monospace', fill: '#ff0000' }).setOrigin(0.5);
        this.add.text(400, 320, reason, { font: '24px monospace', fill: '#ffffff' }).setOrigin(0.5);

        const restartBtn = this.add.text(400, 420, 'RESTART VIBE', {
            font: '20px monospace',
            fill: '#000000',
            backgroundColor: '#00ffff',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive();

        restartBtn.on('pointerdown', () => this.scene.restart());
    }

    getSpeedMultiplier() {
        return 1 + (this.level - 1) * 0.2; // 20% speed increase per level
    }

    addScore(points) {
        this.score += points;
        this.enemiesDefeated++;

        // Level up check
        if (this.enemiesDefeated >= this.level * this.gameConfig.levelThreshold) {
            this.level++;
            this.cameras.main.flash(500, 0, 255, 255);
            // Show level up message handled here if needed
        }

        this.updateHUD();
    }

    updateHUD() {
        this.scoreText.setText('SCORE: ' + this.score);
        this.levelText.setText('LEVEL: ' + this.level);
    }

    update() {
        if (this.isGameOver || !this.player || !this.player.active) return;

        // Player Movement
        const speed = this.gameConfig.player.speed * this.getSpeedMultiplier();
        const isHorizontal = this.gameConfig.orientation === 'horizontal';

        if (isHorizontal) {
            if (this.cursors.up.isDown) {
                this.player.setVelocityY(-speed);
            } else if (this.cursors.down.isDown) {
                this.player.setVelocityY(speed);
            } else {
                this.player.setVelocityY(0);
            }
            this.player.setVelocityX(0);
        } else {
            if (this.cursors.left.isDown) {
                this.player.setVelocityX(-speed);
            } else if (this.cursors.right.isDown) {
                this.player.setVelocityX(speed);
            } else {
                this.player.setVelocityX(0);
            }
            this.player.setVelocityY(0);
        }

        // Firing
        if (this.cursors.space.isDown) {
            this.weapons.fire(this.player.x, this.player.y, this.gameConfig.weapon);
        }

        this.weapons.update();
        this.spawner.update();

        // Scrolling Background
        if (this.gameConfig.orientation === 'horizontal' && this.bg) {
            this.bg.tilePositionX += 2 * this.getSpeedMultiplier();
        }
    }
}
