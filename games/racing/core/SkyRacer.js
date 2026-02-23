
import * as Phaser from 'phaser';
import { createMobileControls } from '../../core/MovementManager';

export default class SkyRacer extends Phaser.Scene {
    constructor() {
        super({ key: 'SkyRacer' });
    }

    init(config) {
        const defaults = {
            player: { speed: 400, jumpForce: -600, asset: 'spaceship/spaceship.pod.1.yellow.png', scale: 0.3, hp: 5 },
            background: 'background/space-Background-1.png',
            platform: { asset: 'spaceship/baseship11.small_.png', speed: 300, spacing: 400, scale: 1.0 },
            obstacles: { count: 3, asset: '💥', scale: 0.8, damage: 1 },
            levelThreshold: 2000 // Distance units
        };

        if (!config || typeof config !== 'object') {
            this.gameConfig = defaults;
        } else {
            this.gameConfig = {
                ...defaults,
                ...config,
                player: { ...defaults.player, ...(config.player || {}) },
                platform: { ...defaults.platform, ...(config.platform || {}) },
                obstacles: { ...defaults.obstacles, ...(config.obstacles || {}) }
            };
        }

        this.isGameOver = false;
        this.score = 0;
        this.distance = 0;
        this.hp = this.gameConfig.player.hp || 5;
        this.maxHp = this.hp;
    }

