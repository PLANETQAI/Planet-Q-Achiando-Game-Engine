
/**
 * Standalone helper to bridge React MobileControls with Phaser state.
 */
export function createMobileControls(scene) {
    const mobileInput = { left: false, right: false, up: false, down: false, action: false, justAction: false };

    // Listen for events from the React layer via the Scene's event bus
    scene.events.on('vibe-mobile-action', (action) => {
        if (action === 'left') {
            mobileInput.left = true;
            // Clear opposite
            mobileInput.right = false;
        } else if (action === 'right') {
            mobileInput.right = true;
            mobileInput.left = false;
        } else if (action === 'up') {
            mobileInput.up = true;
            mobileInput.down = false;
        } else if (action === 'down') {
            mobileInput.down = true;
            mobileInput.up = false;
        } else if (action === 'fire' || action === 'jump' || action === 'action') {
            mobileInput.action = true;
            mobileInput.justAction = true;
        } else if (action === 'hold-left') {
            mobileInput.left = true;
        } else if (action === 'release-left') {
            mobileInput.left = false;
        } else if (action === 'hold-right') {
            mobileInput.right = true;
        } else if (action === 'release-right') {
            mobileInput.right = false;
        }
    });

    return mobileInput;
}

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

        // Use the event-based bridge
        this.mobileInput = createMobileControls(this.scene);
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

        // Reset just action flag and discrete taps after update is processed
        if (this.mobileInput.justAction) {
            this.mobileInput.justAction = false;
            // For discrete D-Pad taps that aren't 'hold' events, clear them
            if (!this.scene.input.pointer1.isDown) {
                this.mobileInput.up = false;
                this.mobileInput.down = false;
                this.mobileInput.left = false;
                this.mobileInput.right = false;
            }
        }
    }

    handle4WayMovement(speed) {
        let vx = 0;
        let vy = 0;

        if (this.cursors.left.isDown || this.wasd.left.isDown || this.mobileInput.left) vx = -speed;
        else if (this.cursors.right.isDown || this.wasd.right.isDown || this.mobileInput.right) vx = speed;

        if (this.cursors.up.isDown || this.wasd.up.isDown || this.mobileInput.up) vy = -speed;
        else if (this.cursors.down.isDown || this.wasd.down.isDown || this.mobileInput.down) vy = speed;

        this.entity.setVelocity(vx, vy);
    }

    handle2WayHorizontal(speed) {
        if (this.cursors.left.isDown || this.wasd.left.isDown || this.mobileInput.left) {
            this.entity.setVelocityX(-speed);
        } else if (this.cursors.right.isDown || this.wasd.right.isDown || this.mobileInput.right) {
            this.entity.setVelocityX(speed);
        } else {
            this.entity.setVelocityX(0);
        }
    }

    handlePlatformerMovement(speed, jumpForce) {
        // Horizontal
        if (this.cursors.left.isDown || this.wasd.left.isDown || this.mobileInput.left) {
            this.entity.setVelocityX(-speed);
            this.entity.flipX = true;
        } else if (this.cursors.right.isDown || this.wasd.right.isDown || this.mobileInput.right) {
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

        if (Phaser.Input.Keyboard.JustDown(this.cursors.up) || Phaser.Input.Keyboard.JustDown(this.wasd.up) || Phaser.Input.Keyboard.JustDown(this.wasd.space) || this.mobileInput.justAction) {
            if (isGrounded || this.jumpCount < this.maxJumps) {
                this.entity.setVelocityY(jumpForce);
                this.jumpCount++;
                this.mobileInput.justAction = false;
            }
        }
    }

    handleRacingMovement(speed, jumpForce) {
        const handling = this.config.handling || speed;

        if (this.cursors.left.isDown || this.wasd.left.isDown || this.mobileInput.left) {
            this.entity.setVelocityX(-handling);
            this.entity.setAngle(-15);
        } else if (this.cursors.right.isDown || this.wasd.right.isDown || this.mobileInput.right) {
            this.entity.setVelocityX(handling);
            this.entity.setAngle(15);
        } else {
            this.entity.setVelocityX(0);
            this.entity.setAngle(0);
        }

        if (this.cursors.up.isDown || this.wasd.up.isDown || this.mobileInput.up) {
            this.entity.setVelocityY(-handling);
        } else if (this.cursors.down.isDown || this.wasd.down.isDown || this.mobileInput.down) {
            this.entity.setVelocityY(handling);
        } else {
            this.entity.setVelocityY(0);
        }

        const isGrounded = !this.isJumping;
        if ((Phaser.Input.Keyboard.JustDown(this.wasd.space) || this.mobileInput.justAction) && isGrounded) {
            this.isJumping = true;
            this.mobileInput.justAction = false;
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
