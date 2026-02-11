
export default class CollisionHandler {
    constructor(scene) {
        this.scene = scene;
    }

    setup(player, enemies, projectiles) {
        this.scene.physics.add.collider(projectiles, enemies, this.handleBulletEnemyCollision, null, this);
        this.scene.physics.add.collider(player, enemies, this.handlePlayerEnemyCollision, null, this);
    }

    handleBulletEnemyCollision(projectile, enemy) {
        // Create a visual "hit" effect
        const x = enemy.x;
        const y = enemy.y;

        projectile.setActive(false);
        projectile.setVisible(false);
        projectile.destroy();

        // Burning Emoji Effect
        const fire = this.scene.add.text(x, y, '🔥', { fontSize: '32px' }).setOrigin(0.5);
        this.scene.tweens.add({
            targets: fire,
            scale: 2,
            alpha: 0,
            duration: 400,
            onComplete: () => fire.destroy()
        });

        // Check for special "pop" effects (shrapnel/explosions)
        const explodeConfig = this.scene.gameConfig.spawn?.explosion;
        if (explodeConfig && !projectile.isShrapnel) {
            this.scene.weapons.burst(x, y, explodeConfig.count || 8, {
                asset: explodeConfig.asset || 'bullet_light',
                bulletSpeed: explodeConfig.speed || 300,
                scale: explodeConfig.scale || 0.3
            });
        }

        enemy.destroy();

        // Screen shake
        this.scene.cameras.main.shake(150, 0.008);

        if (this.scene.addScore) {
            this.scene.addScore(100);
        }
    }

    handlePlayerEnemyCollision(player, enemy) {
        enemy.destroy();

        // Damage feedback
        this.scene.cameras.main.flash(200, 255, 0, 0);
        this.scene.cameras.main.shake(300, 0.01);

        // Trigger player damage
        this.scene.events.emit('playerHit');
    }
}
