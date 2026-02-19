
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
            spawn: { type: 'grid', count: 12, spacing: 60, asset: 'spaceship/alienshipnorm.png', scale: 0.15, recurring: true, fireRate: 2000 },
            levelThreshold: 15,
            background: 'background/space-Background-1.png',
            sounds: {
                fire: 'sound/laserfire01.ogg'
            }
        }
    },
    'cyber-intercept-01': {
        id: 'cyber-intercept-01',
        name: 'Cyber Intercept',
        description: 'Elite dogfighting! Enemies fire back with tracking missiles. Use your beam to clear the path.',
        category: 'shooter',
        tags: ['Elite', 'Combat', 'Neon'],
        config: {
            player: { speed: 450, asset: 'spaceship/ship6.png', scale: 0.4, hp: 8 },
            weapon: { fireRate: 100, bulletSpeed: 1000, type: 'bullet', asset: 'bullet_blue', scale: 0.5 },
            spawn: {
                type: 'chaos', count: 12, speed: 200, asset: 'spaceship/small.drone_.1_0.PNG', scale: 0.5, recurring: true,
                fireRate: 1500, bulletAsset: 'missile', bulletScale: 0.4, bulletSpeed: 200
            },
            levelThreshold: 15,
            orientation: 'horizontal',
            background: 'background/space-Background-2.png'
        }
    },
    'neon-blitz-01': {
        id: 'neon-blitz-01',
        name: 'Neon Blitz',
        description: 'Hyper-speed survival with homing projectiles and constant power-ups.',
        category: 'shooter',
        tags: ['Action', 'Powerups', 'Flashy'],
        config: {
            player: { speed: 500, asset: 'spaceship/ship3.png', scale: 0.4, hp: 5 },
            weapon: { fireRate: 150, bulletSpeed: 800, type: 'bullet', asset: 'bullet_light', scale: 0.6, homing: true },
            spawn: {
                type: 'chaos', count: 20, speed: 150, asset: 'spaceship/alienshipnorm.png', scale: 0.12, recurring: true,
                fireRate: 3000, bulletAsset: 'bullet_red', bulletScale: 0.4
            },
            levelThreshold: 20,
            background: 'background/space-Background-4.png'
        }
    },
    'titan-slayer-01': {
        id: 'titan-slayer-01',
        name: 'Titan Slayer',
        description: 'Endless boss rush mode. Heavy artillery vs massive capital ships.',
        category: 'shooter',
        tags: ['Boss Rush', 'Heavy', 'Hard'],
        config: {
            player: { speed: 300, asset: 'spaceship/large.ship_.1_0.PNG', scale: 0.35, hp: 15 },
            weapon: { fireRate: 400, bulletSpeed: 500, type: 'missile', asset: 'missile', scale: 1.2, bulletCount: 3, spread: 0.4 },
            spawn: {
                type: 'grid', count: 4, spacing: 150, asset: 'spaceship/ship9_0.png', scale: 0.4, recurring: false,
                fireRate: 2500, bulletAsset: 'bomb', bulletScale: 0.8
            },
            levelThreshold: 1,
            background: 'background/space-Background-3.png'
        }
    },
    'ikaruga-pulse-01': {
        id: 'ikaruga-pulse-01',
        name: 'Ikaruga Pulse',
        description: 'Polarity-shifting vertical shooter. SHIFT to change color. Absorb same-color bullets!',
        category: 'shooter',
        tags: ['Polarity', 'Skill', 'Hardcore'],
        config: {
            player: { speed: 400, asset: 'spaceship/ship1.png', scale: 0.5, hp: 5 },
            weapon: { fireRate: 100, bulletSpeed: 1000, type: 'bullet', asset: 'bullet_light' },
            spawn: {
                type: 'chaos', count: 15, asset: 'spaceship/alienshipnorm.png', scale: 0.15, recurring: true,
                fireRate: 800, bulletAsset: 'bullet', bulletSpeed: 300, polarity: 'dark'
            },
            levelThreshold: 20,
            background: 'background/space-Background-1.png'
        }
    },
    'raiden-fury-01': {
        id: 'raiden-fury-01',
        name: 'Raiden Fury',
        description: 'Vertical scroll bullet hell. Press X for Screen Bombs!',
        category: 'shooter',
        tags: ['Bullet Hell', 'Classic', 'Bombs'],
        config: {
            player: { speed: 450, asset: 'spaceship/ship6.png', scale: 0.4, hp: 3, bombs: 3 },
            weapon: { fireRate: 80, bulletSpeed: 900, type: 'bullet', asset: 'bullet_blue', bulletCount: 3, spread: 0.3 },
            spawn: {
                type: 'chaos', count: 25, asset: 'spaceship/small.drone_.1_0.PNG', scale: 0.4, recurring: true,
                fireRate: 1200, bulletAsset: 'bullet_red', bulletSpeed: 400
            },
            levelThreshold: 25,
            background: 'background/space-Background-2.png'
        }
    },
    'gradius-prime-01': {
        id: 'gradius-prime-01',
        name: 'Gradius Prime',
        description: 'Horizontal shooter with following "Option" drones.',
        category: 'shooter',
        tags: ['Options', 'Horizontal', 'Tactical'],
        config: {
            player: { speed: 400, asset: 'spaceship/ship3.png', scale: 0.4, hp: 5 },
            weapon: { fireRate: 150, bulletSpeed: 800, type: 'bullet', asset: 'bullet_light' },
            spawn: { type: 'chaos', count: 10, speed: 200, asset: 'spaceship/alienshipnorm.png', scale: 0.15, recurring: true },
            levelThreshold: 15,
            orientation: 'horizontal',
            background: 'background/space-Background-4.png'
        }
    },
    'contra-core-01': {
        id: 'contra-core-01',
        name: 'Contra Core',
        description: 'High-intensity run & gun simulation. Staggered waves and heavy destruction.',
        category: 'shooter',
        tags: ['Combat', 'Intense', 'Action'],
        config: {
            player: { speed: 450, asset: 'spaceship/ship8.png', scale: 0.4, hp: 10 },
            weapon: { fireRate: 50, bulletSpeed: 1200, type: 'bullet', asset: 'bullet_light', bulletCount: 5, spread: 0.1 },
            spawn: {
                type: 'chaos', count: 30, asset: 'spaceship/alienshipnorm.png', scale: 0.12, recurring: true,
                fireRate: 500, bulletAsset: 'bullet_red'
            },
            levelThreshold: 30,
            background: 'background/space-Background-3.png'
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
            obstacles: { count: 12, asset: 'spaceship/spiked ship 3. small.PNG', scale: 0.4 },
            globalSystems: {
                movement: true,
                environment: true
            }
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
            obstacles: { count: 10, asset: 'spaceship/alienshiptex.png', scale: 0.15 },
            globalSystems: {
                movement: true,
                environment: true
            }
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
            borders: { left: 'car/Race/LeftBump.png', right: 'car/Race/RightBump.png' },
            globalSystems: {
                movement: true,
                environment: true
            }
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
            collectibles: { asset: '🪙', scale: 1.0, value: 100, heal: 1 },
            globalSystems: {
                movement: true,
                environment: true
            }
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
            collectibles: { asset: '🪙', scale: 1.0, value: 50, heal: 0 },
            globalSystems: {
                movement: true,
                environment: true
            }
        }
    },
    'rail-jumper-01': {
        id: 'rail-jumper-01',
        name: 'Rail Jumper',
        description: 'Jump between high-voltage rails to avoid short circuits.',
        category: 'racing',
        tags: ['Precision', 'Industrial', 'Jump'],
        config: {
            player: { speed: 450, jumpForce: -700, asset: 'spaceship/spaceship.pod.1.png', scale: 0.35, hp: 5 },
            background: 'background/space-Background-2.png',
            platform: { asset: 'spaceship/baseship11.small_.png', speed: 350, spacing: 350, scale: 0.8 },
            obstacles: { count: 4, asset: '⚡', scale: 1.0, damage: 2 }
        }
    },
    'hazard-hurdler-01': {
        id: 'hazard-hurdler-01',
        name: 'Hazard Hurdler',
        description: 'Jump over roadblocks and pits at high speed.',
        category: 'racing',
        tags: ['Skill', 'Jump', 'Urban'],
        config: {
            car: { maxSpeed: 550, acceleration: 300, drag: 0.95, handling: 300, asset: 'car/Topdown_vehicle_sprites_pack/Black_viper.png', scale: 0.7, hp: 5 },
            background: 'background/space-Background-4.png',
            track: { laps: 5, timePerLevel: 90 },
            obstacles: { count: 15, asset: '🚧', scale: 0.8, damage: 1 },
            collectibles: { asset: '🪙', scale: 1.0, value: 100, heal: 1 }
        }
    },
    'nitro-speedrun-01': {
        id: 'nitro-speedrun-01',
        name: 'Nitro Velocity',
        description: 'Pure speed. Zero drag. Can you handle the G-force?',
        category: 'racing',
        tags: ['Speed', 'Nitro', 'Experimental'],
        config: {
            car: { maxSpeed: 1200, acceleration: 600, drag: 1.0, handling: 400, asset: 'spaceship/cartoonship red.png', scale: 0.25, hp: 1 },
            background: 'background/space-Background-3.png',
            track: { laps: 1, timePerLevel: 30 },
            obstacles: { count: 20, asset: '☄️', scale: 0.5, damage: 1 }
        }
    },
    'chrono-wipeout-01': {
        id: 'chrono-wipeout-01',
        name: 'Chrono Wipeout',
        description: 'Elite elimination racing. Stay ahead of the timer or get wiped out!',
        category: 'racing',
        tags: ['Elimination', 'Hardcore', 'Neon'],
        config: {
            car: { maxSpeed: 600, acceleration: 400, drag: 0.97, handling: 350, asset: 'spaceship/spaceship.pod.1.green.png', scale: 0.3, hp: 1 },
            background: 'background/space-Background-4.png',
            track: { laps: 1, timePerLevel: 25 },
            obstacles: { count: 15, asset: '💥', scale: 0.8, damage: 1 }
        }
    },
    'hot-pursuit-01': {
        id: 'hot-pursuit-01',
        name: 'Hot Pursuit',
        description: 'Escape the high-speed patrol drones in this urban interceptor challenge.',
        category: 'racing',
        tags: ['Police', 'Chase', 'Action'],
        config: {
            car: { maxSpeed: 550, acceleration: 320, drag: 0.96, handling: 300, asset: 'car/Topdown_vehicle_sprites_pack/Black_viper.png', scale: 0.75, hp: 8 },
            background: 'background/space-Background-1.png',
            track: { laps: 3, timePerLevel: 120 },
            obstacles: { count: 20, asset: 'car/Topdown_vehicle_sprites_pack/Police.png', scale: 0.8, damage: 2 }
        }
    },
    'rally-storm-01': {
        id: 'rally-storm-01',
        name: 'Rally Storm',
        description: 'Brave the mud and sand! Use your suspension to hop over dunes.',
        category: 'racing',
        tags: ['Off-Road', 'Mud', 'Jump'],
        config: {
            car: { maxSpeed: 450, acceleration: 400, drag: 0.94, handling: 250, asset: 'car/Topdown_vehicle_sprites_pack/Mini_truck.png', scale: 0.8, hp: 10 },
            background: 'background/background.png',
            track: { laps: 2, timePerLevel: 100 },
            obstacles: { count: 12, asset: 'rock', scale: 1.0, damage: 1 },
            mudZones: true
        }
    },
    'powerup-havoc-01': {
        id: 'powerup-havoc-01',
        name: 'Power-up Havoc',
        description: 'Chaos on the track! Collect nitro and avoid heavy artillery projectiles.',
        category: 'racing',
        tags: ['Combat', 'Arcade', 'Powerups'],
        config: {
            car: { maxSpeed: 500, acceleration: 350, drag: 0.96, handling: 320, asset: 'spaceship/spaceship.pod.1.yellow.png', scale: 0.35, hp: 6 },
            background: 'background/space-Background-3.png',
            track: { laps: 5, timePerLevel: 180 },
            obstacles: { count: 25, asset: 'missile', scale: 1.2, damage: 3 }
        }
    },
    'kitchen-cup-01': {
        id: 'kitchen-cup-01',
        name: 'Kitchen Cup',
        description: 'A micro-racing adventure! Speed past giant forks and spillages.',
        category: 'racing',
        tags: ['Micro', 'Fun', 'Creative'],
        config: {
            car: { maxSpeed: 400, acceleration: 200, drag: 0.98, handling: 300, asset: '🚗', scale: 0.6, hp: 3 },
            background: 'background/background.png',
            track: { laps: 3, timePerLevel: 90 },
            obstacles: { count: 30, asset: '🍴', scale: 1.5, damage: 1 },
            collectibles: { asset: '🍓', scale: 1.0, value: 200, heal: 1 }
        }
    },
    'neon-wake-01': {
        id: 'neon-wake-01',
        name: 'Neon Wake',
        description: 'Hydro-racing in a cyberpunk harbor. High drag, even higher style.',
        category: 'racing',
        tags: ['Water', 'Cyberpunk', 'Sliding'],
        config: {
            car: { maxSpeed: 480, acceleration: 150, drag: 0.90, handling: 180, asset: 'spaceship/small.drone_.1_0.PNG', scale: 0.5, hp: 4 },
            background: 'background/space-Background-2.png',
            track: { laps: 3, timePerLevel: 120 },
            obstacles: { count: 15, asset: 'buoy', scale: 1.0, damage: 1 },
            vibe: 'rainy-cyber'
        }
    },
    'shift-master-01': {
        id: 'shift-master-01',
        name: 'Shift Master',
        description: 'Drag racing perfection. Eliminate drag and hit terminal velocity.',
        category: 'racing',
        tags: ['Drag', 'Speed', 'Minimalist'],
        config: {
            car: { maxSpeed: 2000, acceleration: 800, drag: 1.0, handling: 500, asset: 'spaceship/large.ship_.1_0.PNG', scale: 0.2, hp: 1 },
            background: 'background/space-Background-4.png',
            track: { laps: 1, timePerLevel: 20 },
            obstacles: { count: 5, asset: '☄️', scale: 0.4, damage: 1 }
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
    },
    'cyber-city-01': {
        id: 'cyber-city-01',
        name: 'Cyber City: Protocol',
        description: 'Elite cyborg operations in a shifting neon metropolis. Sword-styling fighting mixed with tactical drone clearing.',
        category: 'fighting',
        tags: ['Cyberpunk', 'Fighting', 'Rain', 'Drones'],
        config: {
            player: {
                speed: 400,
                asset: 'shooter/cyber-city/cyborg.png',
                scale: 0.35,
                hp: 15
            },
            weapon: {
                fireRate: 350,
                type: 'melee',
                asset: 'bullet_light',
                scale: 1.5
            },
            spawn: {
                type: 'chaos',
                count: 20,
                spacing: 200,
                speed: 150,
                asset: 'shooter/cyber-city/drone-non-shooting-transparent.png',
                scale: 0.35,
                recurring: true
            },
            levelThreshold: 15,
            background: 'background/cyborg-city.png',
            vibe: 'rainy-cyber',
            movementMode: 'stage-scroll',
            environmentSequence: [
                { level: 1, vibe: 'rainy-cyber' },
                { level: 3, vibe: 'snow' },
                { level: 6, vibe: 'fire' },
                { level: 10, vibe: 'sunny' }
            ]
        }
    },
    'dual-fighter-test': {
        id: 'dual-fighter-test',
        name: 'Dual Protocol: Neo Versus',
        description: 'A pure 1v1 cyborg duel in the heart of the neon arena. No distractions, just skill. P1: WASD, P2: ARROWS.',
        category: 'fighting',
        tags: ['Multiplayer', 'Fighting', '1v1', 'Versus'],
        config: {
            fighters: [
                {
                    speed: 450,
                    asset: 'fighter/dual-fighter/p1_red-transparent.png',
                    scale: 0.35,
                    hp: 20,
                    controls: 'WASD',
                    team: 'alpha'
                },
                {
                    speed: 450,
                    asset: 'fighter/dual-fighter/p2_blue-transparent.png',
                    scale: 0.35,
                    hp: 20,
                    controls: 'ARROWS',
                    team: 'beta'
                }
            ],
            weapon: {
                fireRate: 350,
                type: 'melee',
                asset: 'bullet_light',
                scale: 1.5,
                lunge: 400
            },
            background: 'fighter/dual-fighter/arena_bg.png',
            vibe: 'neon',
            movementMode: 'stage-scroll'
        }
    },
    'cyber-samurai-01': {
        id: 'cyber-samurai-01',
        name: 'Cyber Samurai: Rain',
        description: 'Master the blade in a rain-soaked metropolis. Advance through the streets and clear the sector.',
        category: 'fighting',
        tags: ['Samurai', 'Brawler', 'Rain', 'Neon'],
        config: {
            player: {
                speed: 400,
                asset: 'fighter/cyber-showdown/samurai-transparent.png',
                scale: 0.4,
                hp: 25
            },
            weapon: {
                fireRate: 400,
                type: 'melee',
                asset: 'bullet_light',
                scale: 2,
                lunge: 450
            },
            spawn: {
                type: 'chaos',
                count: 15,
                speed: 120,
                asset: 'fighter/dual-fighter/guard_drone-transparent.png',
                scale: 0.35,
                recurring: true
            },
            background: 'fighter/dual-fighter/arena_bg.png',
            vibe: 'rainy-cyber',
            movementMode: 'stage-scroll'
        }
    },
    'shadow-duel-01': {
        id: 'shadow-duel-01',
        name: 'Shadow Duel: Rooftop',
        description: 'High-stakes 1v1 duel on the rain-slicked rooftops of Neo-Tokyo. Samurai vs Ninja.',
        category: 'fighting',
        tags: ['Versus', '1v1', 'Ninja', 'Rooftop'],
        config: {
            fighters: [
                {
                    speed: 500,
                    asset: 'fighter/cyber-showdown/samurai-transparent.png',
                    scale: 0.4,
                    hp: 30,
                    controls: 'WASD',
                    team: 'samurai'
                },
                {
                    speed: 550,
                    asset: 'fighter/cyber-showdown/ninja-transparent.png',
                    scale: 0.4,
                    hp: 25,
                    controls: 'ARROWS',
                    team: 'ninja'
                }
            ],
            weapon: {
                fireRate: 300,
                type: 'melee',
                asset: 'bullet_light',
                scale: 1.8,
                lunge: 500
            },
            background: 'fighter/cyber-showdown/rooftop_bg.png',
            vibe: 'rainy-cyber',
            movementMode: 'stage-scroll'
        }
    },
    'neon-street-brawler': {
        id: 'neon-street-brawler',
        name: 'Neon Street Brawler',
        description: 'Classic side-scrolling beat em up action through the heart of the neon city.',
        category: 'fighting',
        tags: ['BeatEmUp', 'Street', 'Brawler'],
        config: {
            player: {
                speed: 450,
                asset: 'fighter/cyber-showdown/ninja-transparent.png',
                scale: 0.4,
                hp: 20
            },
            weapon: {
                fireRate: 300,
                type: 'melee',
                asset: 'bullet_light',
                scale: 1.5,
                lunge: 350
            },
            spawn: {
                type: 'chaos',
                count: 12,
                speed: 150,
                asset: 'fighter/dual-fighter/guard_drone-transparent.png',
                scale: 0.3
            },
            background: 'fighter/cyber-showdown/street_bg.png',
            vibe: 'neon',
            movementMode: 'stage-scroll'
        }
    },
    'cyber-coop-brawler': {
        id: 'cyber-coop-brawler',
        name: 'Cyber City: Co-op Protocol',
        description: 'Team up with a friend to clear the sector of security drones. P1: WASD, P2: ARROWS.',
        category: 'fighting',
        tags: ['Co-op', 'Multiplayer', 'Brawler'],
        config: {
            fighters: [
                {
                    speed: 400,
                    asset: 'fighter/cyber-showdown/samurai-transparent.png',
                    scale: 0.35,
                    hp: 20,
                    controls: 'WASD',
                    team: 'alpha'
                },
                {
                    speed: 450,
                    asset: 'fighter/cyber-showdown/ninja-transparent.png',
                    scale: 0.35,
                    hp: 15,
                    controls: 'ARROWS',
                    team: 'alpha'
                }
            ],
            weapon: {
                fireRate: 350,
                type: 'melee',
                asset: 'bullet_light',
                scale: 1.5,
                lunge: 400
            },
            spawn: {
                type: 'chaos',
                count: 20,
                speed: 100,
                asset: 'fighter/dual-fighter/guard_drone-transparent.png',
                scale: 0.3,
                recurring: true
            },
            background: 'fighter/cyber-showdown/night_city_bg.png',
            skyBackground: 'background/space-Background-1.png',
            vibe: 'neon',
            movementMode: 'stage-scroll'
        }
    },
    'retro-strike-01': {
        id: 'retro-strike-01',
        name: 'Retro Strike',
        description: 'Classic 1v1 arcade fighting. Master parries and unleash your Super Move when the meter is full!',
        category: 'fighting',
        tags: ['Versus', 'Classic', 'Special Meter'],
        config: {
            fighters: [
                { speed: 400, asset: 'fighter/cyber-showdown/samurai-transparent.png', scale: 0.5, hp: 30, team: 'p1', controls: 'WASD' },
                { speed: 400, asset: 'fighter/cyber-showdown/ninja-transparent.png', scale: 0.5, hp: 30, team: 'p2', controls: 'ARROWS' }
            ],
            weapon: { fireRate: 400, type: 'melee', scale: 2.0, lunge: 500 },
            background: 'fighter/dual-fighter/arena_bg.png',
            vibe: 'neon'
        }
    },
    'rooftop-rumble-01': {
        id: 'rooftop-rumble-01',
        name: 'Rooftop Rumble',
        description: 'High-flying platform fighter. Knock enemies off the stage or into walls for big damage!',
        category: 'fighting',
        tags: ['Platform Fighter', 'Acrobatic', 'Fast'],
        config: {
            player: { speed: 500, jumpForce: -900, asset: 'fighter/cyber-showdown/ninja-transparent.png', scale: 0.4, hp: 50 },
            spawn: { type: 'chaos', count: 8, speed: 200, asset: 'fighter/dual-fighter/guard_drone-transparent.png', scale: 0.3, recurring: true },
            background: 'fighter/cyber-showdown/rooftop_bg.png',
            vibe: 'rainy-cyber',
            movementMode: 'stage-scroll'
        }
    },
    'cyber-coliseum-01': {
        id: 'cyber-coliseum-01',
        name: 'Cyber Coliseum',
        description: 'Brutal pit fighting. Heavy hits, wall bounces, and explosive Supers.',
        category: 'fighting',
        tags: ['Brutal', 'Brawler', 'WallBounce'],
        config: {
            fighters: [
                { speed: 350, asset: 'fighter/cyber-showdown/samurai-transparent.png', scale: 0.6, hp: 40, team: 'red', controls: 'WASD' },
                { speed: 350, asset: 'fighter/dual-fighter/guard_drone-transparent.png', scale: 0.5, hp: 40, team: 'blue', controls: 'ARROWS' }
            ],
            weapon: { fireRate: 600, type: 'melee', scale: 2.5, lunge: 600, damage: 3 },
            background: 'fighter/dual-fighter/arena_bg.png',
            vibe: 'dark-neon'
        }
    },
    'dragons-path-01': {
        id: 'dragons-path-01',
        name: 'Dragons Path',
        description: 'Classic side-scrolling beat em up. Fight through waves of cyber-punks to reach the boss.',
        category: 'fighting',
        tags: ['BeatEmUp', 'Adventure', 'Coop'],
        config: {
            fighters: [
                { speed: 400, asset: 'fighter/cyber-showdown/samurai-transparent.png', scale: 0.4, hp: 20, team: 'hero', controls: 'WASD' },
                { speed: 450, asset: 'fighter/cyber-showdown/ninja-transparent.png', scale: 0.4, hp: 15, team: 'hero', controls: 'ARROWS' }
            ],
            spawn: { type: 'chaos', count: 25, speed: 100, asset: 'fighter/dual-fighter/guard_drone-transparent.png', scale: 0.3, recurring: true },
            background: 'fighter/cyber-showdown/street_bg.png',
            vibe: 'neon',
            movementMode: 'stage-scroll'
        }
    },
    'titan-versus-01': {
        id: 'titan-versus-01',
        name: 'Titan Duel: Night City',
        description: 'A massive versus encounter high above the city. Higher speed, higher stakes.',
        category: 'fighting',
        tags: ['Versus', '1v1', 'HighStakes'],
        config: {
            fighters: [
                {
                    speed: 550,
                    asset: 'fighter/cyber-showdown/samurai-transparent.png',
                    scale: 0.5,
                    hp: 50,
                    controls: 'WASD',
                    team: 'alpha'
                },
                {
                    speed: 550,
                    asset: 'fighter/cyber-showdown/ninja-transparent.png',
                    scale: 0.5,
                    hp: 50,
                    controls: 'ARROWS',
                    team: 'beta'
                }
            ],
            weapon: {
                fireRate: 250,
                type: 'melee',
                asset: 'bullet_light',
                scale: 2.2,
                lunge: 600
            },
            background: 'fighter/cyber-showdown/night_city_bg.png',
            vibe: 'neon',
            movementMode: 'stage-scroll'
        }
    },
    'boss-rush-brute': {
        id: 'boss-rush-brute',
        name: 'Boss Rush: The Brute',
        description: 'Face off against a massive cybernetic enforcer. Use speed to avoid its heavy strikes.',
        category: 'fighting',
        tags: ['Boss', 'Challenge', 'Hard'],
        config: {
            player: {
                speed: 500,
                asset: 'fighter/cyber-showdown/ninja-transparent.png',
                scale: 0.4,
                hp: 15
            },
            weapon: {
                fireRate: 300,
                type: 'melee',
                asset: 'bullet_light',
                scale: 1.5,
                lunge: 500
            },
            spawn: {
                type: 'chaos',
                count: 1,
                speed: 50,
                asset: 'fighter/cyber-showdown/boss-transparent.png',
                scale: 1.2,
                recurring: false
            },
            background: 'fighter/cyber-showdown/night_city_bg.png',
            vibe: 'neon',
            movementMode: 'stage-scroll'
        }
    },
    'neon-hopper-01': {
        id: 'neon-hopper-01',
        name: 'Neon Hopper',
        description: 'High-speed precision trials. Master the wall jump to reach the summit!',
        category: 'platformer',
        tags: ['Precision', 'Parkour', 'Speed'],
        config: {
            player: { speed: 350, jumpForce: -700, scale: 0.45, asset: 'shooter/cyber-city/cyborg-non-shooting-transparent.png' },
            level: { width: 3200, height: 600 },
            vibe: 'neon'
        }
    },
    'cyber-quest-01': {
        id: 'cyber-quest-01',
        name: 'Cyber Quest',
        description: 'Side-scrolling adventure through the neon megastructure. Collect data fragments.',
        category: 'platformer',
        tags: ['Adventure', 'Exploration', 'Collectibles'],
        config: {
            player: { speed: 300, jumpForce: -600, scale: 0.5, asset: 'shooter/cyber-city/ninja-non-shooting-transparent.png' },
            level: { width: 5000, height: 600 },
            vibe: 'rainy-cyber'
        }
    },
    'gravity-runner-01': {
        id: 'gravity-runner-01',
        name: 'Gravity Runner',
        description: 'Defy the laws of physics. Constant forward motion and gravity manipulation.',
        category: 'platformer',
        tags: ['Runner', 'Gravity', 'Puzzle'],
        config: {
            player: { speed: 450, jumpForce: -500, scale: 0.4, asset: 'shooter/cyber-city/cyborg-non-shooting-transparent.png' },
            level: { width: 4000, height: 600 },
            vibe: 'pulse'
        }
    },
    'void-jumper-01': {
        id: 'void-jumper-01',
        name: 'Void Jumper',
        description: 'Survival platforming over the endless void. Dont look down.',
        category: 'platformer',
        tags: ['Survival', 'Hardcore', 'Void'],
        config: {
            player: { speed: 320, jumpForce: -750, scale: 0.45, asset: 'shooter/cyber-city/cyborg-non-shooting-transparent.png' },
            level: { width: 3500, height: 800 },
            vibe: 'dark-neon'
        }
    },
    'neon-match-01': {
        id: 'neon-match-01',
        name: 'Neon Match',
        description: 'High-speed color matching. Clear the grid before the pulses overload!',
        category: 'puzzle',
        tags: ['Match-3', 'Neon', 'Fast'],
        config: {
            grid: { width: 8, height: 8, tileSize: 60, types: 5 },
            type: 'match-3',
            vibe: 'neon'
        }
    },
    'logic-block-01': {
        id: 'logic-block-01',
        name: 'Logic Block',
        description: 'Classic warehouse pushing logic. Move all energy cores to the designated sockets.',
        category: 'puzzle',
        tags: ['Sokoban', 'Logic', 'Strategy'],
        config: {
            grid: { width: 10, height: 10, tileSize: 50, types: 4 },
            type: 'sokoban',
            vibe: 'industrial'
        }
    },
    'quantum-chain-01': {
        id: 'quantum-chain-01',
        name: 'Quantum Chain',
        description: 'Chain reactions in a grid. Trigger one pulse to clear entire sectors.',
        category: 'puzzle',
        tags: ['Chain-Reaction', 'Science', 'Grid'],
        config: {
            grid: { width: 12, height: 8, tileSize: 50, types: 6 },
            type: 'match-3',
            vibe: 'pulse'
        }
    },
    'grid-escape-01': {
        id: 'grid-escape-01',
        name: 'Grid Escape',
        description: 'Navigate the labyrinth. Move barriers to create a path for your escape pod.',
        category: 'puzzle',
        tags: ['Pathfinding', 'Puzzle', 'Escape'],
        config: {
            grid: { width: 8, height: 8, tileSize: 60, types: 3 },
            type: 'match-3',
            vibe: 'dark-neon'
        }
    }
};

export const getGameById = (id) => GAME_REGISTRY[id] || null;
export const getAllGames = () => Object.values(GAME_REGISTRY);
