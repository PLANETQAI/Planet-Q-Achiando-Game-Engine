
import * as Phaser from 'phaser';

export default class WeaponSystem {
    constructor(scene) {
        this.scene = scene;
        this.projectiles = scene.physics.add.group({
            classType: Phaser.Physics.Arcade.Image,
            maxSize: 50,
            runChildUpdate: true
        });

        this.lastFired = 0;
    }

    fire(x, y, config) {
        const time = this.scene.time.now;
        const fireRate = config.fireRate || 300;

        if (time < this.lastFired + fireRate) return;

        // Determine projectile type and asset
        const type = config.type || 'bullet';
        let assetKey = config.asset || 'bullet';

        // Check if asset exists, fallback to default 'bullet' if not
        if (!this.scene.textures.exists(assetKey)) {
            console.warn(`Asset ${assetKey} not found, falling back to default bullet`);
            assetKey = 'bullet';
        }

        const bulletCount = config.bulletCount || 1;
        const spread = config.spread || 0;

        for (let i = 0; i < bulletCount; i++) {
            const projectile = this.projectiles.get(x, y, assetKey);
            if (projectile) {
                projectile.setActive(true);
                projectile.setVisible(true);
                projectile.setOrigin(0.5, 0.5);

                const speed = config.bulletSpeed || (type === 'missile' ? 300 : 500);
                const isHorizontal = this.scene.gameConfig.orientation === 'horizontal';

                // Calculate spread angle
                let angle = 0;
                if (bulletCount > 1) {
                    angle = ((i / (bulletCount - 1)) - 0.5) * spread;
                }

                if (isHorizontal) {
                    const vx = speed * Math.cos(angle);
                    const vy = speed * Math.sin(angle);
                    projectile.setVelocity(vx, vy);
                    projectile.setRotation(angle + Math.PI / 2);
                } else {
                    const vx = speed * Math.sin(angle);
                    const vy = -speed * Math.cos(angle);
                    projectile.setVelocity(vx, vy);
                    if (type === 'missile') {
                        projectile.setRotation(angle);
                    }
                }

                // Scale
                if (config.scale) projectile.setScale(config.scale);
                else if (type === 'missile') projectile.setScale(0.8);
                else projectile.setScale(0.5);
            }
        }

        this.lastFired = time;

        if (this.scene.cache.audio.exists('fire_sound')) {
            this.scene.sound.play('fire_sound', { volume: 0.3 });
        }
    }

    burst(x, y, count, config) {
        const spread = Math.PI * 2;
        const assetKey = config.asset || 'bullet';

        for (let i = 0; i < count; i++) {
            const projectile = this.projectiles.get(x, y, assetKey);
            if (projectile) {
                projectile.setActive(true);
                projectile.setVisible(true);

                const angle = (i / count) * spread;
                const speed = config.bulletSpeed || 400;

                projectile.setVelocity(
                    speed * Math.cos(angle),
                    speed * Math.sin(angle)
                );
                projectile.setRotation(angle + Math.PI / 2);
                projectile.setScale(config.scale || 0.4);

                // Mark as shrapnel to prevent infinite loops
                projectile.isShrapnel = true;
            }
        }
    }

    update() {
        this.projectiles.children.each(projectile => {
            if (projectile.active) {
                if (projectile.y < -50 || projectile.y > 650 || projectile.x < -50 || projectile.x > 850) {
                    projectile.setActive(false);
                    projectile.setVisible(false);
                }
            }
        });
    }
}
