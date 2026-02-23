
import * as Phaser from 'phaser';

export default class GridManager {
    constructor(scene) {
        this.scene = scene;
        this.config = scene.gameConfig.grid;
        this.type = scene.gameConfig.type || 'match-3';
        this.tiles = [];
        this.selectedTile = null;
        this.selectionChain = [];
        this.isBusy = false;
        this.isDragging = false;

        // Vowel-heavy alphabet for word games
        this.alphabet = "AAAAABBCCDDDEEEEEEEFFGGGHHIIIIJKLLLLMMNNNNOOOOOOPPQRRRRSSSSTTTTUUUUVVWWXYZ".split('');

        // Graphics for drawing paths/lines
        this.graphics = this.scene.add.graphics();
        this.graphics.setDepth(5);

        this.initGrid();
    }

    initGrid() {
        if (this.type === 'memory-match') {
            this.initMemoryGrid();
        } else if (this.type === 'sliding-puzzle') {
            this.initSlidingGrid();
        } else if (this.type === 'line-connect') {
            this.initLineGrid();
        } else if (this.type === 'word-search') {
            this.initWordSearchGrid();
        } else if (this.type === 'math-cross') {
            this.initMathCrossGrid();
        } else {
            this.initStandardGrid();
        }
    }

    initStandardGrid() {
        const { width, height, tileSize } = this.config;
        const offsetX = (800 - (width * tileSize)) / 2;
        const offsetY = (600 - (height * tileSize)) / 2;

        for (let y = 0; y < height; y++) {
            this.tiles[y] = [];
            for (let x = 0; x < width; x++) {
                this.spawnTile(x, y, offsetX, offsetY, tileSize, null);
            }
        }
    }

    initMemoryGrid() {
        const { width, height, tileSize } = this.config;
        const totalTiles = width * height;
        const pairsNeeded = Math.floor(totalTiles / 2);

        let pool = [];
        for (let i = 0; i < pairsNeeded; i++) {
            const typeValue = (i % this.config.types) + 1;
            pool.push(typeValue, typeValue);
        }
        if (totalTiles % 2 !== 0) pool.push(-1);

        Phaser.Utils.Array.Shuffle(pool);

        const offsetX = (800 - (width * tileSize)) / 2;
        const offsetY = (600 - (height * tileSize)) / 2;

        for (let y = 0; y < height; y++) {
            this.tiles[y] = [];
            for (let x = 0; x < width; x++) {
                const type = pool.pop();
                if (type === -1) {
                    this.tiles[y][x] = null;
                    continue;
                }
                const tileObj = this.spawnTile(x, y, offsetX, offsetY, tileSize, type);
                tileObj.display.setAlpha(0);
                tileObj.isMatched = false;
            }
        }
    }

    initSlidingGrid() {
        const { width, height, tileSize } = this.config;
        const totalTiles = width * height;

        let sequence = Array.from({ length: totalTiles - 1 }, (_, i) => i + 1);
        sequence.push(null);
        Phaser.Utils.Array.Shuffle(sequence);

        const offsetX = (800 - (width * tileSize)) / 2;
        const offsetY = (600 - (height * tileSize)) / 2;

        for (let y = 0; y < height; y++) {
            this.tiles[y] = [];
            for (let x = 0; x < width; x++) {
                const val = sequence.shift();
                if (val === null) {
                    this.emptySlot = { gridX: x, gridY: y };
                    this.tiles[y][x] = null;
                } else {
                    const tileObj = this.spawnTile(x, y, offsetX, offsetY, tileSize, val);
                    tileObj.correctValue = y * width + x + 1;
                }
            }
        }
    }

    initLineGrid() {
        const { width, height, tileSize } = this.config;
        const offsetX = (800 - (width * tileSize)) / 2;
        const offsetY = (600 - (height * tileSize)) / 2;

        this.lineColors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff];
        this.paths = {};
        this.currentLineColor = null;

        for (let y = 0; y < height; y++) {
            this.tiles[y] = [];
            for (let x = 0; x < width; x++) {
                const tileObj = this.spawnTile(x, y, offsetX, offsetY, tileSize, null);
                tileObj.display.setAlpha(0);
                tileObj.nodeColor = null;
            }
        }

