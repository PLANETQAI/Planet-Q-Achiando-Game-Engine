
export default class MovementManager {
    constructor(scene, entity) {
        this.scene = scene;
        this.entity = entity;
        this.config = entity.config || scene.gameConfig.player || {};

        const scheme = this.config.controls || 'ARROWS';

        if (scheme === 'WASD') {
            this.wasd = scene.input.keyboard.addKeys({
                up: Phaser.Input.Keyboard.KeyCodes.W,
                down: Phaser.Input.Keyboard.KeyCodes.S,
                left: Phaser.Input.Keyboard.KeyCodes.A,
                right: Phaser.Input.Keyboard.KeyCodes.D,
                space: Phaser.Input.Keyboard.KeyCodes.SPACE
            });
            this.cursors = this.wasd;
        } else {
            this.cursors = scene.input.keyboard.addKeys({
                up: Phaser.Input.Keyboard.KeyCodes.UP,
                down: Phaser.Input.Keyboard.KeyCodes.DOWN,
                left: Phaser.Input.Keyboard.KeyCodes.LEFT,
                right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
                space: Phaser.Input.Keyboard.KeyCodes.SPACE
            });
            this.wasd = this.cursors;
        }

        this.isJumping = false;
        this.jumpCount = 0;
        this.maxJumps = this.config.maxJumps || 1;
    }

    update(mode = '4way', speedMultiplier = 1) {
        if (!this.entity || !this.entity.active) return;

        const speed = (this.config.speed || 300) * speedMultiplier;
        const jumpForce = this.config.jumpForce || -600;

        switch (mode) {
            case '4way':
                this.handle4WayMovement(speed);
                break;
            case '2way-horizontal':
                this.handle2WayHorizontal(speed);
                break;
            case 'platformer':
                this.handlePlatformerMovement(speed, jumpForce);
                break;
            case 'racing':
                this.handleRacingMovement(speed, jumpForce);
                break;
        }
    }

    handle4WayMovement(speed) {
        let vx = 0;
        let vy = 0;

        if (this.cursors.left.isDown || this.wasd.left.isDown) vx = -speed;
        else if (this.cursors.right.isDown || this.wasd.right.isDown) vx = speed;

        if (this.cursors.up.isDown || this.wasd.up.isDown) vy = -speed;
        else if (this.cursors.down.isDown || this.wasd.down.isDown) vy = speed;

        this.entity.setVelocity(vx, vy);
    }

    handle2WayHorizontal(speed) {
        if (this.cursors.left.isDown || this.wasd.left.isDown) {
            this.entity.setVelocityX(-speed);
        } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
            this.entity.setVelocityX(speed);
        } else {
            this.entity.setVelocityX(0);
        }
    }

    handlePlatformerMovement(speed, jumpForce) {
        // Horizontal
        if (this.cursors.left.isDown || this.wasd.left.isDown) {
            this.entity.setVelocityX(-speed);
            this.entity.flipX = true;
        } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
            this.entity.setVelocityX(speed);
            this.entity.flipX = false;
        } else {
            this.entity.setVelocityX(0);
        }

        // Jump
        const isGrounded = this.entity.body.blocked.down || this.entity.body.touching.down;

        if (isGrounded) {
            this.jumpCount = 0;
        }

        if (Phaser.Input.Keyboard.JustDown(this.cursors.up) || Phaser.Input.Keyboard.JustDown(this.wasd.up) || Phaser.Input.Keyboard.JustDown(this.wasd.space)) {
            if (isGrounded || this.jumpCount < this.maxJumps) {
                this.entity.setVelocityY(jumpForce);
                this.jumpCount++;
            }
        }
    }

    handleRacingMovement(speed, jumpForce) {
        // In racing, 'speed' is often handled by the background scroll, 
        // but player can move within the screen.
        const handling = this.config.handling || speed;

        if (this.cursors.left.isDown || this.wasd.left.isDown) {
            this.entity.setVelocityX(-handling);
            this.entity.setAngle(-15);
        } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
            this.entity.setVelocityX(handling);
            this.entity.setAngle(15);
        } else {
            this.entity.setVelocityX(0);
            this.entity.setAngle(0);
        }

        if (this.cursors.up.isDown || this.wasd.up.isDown) {
            this.entity.setVelocityY(-handling);
        } else if (this.cursors.down.isDown || this.wasd.down.isDown) {
            this.entity.setVelocityY(handling);
        } else {
            this.entity.setVelocityY(0);
        }

        // Jump capability in racing!
        const isGrounded = !this.isJumping; // Simple racing jump
        if (Phaser.Input.Keyboard.JustDown(this.wasd.space) && isGrounded) {
            this.isJumping = true;
            this.scene.tweens.add({
                targets: this.entity,
                scale: this.entity.scale * 1.5,
                duration: 400,
                yoyo: true,
                onComplete: () => { this.isJumping = false; }
            });
        }
    }
}
