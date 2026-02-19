import * as Phaser from 'phaser';
import WeaponSystem from './FighterWeaponSystem';
import SpawnManager from '../../shooter/core/SpawnManager';
import CollisionHandler from './FighterCollisionHandler';
import EnvironmentManager from '../../core/EnvironmentManager';
import JuiceManager from '../../core/JuiceManager';
import MovementManager from '../../core/MovementManager';

export default class BaseFighter extends Phaser.Scene {
    constructor() {
        super({ key: 'BaseFighter' });
    }

    init(config) {
        const defaults = {
            player: { speed: 400, jumpForce: -700, asset: 'shooter/cyber-city/cyborg-non-shooting-transparent.png', scale: 0.5, hp: 10, maxJumps: 2, team: 'alpha', controls: 'WASD' },
            weapon: { fireRate: 400, type: 'melee', asset: 'bullet_light', scale: 1.5 },
            spawn: { type: 'chaos', count: 5, spacing: 100, asset: 'shooter/cyber-city/drone-non-shooting-transparent.png', scale: 0.4 },
            background: 'background/cyborg-city.png',
            levelThreshold: 15,
            vibe: 'rainy-cyber'
        };

        this.gameConfig = {
            ...defaults,
            ...config,
            player: { ...defaults.player, ...(config.player || {}) },
            weapon: { ...defaults.weapon, ...(config.weapon || {}) },
            spawn: { ...defaults.spawn, ...(config.spawn || {}) }
        };

        // Support for multiple fighters from config
        this.fighterConfigs = config.fighters || [this.gameConfig.player];

        this.isGameOver = false;
        this.score = 0;
        this.level = 1;
        this.enemiesDefeated = 0;
        this.combo = 0;
        this.lastHitTime = 0;
    }

    preload() {
        const assetsBase = '/assets/';
        if (this.gameConfig.background) this.load.image('background', assetsBase + this.gameConfig.background);
        if (this.gameConfig.skyBackground) this.load.image('skyBg', assetsBase + this.gameConfig.skyBackground);

        // Load all unique fighter assets
        const playerAssets = new Set();
        this.fighterConfigs.forEach(f => {
            if (f.asset) playerAssets.add(f.asset);
        });
        playerAssets.forEach(asset => this.load.image(asset, assetsBase + asset));

        if (this.gameConfig.spawn?.asset) {
            const spawnAssets = Array.isArray(this.gameConfig.spawn.asset) ? this.gameConfig.spawn.asset : [this.gameConfig.spawn.asset];
            spawnAssets.forEach(a => this.load.image(a, assetsBase + a));
        }

        this.load.image('bullet_light', assetsBase + 'bullets/light_bullet.png');
        this.load.image('bullet_blue', assetsBase + 'bullets/bulet_3.png');
    }

