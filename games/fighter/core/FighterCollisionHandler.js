
export default class CollisionHandler {
    constructor(scene) {
        this.scene = scene;
    }

    setup(playerOrGroup, enemies, projectiles) {
        // Player/Fighters vs Enemies
        this.scene.physics.add.overlap(projectiles, enemies, this.handleBulletEnemyCollision, null, this);
        this.scene.physics.add.overlap(playerOrGroup, enemies, this.handlePlayerEnemyCollision, null, this);

        // Fighters vs Fighters (1v1 support)
        if (playerOrGroup.getChildren) {
            this.scene.physics.add.overlap(projectiles, playerOrGroup, this.handleBulletFighterCollision, null, this);
        }
    }

    handleBulletEnemyCollision(projectile, enemy) {
        if (!enemy.active) return;
        if (projectile.source === enemy) return;

        enemy.hp = (enemy.hp || 1) - (projectile.damage || 1);

        if (enemy.hp <= 0) {
            enemy.setActive(false);
            enemy.setVisible(false);
            enemy.body.enable = false;

            // Premium Death Effect: Energy Burst
            if (this.scene.juice) {
                this.scene.juice.explode(enemy.x, enemy.y, 'shrapnel');
                this.scene.juice.shake(200, 0.02);
            }

            this.scene.addScore(10);
        } else {
            if (this.scene.juice) {
                this.scene.juice.flash(enemy, 50);
                this.scene.juice.explode(enemy.x, enemy.y, 'sparks');
            }
        }

        if (!projectile.isMelee) {
            projectile.destroy();
        }
    }

    handleBulletFighterCollision(projectile, fighter) {
        if (!fighter.active) return;

        if (projectile.source === fighter) return;
        if (projectile.source?.team && fighter.team && projectile.source.team === fighter.team) return;

        // 1. Check Blocking
        if (fighter.isBlocking) {
            // Blockstun & Shield Feedback
            fighter.isBlockStunned = true;
            fighter.setTint(0x00ffff);

            if (this.scene.juice) {
                this.scene.juice.shake(100, 0.002);
                this.scene.juice.explode(fighter.x, fighter.y, 'sparks');
            }

            // Reduced damage/knockback on block
            const dir = (fighter.x > projectile.source.x) ? 1 : -1;
            fighter.setVelocityX(200 * dir);

            this.scene.time.delayedCall(200, () => {
                if (fighter.active) {
                    fighter.isBlockStunned = false;
                    fighter.clearTint();
                }
            });

            if (this.scene.handlePlayerHit) {
                this.scene.handlePlayerHit(fighter, (projectile.damage || 1) * 0.2);
            }
            return;
        }

        // 2. Full Hit Reaction
        const dir = (fighter.x > projectile.source.x) ? 1 : -1;

        // Launchers go UP
        if (projectile.isLauncher) {
            fighter.setVelocityY(-1000);
            fighter.setVelocityX(400 * dir);
        } else if (projectile.isDive) {
            fighter.setVelocityY(200);
            fighter.setVelocityX(900 * dir);
        } else {
            fighter.setVelocityX(1000 * dir);
        }

        fighter.setTint(0xffffff); // Flash white

        // HitStun
        fighter.isHitStunned = true;

        // Visual Impact
        if (this.scene.juice) {
            const intensity = projectile.isLauncher || projectile.isHeavy ? 0.03 : 0.01;
            this.scene.juice.shake(200, intensity);
            this.scene.juice.explode(fighter.x, fighter.y, projectile.isLauncher ? 'fire' : 'sparks');
        }

        // Squash on hit
        this.scene.tweens.add({
            targets: fighter,
            scaleX: (fighter.config?.scale || 1) * 0.5,
            scaleY: (fighter.config?.scale || 1) * 1.5,
            duration: 50,
            yoyo: true
        });

        this.scene.time.delayedCall(projectile.isLauncher ? 600 : 300, () => {
            if (fighter.active) {
                fighter.isHitStunned = false;
                fighter.clearTint();
                if (!projectile.isLauncher) fighter.setVelocityX(0);
            }
        });

        if (!projectile.isMelee) {
            projectile.destroy();
        }

        if (this.scene.handlePlayerHit) {
            this.scene.handlePlayerHit(fighter, projectile.damage || 1);
        }
    }

    handlePlayerEnemyCollision(player, enemy) {
        if (!enemy.active || !player.active) return;

        // In Versus mode, players don't die from touching enemies usually, 
        // but we keep it for Brawler mode compatibility.
        enemy.destroy();

        this.scene.cameras.main.shake(300, 0.01);
        if (this.scene.handlePlayerHit) {
            this.scene.handlePlayerHit(player);
        }
    }
}
