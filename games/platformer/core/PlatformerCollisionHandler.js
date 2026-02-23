
export default class CollisionHandler {
    constructor(scene) {
        this.scene = scene;
    }

    setup(player, staticPlatforms, movingPlatforms, hazards, collectibles, goal) {
        // Player vs Platforms
        this.scene.physics.add.collider(player, staticPlatforms);
        this.scene.physics.add.collider(player, movingPlatforms, (p, m) => {
            // Logic to move player with platform
            if (p.body.touching.down && m.body.touching.up) {
                // Phaser's internal physics handles this partially, 
                // but we can add friction or direct velocity if needed.
            }
        });

        // Player vs Hazards
        this.scene.physics.add.overlap(player, hazards, this.handleHazardCollision, null, this);

        // Player vs Collectibles
        this.scene.physics.add.overlap(player, collectibles, this.handleItemCollision, null, this);

        // Player vs Goal
        if (goal) {
            this.scene.physics.add.overlap(player, goal, this.handleGoalCollision, null, this);
        }

        // Player vs Math Labels
        if (this.scene.platforms.labels) {
            this.scene.physics.add.overlap(player, this.scene.platforms.labels, this.handleLabelOverlap, null, this);
        }
    }

    handleLabelOverlap(player, label) {
        if (this.scene.handleLabelOverlap) {
            this.scene.handleLabelOverlap(label);
        }
    }

    handleGoalCollision(player, goal) {
        this.scene.handleWin();
    }

    handleHazardCollision(player, hazard) {
        this.scene.handleDeath();
    }

    handleItemCollision(player, item) {
        this.scene.collectItem(player, item);
    }
}