    create() {
        // Background Layers (Parallax)
        if (this.textures.exists('skyBg')) {
            this.skyBg = this.add.tileSprite(400, 300, 800, 600, 'skyBg');
            const skyTex = this.textures.get('skyBg').getSourceImage();
            this.skyBg.setTileScale(Math.max(800 / skyTex.width, 600 / skyTex.height));
            this.skyBg.setScrollFactor(0.2); // Slower
        }

        this.bg = this.add.tileSprite(400, 300, 800, 600, 'background');
        const bgTex = this.textures.get('background').getSourceImage();
        this.bg.setTileScale(Math.max(800 / bgTex.width, 600 / bgTex.height));
        this.bg.setDepth(-10);

        // Systems
        this.environment = new EnvironmentManager(this);
        this.environment.applyVibe(this.gameConfig.vibe);

        this.weapons = new WeaponSystem(this);
        this.spawner = new SpawnManager(this);
        this.collisions = new CollisionHandler(this);

        // Fighters group
        this.fighters = this.physics.add.group();
        this.physics.world.gravity.y = 1200; // Fight weight

        this.fighterConfigs.forEach((fConfig, index) => {
            const x = 200 + (index * 400); // Wide start for Versus
            const y = 400;
            const fighter = this.physics.add.sprite(x, y, fConfig.asset || 'player');
            fighter.setScale(fConfig.scale || this.gameConfig.player.scale);
            fighter.setCollideWorldBounds(true);
            fighter.body.setAllowGravity(true);
            fighter.body.setDragX(1000); // Friction for "Grounded" feel
            fighter.setDepth(100);
            fighter.body.onWorldBounds = true;

            // Custom properties
            fighter.hp = fConfig.hp || 10;
            fighter.maxHp = fighter.hp;
            fighter.index = index;
            fighter.team = fConfig.team || 'alpha';
            fighter.config = fConfig;

            // State
            fighter.isHitStunned = false;
            fighter.isAttacking = false;
            fighter.isBlocking = false;
            fighter.isDashing = false;
            fighter.lastTapTime = 0;
            fighter.lastTapKey = null;
            fighter.comboStep = 0;
            fighter.lastAttackTime = 0;
            fighter.attackCharge = 0;
            fighter.isCharging = false;
            fighter.meter = 0;
            fighter.maxMeter = 100;

            // Movement Manager per fighter
            fighter.movement = new MovementManager(this, fighter);
            // We'll need to update MovementManager to respect the control scheme
            // For now we assume fConfig.controls exists: 'WASD', 'ARROWS', etc.

            this.fighters.add(fighter);

            // First fighter is "primary" for camera and legacy compat
            if (index === 0) this.player = fighter;
        });

        // Custom depth state
        this.stageDepth = 1.0;
        this.minDepth = 0.5;
        this.maxDepth = 2.0;

        // Collisions
        this.collisions.setup(this.fighters, this.spawner.enemies, this.weapons.projectiles);

        // Physical Collision between fighters (Versus Mode)
        this.physics.add.collider(this.fighters, this.fighters);

        // UI & Juice
        this.juice = new JuiceManager(this);
        this.createUI();

        // Arena Bounding (Versus Mode)
        if (this.fighterConfigs.length > 1) {
            this.physics.world.setBounds(0, 0, 800, 600);
            this.cameras.main.setBounds(0, 0, 800, 600);
        }

        // Spawn Wave
        this.spawner.spawnWave(this.gameConfig.spawn);

        // Wall Bounce Listener
        this.physics.world.on('worldbounds', (body) => {
            const fighter = body.gameObject;
            if (fighter && fighter.isHitStunned && !fighter.hasBounced) {
                const bounceDir = fighter.x < 100 ? 1 : -1;
                fighter.setVelocityX(bounceDir * 600);
                fighter.setVelocityY(-400); // Popup on bounce
                fighter.hasBounced = true;
                if (this.juice) this.juice.shake(100, 0.02);

                // Reset bounce flag after a while
                this.time.delayedCall(500, () => { fighter.hasBounced = false; });
            }
        });

        this.cursors = this.input.keyboard.createCursorKeys();

        // Round Start Sequence
        this.startRoundIntro();
    }

    startRoundIntro() {
        const text = this.add.text(400, 300, 'ROUND 1', {
            font: 'bold 80px monospace',
            fill: '#ffffff',
            stroke: '#ff0000',
            strokeThickness: 8
        }).setOrigin(0.5).setDepth(200).setScale(0);

        this.tweens.add({
            targets: text,
            scale: 1,
            duration: 500,
            ease: 'Back.out',
            onComplete: () => {
                this.time.delayedCall(500, () => {
                    text.setText('FIGHT!');
                    this.cameras.main.flash(500, 255, 0, 0);
                    this.tweens.add({
                        targets: text,
                        alpha: 0,
                        scale: 2,
                        duration: 500,
                        onComplete: () => text.destroy()
                    });
                });
            }
        });
    }

    executeDash(fighter, dir) {
        if (fighter.isDashing || fighter.isHitStunned) return;

        fighter.isDashing = true;
        fighter.setVelocityX(dir * 1200);

        // Dash Ghost/Afterimage effect if we had a list, for now just particles
        if (this.juice) {
            this.juice.explode(fighter.x, fighter.y, 'sparks');
        }

        this.time.delayedCall(200, () => {
            fighter.isDashing = false;
        });
    }