        const numPairs = Phaser.Math.Between(3, Math.min(this.lineColors.length, Math.floor(width * height / 3)));
        let availablePositions = [];
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) availablePositions.push({ x, y });
        }
        Phaser.Utils.Array.Shuffle(availablePositions);

        for (let i = 0; i < numPairs; i++) {
            const color = this.lineColors[i];
            const p1 = availablePositions.pop();
            const p2 = availablePositions.pop();

            this.tiles[p1.y][p1.x].nodeColor = color;
            this.tiles[p1.y][p1.x].bg.setFillStyle(color, 1);
            this.tiles[p1.y][p1.x].display.setAlpha(0);

            this.tiles[p2.y][p2.x].nodeColor = color;
            this.tiles[p2.y][p2.x].bg.setFillStyle(color, 1);
            this.tiles[p2.y][p2.x].display.setAlpha(0);

            this.paths[color] = [];
        }
    }

    initWordSearchGrid() {
        const { width, height, tileSize } = this.config;
        const offsetX = (800 - (width * tileSize)) / 2;
        const offsetY = (600 - (height * tileSize)) / 2;
        this.targetWords = (this.scene.gameConfig.words || ["NEON", "CYBER", "GRID", "FLOW", "VIBE", "DATA", "CORE"]).map(w => w.toUpperCase());
        this.foundWords = [];
        for (let y = 0; y < height; y++) {
            this.tiles[y] = [];
            for (let x = 0; x < width; x++) this.spawnTile(x, y, offsetX, offsetY, tileSize, null);
        }
        this.targetWords.forEach(word => {
            let placed = false, attempts = 0;
            while (!placed && attempts < 100) {
                const dx = Phaser.Math.Between(-1, 1), dy = Phaser.Math.Between(-1, 1);
                if (dx === 0 && dy === 0) continue;
                const sx = Phaser.Math.Between(0, width - 1), sy = Phaser.Math.Between(0, height - 1);
                if (this.canPlaceWord(word, sx, sy, dx, dy)) { this.placeWord(word, sx, sy, dx, dy); placed = true; }
                attempts++;
            }
        });
    }

    canPlaceWord(word, x, y, dx, dy) {
        const { width, height } = this.config;
        if (x + dx * (word.length - 1) < 0 || x + dx * (word.length - 1) >= width) return false;
        if (y + dy * (word.length - 1) < 0 || y + dy * (word.length - 1) >= height) return false;
        for (let i = 0; i < word.length; i++) {
            const tile = this.tiles[y + dy * i][x + dx * i];
            if (tile.isReserved && tile.value !== word[i]) return false;
        }
        return true;
    }

    placeWord(word, x, y, dx, dy) {
        for (let i = 0; i < word.length; i++) {
            const tile = this.tiles[y + dy * i][x + dx * i];
            tile.value = word[i]; tile.display.setText(word[i]); tile.isReserved = true;
        }
    }

    initMathCrossGrid() {
        const { tileSize } = this.config;
        const width = 7, height = 7;
        this.config.width = width; this.config.height = height;
        const offsetX = (800 - (width * tileSize)) / 2, offsetY = (600 - (height * tileSize)) / 2;
        const pattern = [
            [0, 1, 3, 1, 0, 2, 0], [1, 4, 1, 4, 1, 4, 1], [3, 1, 0, 1, 0, 2, 0],
            [2, 4, 2, 4, 2, 4, 2], [0, 1, 0, 1, 3, 2, 0], [1, 4, 1, 4, 1, 4, 1],
            [3, 1, 3, 1, 0, 2, 0]
        ];
        const values = [
            [13, '+', 13, '-', 17, '=', 9], ['+', '', '+', '', '+', '', '+'],
            [2, '+', 4, '-', 2, '=', 8], ['=', '', '=', '', '=', '', '='],
            [8, '+', 6, '-', 4, '=', 10], ['-', '', '-', '', '-', '', '-'],
            [7, '+', 7, '-', 4, '=', 10]
        ];
        for (let y = 0; y < height; y++) {
            this.tiles[y] = [];
            for (let x = 0; x < width; x++) {
                const cellType = pattern[y][x];
                if (cellType === 4) { this.tiles[y][x] = null; continue; }
                const forcedVal = values[y][x];
                const tileObj = this.spawnTile(x, y, offsetX, offsetY, tileSize, forcedVal);
                tileObj.cellType = cellType;
                if (cellType === 3) {
                    tileObj.correctValue = forcedVal; tileObj.value = ""; tileObj.display.setText("");
                    tileObj.bg.setFillStyle(0xffff99, 1); tileObj.bg.setStrokeStyle(4, 0x000000); tileObj.display.setColor('#000000');
                } else if (cellType === 0) {
                    tileObj.bg.setFillStyle(0xffffff, 1); tileObj.bg.setStrokeStyle(2, 0x000000); tileObj.display.setColor('#000000');
                } else {
                    tileObj.bg.setFillStyle(0x449999, 1); tileObj.bg.setStrokeStyle(2, 0x000000);
                }
            }
        }
    }

    spawnTile(x, y, offsetX, offsetY, tileSize, forcedValue = null) {
        let value, display;

        const bg = this.scene.add.rectangle(
            offsetX + x * tileSize + tileSize / 2,
            offsetY + y * tileSize + tileSize / 2,
            tileSize * 0.9,
            tileSize * 0.9,
            0x222244, 1
        ).setStrokeStyle(2, 0x00ffff);

        if (this.type === 'word-connect' || this.type === 'word-search' || this.type === 'math-cross') {
            value = forcedValue !== null ? forcedValue : Phaser.Utils.Array.GetRandom(this.alphabet);
            display = this.scene.add.text(bg.x, bg.y, value, { font: 'bold 28px Arial', fill: '#ffffff' }).setOrigin(0.5);
        } else if (this.type === 'number-sum' || this.type === 'sliding-puzzle') {
            value = forcedValue !== null ? forcedValue : Phaser.Math.Between(1, 9);
            display = this.scene.add.text(bg.x, bg.y, value.toString(), { font: 'bold 28px Arial', fill: '#ffffff' }).setOrigin(0.5);
        } else if (this.type === 'memory-match') {
            value = forcedValue;
            display = this.scene.add.sprite(bg.x, bg.y, `tile_${value}`).setScale(tileSize / 100);
            bg.setFillStyle(0x555555, 1);
        } else {
            value = forcedValue !== null ? forcedValue : Phaser.Math.Between(1, this.config.types);
            display = this.scene.add.sprite(bg.x, bg.y, `tile_${value}`).setScale(tileSize / 100);
            bg.setFillStyle(0x000000, 0);
            bg.setStrokeStyle(0, 0x000000, 0);
        }

        const tileObj = { bg, display, value, gridX: x, gridY: y };
        this.tiles[y][x] = tileObj;
        return tileObj;
    }

    handlePointerDown(pointer) {
        if (this.isBusy) return;
        const tile = this.getTileAt(pointer.x, pointer.y);
        if (!tile) return;

        this.isDragging = true;

        if (this.type === 'match-3') {
            this.handleMatch3Interaction(tile);
        } else if (this.type === 'word-connect' || this.type === 'number-sum' || this.type === 'word-search') {
            this.startChain(tile);
        } else if (this.type === 'math-cross') {
            this.handleMathCrossInteraction(tile);
        } else if (this.type === 'memory-match') {
            this.handleMemoryInteraction(tile);
        } else if (this.type === 'sliding-puzzle') {
            this.handleSlidingInteraction(tile);
        } else if (this.type === 'line-connect') {
            if (tile.nodeColor) {
                this.currentLineColor = tile.nodeColor;
                this.clearPath(this.currentLineColor);
                this.paths[this.currentLineColor].push(tile);
                this.drawPaths();
            }
        }
    }

    handlePointerMove(pointer) {
        if (!this.isDragging || this.isBusy) return;
        const tile = this.getTileAt(pointer.x, pointer.y);
        if (!tile) return;

        if (this.type === 'word-connect' || this.type === 'number-sum' || this.type === 'word-search') {
            this.continueChain(tile);
        } else if (this.type === 'line-connect' && this.currentLineColor) {
            this.handleLineDrag(tile);
        }
    }

    handlePointerUp() {
        if (this.type === 'word-connect' || this.type === 'number-sum' || this.type === 'word-search') {
            this.validateChain();
        } else if (this.type === 'line-connect') {
            this.currentLineColor = null;
            this.validateLineConnect();
        }
        this.isDragging = false;
        this.drawPaths();
    }

    getTileAt(x, y) {
        const { tileSize } = this.config;
        const offsetX = (800 - (this.config.width * tileSize)) / 2;
        const offsetY = (600 - (this.config.height * tileSize)) / 2;

        const gridX = Math.floor((x - offsetX) / tileSize);
        const gridY = Math.floor((y - offsetY) / tileSize);

        if (gridX >= 0 && gridX < this.config.width && gridY >= 0 && gridY < this.config.height) {
            return this.tiles[gridY][gridX];
        }
        return null;
    }

    startChain(tile) {
        this.selectionChain = [tile];
        tile.bg.setFillStyle(0x00aaff, 1);
        this.updateChainUI();
    }

    continueChain(tile) {
        if (this.selectionChain.includes(tile)) {
            if (this.selectionChain.length > 1 && this.selectionChain[this.selectionChain.length - 2] === tile) {
                const removed = this.selectionChain.pop();
                if (!removed.isFound) removed.bg.setFillStyle(0x222244, 1);
                this.updateChainUI();
            }
            return;
        }

        const lastTile = this.selectionChain[this.selectionChain.length - 1];
        const dx = Math.abs(tile.gridX - lastTile.gridX);
        const dy = Math.abs(tile.gridY - lastTile.gridY);

        if (this.type === 'word-search' && this.selectionChain.length >= 2) {
            const first = this.selectionChain[0], second = this.selectionChain[1];
            if (tile.gridX === lastTile.gridX + (second.gridX - first.gridX) &&
                tile.gridY === lastTile.gridY + (second.gridY - first.gridY)) {
                this.selectionChain.push(tile); tile.bg.setFillStyle(0x00aaff, 1); this.updateChainUI();
            }
            return;
        }

        if (dx <= 1 && dy <= 1) {
            this.selectionChain.push(tile); tile.bg.setFillStyle(0x00aaff, 1); this.updateChainUI();
        }
    }

    updateChainUI() {
        let text = "";
        let color = 0xffffff;

        if (this.type === 'word-connect') {
            text = this.selectionChain.map(t => t.value).join('');
        } else if (this.type === 'number-sum') {
            const sum = this.selectionChain.reduce((acc, t) => acc + t.value, 0);
            text = this.selectionChain.map(t => t.value).join(' + ') + ` = ${sum}`;
            if (sum === 10) color = 0x00ff00;
            else if (sum > 10) color = 0xff0000;
        }

        this.scene.updatePreview(text, color);
        this.drawPaths();
    }

    drawPaths() {
        this.graphics.clear();

        // Draw selection chain for word/number
        if (this.selectionChain.length > 1) {
            this.graphics.lineStyle(8, 0x00aaff, 0.5);
            this.graphics.beginPath();
            this.graphics.moveTo(this.selectionChain[0].bg.x, this.selectionChain[0].bg.y);
            for (let i = 1; i < this.selectionChain.length; i++) {
                this.graphics.lineTo(this.selectionChain[i].bg.x, this.selectionChain[i].bg.y);
            }
            this.graphics.strokePath();
        }

        // Draw Line Connect paths
        if (this.type === 'line-connect') {
            for (const [color, path] of Object.entries(this.paths)) {
                if (path.length > 1) {
                    this.graphics.lineStyle(12, parseInt(color), 0.8);
                    this.graphics.beginPath();
                    this.graphics.moveTo(path[0].bg.x, path[0].bg.y);
                    for (let i = 1; i < path.length; i++) {
                        this.graphics.lineTo(path[i].bg.x, path[i].bg.y);
                    }
                    this.graphics.strokePath();
                }
            }
        }
    }

    handleLineDrag(tile) {
        if (!this.currentLineColor) return;
        const path = this.paths[this.currentLineColor];
        const lastTile = path[path.length - 1];

        if (tile === lastTile) return;

        const dx = Math.abs(tile.gridX - lastTile.gridX);
        const dy = Math.abs(tile.gridY - lastTile.gridY);
        if (dx + dy !== 1) return;

        if (tile.nodeColor && tile.nodeColor !== this.currentLineColor) return;

        const index = path.indexOf(tile);
        if (index > -1) {
            const removed = path.splice(index + 1);
            removed.forEach(t => t.pathColor = null);
            return;
        }

        if (tile.pathColor && tile.pathColor !== this.currentLineColor) {
            const otherPath = this.paths[tile.pathColor];
            const otherIndex = otherPath.indexOf(tile);
            const removed = otherPath.splice(otherIndex);
            removed.forEach(t => t.pathColor = null);
        }

        path.push(tile);
        tile.pathColor = this.currentLineColor;

        if (tile.nodeColor === this.currentLineColor) {
            this.currentLineColor = null;
            this.validateLineConnect();
        }
        this.drawPaths();
    }

    clearPath(color) {
        if (!this.paths[color]) return;
        this.paths[color].forEach(t => t.pathColor = null);
        this.paths[color] = [];
    }

    validateLineConnect() {
        let allConnected = true;
        let allFilled = true;

        for (const [color, path] of Object.entries(this.paths)) {
            if (path.length < 2 || path[path.length - 1].nodeColor !== parseInt(color)) {
                allConnected = false;
                break;
            }
        }

        if (allConnected) {
            for (let y = 0; y < this.config.height; y++) {
                for (let x = 0; x < this.config.width; x++) {
                    const t = this.tiles[y][x];
                    if (!t.nodeColor && !t.pathColor) {
                        allFilled = false;
                        break;
                    }
                }
                if (!allFilled) break;
            }
        }

        if (allConnected && allFilled) {
            this.scene.updatePreview('PERFECT FLOW!', 0x00ff00);
            this.scene.time.delayedCall(1500, () => this.scene.handleGameOver());
        } else if (allConnected) {
            this.scene.updatePreview('FILL ALL TILES', 0xffff00);
        }
    }

    handleMemoryInteraction(tile) {
        if (tile.isMatched || this.selectionChain.includes(tile)) return;
        tile.bg.setFillStyle(0x222244, 1);
        tile.display.setAlpha(1);
        this.selectionChain.push(tile);

        if (this.selectionChain.length === 2) {
            this.isBusy = true;
            this.scene.time.delayedCall(800, () => this.validateMemoryMatch());
        }
    }

    validateMemoryMatch() {
        const [t1, t2] = this.selectionChain;
        this.scene.useMove();

        if (t1.value === t2.value) {
            t1.isMatched = true; t2.isMatched = true;
            this.scene.updateScore(100);
            this.scene.updatePreview('MATCH!', 0x00ff00);
            this.scene.tweens.add({
                targets: [t1.bg, t1.display, t2.bg, t2.display],
                alpha: 0.5, duration: 300
            });
            if (this.tiles.flat().filter(t => t !== null).every(t => t.isMatched)) {
                this.scene.updatePreview('YOU WIN!', 0x00ff00);
                this.scene.time.delayedCall(1500, () => this.scene.handleGameOver());
            }
        } else {
            t1.bg.setFillStyle(0x555555, 1); t1.display.setAlpha(0);
            t2.bg.setFillStyle(0x555555, 1); t2.display.setAlpha(0);
        }
        this.selectionChain = [];
        this.isBusy = false;
    }

    handleSlidingInteraction(tile) {
        const dx = Math.abs(tile.gridX - this.emptySlot.gridX);
        const dy = Math.abs(tile.gridY - this.emptySlot.gridY);

        if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
            this.isBusy = true;
            this.scene.useMove();
            const { tileSize } = this.config;
            const offsetX = (800 - (this.config.width * tileSize)) / 2;
            const offsetY = (600 - (this.config.height * tileSize)) / 2;
            const targetX = offsetX + this.emptySlot.gridX * tileSize + tileSize / 2;
            const targetY = offsetY + this.emptySlot.gridY * tileSize + tileSize / 2;

            this.scene.tweens.add({
                targets: [tile.bg, tile.display],
                x: targetX, y: targetY, duration: 150,
                onComplete: () => {
                    this.tiles[this.emptySlot.gridY][this.emptySlot.gridX] = tile;
                    this.tiles[tile.gridY][tile.gridX] = null;
                    const ox = tile.gridX, oy = tile.gridY;
                    tile.gridX = this.emptySlot.gridX; tile.gridY = this.emptySlot.gridY;
                    this.emptySlot.gridX = ox; this.emptySlot.gridY = oy;
                    this.validateSlidingPuzzle();
                    this.isBusy = false;
                }
            });
        }
    }

    validateSlidingPuzzle() {
        let isSolved = true;
        const width = this.config.width;
        for (let y = 0; y < this.config.height; y++) {
            for (let x = 0; x < width; x++) {
                const t = this.tiles[y][x];
                if (t === null) {
                    if (y * width + x + 1 !== width * this.config.height) isSolved = false;
                    continue;
                }
                if (t.correctValue !== (y * width + x + 1)) { isSolved = false; break; }
            }
            if (!isSolved) break;
        }
        if (isSolved) {
            this.scene.updatePreview('SOLVED!', 0x00ff00);
            this.scene.time.delayedCall(1500, () => this.scene.handleGameOver());
        }
    }

    validateChain() {
        if (this.selectionChain.length < 2) {
            this.selectionChain.forEach(t => { if (!t.isFound) t.bg.setFillStyle(0x222244, 1); });
            this.selectionChain = [];
            this.graphics.clear();
            return;
        }

        if (this.type === 'word-search') {
            const word = this.selectionChain.map(t => t.value).join('');
            const rev = word.split('').reverse().join('');
            if (this.targetWords.includes(word) || this.targetWords.includes(rev)) {
                const w = this.targetWords.includes(word) ? word : rev;
                if (!this.foundWords.includes(w)) {
                    this.foundWords.push(w);
                    this.selectionChain.forEach(t => { t.isFound = true; t.bg.setFillStyle(0x00ff00, 1); });
                    this.scene.updateScore(200); this.scene.updatePreview(`FOUND: ${w}`, 0x00ff00);
                    if (this.foundWords.length === this.targetWords.length) {
                        this.scene.updatePreview('ALL WORDS FOUND!', 0x00ff00);
                        this.scene.time.delayedCall(1500, () => this.scene.handleGameOver());
                    }
                }
            } else {
                this.selectionChain.forEach(t => { if (!t.isFound) t.bg.setFillStyle(0x222244, 1); });
            }
            this.selectionChain = []; this.graphics.clear();
            return;
        }

        if (this.type === 'word-connect') {
            const word = this.selectionChain.map(t => t.value).join('');
            const validWords = [
                'THE', 'AND', 'FOR', 'ARE', 'BUT', 'NOT', 'YOU', 'ALL', 'ANY', 'CAN',
                'HAD', 'HER', 'WAS', 'ONE', 'OUR', 'OUT', 'DAY', 'GET', 'HAS', 'HIM',
                'HIS', 'HOW', 'MAN', 'NEW', 'NOW', 'OLD', 'SEE', 'TWO', 'WAY', 'WHO',
                'BOY', 'DID', 'ITS', 'LET', 'PUT', 'SAY', 'SHE', 'TOO', 'USE', 'GAME',
                'PLAY', 'WORD', 'TEST', 'CODE', 'NODE', 'VIBE', 'NEON', 'CYBER', 'FLOW',
                'TECH', 'BIT', 'BYTE', 'NET', 'LINK', 'GRID', 'DATA', 'CORE', 'SYNC',
                'FAST', 'SLOW', 'HIGH', 'LOW', 'CITY', 'PLAN', 'CORE', 'HUB', 'PORT'
            ];
            if (validWords.includes(word) || word.length >= 4) {
                this.clearChainMatches();
            } else {
                this.selectionChain.forEach(t => t.bg.setFillStyle(0xff0000, 1));
                this.scene.time.delayedCall(400, () => this.clearSelectionChain());
            }
        } else if (this.type === 'number-sum') {
            const sum = this.selectionChain.reduce((acc, t) => acc + t.value, 0);
            if (sum === 10) {
                this.clearChainMatches();
            } else {
                this.selectionChain.forEach(t => t.bg.setFillStyle(0xff0000, 1));
                this.scene.time.delayedCall(400, () => this.clearSelectionChain());
            }
        }
    }

    clearSelectionChain() {
        this.graphics.clear();
        this.selectionChain.forEach(t => t.bg.setFillStyle(0x222244, 1));
        this.selectionChain = [];
        this.scene.updatePreview('');
        this.drawPaths();
    }

    clearChainMatches() {
        this.isBusy = true;
        this.scene.updateScore(this.selectionChain.length * 50);
        this.scene.updatePreview('SUCCESS!', 0x00ff00);
        this.scene.useMove();
        const chain = [...this.selectionChain];
        this.scene.tweens.add({
            targets: chain.flatMap(t => [t.bg, t.display]),
            scale: 0, duration: 300,
            onComplete: () => {
                chain.forEach(t => {
                    t.value = this.type === 'word-connect' ? Phaser.Utils.Array.GetRandom(this.alphabet) : Phaser.Math.Between(1, 9);
                    t.display.setText(t.value.toString());
                    t.bg.setScale(1); t.display.setScale(1); t.bg.setFillStyle(0x222244, 1);
                });
                this.clearSelectionChain();
                this.isBusy = false;
            }
        });
    }

    handleMatch3Interaction(tile) {
        if (!this.selectedTile) {
            this.selectedTile = tile;
            tile.display.setTint(0x00ffff);
        } else {
            const dist = Phaser.Math.Distance.Between(this.selectedTile.gridX, this.selectedTile.gridY, tile.gridX, tile.gridY);
            if (dist === 1) this.swapTiles(this.selectedTile, tile);
            this.selectedTile.display.clearTint();
            this.selectedTile = null;
        }
    }

    swapTiles(tile1, tile2) {
        this.isBusy = true;
        const tx = tile1.bg.x, ty = tile1.bg.y, gx = tile1.gridX, gy = tile1.gridY;
        this.scene.tweens.add({ targets: [tile1.bg, tile1.display], x: tile2.bg.x, y: tile2.bg.y, duration: 200 });
        this.scene.tweens.add({
            targets: [tile2.bg, tile2.display], x: tx, y: ty, duration: 200,
            onComplete: () => {
                this.tiles[gy][gx] = tile2; this.tiles[tile2.gridY][tile2.gridX] = tile1;
                const tempX = tile1.gridX, tempY = tile1.gridY;
                tile1.gridX = tile2.gridX; tile1.gridY = tile2.gridY;
                tile2.gridX = tempX; tile2.gridY = tempY;
                this.checkMatches();
            }
        });
    }

    checkMatches() {
        const matches = new Set();
        const { width, height } = this.config;
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width - 2; x++) {
                const t1 = this.tiles[y][x], t2 = this.tiles[y][x + 1], t3 = this.tiles[y][x + 2];
                if (t1.value === t2.value && t2.value === t3.value) { matches.add(t1); matches.add(t2); matches.add(t3); }
            }
        }
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height - 2; y++) {
                const t1 = this.tiles[y][x], t2 = this.tiles[y + 1][x], t3 = this.tiles[y + 2][x];
                if (t1.value === t2.value && t2.value === t3.value) { matches.add(t1); matches.add(t2); matches.add(t3); }
            }
        }
        if (matches.size > 0) this.clearMatches(Array.from(matches)); else this.isBusy = false;
    }

    clearMatches(matchList) {
        this.scene.updateScore(matchList.length * 10);
        this.scene.useMove();
        this.scene.tweens.add({
            targets: matchList.flatMap(t => [t.bg, t.display]),
            alpha: 0, scale: 0, duration: 300,
            onComplete: () => {
                matchList.forEach(t => {
                    t.value = Phaser.Math.Between(1, this.config.types);
                    t.display.setTexture(`tile_${t.value}`);
                    t.bg.alpha = 1; t.display.alpha = 1; t.bg.scale = 1; t.display.scale = this.config.tileSize / 100;
                });
                this.checkMatches();
            }
        });
    }

    handleMathCrossInteraction(tile) {
        if (tile.cellType !== 3) return;
        let val = tile.value === "" ? 0 : parseInt(tile.value);
        val = (val + 1) % 21;
        tile.value = val.toString(); tile.display.setText(val.toString());
        this.validateMathCross();
    }

    validateMathCross() {
        let allCorrect = true;
        this.tiles.flat().filter(t => t && t.cellType === 3).forEach(t => {
            if (t.value.toString() !== t.correctValue.toString()) allCorrect = false;
        });
        if (allCorrect) {
            this.scene.updatePreview('MATH MASTER!', 0x00ff00);
            this.scene.time.delayedCall(1500, () => this.scene.handleGameOver());
        }
    }
}
