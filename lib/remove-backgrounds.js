const { Jimp } = require('jimp');
const path = require('path');
const fs = require('fs');

const DEFAULT_DIRS = [
    path.join(process.cwd(), 'public/assets/shooter/cyber-city'),
    path.join(process.cwd(), 'public/assets/fighter/dual-fighter')
];

async function removeBackground(filePath) {
    try {
        const image = await Jimp.read(filePath);

        // In Jimp 1.x, the bit depth/format is handled in bitmap.data
        const targetR = image.bitmap.data[0];
        const targetG = image.bitmap.data[1];
        const targetB = image.bitmap.data[2];

        image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
            const r = this.bitmap.data[idx + 0];
            const g = this.bitmap.data[idx + 1];
            const b = this.bitmap.data[idx + 2];

            // Distance check
            const dist = Math.sqrt(
                Math.pow(r - targetR, 2) +
                Math.pow(g - targetG, 2) +
                Math.pow(b - targetB, 2)
            );

            // Threshold for background removal
            if (dist < 40 || (r < 15 && g < 15 && b < 15)) {
                this.bitmap.data[idx + 3] = 0; // Set alpha to 0 (transparent)
            }
        });

        const outPath = filePath.replace('.png', '-transparent.png');
        await image.write(outPath);
        console.log(`Processed: ${outPath}`);
        return outPath;
    } catch (err) {
        console.error(`Error processing ${filePath}:`, err);
    }
}

async function main() {
    const customDir = process.argv[2];
    const targetDirs = customDir ? [path.resolve(customDir)] : DEFAULT_DIRS;

    for (const targetDir of targetDirs) {
        if (!fs.existsSync(targetDir)) {
            console.warn(`Directory not found: ${targetDir}`);
            continue;
        }

        const files = fs.readdirSync(targetDir).filter(f => f.endsWith('.png') && !f.includes('-transparent'));
        console.log(`Found ${files.length} files in ${targetDir} to process...`);

        for (const file of files) {
            await removeBackground(path.join(targetDir, file));
        }
    }
}

main();