    createUI() {
        this.scoreText = this.add.text(20, 20, 'SCORE: 0', { font: 'bold 20px monospace', fill: '#00ffff' }).setScrollFactor(0);
        this.comboText = this.add.text(400, 100, '', { font: 'bold 40px monospace', fill: '#ffff00' }).setOrigin(0.5).setScrollFactor(0);

        this.fighterUI = [];
        this.fighters.getChildren().forEach((fighter, index) => {
            const x = 580;
            const y = 20 + (index * 40);

            const name = this.add.text(x, y, `P${index + 1} VITALITY`, { font: 'bold 12px monospace', fill: '#ffffff' }).setScrollFactor(0);
            const bg = this.add.rectangle(700, y + 7, 150, 15, 0x333333).setScrollFactor(0);
            const bar = this.add.rectangle(700, y + 7, 150, 15, 0x00ff00).setScrollFactor(0);

            // Meter Bar
            const meterBg = this.add.rectangle(700, y + 20, 150, 8, 0x222222).setScrollFactor(0);
            const meterBar = this.add.rectangle(700, y + 20, 0, 8, 0x00ffff).setScrollFactor(0);

            this.fighterUI.push({ name, bg, bar, meterBg, meterBar });
        });
    }

    update() {
        if (this.isGameOver) return;

        // Update all fighters
        const activeFighters = this.fighters.getChildren().filter(f => f.active);

        activeFighters.forEach(fighter => {
            const controls = fighter.movement.cursors;
            const isGrounded = fighter.body.blocked.down || fighter.body.touching.down;

            if (fighter.isHitStunned || fighter.isBlockStunned) {
                // Apply friction even when stunned
                if (isGrounded) fighter.setVelocityX(fighter.body.velocity.x * 0.9);
                return;
            }

            // 1. Auto-Facing
            if (activeFighters.length === 2 && !fighter.isAttacking) {
                const opponent = activeFighters.find(f => f !== fighter);
                fighter.flipX = (opponent.x < fighter.x);
            }

            // 2. Movement & Blocking
            fighter.isBlocking = controls.down.isDown && isGrounded && !fighter.isAttacking;

            if (!fighter.isAttacking && !fighter.isBlocking) {
                // Horizontal
                if (controls.left.isDown) {
                    fighter.setVelocityX(-(fighter.config.speed || 400));
                    fighter.setAngle(Phaser.Math.Interpolation.Linear([-fighter.angle, -10], 0.1)); // Lean into run
                } else if (controls.right.isDown) {
                    fighter.setVelocityX(fighter.config.speed || 400);
                    fighter.setAngle(Phaser.Math.Interpolation.Linear([fighter.angle, 10], 0.1)); // Lean into run
                } else {
                    fighter.setAngle(Phaser.Math.Interpolation.Linear([fighter.angle, 0], 0.2));
                }

                // Dash Logic (Double Tap)
                const now = this.time.now;
                const tapThreshold = 250;

                if (Phaser.Input.Keyboard.JustDown(controls.left)) {
                    if (fighter.lastTapKey === 'left' && now - fighter.lastTapTime < tapThreshold) {
                        this.executeDash(fighter, -1);
                    }
                    fighter.lastTapKey = 'left';
                    fighter.lastTapTime = now;
                } else if (Phaser.Input.Keyboard.JustDown(controls.right)) {
                    if (fighter.lastTapKey === 'right' && now - fighter.lastTapTime < tapThreshold) {
                        this.executeDash(fighter, 1);
                    }
                    fighter.lastTapKey = 'right';
                    fighter.lastTapTime = now;
                }

                // Jump
                if (Phaser.Input.Keyboard.JustDown(controls.up) && isGrounded) {
                    fighter.setVelocityY(-750);
                    this.createDust(fighter.x, fighter.y + 40);

                    this.tweens.add({
                        targets: fighter,
                        scaleY: fighter.config.scale * 1.4,
                        scaleX: fighter.config.scale * 0.7,
                        duration: 80,
                        yoyo: true
                    });
                }
            }

            // Attack Lunge Dust
            if (fighter.isAttacking && Math.abs(fighter.body.velocity.x) > 100 && isGrounded && Math.random() > 0.7) {
                this.createDust(fighter.x, fighter.y + 40);
            }

            if (fighter.isBlocking) {
                if (!fighter.wasBlocking) {
                    fighter.lastBlockTime = this.time.now;
                }
                fighter.wasBlocking = true;
                fighter.setVelocityX(0);
                fighter.setTint(0x888888);
                fighter.setAngle(0);
            } else {
                fighter.wasBlocking = false;
                fighter.clearTint();
            }

            // 3. Attacks (Combo & Charge System)
            if (controls.space.isDown && !fighter.isBlocking) {
                fighter.isCharging = true;
                fighter.attackCharge += this.sys.game.loop.delta;

                // Charge Visual
                if (fighter.attackCharge > 500) {
                    fighter.setTint(0xffff00);
                    if (Math.random() > 0.8) this.juice.explode(fighter.x, fighter.y, 'sparks');
                }
                fighter.isCharging = false;
                fighter.attackCharge = 0;
                fighter.clearTint();

                // Special / Super Logic
                const isSuper = fighter.meter >= 100 && controls.space.isDown && controls.down.isDown;
                if (isSuper) {
                    fighter.meter = 0;
                    this.weapons.fire(fighter.x, fighter.y, {
                        ...this.gameConfig.weapon,
                        source: fighter,
                        type: 'super',
                        damage: 10
                    });
                } else {
                    this.weapons.fire(fighter.x, fighter.y, {
                        ...this.gameConfig.weapon,
                        source: fighter,
                        isHeavy: isHeavy,
                        isDive: isDive,
                        scale: isHeavy ? (this.gameConfig.weapon.scale * 2) : (isDive ? 1.5 : this.gameConfig.weapon.scale)
                    });
                }
            }

            // 4. Corner Pushback Logic
            const worldBounds = this.physics.world.bounds;
            if (fighter.x < worldBounds.x + 50 || fighter.x > worldBounds.width - 50) {
                if (fighter.isAttacking) {
                    const pushDir = fighter.x < worldBounds.x + 50 ? 1 : -1;
                    fighter.x += pushDir * 5; // Slight force out of corner
                }
            }

        });

        this.checkVictory(activeFighters);

        // 4. Brawler Stage Scroll (Global logic for brawler modes)
        if (this.gameConfig.movementMode === 'stage-scroll') {
            this.handleDepthScaling(activeFighters);
        }

        // 5. Versus Camera
        if (activeFighters.length === 2) {
            const f1 = activeFighters[0];
            const f2 = activeFighters[1];
            const midX = (f1.x + f2.x) / 2;
            const midY = (f1.y + f2.y) / 2;
            const dist = Phaser.Math.Distance.Between(f1.x, f1.y, f2.x, f2.y);

            this.cameras.main.centerOn(midX, midY - 50);
            const zoom = Phaser.Math.Clamp(800 / (dist + 200), 0.8, 1.5);
            this.cameras.main.setZoom(zoom);
        }

        // Combo timeout
        if (this.time.now > this.lastHitTime + 2000) {
            this.combo = 0;
            this.comboText.setText('');
        }

        this.weapons.update();
        this.spawner.update();
        this.environment.update();

        // 5. Environment Update
        if (this.gameConfig.vibe) {
            this.environment.updateByLevel(this.level, this.gameConfig.environmentSequence);
        }
    }

