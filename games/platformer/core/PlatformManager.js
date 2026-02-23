
import * as Phaser from 'phaser';

export default class PlatformManager {
    constructor(scene) {
        this.scene = scene;
        this.staticPlatforms = scene.physics.add.staticGroup();
        this.movingPlatforms = scene.physics.add.group({
            allowGravity: false,
            immovable: true
        });
        this.hazards = scene.physics.add.staticGroup();
        this.collectibles = scene.physics.add.staticGroup();
        this.goal = scene.physics.add.staticGroup();
        this.labels = scene.physics.add.staticGroup();
    }

    generateLevel(config) {
        this.type = config.type || 'standard';

        if (this.type === 'math-platformer') {
            this.generateMathLevel(config);
        } else if (this.type === 'collect-athon') {
            this.generateCollectLevel(config);
        } else {
            this.generateStandardLevel(config);
        }
    }

    generateStandardLevel(config) {
        const spacing = config.spacing || 300;
        const width = config.width || 2400;
        const heightVariation = config.heightVariation || 100;
        const platformWidthScale = config.platformWidthScale || 1;
        const movingChance = config.movingChance !== undefined ? config.movingChance : 0.2;
        const hazardChance = config.hazardChance !== undefined ? config.hazardChance : 0.15;

        for (let x = 0; x < width; x += 200) {
            if (x < 400 || Math.random() > 0.1) {
                this.addPlatform(x + 100, 580, 1, true);
            }
        }

        let lastY = 450;
        for (let x = 500; x < width - 200; x += spacing) {
            const y = Phaser.Math.Clamp(lastY + Phaser.Math.Between(-heightVariation, heightVariation), 200, 450);
            lastY = y;
            const isMoving = Math.random() < movingChance;
            if (isMoving) {
                this.addMovingPlatform(x, y);
            } else {
                this.addPlatform(x, y, (0.6 + Math.random() * 0.4) * platformWidthScale);
                if (Math.random() < 0.6) this.addCollectible(x, y - 40);
                if (Math.random() < hazardChance) this.addHazard(x + 40, y - 15);
            }
        }
        this.addGoal(width - 150, lastY - 60);
    }

    generateMathLevel(config) {
        const width = config.width || 3000;
        const spacing = 500;

        // Solid ground for start
        this.addPlatform(150, 580, 1.5, true);

        let lastY = 450;
        for (let x = 600; x < width - 200; x += spacing) {
            const correctVal = Phaser.Math.Between(2, 20);
            const wrongVal = correctVal + (Math.random() > 0.5 ? 1 : -1);

            const y1 = Phaser.Math.Clamp(lastY + Phaser.Math.Between(-50, 50), 200, 350);
            const y2 = y1 + 150;

            const p1 = this.addPlatform(x, y1, 0.4);
            const p2 = this.addPlatform(x, y2, 0.4);

            // Add labels
            this.addTextLabel(x, y1 - 25, correctVal.toString(), true);
            this.addTextLabel(x, y2 - 25, wrongVal.toString(), false);

            lastY = y1;
        }
        this.addGoal(width - 150, lastY - 60);
    }

    generateCollectLevel(config) {
        const width = config.width || 2000;
        this.totalCoinsNeeded = 0;

        // Flat ground with many clusters
        for (let x = 0; x < width; x += 250) {
            this.addPlatform(x + 125, 580, 1.2, true);
            for (let i = 0; i < 3; i++) {
                this.addCollectible(x + 100 + (i * 30), 540);
                this.totalCoinsNeeded++;
            }
        }
        this.addGoal(width - 150, 520);
    }

    addTextLabel(x, y, text, isCorrect) {
        const label = this.scene.add.text(x, y, text, {
            font: 'bold 24px Arial',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        this.labels.add(label);
        label.isCorrect = isCorrect;
        label.body.setSize(label.width, label.height);
        return label;
    }

    addPlatform(x, y, scale = 1, isGround = false) {
        const platform = this.staticPlatforms.create(x, y, 'neon_platform');
        platform.setScale(scale);
        platform.refreshBody();
        return platform;
    }

    addMovingPlatform(x, y) {
        const platform = this.movingPlatforms.create(x, y, 'neon_platform');
        platform.setScale(0.5);

        // Setup movement
        platform.startY = y;
        platform.moveRange = 100;
        platform.moveSpeed = 0.002;
        platform.startTime = Math.random() * 1000;

        return platform;
    }

    addHazard(x, y) {
        const hazard = this.hazards.create(x, y, 'spike');
        hazard.setScale(0.5);
        hazard.refreshBody();
        return hazard;
    }

    addCollectible(x, y) {
        const item = this.collectibles.create(x, y, 'coin');
        item.setScale(0.6);
        item.refreshBody();

        this.scene.tweens.add({
            targets: item,
            y: y - 10,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        return item;
    }


    addGoal(x, y) {
        const goal = this.goal.create(x, y, 'goal');
        goal.setScale(1.2);
        goal.refreshBody();
        goal.setTint(0x00ffff);

        this.scene.tweens.add({
            targets: goal,
            angle: 360,
            duration: 3000,
            repeat: -1
        });

        return goal;
    }

    update() {
        const time = this.scene.time.now;
        this.movingPlatforms.getChildren().forEach(platform => {
            const offset = Math.sin((time + platform.startTime) * platform.moveSpeed) * platform.moveRange;
            platform.y = platform.startY + offset;
            platform.body.updateFromGameObject();
        });
    }
}
