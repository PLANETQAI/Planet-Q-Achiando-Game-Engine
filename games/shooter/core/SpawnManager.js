
import * as Phaser from 'phaser';

export default class SpawnManager {
    constructor(scene) {
        this.scene = scene;
        this.enemies = scene.physics.add.group();
        this.moveDirection = 1;
        this.moveSpeed = 50;
    }

    spawnWave(config) {
        this.waveConfig = config || this.waveConfig;
        const { type, count, spacing, scale } = this.waveConfig;

        if (type === 'grid') {
            const cols = Math.min(count, 8);
            const rows = Math.ceil(count / cols);

            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    const x = 100 + (c * spacing);
                    const y = 80 + (r * spacing);
                    this.createEnemy(x, y, scale);
                }
            }
        } else {
            // Chaos/Random spawn - Staggered positions for sparsity
            const isHorizontal = this.scene.gameConfig.orientation === 'horizontal';
            for (let i = 0; i < count; i++) {
                if (isHorizontal) {
                    const x = Phaser.Math.Between(850, 1600);
                    const y = Phaser.Math.Between(50, 550);
                    this.createEnemy(x, y, scale, true);
                } else {
                    const x = Phaser.Math.Between(50, 750);
                    const y = Phaser.Math.Between(-800, -50);
                    this.createEnemy(x, y, scale, true);
                }
            }
        }
    }

    createEnemy(x, y, scale, isChaos = false) {
        let assetKey = 'enemy';
        if (this.waveConfig?.asset) {
            if (Array.isArray(this.waveConfig.asset)) {
                assetKey = Phaser.Utils.Array.GetRandom(this.waveConfig.asset);
            } else {
                assetKey = this.waveConfig.asset;
            }
        }

        const enemy = this.enemies.create(x, y, assetKey);
        if (scale) enemy.setScale(scale);

        const multiplier = this.scene.getSpeedMultiplier();
        const configSpeed = (this.waveConfig?.speed || 150) * multiplier;
        const currentMoveSpeed = this.moveSpeed * multiplier;

        const isHorizontal = this.scene.gameConfig.orientation === 'horizontal';

        if (isChaos) {
            if (isHorizontal) {
                enemy.setVelocityX(-Phaser.Math.Between(configSpeed * 0.8, configSpeed * 1.2));
                enemy.setVelocityY(Phaser.Math.Between(-50, 50) * multiplier);
            } else {
                // Swarm Physics: Descend with jitter
                enemy.setVelocityY(Phaser.Math.Between(configSpeed * 0.5, configSpeed));
                enemy.setVelocityX(Phaser.Math.Between(-100, 100) * multiplier);
                enemy.body.setDrag(50); // Air resistance
            }
        } else {
            enemy.setVelocityX(currentMoveSpeed * this.moveDirection);
        }

        // Apply visual tweaks from config
        if (this.waveConfig?.blendMode) {
            enemy.setBlendMode(this.waveConfig.blendMode);
        }
        if (this.waveConfig?.tints) {
            const tint = Phaser.Utils.Array.GetRandom(this.waveConfig.tints);
            enemy.setTint(tint);
        }

        // Depth Scaling Initial State
        if (this.waveConfig?.depthScale && !isHorizontal) {
            enemy.baseScale = scale || 1.0;
            enemy.setScale(enemy.baseScale * 0.1);
            enemy.setAlpha(0.3);
        }

        enemy.setCollideWorldBounds(false);
    }

    spawnBoss(config) {
        const x = this.scene.gameConfig.orientation === 'horizontal' ? 900 : 400;
        const y = this.scene.gameConfig.orientation === 'horizontal' ? 300 : -100;

        const boss = this.enemies.create(x, y, config.asset || 'player');
        boss.hp = config.hp || 50;
        boss.maxHp = boss.hp;
        boss.isBoss = true;
        boss.setScale(config.scale || 1.5);
        boss.setTint(0xff8888);

        // Complex movement pattern
        this.scene.tweens.add({
            targets: boss,
            x: this.scene.gameConfig.orientation === 'horizontal' ? 600 : 400,
            y: this.scene.gameConfig.orientation === 'horizontal' ? 300 : 150,
            duration: 2000,
            onComplete: () => {
                this.scene.tweens.add({
                    targets: boss,
                    x: { from: 100, to: 700 },
                    duration: 3000,
                    yoyo: true,
                    loop: -1
                });
            }
        });

        return boss;
    }

    update() {
        let hitEdge = false;
        let activeCount = 0;
        const isHorizontal = this.scene.gameConfig.orientation === 'horizontal';

        this.enemies.children.each(enemy => {
            if (enemy.active) {
                activeCount++;
                // Bounds check for grid movement
                if (enemy.body.velocity.y === 0) { // Only grid enemies move horizontally
                    if (enemy.x >= 750 || enemy.x <= 50) {
                        hitEdge = true;
                    }
                }

                // Depth Scaling & Perspective Logic
                if (this.waveConfig?.depthScale && !isHorizontal) {
                    const progress = Phaser.Math.Clamp((enemy.y + 100) / 700, 0, 1);
                    const currentScale = (enemy.baseScale || 1.0) * (0.1 + (progress * 0.9));
                    enemy.setScale(currentScale);
                    enemy.setAlpha(0.3 + (progress * 0.7));

                    // Perspective drift: Pull toward center when far, push away slightly when close
                    const centerX = 400;
                    const driftFactor = (1 - progress) * 2; // More drift when far
                    if (enemy.x < centerX) enemy.x += driftFactor;
                    else if (enemy.x > centerX) enemy.x -= driftFactor;
                }

                // Glitch Jitter Effect
                if (this.waveConfig?.glitch) {
                    if (Math.random() > 0.95) {
                        enemy.x += Phaser.Math.Between(-10, 10);
                        enemy.setAlpha(Phaser.Math.FloatBetween(0.5, 1.0));
                    } else {
                        enemy.setAlpha(1.0);
                    }
                }

                // Universal Recycling: Any enemy going off the opposite edge returns

                if (isHorizontal) {
                    if (enemy.x < -50) {
                        enemy.setX(Phaser.Math.Between(850, 1000));
                        enemy.setY(Phaser.Math.Between(50, 550));

                        const multiplier = this.scene.getSpeedMultiplier();
                        const configSpeed = (this.waveConfig?.speed || 150) * multiplier;
                        enemy.setVelocityX(-Phaser.Math.Between(configSpeed * 0.8, configSpeed * 1.2));
                        enemy.setVelocityY(Phaser.Math.Between(-50, 50) * multiplier);
                    }
                } else {
                    if (enemy.y > 650) {
                        enemy.setY(Phaser.Math.Between(-200, -50));
                        enemy.setX(Phaser.Math.Between(50, 750));

                        const multiplier = this.scene.getSpeedMultiplier();
                        if (enemy.body.velocity.y !== 0) { // Chaos enemy
                            const configSpeed = (this.waveConfig?.speed || 150) * multiplier;
                            enemy.setVelocityY(Phaser.Math.Between(configSpeed * 0.8, configSpeed * 1.2));
                        } else { // Grid enemy
                            enemy.setVelocityX(this.moveSpeed * multiplier * this.moveDirection);
                        }
                    }
                }
            }
        });

        // Trigger new wave if all dead and recurring is true
        if (activeCount === 0 && this.waveConfig?.recurring) {
            this.spawnWave();
        }

        if (hitEdge) {
            this.moveDirection *= -1;
            const multiplier = this.scene.getSpeedMultiplier();
            this.enemies.children.each(enemy => {
                if (enemy.active && enemy.body.velocity.y === 0) {
                    enemy.setVelocityX(this.moveSpeed * multiplier * this.moveDirection);
                    enemy.y += 20 * multiplier;
                }
            });
        }
    }
}