    handleDepthScaling(activeFighters) {
        if (!activeFighters.length) return;

        const scrollSensitivity = 0.005 * this.getSpeedMultiplier();
        let scrollUp = false;
        let scrollDown = false;

        // Check if ANY player is pressing UP/DOWN (WASD) to scale depth
        activeFighters.forEach(fighter => {
            const movement = fighter.movement;
            if (movement.wasd.up.isDown) scrollUp = true;
            if (movement.wasd.down.isDown) scrollDown = true;
        });

        if (scrollUp) {
            this.stageDepth = Math.min(this.maxDepth, this.stageDepth + scrollSensitivity);
            this.bg.tilePositionY += 4 * this.getSpeedMultiplier();
            if (this.skyBg) this.skyBg.tilePositionY += 1 * this.getSpeedMultiplier(); // Slower parallax
        } else if (scrollDown) {
            this.stageDepth = Math.max(this.minDepth, this.stageDepth - scrollSensitivity);
            this.bg.tilePositionY -= 4 * this.getSpeedMultiplier();
            if (this.skyBg) this.skyBg.tilePositionY -= 1 * this.getSpeedMultiplier();
        }

        // Apply depth to background scaling
        this.bg.setTileScale(this.stageDepth * 1.5);

        // Scale enemies based on "depth"
        this.spawner.enemies.getChildren().forEach(enemy => {
            if (!enemy.active) return;
            if (!enemy.baseScale) enemy.baseScale = enemy.scaleX;

            const progress = Phaser.Math.Clamp((enemy.y + 100) / 620, 0, 1);
            const projection = 0.4 + (progress * 0.6);
            enemy.setScale(enemy.baseScale * projection * this.stageDepth);
            enemy.setAlpha(0.7 + (progress * 0.3));

            // Advanced "Inward" movement
            if (scrollUp) {
                enemy.y += 2 * this.getSpeedMultiplier();
            } else if (enemy.y < 520) {
                // Gentle gravity for brawler drones
                enemy.y += 0.5 * this.getSpeedMultiplier();
            }
        });
    }

