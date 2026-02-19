
export default class CollisionHandler {
    constructor(scene) {
        this.scene = scene;
    }

    setup(playerOrGroup, enemies, projectiles, powerUps) {
        // Player/Fighters vs Enemies
        this.scene.physics.add.overlap(projectiles, enemies, this.handleBulletEnemyCollision, null, this);
        this.scene.physics.add.overlap(playerOrGroup, enemies, this.handlePlayerEnemyCollision, null, this);

        // Power-ups
        if (powerUps) {
            this.scene.physics.add.overlap(playerOrGroup, powerUps, this.scene.handlePowerUpCollision, null, this.scene);
        }

        // Enemy Projectiles vs Player/Fighters
        if (this.scene.weapons.enemyProjectiles) {
            this.scene.physics.add.overlap(this.scene.weapons.enemyProjectiles, playerOrGroup, this.handleBulletFighterCollision, null, this);
        }

        // Fighters vs Fighters (1v1 support)
        if (playerOrGroup.getChildren) {
            this.scene.physics.add.overlap(projectiles, playerOrGroup, this.handleBulletFighterCollision, null, this);
        }
    }

    handleBulletEnemyCollision(projectile, enemy) {
        if (!enemy.active) return;

        // Polarity Logic
        if (enemy.polarity && projectile.polarity) {
            if (enemy.polarity === projectile.polarity) {
                // Absorbed or reduced damage
                projectile.destroy();
                return;
            } else {
                // Opposite polarity: Double damage
                projectile.damage = (projectile.damage || 1) * 2;
            }
        }

        // Don't hit self with projectiles
        if (projectile.source === enemy) return;

        const x = enemy.x;
        const y = enemy.y;

        // Melee hitboxes shouldn't be destroyed
        if (!projectile.isMelee) {
            projectile.setActive(false);
            projectile.setVisible(false);
            projectile.destroy();
        }

        // Visual "Pop" - Replace Emoji with Particles
        if (this.scene.juice) {
            this.scene.juice.explode(x, y, 'fire');
            this.scene.juice.hitStop(20);
        }

        // Spawn effects
        const explodeConfig = this.scene.gameConfig.spawn?.explosion;
        if (explodeConfig && !projectile.isShrapnel && !projectile.isMelee) {
            this.scene.weapons.burst(x, y, explodeConfig.count || 8, {
                asset: explodeConfig.asset || 'bullet_light',
                bulletSpeed: explodeConfig.speed || 300,
                scale: explodeConfig.scale || 0.3
            });
        }

        // Multi-hit logic for bosses
        if (enemy.isBoss) {
            enemy.hp -= (projectile.damage || 1);
            if (this.scene.juice) {
                this.scene.juice.flash(enemy, 50);
                this.scene.juice.explode(x, y, 'sparks');
            }
            if (enemy.hp > 0) return; // Don't destroy yet

            // Boss Death: Massive explosion
            if (this.scene.juice) {
                this.scene.juice.explode(x, y, 'fire');
                this.scene.juice.explode(x, y, 'shrapnel');
                this.scene.juice.shake(500, 0.04);
                this.scene.juice.hitStop(200);
            }
        }

        enemy.destroy();

        // Feedback
        if (this.scene.juice) {
            this.scene.juice.shake(100, 0.01);
        }

        if (this.scene.addScore) {
            this.scene.addScore(100);
        }

        // Power-up Drop Logic
        if (this.scene.spawnPowerUp && Math.random() < 0.15) { // 15% chance
            this.scene.spawnPowerUp(x, y);
        }
    }

    handleBulletFighterCollision(projectile, fighter) {
        if (!fighter.active) return;

        // Don't hit self or teammates
        if (projectile.source === fighter) return;
        if (projectile.source?.team && fighter.team && projectile.source.team === fighter.team) return;

        // Polarity Logic for Player
        if (this.scene.polarity && projectile.isEnemy) {
            const projectilePolarity = projectile.polarity || 'light';
            if (this.scene.polarity === projectilePolarity) {
                // Absorb bullet
                projectile.destroy();
                if (this.scene.juice) this.scene.juice.flash(fighter, 50, 0x00ffff);
                return;
            }
        }

        // Melee hitboxes shouldn't be destroyed
        if (!projectile.isMelee) {
            projectile.setActive(false);
            projectile.setVisible(false);
            projectile.destroy();
        }

        if (this.scene.handlePlayerHit) {
            this.scene.handlePlayerHit(fighter);
        }
    }

    handlePlayerEnemyCollision(player, enemy) {
        if (!enemy.active || !player.active) return;
        enemy.destroy();

        this.scene.cameras.main.shake(300, 0.01);
        if (this.scene.handlePlayerHit) {
            this.scene.handlePlayerHit(player);
        } else {
            this.scene.events.emit('playerHit');
        }
    }
}
