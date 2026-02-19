
import * as Phaser from 'phaser';
import GridManager from './GridManager';
import EnvironmentManager from '../../core/EnvironmentManager';
import JuiceManager from '../../core/JuiceManager';

export default class BasePuzzle extends Phaser.Scene {
    constructor() {
        super({ key: 'BasePuzzle' });
    }

    init(config) {
        const defaults = {
            grid: {
                width: 8,
                height: 8,
                tileSize: 60,
                types: 5
            },
            type: 'match-3', // 'match-3' or 'sokoban'
            background: 'background/space-Background-3.png',
            vibe: 'neon'
        };

        this.gameConfig = {
            ...defaults,
            ...config,
            grid: { ...defaults.grid, ...(config.grid || {}) }
        };

        this.isGameOver = false;
        this.score = 0;
        this.moves = config.moves || 20;
    }

    preload() {
        console.log('BasePuzzle: preload start');
        const assetsBase = '/assets/';
        if (this.gameConfig.background) this.load.image('background', assetsBase + this.gameConfig.background);

        // Load puzzle assets using existing shooter assets as fallbacks
        const fallbacks = [
            'bullets/light_bullet.png', // Corrected
            'bullets/bullet_1.png',      // Fallback for blue
            'bullets/red_bullet.png',   // Corrected
            'spaceship/small.drone_.1_0.PNG',
            'spaceship/ship5.png',
            'spaceship/ship7.png'
        ];

        for (let i = 1; i <= 6; i++) {
            this.load.image(`tile_${i}`, assetsBase + fallbacks[i - 1]);
        }
        this.load.image('particle', assetsBase + 'bullets/light_bullet.png'); // Corrected

        this.load.on('loaderror', (file) => {
            console.error('BasePuzzle: Load error', file.src);
        });
    }

    create() {
        console.log('BasePuzzle: create start');
        // Background
        // Background
        this.bg = this.add.tileSprite(400, 300, 800, 600, 'background').setScrollFactor(0);

        // Systems
        this.environment = new EnvironmentManager(this);
        this.environment.applyVibe(this.gameConfig.vibe);
        this.juice = new JuiceManager(this);

        this.grid = new GridManager(this);

        // UI
        this.createUI();

        // Input
        this.input.on('pointerdown', this.onPointerDown, this);
        this.keys = this.input.keyboard.addKeys({ reset: 'R' });
    }

    createUI() {
        this.scoreText = this.add.text(20, 20, 'SCORE: 0', { font: 'bold 24px monospace', fill: '#00ffff' }).setScrollFactor(0);
        this.movesText = this.add.text(20, 50, `MOVES: ${this.moves}`, { font: 'bold 24px monospace', fill: '#ff00ff' }).setScrollFactor(0);

        if (this.gameConfig.type === 'sokoban') {
            this.movesText.setText('PUSHES: 0');
        }
    }

    onPointerDown(pointer) {
        if (this.isGameOver) return;
        this.grid.handleClick(pointer);
    }

    update() {
        if (this.isGameOver) {
            if (this.keys.reset.isDown) this.scene.restart();
            return;
        }

        this.bg.tilePositionX += 0.2;
    }

    updateScore(amount) {
        this.score += amount;
        this.scoreText.setText(`SCORE: ${this.score}`);
        if (this.juice) this.juice.shake(100, 0.01);
    }

    useMove() {
        if (this.gameConfig.type === 'match-3') {
            this.moves--;
            this.movesText.setText(`MOVES: ${this.moves}`);
            if (this.moves <= 0) this.handleGameOver();
        } else {
            this.score++; // In Sokoban, score is often steps/pushes
            this.movesText.setText(`PUSHES: ${this.score}`);
        }
    }

    handleGameOver() {
        this.isGameOver = true;
        this.add.text(400, 300, 'LEVEL COMPLETE\nPress R to Restart', {
            font: 'bold 40px monospace',
            fill: '#ffffff',
            align: 'center'
        }).setOrigin(0.5).setScrollFactor(0);
    }
}
