

export default class WeaponSystem {
    constructor(scene) {
        this.scene = scene;
        this.projectiles = scene.physics.add.group({
            classType: Phaser.Physics.Arcade.Image,
            maxSize: 100,
            runChildUpdate: true
        });

        this.enemyProjectiles = scene.physics.add.group({
            classType: Phaser.Physics.Arcade.Image,
            maxSize: 100,
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
        } else if (type === 'beam') {
            this.fireBeam(x, y, config);
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

        const isEnemy = config.source && config.source !== this.scene.player;
        const group = isEnemy ? this.enemyProjectiles : this.projectiles;

        for (let i = 0; i < bulletCount; i++) {
            const projectile = group.get(x, y, assetKey);
            if (projectile) {
                projectile.setActive(true);
                projectile.setVisible(true);
                projectile.setOrigin(0.5, 0.5);
                projectile.isEnemy = isEnemy;
                projectile.polarity = config.polarity || 'light';

                if (projectile.polarity === 'dark') {
                    projectile.setTint(0x444444);
                } else {
                    projectile.clearTint();
                }

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
                    const vx = speed * Math.cos(angle) * (isEnemy ? -1 : 1);
                    const vy = speed * Math.sin(angle);
                    projectile.setVelocity(vx, vy);
                    projectile.setRotation(angle + (isEnemy ? -Math.PI / 2 : Math.PI / 2));
                } else {
                    const vx = speed * Math.sin(angle);
                    const vy = speed * Math.cos(angle) * (isEnemy ? 1 : -1);
                    projectile.setVelocity(vx, vy);
                    if (type === 'missile') {
                        projectile.setRotation(angle + (isEnemy ? Math.PI : 0));
                    }
                }

                if (config.scale) projectile.setScale(config.scale);
                else projectile.setScale(0.5);

                projectile.homing = config.homing;
                projectile.homingTarget = config.homingTarget;

                // Premium: Muzzle Flash & Screen Shake (if source is player)
                if (this.scene.juice) {
                    this.scene.juice.muzzleFlash(x, y);
                    if (this.scene.player === config.source || !config.source) {
                        this.scene.juice.shake(50, 0.002);
                    }
                }
            }
        }
    }

    fireMelee(x, y, config) {
        const isPlatformer = this.scene.gameConfig.category === 'fighting';
        const source = config.source || this.scene.player;
        const dir = (isPlatformer && source.flipX) ? -1 : 1;

        // Visual Slash
        const slash = this.scene.add.sprite(x + (50 * dir), y, 'bullet_light');
        slash.setScale(0.1, 2);
        slash.setAlpha(1);
        slash.setTint(0x00ffff);
        slash.setDepth(15);
        if (dir === -1) slash.flipX = true;

        // Multi-stage animation
        this.scene.tweens.add({
            targets: slash,
            scaleX: config.direction?.y ? 0.1 : 4,
            scaleY: config.direction?.y ? 4 : 2,
            alpha: 0.5,
            duration: 100,
            ease: 'Expo.out',
            onComplete: () => {
                this.scene.tweens.add({
                    targets: slash,
                    alpha: 0,
                    scaleX: config.direction?.y ? 0.2 : 6,
                    scaleY: config.direction?.y ? 6 : 3,
                    duration: 150,
                    onComplete: () => slash.destroy()
                });
            }
        });

        // Hitbox
        const hX = config.direction?.y ? x : x + (60 * dir);
        const hY = config.direction?.y ? y + (60 * config.direction.y) : y;
        const hW = config.direction?.y ? 80 : 100;
        const hH = config.direction?.y ? 100 : 80;

        const hitbox = this.scene.add.rectangle(hX, hY, hW, hH, 0xffffff, 0);
        this.scene.physics.add.existing(hitbox);
        hitbox.body.setAllowGravity(false);
        hitbox.isMelee = true;
        hitbox.source = source; // Pass source for damage tracking

        // Use a generic overlap handled by CollisionHandler if exists
        // Otherwise use default logic
        const targetGroup = this.scene.spawner.enemies;

        this.scene.physics.overlap(hitbox, targetGroup, (h, target) => {
            if (this.scene.collisions) {
                this.scene.collisions.handleBulletEnemyCollision(h, target);
                const stopTime = config.isHeavy ? 300 : 100;
                this.applyHitStop(stopTime);
                if (config.isHeavy && this.scene.juice) {
                    this.scene.juice.shake(300, 0.03);
                    this.scene.juice.explode(target.x, target.y, 'fire');
                }
            }
        });

        this.scene.time.delayedCall(config.isHeavy ? 300 : 150, () => hitbox.destroy());
    }

    fireBeam(x, y, config) {
        const isHorizontal = this.scene.gameConfig.orientation === 'horizontal';
        const source = config.source || this.scene.player;
        const width = isHorizontal ? 800 : 40;
        const height = isHorizontal ? 40 : 800;

        const bX = isHorizontal ? x + 400 : x;
        const bY = isHorizontal ? y : y - 400;

        const beam = this.scene.add.rectangle(bX, bY, width, height, 0x00ffff, 0.5);
        this.scene.physics.add.existing(beam);
        beam.body.setAllowGravity(false);

        // Visual FX
        this.scene.tweens.add({
            targets: beam,
            fillAlpha: 1,
            scaleX: isHorizontal ? 1 : 2,
            scaleY: isHorizontal ? 2 : 1,
            duration: 100,
            yoyo: true,
            onComplete: () => beam.destroy()
        });

        // Collision
        const targetGroup = (config.source === this.scene.player || !config.source)
            ? this.scene.spawner.enemies
            : this.scene.player;

        this.scene.physics.overlap(beam, targetGroup, (b, target) => {
            if (this.scene.collisions) {
                this.scene.collisions.handleBulletEnemyCollision({ damage: config.damage || 5, isMelee: true }, target);
            }
        });
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
        const time = this.scene.time.now;
        [this.projectiles, this.enemyProjectiles].forEach(group => {
            group.children.each(projectile => {
                if (projectile.active) {
                    // Homing Logic
                    if (projectile.homing) {
                        const targets = projectile.isEnemy ? [this.scene.player] : this.scene.spawner.enemies.getChildren();
                        let nearest = null;
                        let minDist = 1000;

                        targets.forEach(t => {
                            if (!t.active) return;
                            const dist = Phaser.Math.Distance.Between(projectile.x, projectile.y, t.x, t.y);
                            if (dist < minDist) {
                                minDist = dist;
                                nearest = t;
                            }
                        });

                        if (nearest) {
                            const angle = Phaser.Math.Angle.Between(projectile.x, projectile.y, nearest.x, nearest.y);
                            const speed = projectile.body.speed || 400;
                            projectile.body.velocity.x = Math.cos(angle) * speed;
                            projectile.body.velocity.y = Math.sin(angle) * speed;
                            projectile.setRotation(angle + Math.PI / 2);
                        }
                    }

                    if (projectile.y < -150 || projectile.y > 750 || projectile.x < -150 || projectile.x > 950) {
                        projectile.setActive(false);
                        projectile.setVisible(false);
                    }
                }
            });
        });
    }
}
