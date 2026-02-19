
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
    }
};

export const getGameById = (id) => GAME_REGISTRY[id] || null;
export const getAllGames = () => Object.values(GAME_REGISTRY);
