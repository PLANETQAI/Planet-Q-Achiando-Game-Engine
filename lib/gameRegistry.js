
export const GAME_REGISTRY = {
    'space-invaders-01': {
        id: 'space-invaders-01',
        name: 'Galactic Defenders',
        description: 'Classic arcade shooter where you defend Earth from waves of alien invaders.',
        category: 'shooter',
        tags: ['Retro', 'Arcade', 'Action'],
        config: {
            player: {
                speed: 400,
                asset: 'spaceship/spaceship.pod.1.png',
                scale: 0.5,
                hp: 3
            },
            weapon: {
                fireRate: 200,
                bulletSpeed: 800,
                type: 'bullet',
                asset: 'bullet_light',
                scale: 0.8
            },
            spawn: {
                type: 'grid',
                count: 12,
                spacing: 60,
                asset: 'spaceship/alienshipnorm.png',
                scale: 0.15,
                recurring: true
            },
            levelThreshold: 15,
            background: 'background/space-Background-1.png',
            sounds: {
                fire: 'sound/laserfire01.ogg'
            }
        }
    },
    'drone-strike-01': {
        id: 'drone-strike-01',
        name: 'Drone Strike',
        description: 'Survival swarm! Evade and destroy hundreds of agile drones.',
        category: 'shooter',
        tags: ['Swarm', 'Fast', 'Agile'],
        config: {
            player: {
                speed: 500,
                asset: 'spaceship/ship6.png',
                scale: 0.4,
                hp: 5
            },
            weapon: {
                fireRate: 80,
                bulletSpeed: 900,
                type: 'bullet',
                asset: 'bullet_blue',
                scale: 0.5,
                bulletCount: 3,
                spread: 0.4
            },
            spawn: {
                type: 'chaos',
                count: 8,
                spacing: 100,
                speed: 100,
                asset: 'spaceship/small.drone_.1_0.PNG',
                scale: 0.4,
                recurring: true
            },
            levelThreshold: 20,
            background: 'background/space-Background-2.png',
            sounds: {
                fire: 'sound/laserfire02.ogg'
            }
        }
    },
    'arcade-racer-01': {
        id: 'arcade-racer-01',
        name: 'Neon Drift',
        description: 'High-speed arcade racing on neon-lit tracks. Drift to win!',
        category: 'racing',
        tags: ['Speed', 'Drift', 'Action'],
        config: {
            car: {
                maxSpeed: 500,
                acceleration: 300,
                drag: 0.96,
                handling: 250,
                asset: 'spaceship/cartoonship blue.png',
                scale: 0.2
            },
            background: 'background/space-Background-3.png',
            track: { laps: 3, timePerLevel: 45 },
            obstacles: { count: 8, asset: 'spaceship/alienshipnorm.png', scale: 0.12 }
        }
    },
    'bullet-hell-01': {
        id: 'bullet-hell-01',
        name: 'Danmaku Core',
        description: 'Dodge thousands of bullets in this intense bullet hell experience.',
        category: 'shooter',
        tags: ['Hardcore', 'Bullet Hell', 'Skill'],
        config: {
            player: {
                speed: 350,
                asset: 'spaceship/spaceship.pod.1.small.purple.png',
                scale: 0.6,
                hp: 1
            },
            weapon: {
                fireRate: 50,
                bulletSpeed: 1000,
                type: 'bullet',
                asset: 'bullet_red',
                scale: 0.3
            },
            spawn: {
                type: 'chaos',
                count: 35,
                spacing: 20,
                asset: 'spaceship/spiked ship 3. small.blue__0.PNG',
                scale: 0.4,
                recurring: true
            },
            levelThreshold: 30,
            background: 'background/space-Background-4.png',
            sounds: {
                fire: 'sound/laserfire02.ogg'
            }
        }
    },
    'void-stalker-01': {
        id: 'void-stalker-01',
        name: 'Void Stalker',
        description: 'Heavy artillery operations in deep space. One shot, one kill.',
        category: 'shooter',
        tags: ['Heavy', 'Tactical', 'Missiles'],
        config: {
            player: {
                speed: 250,
                asset: 'spaceship/large.ship_.1_0.PNG',
                scale: 0.3,
                hp: 10
            },
            weapon: {
                fireRate: 600,
                bulletSpeed: 400,
                type: 'missile',
                asset: 'missile',
                scale: 1.2,
                bulletCount: 3,
                spread: 0.3
            },
            spawn: {
                type: 'grid',
                count: 6,
                spacing: 120,
                asset: 'spaceship/ship9_0.png',
                scale: 0.3,
                recurring: true
            },
            levelThreshold: 10,
            background: 'background/space-Background-1.png',
            sounds: {
                fire: 'sound/laserfire01.ogg'
            }
        }
    },
    'ghost-racer-01': {
        id: 'ghost-racer-01',
        name: 'Ghost Racer',
        description: 'Compete against your own ghost in this precision time trial racer.',
        category: 'racing',
        tags: ['Time Attack', 'Simulation'],
        config: {
            car: {
                maxSpeed: 600,
                acceleration: 400,
                drag: 0.98,
                handling: 350,
                asset: 'spaceship/cartoonship purple.png',
                scale: 0.2
            },
            background: 'background/space-Background-2.png',
            track: { laps: 1, timePerLevel: 30 },
            obstacles: { count: 12, asset: 'spaceship/spiked ship 3. small.PNG', scale: 0.4 }
        }
    },
    'cyber-arena-01': {
        id: 'cyber-arena-01',
        name: 'Cyber Arena',
        description: 'Survive endless waves of cyborgs in a twin-stick shooter arena.',
        category: 'shooter',
        tags: ['Survival', 'Twin Stick', 'Cyberpunk'],
        config: {
            player: {
                speed: 300,
                asset: 'spaceship/ship3.png',
                scale: 0.4,
                hp: 5
            },
            weapon: {
                fireRate: 150,
                bulletSpeed: 600,
                type: 'missile',
                asset: 'missile',
                scale: 0.6
            },
            spawn: {
                type: 'chaos',
                count: 15,
                spacing: 50,
                asset: 'spaceship/small.drone_.1_0.PNG',
                scale: 0.6,
                recurring: true
            },
            levelThreshold: 15,
            background: 'background/space-Background-1.png',
            sounds: {
                fire: 'sound/laserfire01.ogg'
            }
        }
    },
    'star-guardian-01': {
        id: 'star-guardian-01',
        name: 'Star Guardian',
        description: 'Protect the sector from rogue asteroids and alien scouts.',
        category: 'shooter',
        tags: ['Defender', 'Elite', 'Action'],
        config: {
            player: {
                speed: 380,
                asset: 'spaceship/ship2.png',
                scale: 0.5,
                hp: 6
            },
            weapon: {
                fireRate: 180,
                bulletSpeed: 750,
                type: 'bullet',
                asset: 'bullet_light',
                scale: 0.7
            },
            spawn: {
                type: 'grid',
                count: 15,
                spacing: 50,
                asset: 'spaceship/ship4_0.png',
                scale: 0.2,
                recurring: true
            },
            levelThreshold: 20,
            background: 'background/space-Background-4.png',
            sounds: {
                fire: 'sound/laserfire02.ogg'
            }
        }
    },
    'road-rage-01': {
        id: 'road-rage-01',
        name: 'Road Rage',
        description: 'Race and destroy your opponents with heavy weaponry.',
        category: 'racing',
        tags: ['Combat', 'Explosions', 'Action'],
        config: {
            car: {
                maxSpeed: 450,
                acceleration: 250,
                drag: 0.95,
                handling: 200,
                asset: 'spaceship/cartoonship red.png',
                scale: 0.22
            },
            background: 'background/space-Background-4.png',
            track: { laps: 3, timePerLevel: 60 },
            obstacles: { count: 10, asset: 'spaceship/alienshiptex.png', scale: 0.15 }
        }
    },
    'dragon-slayer-01': {
        id: 'dragon-slayer-01',
        name: 'Dragon Slayer',
        description: 'Defend the kingdom from ferocious dragons in this fantasy shooter.',
        category: 'shooter',
        tags: ['Fantasy', 'Arcade', 'Epic'],
        config: {
            player: {
                speed: 350,
                asset: 'spaceship/kit2ship1.png',
                scale: 0.6,
                hp: 10
            },
            weapon: {
                fireRate: 300,
                bulletSpeed: 600,
                type: 'bullet',
                asset: 'bullet_blue',
                scale: 1.0
            },
            spawn: {
                type: 'chaos',
                count: 8,
                spacing: 120,
                asset: 'dragon/0.png',
                scale: 0.4,
                recurring: true
            },
            levelThreshold: 10,
            background: 'background/background.png',
            sounds: {
                fire: 'sound/Magic Missiles.wav'
            }
        }
    },
    'grand-prix-01': {
        id: 'grand-prix-01',
        name: 'Asphalt Grand Prix',
        description: 'Professional circuit racing with high-performance vehicles.',
        category: 'racing',
        tags: ['Formula', 'Speed', 'Circuit'],
        config: {
            car: {
                maxSpeed: 650,
                acceleration: 350,
                drag: 0.97,
                handling: 300,
                asset: 'car/Race/CarRed.png',
                scale: 1.0
            },
            background: 'car/Race/Road.png',
            track: { laps: 10, timePerLevel: 120 },
            obstacles: { count: 12, asset: 'car/Race/CarBlue.png', scale: 0.8 },
            borders: { left: 'car/Race/LeftBump.png', right: 'car/Race/RightBump.png' }
        }
    },
    'urban-traffic-01': {
        id: 'urban-traffic-01',
        name: 'Urban Viper',
        description: 'Navigate through dense city traffic in your custom black viper.',
        category: 'racing',
        tags: ['City', 'Traffic', 'Survival'],
        config: {
            car: {
                maxSpeed: 550,
                acceleration: 300,
                drag: 0.95,
                handling: 280,
                asset: 'car/Topdown_vehicle_sprites_pack/Black_viper.png',
                scale: 0.8,
                hp: 5
            },
            background: 'background/space-Background-1.png',
            track: { laps: 1, timePerLevel: 90 },
            obstacles: { count: 15, asset: 'car/Topdown_vehicle_sprites_pack/Audi.png', scale: 0.7, damage: 1 },
            collectibles: { asset: '🪙', scale: 1.0, value: 100, heal: 1 }
        }
    },
    'sky-climber-01': {
        id: 'sky-climber-01',
        name: 'Sky Climber',
        description: 'Climb the clouds and collect gems in this fun emoji-style racer!',
        category: 'racing',
        tags: ['Emoji', 'Fun', 'Casual'],
        config: {
            car: {
                maxSpeed: 400,
                acceleration: 200,
                drag: 0.95,
                handling: 300,
                asset: '🚀',
                scale: 1.0,
                hp: 3
            },
            background: 'background/background.png',
            track: { laps: 1, timePerLevel: 60 },
            obstacles: { count: 10, asset: '☁️', scale: 1.2, damage: 1 },
            collectibles: { asset: '🪙', scale: 1.0, value: 50, heal: 0 }
        }
    },
    'stellar-hunt-01': {
        id: 'stellar-hunt-01',
        name: 'Stellar Hunt',
        description: 'Side-scrolling survival! Hunt rogue scouts in the asteroid belt.',
        category: 'shooter',
        tags: ['Horizontal', 'Survival', 'Hunting'],
        config: {
            player: {
                speed: 400,
                asset: 'spaceship/ship3.png',
                scale: 0.5,
                hp: 6
            },
            weapon: {
                fireRate: 200,
                bulletSpeed: 800,
                type: 'missile',
                asset: 'missile',
                scale: 0.8,
                bulletCount: 2,
                spread: 0.2
            },
            spawn: {
                type: 'chaos',
                count: 12,
                spacing: 80,
                speed: 150,
                asset: 'spaceship/spiked ship 3. small.PNG',
                scale: 0.4,
                recurring: true
            },
            orientation: 'horizontal',
            levelThreshold: 15,
            background: 'background/space-Background-3.png'
        }
    },
    'balloon-pop-01': {
        id: 'balloon-pop-01',
        name: 'Balloon Pop',
        description: 'Satisfying carnival action! Target the balloons and pop them all.',
        category: 'shooter',
        tags: ['Casual', 'Satisfying', 'Carnival'],
        config: {
            player: {
                speed: 550,
                asset: 'spaceship/ship7.png',
                scale: 0.4,
                hp: 10
            },
            weapon: {
                fireRate: 120,
                bulletSpeed: 1200,
                type: 'bullet',
                asset: 'bullet',
                scale: 0.5
            },
            spawn: {
                type: 'chaos',
                count: 20,
                spacing: 50,
                speed: 80,
                asset: 'pro/balloon_pro.png',
                scale: 0.25,
                blendMode: 'SCREEN',
                tints: [0xff0000, 0x00ff00, 0x00aaff, 0xffff00, 0xff00ff, 0x00ffff],
                recurring: true
            },
            levelThreshold: 30,
            background: 'background/background.png'
        }
    },
    'starborne-3d-01': {
        id: 'starborne-3d-01',
        name: 'Starborne 3D',
        description: 'Next-gen rail shooter! Experience deep-space combat with realistic depth.',
        category: 'shooter',
        tags: ['3D', 'Pro', 'Space'],
        config: {
            player: {
                speed: 450,
                asset: 'spaceship/ship3.png',
                scale: 0.4,
                hp: 5
            },
            weapon: {
                fireRate: 250,
                bulletSpeed: 900,
                type: 'bullet',
                asset: 'bullet_blue',
                scale: 0.6
            },
            spawn: {
                type: 'chaos',
                count: 15,
                spacing: 120,
                speed: 200,
                asset: 'pro/spacecraft_3d.png',
                scale: 0.8,
                depthScale: true,
                recurring: true
            },
            levelThreshold: 20,
            background: 'background/space-Background-2.png'
        }
    },
    'vibe-storm-01': {
        id: 'vibe-storm-01',
        name: 'Vibe Storm: Glitch Pop',
        description: 'EXTRAORDINARY! Chain reaction chaos in a glitchy neon void. Pop one, pop them all.',
        category: 'shooter',
        tags: ['Extraordinary', 'Chain Reaction', 'Neon'],
        config: {
            player: {
                speed: 600,
                asset: 'spaceship/ship3.png',
                scale: 0.35,
                hp: 5
            },
            weapon: {
                fireRate: 200,
                bulletSpeed: 1000,
                type: 'bullet',
                asset: 'bullet_blue',
                scale: 0.7
            },
            spawn: {
                type: 'chaos',
                count: 15,
                spacing: 100,
                speed: 120,
                asset: 'pro/balloon_pro.png',
                scale: 0.3,
                blendMode: 'SCREEN',
                tints: [0xff00ff, 0x00ffff, 0xffff00], // Hyper neon tints
                recurring: true,
                depthScale: true,
                glitch: true,
                explosion: {
                    count: 12,
                    speed: 400,
                    asset: 'bullet_light',
                    scale: 0.4
                }
            },
            levelThreshold: 20,
            background: 'background/space-Background-4.png'
        }
    },
    'sky-leap-01': {
        id: 'sky-leap-01',
        name: 'Sky Leap Racer',
        description: 'EXTRAORDINARY! Leap across floating platforms in this high-speed altitude race. Don\'t stumble!',
        category: 'platform-racing',
        tags: ['Extraordinary', 'Platformer', 'Racing'],
        config: {
            player: {
                speed: 400,
                jumpForce: -650,
                asset: 'spaceship/spaceship.pod.1.yellow.png',
                scale: 0.3,
                hp: 5
            },
            background: 'background/space-Background-1.png',
            platform: {
                asset: 'spaceship/baseship11.small_.png',
                speed: 350,
                spacing: 450,
                scale: 1.2
            },
            obstacles: {
                count: 3,
                asset: '💥',
                scale: 0.8,
                damage: 1
            },
            levelThreshold: 2500
        }
    }
};

export const getGameById = (id) => GAME_REGISTRY[id] || null;
export const getAllGames = () => Object.values(GAME_REGISTRY);
