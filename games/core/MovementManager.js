
export function createMobileControls(scene) {
    const mobileInput = { left: false, right: false, up: false, down: false, action: false, justAction: false };

    // Only setup if touch is supported OR screen is very small (mobile size)
    const isMobileSize = scene.cameras.main.width <= 600 || window.innerWidth <= 600;
    if (!scene.sys.game.device.input.touch && !isMobileSize && scene.sys.game.device.os.desktop) return mobileInput;

    // Add extra pointer to support multi-touch (e.g., move + jump)
    scene.input.addPointer(2);

    const width = scene.cameras.main.width;
    const height = scene.cameras.main.height;

    // Visual styles for on-screen buttons
    const createButton = (x, y, label, key) => {
        const btn = scene.add.circle(x, y, 40, 0xffffff, 0.2)
            .setScrollFactor(0)
            .setInteractive()
            .setDepth(1000); // Ensure they're on top of everything

        const text = scene.add.text(x, y, label, { font: 'bold 24px Arial', fill: '#ffffff' })
            .setOrigin(0.5)
            .setScrollFactor(0)
            .setDepth(1001);

        btn.on('pointerdown', () => {
            btn.setAlpha(0.5);
            mobileInput[key] = true;
            if (key === 'action') mobileInput.justAction = true;
        });
        btn.on('pointerup', () => {
            btn.setAlpha(0.2);
            mobileInput[key] = false;
        });
        btn.on('pointerout', () => {
            btn.setAlpha(0.2);
            mobileInput[key] = false;
        });

        return btn;
    };

    // D-Pad (Left side)
    const padX = 80;
    const padY = height - 80;
    createButton(padX - 50, padY, '←', 'left');
    createButton(padX + 50, padY, '→', 'right');
    createButton(padX, padY - 50, '↑', 'up');
    createButton(padX, padY + 50, '↓', 'down');

    // Action Button (Right side)
    createButton(width - 80, height - 80, 'A', 'action');

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

        // Use the standalone helper
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

        // Reset just action flag after update is processed
        this.mobileInput.justAction = false;
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
            }
        }
    }

    handleRacingMovement(speed, jumpForce) {
        // In racing, 'speed' is often handled by the background scroll, 
        // but player can move within the screen.
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

        // Jump capability in racing!
        const isGrounded = !this.isJumping; // Simple racing jump
        if ((Phaser.Input.Keyboard.JustDown(this.wasd.space) || this.mobileInput.justAction) && isGrounded) {
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