    addScore(points) {
        this.score += points;
        this.enemiesDefeated++;
        this.scoreText.setText('SCORE: ' + this.score);

        // Combo system
        this.combo++;
        this.lastHitTime = this.time.now;
        if (this.combo > 1) {
            this.comboText.setText(this.combo + ' HIT COMBO!');
            this.tweens.add({ targets: this.comboText, scale: 1.5, duration: 100, yoyo: true });
        }

        if (this.enemiesDefeated >= this.level * this.gameConfig.levelThreshold) {
            this.level++;
            this.cameras.main.flash(500, 255, 255, 255);
        }
    }

    createDust(x, y) {
        const dust = this.add.text(x, y, '💨', { fontSize: '20px' }).setOrigin(0.5);
        this.tweens.add({
            targets: dust,
            alpha: 0,
            y: y - 40,
            scale: 2,
            duration: 400,
            onComplete: () => dust.destroy()
        });
    }

    handlePlayerHit(fighter, damage = 1) {
        if (!fighter || this.isGameOver) return;
        fighter.hp -= damage;
        this.updateHUD();
        this.cameras.main.shake(150, 0.01 + (damage * 0.005));

        if (fighter.hp <= 0) {
            // Victory check in update loop will trigger end
        }
    }

    checkVictory(activeFighters) {
        if (this.isGameOver) return;

        const deadFighter = this.fighters.getChildren().find(f => f.hp <= 0 && f.active);
        if (deadFighter) {
            const winner = this.fighters.getChildren().find(f => f !== deadFighter && f.active);
            this.triggerVictory(winner);
        }
    }

    triggerVictory(winner) {
        this.isGameOver = true;

        // Winner Pose
        if (winner) {
            this.tweens.add({
                targets: winner,
                y: winner.y - 100,
                scaleX: winner.config.scale * 1.5,
                scaleY: winner.config.scale * 1.5,
                duration: 500,
                yoyo: true,
                repeat: -1,
                ease: 'Back.out'
            });
        }

        const winText = this.add.text(400, 300, 'K.O.', {
            font: 'bold 120px monospace',
            fill: '#ff0000',
            stroke: '#ffffff',
            strokeThickness: 12
        }).setOrigin(0.5).setDepth(200);

        this.time.delayedCall(1000, () => {
            winText.setText('WINNER');
            this.cameras.main.flash(1000, 255, 255, 255);

            const subText = this.add.text(400, 420, 'MATCH SET', {
                font: 'bold 40px monospace',
                fill: '#ffffff'
            }).setOrigin(0.5).setDepth(200).setAlpha(0);

            this.tweens.add({ targets: subText, alpha: 1, duration: 500 });
        });
    }

    updateHUD() {
        this.fighters.getChildren().forEach((fighter, index) => {
            if (this.fighterUI[index]) {
                const ui = this.fighterUI[index];
                const percent = Math.max(0, fighter.hp / fighter.maxHp);
                // Meter Progress
                const meterPercent = Math.min(1, fighter.meter / fighter.maxMeter);
                ui.meterBar.width = 150 * meterPercent;
                if (meterPercent >= 1) ui.meterBar.setFillStyle(0xffffff);
                else ui.meterBar.setFillStyle(0x00ffff);

                // Color change based on health
                if (percent < 0.3) ui.bar.setFillStyle(0xff0000);
                else if (percent < 0.6) ui.bar.setFillStyle(0xffff00);
            }
        });
    }

    gameOver() {
        if (this.isGameOver) return;
        this.isGameOver = true;
        this.physics.pause();
        this.scene.restart();
    }

    getSpeedMultiplier() {
        return 1 + (this.level - 1) * 0.1;
    }
}
