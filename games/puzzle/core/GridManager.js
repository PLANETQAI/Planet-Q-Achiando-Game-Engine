
import * as Phaser from 'phaser';

export default class GridManager {
    constructor(scene) {
        this.scene = scene;
        this.config = scene.gameConfig.grid;
        this.tiles = [];
        this.selectedTile = null;
        this.isBusy = false;

        this.initGrid();
    }

    initGrid() {
        const { width, height, tileSize } = this.config;
        const offsetX = (800 - (width * tileSize)) / 2;
        const offsetY = (600 - (height * tileSize)) / 2;

        for (let y = 0; y < height; y++) {
            this.tiles[y] = [];
            for (let x = 0; x < width; x++) {
                const type = Phaser.Math.Between(1, this.config.types);
                const tile = this.scene.add.sprite(
                    offsetX + x * tileSize + tileSize / 2,
                    offsetY + y * tileSize + tileSize / 2,
                    `tile_${type}`
                );
                tile.setInteractive();
                tile.setScale(this.config.tileSize / 100);
                tile.gridX = x;
                tile.gridY = y;
                tile.type = type;
                this.tiles[y][x] = tile;
            }
        }

        // Potential initial match clearing could go here
    }

    handleClick(pointer) {
        if (this.isBusy) return;

        const { tileSize } = this.config;
        const offsetX = (800 - (this.config.width * tileSize)) / 2;
        const offsetY = (600 - (this.config.height * tileSize)) / 2;

        const x = Math.floor((pointer.x - offsetX) / tileSize);
        const y = Math.floor((pointer.y - offsetY) / tileSize);

        if (x >= 0 && x < this.config.width && y >= 0 && y < this.config.height) {
            const clickedTile = this.tiles[y][x];

            if (!this.selectedTile) {
                this.selectedTile = clickedTile;
                clickedTile.setTint(0x00ffff);
            } else {
                const dist = Phaser.Math.Distance.Between(this.selectedTile.gridX, this.selectedTile.gridY, x, y);
                if (dist === 1) {
                    this.swapTiles(this.selectedTile, clickedTile);
                }
                this.selectedTile.clearTint();
                this.selectedTile = null;
            }
        }
    }

    swapTiles(tile1, tile2) {
        this.isBusy = true;
        const tx = tile1.x, ty = tile1.y;
        const gx = tile1.gridX, gy = tile1.gridY;

        this.scene.tweens.add({
            targets: tile1,
            x: tile2.x,
            y: tile2.y,
            duration: 200
        });

        this.scene.tweens.add({
            targets: tile2,
            x: tx,
            y: ty,
            duration: 200,
            onComplete: () => {
                // Swap in array
                this.tiles[gy][gx] = tile2;
                this.tiles[tile2.gridY][tile2.gridX] = tile1;

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

        // Horizontal matches
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width - 2; x++) {
                const t1 = this.tiles[y][x], t2 = this.tiles[y][x + 1], t3 = this.tiles[y][x + 2];
                if (t1.type === t2.type && t2.type === t3.type) {
                    matches.add(t1); matches.add(t2); matches.add(t3);
                }
            }
        }

        // Vertical matches
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height - 2; y++) {
                const t1 = this.tiles[y][x], t2 = this.tiles[y + 1][x], t3 = this.tiles[y + 2][x];
                if (t1.type === t2.type && t2.type === t3.type) {
                    matches.add(t1); matches.add(t2); matches.add(t3);
                }
            }
        }

        if (matches.size > 0) {
            this.clearMatches(Array.from(matches));
        } else {
            this.isBusy = false;
        }
    }

    clearMatches(matchList) {
        this.scene.updateScore(matchList.length * 10);
        this.scene.useMove();

        this.scene.tweens.add({
            targets: matchList,
            alpha: 0,
            scale: 0,
            duration: 300,
            onComplete: () => {
                matchList.forEach(t => {
                    t.type = Phaser.Math.Between(1, this.config.types);
                    t.setTexture(`tile_${t.type}`);
                    t.alpha = 1;
                    t.scale = this.config.tileSize / 100;
                });
                this.checkMatches(); // Check for chain reactions
            }
        });
    }
}
