
export default class JuiceManager {
    constructor(scene) {
        this.scene = scene;
        this.emitters = new Map();
    }

    /**
     * Professional Screen Shake
     * @param {number} duration 
     * @param {number} intensity 
     */
    shake(duration = 200, intensity = 0.01) {
        this.scene.cameras.main.shake(duration, intensity);
    }

    /**
     * Hit-Stop effect (time freeze)
     * @param {number} duration 
     */
    hitStop(duration = 50) {
        this.scene.physics.world.pause();
        this.scene.time.delayedCall(duration, () => {
            if (this.scene && this.scene.physics) {
                this.scene.physics.world.resume();
            }
        });
    }

    /**
     * Flash effect for hit feedback
     * @param {Phaser.GameObjects.Sprite} target 
     * @param {number} duration 
     * @param {number} color 
     */
    flash(target, duration = 100, color = 0xffffff) {
        if (!target) return;
        target.setTintFill(color);
        this.scene.time.delayedCall(duration, () => {
            if (target.active) target.clearTint();
        });
    }

    /**
     * Create/Get a particle emitter
     * @param {string} key 
     * @param {string} texture 
     * @param {object} config 
     */
    addEmitter(key, texture, config) {
        const emitter = this.scene.add.particles(0, 0, texture, config);
        emitter.setDepth(50);
        this.emitters.set(key, emitter);
        return emitter;
    }

    /**
     * Play an explosion at a position
     * @param {number} x 
     * @param {number} y 
     * @param {string} type 'sparks' | 'fire' | 'shrapnel'
     */
    explode(x, y, type = 'sparks') {
        let texture = 'bullet_light';
        let config = {};

        switch (type) {
            case 'sparks':
                config = {
                    speed: { min: 100, max: 200 },
                    angle: { min: 0, max: 360 },
                    scale: { start: 0.4, end: 0 },
                    lifespan: 400,
                    gravityY: 400,
                    blendMode: 'ADD',
                    quantity: 12
                };
                break;
            case 'fire':
                texture = 'bullet_light';
                config = {
                    speed: { min: 50, max: 150 },
                    angle: { min: 0, max: 360 },
                    scale: { start: 0.8, end: 0 },
                    alpha: { start: 1, end: 0 },
                    lifespan: 600,
                    tint: [0xff4400, 0xff8800, 0xffff00],
                    label: 'fire',
                    quantity: 15
                };
                break;
            case 'shrapnel':
                texture = 'bullet_blue';
                config = {
                    speed: { min: 200, max: 500 },
                    angle: { min: 0, max: 360 },
                    scale: { start: 0.3, end: 0.1 },
                    lifespan: 300,
                    quantity: 8
                };
                break;
        }

        const emitter = this.scene.add.particles(x, y, texture, {
            ...config,
            emitting: false
        });
        emitter.setDepth(60);
        emitter.explode(config.quantity || 10);

        this.scene.time.delayedCall(1000, () => emitter.destroy());
    }

    /**
     * Muzzle Flash Effect
     * @param {number} x 
     * @param {number} y 
     * @param {number} angle 
     */
    muzzleFlash(x, y, angle = 0) {
        const flash = this.scene.add.circle(x, y, 15, 0xffff99, 0.8);
        flash.setDepth(110);
        this.scene.tweens.add({
            targets: flash,
            scale: 2,
            alpha: 0,
            duration: 80,
            onComplete: () => flash.destroy()
        });
    }
}