    preload() {
        const assetsBase = '/assets/';

        if (this.gameConfig.background) {
            this.load.image('sky-bg', assetsBase + this.gameConfig.background);
        }

        const loadAsset = (key, path) => {
            if (!path) return;
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

        loadAsset('player', this.gameConfig.player.asset);
        loadAsset('platform', this.gameConfig.platform.asset);
        loadAsset('obstacle', this.gameConfig.obstacles.asset);
    }

    create() {
        // Scrolling Background
        this.bg = this.add.tileSprite(400, 300, 800, 600, 'sky-bg');
        if (this.textures.exists('sky-bg')) {
            const texture = this.textures.get('sky-bg').getSourceImage();
            const scale = 600 / texture.height;
            this.bg.setTileScale(scale);
        }

        // Groups
        this.platforms = this.physics.add.group({ allowGravity: false, immovable: true });
        this.obstacles = this.physics.add.group({ allowGravity: false, immovable: true });

        // Player
        this.player = this.physics.add.sprite(200, 300, 'player');
        this.player.setScale(this.gameConfig.player.scale);
        this.player.setCollideWorldBounds(true);
        this.player.body.setGravityY(1200);

        // Initial Platform
        this.createPlatform(200, 500, 400);

        // Collisions
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.overlap(this.player, this.obstacles, this.handleObstacleCollision, null, this);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.mobileInput = createMobileControls(this);

        // UI
        this.createUI();

        // Spawn Loop
        this.lastPlatformX = 200;
        this.time.addEvent({
            delay: 1500,
            callback: this.spawnSequence,
            callbackScope: this,
            loop: true
        });

        // Start Msg
        const msg = this.add.text(400, 300, 'ASCEND!', { font: 'bold 40px monospace', fill: '#00ffff' }).setOrigin(0.5);
        this.tweens.add({ targets: msg, alpha: 0, scale: 2, duration: 1000, delay: 1000, onComplete: () => msg.destroy() });
    }

    createUI() {
        this.distText = this.add.text(10, 10, 'DISTANCE: 0m', { font: 'bold 16px monospace', fill: '#00ffff' });
        this.hpText = this.add.text(10, 35, 'HULL HP: ' + this.hp, { font: 'bold 12px monospace', fill: '#ff3333' });

        // Health Bar
        this.healthBarBg = this.add.rectangle(725, 17, 100, 10, 0x333333);
        this.healthBar = this.add.rectangle(725, 17, 100, 10, 0x00ff00);
    }

    createPlatform(x, y, width) {
        const plat = this.platforms.create(x, y, 'platform');
        plat.setDisplaySize(width, 40);
        plat.setVelocityX(-this.gameConfig.platform.speed);

        // Randomly add obstacle on platform
        if (Math.random() > 0.6) {
            const obsX = x + Phaser.Math.Between(-width / 3, width / 3);
            const obstacle = this.obstacles.create(obsX, y - 40, 'obstacle');
            obstacle.setScale(this.gameConfig.obstacles.scale);
            obstacle.setVelocityX(-this.gameConfig.platform.speed);
        }
    }

    spawnSequence() {
        if (this.isGameOver) return;
        const width = Phaser.Math.Between(200, 400);
        const y = Phaser.Math.Between(300, 550);
        this.createPlatform(900, y, width);
    }

    handleObstacleCollision(player, obstacle) {
        if (obstacle.hit) return;
        obstacle.hit = true;

        this.hp -= this.gameConfig.obstacles.damage;
        this.updateHealthBar();
        this.cameras.main.shake(200, 0.01);

        // Stumble effect: Spin and temporary penalty
        player.setTint(0xff0000);
        player.setAngularVelocity(720); // Dramatic spin

        // Slow down the "race" temporarily by slowing platforms if possible?
        // Or just penalize player position.
        player.setVelocityX(-200);

        this.time.delayedCall(800, () => {
            player.clearTint();
            player.setAngularVelocity(0);
            player.setRotation(0);
        });

        if (this.hp <= 0) {
            this.gameOver('KINETIC CRASH');
        }

        obstacle.destroy();
    }

    updateHealthBar() {
        const percent = Math.max(0, this.hp / this.maxHp);
        this.healthBar.width = 100 * percent;
        if (percent < 0.3) this.healthBar.setFillStyle(0xff0000);
        else if (percent < 0.6) this.healthBar.setFillStyle(0xffff00);
        else this.healthBar.setFillStyle(0x00ff00);
        this.hpText.setText('HULL HP: ' + Math.max(0, this.hp));
    }

    gameOver(reason) {
        if (this.isGameOver) return;
        this.isGameOver = true;
        this.physics.pause();
        this.player.setTint(0xff0000);

        this.add.text(400, 250, 'ALTITUDE LOST', { font: 'bold 64px monospace', fill: '#ff0000' }).setOrigin(0.5);
        this.add.text(400, 320, reason, { font: '24px monospace', fill: '#ffffff' }).setOrigin(0.5);

        const restartBtn = this.add.text(400, 420, 'REBOOT SYSTEMS', {
            font: '20px monospace', fill: '#000', backgroundColor: '#00ffff', padding: 10
        }).setOrigin(0.5).setInteractive();

        restartBtn.on('pointerdown', () => this.scene.restart());
    }

    update() {
        if (this.isGameOver) return;

        // Background scroll
        this.bg.tilePositionX += this.gameConfig.platform.speed / 60;

        // Distance tracking
        this.distance += this.gameConfig.platform.speed / 600;
        this.distText.setText('DISTANCE: ' + Math.floor(this.distance) + 'm');

        // Input
        const canJump = this.player.body.touching.down;
        if ((this.cursors.up.isDown || this.spaceBar.isDown || this.mobileInput.justAction) && canJump) {
            this.player.setVelocityY(this.gameConfig.player.jumpForce);
        }

        // Horizontal micro-movement
        if (this.cursors.left.isDown || this.mobileInput.left) {
            this.player.setX(this.player.x - 5);
        } else if (this.cursors.right.isDown || this.mobileInput.right) {
            this.player.setX(this.player.x + 5);
        }

        // Cleanup
        this.platforms.children.each(p => {
            if (p.x < -200) p.destroy();
        });
        this.obstacles.children.each(o => {
            if (o.x < -200) o.destroy();
        });

        // Falling off screen
        if (this.player.y > 600) {
            this.gameOver('GRID FALL');
        }

        // Reset just action
        if (this.mobileInput) this.mobileInput.justAction = false;
    }
}
