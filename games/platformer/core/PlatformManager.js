
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
    }

    generateLevel(config) {
        // Basic rhythmic layout for the level
        const spacing = 300;
        const width = config.width || 2400;

        // Ground floor - more consistent
        for (let x = 0; x < width; x += 200) {
            if (x < 400 || Math.random() > 0.1) { // Guaranteed start area
                this.addPlatform(x + 100, 580, 1, true);
            }
        }

        // Raised platforms - rhythmic and reachable
        let lastY = 450;
        for (let x = 500; x < width - 200; x += spacing) {
            const y = Phaser.Math.Clamp(lastY + Phaser.Math.Between(-100, 100), 200, 450);
            lastY = y;

            const isMoving = Math.random() < 0.2;

            if (isMoving) {
                this.addMovingPlatform(x, y);
            } else {
                this.addPlatform(x, y, 0.6 + Math.random() * 0.4);

                // Add collectibles on platforms
                if (Math.random() < 0.6) {
                    this.addCollectible(x, y - 40);
                }

                // Add hazards occasionally
                if (Math.random() < 0.15) {
                    this.addHazard(x + 40, y - 15);
                }
            }
        }

        // Add Goal at the far end
        this.addGoal(width - 150, lastY - 60);
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
