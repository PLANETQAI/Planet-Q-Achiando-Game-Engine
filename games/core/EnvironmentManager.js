

export default class EnvironmentManager {
    constructor(scene) {
        this.scene = scene;
        this.effects = new Map();
        this.currentVibe = null;
    }

    applyVibe(vibe) {
        if (!vibe || this.currentVibe === vibe) return;

        // Cleanup old vibe if transitioning
        if (this.currentVibe) {
            this.scene.cameras.main.fadeOut(500, 0, 0, 0, (camera, progress) => {
                if (progress === 1) {
                    this.clearEffects();
                    this.setupVibe(vibe);
                    this.scene.cameras.main.fadeIn(500);
                }
            });
        } else {
            this.setupVibe(vibe);
        }

        this.currentVibe = vibe;
    }

    setupVibe(vibe) {
        switch (vibe) {
            case 'rainy-cyber':
                this.createRain();
                this.createBloom(0x66ffff, 0.3);
                break;
            case 'snow':
                this.createSnow();
                this.createBloom(0xffffff, 0.5);
                break;
            case 'fire':
                this.createFire();
                this.createBloom(0xff4400, 0.4);
                break;
            case 'sunny':
                this.createSunny();
                break;
            case 'neon':
                this.createBloom(0xff00ff, 0.5);
                break;
            case 'foggy':
                this.createFog();
                break;
        }
    }

    createRain() {
        const rain = this.scene.add.particles(0, 0, 'bullet_light', {
            x: { min: 0, max: 800 },
            y: -10,
            lifespan: 2000,
            speedY: { min: 400, max: 600 },
            speedX: { min: -50, max: -20 },
            scale: { start: 0.1, end: 0.05 },
            alpha: { start: 0.2, end: 0.05 },
            quantity: 1,
            blendMode: 'ADD'
        });
        rain.setDepth(10);
        this.effects.set('rain', rain);
    }

    createSnow() {
        const snow = this.scene.add.particles(0, 0, 'bullet_light', {
            x: { min: 0, max: 800 },
            y: -10,
            lifespan: 4000,
            speedY: { min: 50, max: 150 },
            speedX: { min: -20, max: 20 },
            scale: { start: 0.15, end: 0.08 },
            alpha: { start: 0.3, end: 0.1 },
            quantity: 1,
            tint: 0xffffff
        });
        snow.setDepth(10);
        this.effects.set('snow', snow);
        this.scene.cameras.main.setTint(0xf0f0ff);
    }

    createFire() {
        const fire = this.scene.add.particles(0, 600, 'bullet_light', {
            x: { min: 0, max: 800 },
            y: 610,
            lifespan: 1500,
            speedY: { min: -200, max: -400 },
            speedX: { min: -30, max: 30 },
            scale: { start: 0.4, end: 0 },
            alpha: { start: 0.6, end: 0 },
            quantity: 3,
            blendMode: 'ADD',
            tint: [0xff4400, 0xff8800, 0xffff00]
        });
        fire.setDepth(10);
        this.effects.set('fire', fire);

        // Heat Haze effect (Simulated with camera shake)
        this.scene.time.addEvent({
            delay: 100,
            callback: () => { if (this.currentVibe === 'fire') this.scene.cameras.main.shake(100, 0.001); },
            loop: true
        });
    }

    createSunny() {
        this.scene.cameras.main.clearTint();
        this.scene.cameras.main.setPostPipeline(undefined);
        // Instead of solid sky blue, just a very light yellow tint to the scene
        this.scene.cameras.main.setTint(0xffffcc);

        const sun = this.scene.add.circle(700, 100, 40, 0xffff99, 0.4);
        sun.setScrollFactor(0);
        sun.setDepth(1);
        this.effects.set('sun', sun);
    }

    createBloom(color = 0x66ffff, intensity = 1) {
        if (this.scene.cameras.main.postFX) {
            this.scene.cameras.main.postFX.addBloom(color, 1, 1, 1, 1.2 * intensity);
        }
    }

    createFog() {
        const fog = this.scene.add.rectangle(400, 300, 800, 600, 0x111111, 0.3);
        fog.setDepth(5);
        this.scene.tweens.add({
            targets: fog,
            alpha: { from: 0.2, to: 0.4 },
            duration: 3000,
            yoyo: true,
            loop: -1
        });
        this.effects.set('fog', fog);
    }

    createVignette() {
        const vignette = this.scene.add.graphics();
        vignette.fillStyle(0x000000, 0);
        vignette.fillRect(0, 0, 800, 600);

        // Simple vignette: darker at the edges
        const rect = new Phaser.Geom.Rectangle(0, 0, 800, 600);
        this.effects.set('vignette', vignette);

        // Actually using a simpler approach for performance: a huge dark rectangle with a central hole might be heavy, 
        // so let's use a sprite or a gradient if available. 
        // Removing flat dark overlay as it affects background image opacity
        // const overlay = this.scene.add.rectangle(400, 300, 800, 600, 0x000000, 0.5);
        // overlay.setDepth(20);
        // overlay.setScrollFactor(0);
        // this.effects.set('vignette_overlay', overlay);
    }

    updateByLevel(level, sequence) {
        if (!sequence) return;
        const entry = sequence.find(s => s.level === level);
        if (entry) {
            this.applyVibe(entry.vibe);
        }
    }

    update() {
        // Frame updates
    }

    clearEffects() {
        this.effects.forEach(effect => {
            if (effect.destroy) effect.destroy();
        });
        this.effects.clear();
        this.scene.cameras.main.clearTint();
        if (this.scene.cameras.main.postFX) {
            this.scene.cameras.main.postFX.clear();
        }
    }

    destroy() {
        this.clearEffects();
    }
}
