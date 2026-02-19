

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

        const type = config.type || 'bullet';

        if (type === 'melee') {
            this.fireMelee(x, y, config);
        } else {
            this.fireProjectile(x, y, config);
        }

        this.lastFired = time;

        if (this.scene.cache.audio.exists('fire_sound')) {
            this.scene.sound.play('fire_sound', { volume: 0.3 });
        }
    }

    fireProjectile(x, y, config) {
        const type = config.type || 'bullet';
        let assetKey = config.asset || 'bullet';
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
                const isPlatformer = this.scene.gameConfig.category === 'fighting';

                let angle = 0;
                if (bulletCount > 1) {
                    angle = ((i / (bulletCount - 1)) - 0.5) * spread;
                }

                if (config.direction) {
                    projectile.setVelocity(speed * config.direction.x, speed * config.direction.y);
                    if (config.direction.y < 0) projectile.setRotation(0);
                    else if (config.direction.y > 0) projectile.setRotation(Math.PI);
                    else projectile.setRotation(config.direction.x > 0 ? Math.PI / 2 : -Math.PI / 2);
                } else if (isPlatformer) {
                    // Facing left or right based on source
                    const source = config.source || this.scene.player;
                    const dir = source.flipX ? -1 : 1;
                    projectile.setVelocity(speed * dir, 0);
                    projectile.flipX = source.flipX;
                } else if (isHorizontal) {
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

                if (config.scale) projectile.setScale(config.scale);
                else projectile.setScale(0.5);
            }
        }
    }

    fireMelee(x, y, config) {
        const source = config.source || this.scene.player;
        const dir = source.flipX ? -1 : 1;

        // Combo Logic
        const now = this.scene.time.now;
        if (now - source.lastAttackTime < 800) {
            source.comboStep = (source.comboStep + 1) % 3;
        } else {
            source.comboStep = 0;
        }
        source.lastAttackTime = now;

        // Lunge & State
        const lungeForce = (config.lunge || 300) * (1 + source.comboStep * 0.2);
        source.setVelocityX(lungeForce * dir);
        source.isAttacking = true;

        // Squash & Stretch Attack
        this.scene.tweens.add({
            targets: source,
            scaleX: source.config.scale * 1.4,
            scaleY: source.config.scale * 0.7,
            duration: 80,
            yoyo: true,
            ease: 'Quad.easeOut'
        });

        this.scene.time.delayedCall(250, () => {
            source.isAttacking = false;
        });

        // Visual Slash
        const slashColors = [0xff0000, 0x00ffff, 0xffff00];
        const slash = this.scene.add.sprite(x + (60 * dir), y, 'bullet_light');
        slash.setScale(0.1, 2.5 + source.comboStep);
        slash.setAlpha(1);
        slash.setTint(slashColors[source.comboStep]);
        slash.setDepth(15);
        if (dir === -1) slash.flipX = true;

        this.scene.tweens.add({
            targets: slash,
            scaleX: 6 + source.comboStep * 2,
            alpha: 0,
            duration: 150,
            ease: 'Expo.out',
            onComplete: () => slash.destroy()
        });

        // Hitbox
        const hitbox = this.scene.add.rectangle(x + (80 * dir), y, 140, 120, 0xffffff, 0);
        this.scene.physics.add.existing(hitbox);
        hitbox.body.setAllowGravity(false);
        hitbox.isMelee = true;
        hitbox.damage = 1 + source.comboStep;
        hitbox.isLauncher = source.comboStep === 2; // 3rd hit launches
        hitbox.isHeavy = config.isHeavy;
        hitbox.isDive = config.isDive;

        const fighters = this.scene.fighters;
        const enemies = this.scene.spawner.enemies;

        if (enemies) {
            this.scene.physics.overlap(hitbox, enemies, (h, target) => {
                this.scene.collisions.handleBulletEnemyCollision(h, target);
                this.applyHitStop(100 + source.comboStep * 20);
            });
        }

        if (fighters) {
            this.scene.physics.overlap(hitbox, fighters, (h, target) => {
                if (target !== source) {
                    this.scene.collisions.handleBulletFighterCollision(h, target);

                    const isLauncher = h.isLauncher;
                    const isDive = h.isDive;

                    let stopTime = 150 + source.comboStep * 30;
                    if (isLauncher) stopTime += 100;
                    if (isDive) stopTime += 50;

                    this.applyHitStop(stopTime);
                }
            });
        }

        this.scene.time.delayedCall(150, () => hitbox.destroy());
    }

    applyHitStop(duration) {
        // "Hit Stop" effect - freeze the world for a few frames
        const originalSpeeds = [];
        this.scene.physics.world.pause();

        this.scene.time.delayedCall(duration, () => {
            this.scene.physics.world.resume();
        });
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

                projectile.isShrapnel = true;
            }
        }
    }

    update() {
        this.projectiles.children.each(projectile => {
            if (projectile.active) {
                if (projectile.y < -100 || projectile.y > 700 || projectile.x < -100 || projectile.x > 900) {
                    projectile.setActive(false);
                    projectile.setVisible(false);
                }
            }
        });
    }
}
