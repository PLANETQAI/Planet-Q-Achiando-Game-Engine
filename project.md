# Game Generator Platform - Complete Project Documentation

## Project Overview

A Next.js-based game generation platform that creates playable shooter, racing, and fighting games through a simulated AI coding interface. The platform serves pre-built, configurable game variants. Users can create new games or edit existing ones through a unified interface that showcases a "vibe coding" experience.

---

## Core Concept

### What This Platform Does
- Allows users to describe a game idea in natural language
- Simulates an AI "coding" the game in real-time with visual feedback
- Generates playable games by selecting and configuring pre-built variants from a central registry
- Provides both creation and editing capabilities in a single unified interface
- Displays live game previews during the creation/editing process

### What Makes It Unique
- **Deterministic Intelligence**: No actual AI generation—smart variant selection based on user input
- **Vibe Coding UX**: Creates the illusion of watching an AI code in real-time
- **Unified Create/Edit Flow**: Single interface handles both new games and modifications
- **Live Preview**: See your game come to life as it's being "generated"
- **Config-Driven**: All game logic lives in a central registry, making future AI integration seamless

### Phase 1 Scope (Current State)
This documentation covers the expanded Phase 1: building 24+ deterministic game variants (Shooters, Racing, Fighting) with a polished creation experience and advanced environment/juice managers.

---

## Technical Architecture

### Technology Stack
- **Framework**: Next.js 14+ (App Router)
- **Language**: Pure JavaScript (no TypeScript)
- **Game Engine**: Phaser 3 (for all game logic and rendering)
- **Styling**: Tailwind CSS (following provided design system)
- **Animations**: Framer Motion (for UI transitions and vibe coding effects)
- **State Management**: React Context API + useState hooks
- **Client/Server Split**: Server components for routing, client components for interactivity

### Why These Choices?
- **Next.js App Router**: Server-side rendering for SEO, client components for games
- **Pure JavaScript**: Faster development, easier for future contributors
- **Phaser 3**: Battle-tested 2D game engine, perfect for browser games
- **Config-driven**: Separates game logic from data, enabling future AI modifications

---

## Project Structure

```
game-generator/
│
├── app/
│   ├── layout.js                           # Root layout (server)
│   ├── page.js                             # Home page (server)
│   │
│   └── play/
│       ├── page.js                         # Create new game (server)
│       ├── [id]/
│       │   └── page.js                     # Edit/Create with ID (server)
│       │
│       └── _components/                    # Client components for play routes
│           ├── GameEditor.jsx              # Main editor container (client)
│           ├── GamePreview.jsx             # Live game preview (client)
│           ├── PhaserGame.jsx              # Phaser wrapper (client)
│           │
│           ├── vibe-coder/                 # Vibe coding simulation
│           │   ├── VibeCoderOverlay.jsx    # Full-screen coding UI (client)
│           │   ├── ChatInterface.jsx       # AI chat messages (client)
│           │   ├── AssetInitializationGrid.jsx # Grid of assets during prep
│           │   ├── LogicProcessingSession.jsx # Informative session during logic prep
│           │   └── index.js                # Exports
│           │
│           ├── game-ui/                    # In-game UI components
│           │   └── ...
│           │
│           └── shared/
│               └── ...
│
├── components/
│   ├── home/
│   │   ├── GameGrid.jsx                    # Grid of game cards (client)
│   │   ├── GameCard.jsx                    # Individual game card (client)
│   │   └── ...
│   │
│   └── shared/
│       └── Header.jsx                      # Site header (client)
│
├── games/
│   ├── shooter/
│   │   └── core/                           # Shared shooter logic
│   │       ├── BaseShooter.js
│   │       ├── WeaponSystem.js
│   │       ├── SpawnManager.js
│   │       └── CollisionHandler.js
│   │
│   ├── racing/
│   │   └── core/                           # Shared racing logic
│   │       ├── BaseRacer.js
│   │       └── SkyRacer.js
│   │
│   ├── fighter/
│   │   └── core/                           # Shared fighting logic
│   │       ├── BaseFighter.js
│   │       ├── FighterWeaponSystem.js
│   │       └── FighterCollisionHandler.js
│   │
│   └── core/                               # Project-wide core managers
│       ├── EnvironmentManager.js           # Weather, vibes, shaders
│       ├── JuiceManager.js                 # Screenshake, particles, feedback
│       └── MovementManager.js              # Input handling across genres
│
├── lib/
│   ├── gameRegistry.js                     # The Single Source of Truth for all games
│   ├── vibeCoder.js                        # Simulation steps & messages
│   ├── gameSelector.js                     # Keyword matching logic
│   ├── configBuilder.js                    # Dynamic config construction
│   └── storage.js                          # LocalStorage management
│
└── public/                                 # Static assets (sprites, audio)
    └── assets/
        ├── shooter/
        ├── racing/
        ├── fighter/
        └── ...
```
    ├── home.png                            # Home page design reference
    ├── create.png                          # Create/Edit page design reference
    ├── guidelines.md                       # Design system documentation
    └── components/
        ├── buttons.png
        ├── cards.png
        └── forms.png
```

---

## Routing Architecture

### Route Structure

#### 1. Home Page: `/`
- **File**: `app/page.js` (Server Component)
- **Purpose**: Landing page showcasing all available games
- **Components Used**: `Hero`, `GameGrid`, `GameCard`, `CategoryFilter`, `SearchBar`
- **Data**: Fetches list of all games from game registry
- **Actions**: Navigate to `/play` (create new) or `/play/[id]` (edit existing)

#### 2. Create New Game: `/play`
- **File**: `app/play/page.js` (Server Component)
- **Purpose**: Entry point for creating a new game from scratch
- **Behavior**: 
  - Renders without an ID parameter
  - Shows empty game editor
  - User inputs game description → triggers vibe coding → generates new game with unique ID
  - After generation, URL updates to `/play/[new-id]`
- **Components**: Delegates to `GameEditor` client component

#### 3. Edit/View Game: `/play/[id]`
- **File**: `app/play/[id]/page.js` (Server Component)
- **Purpose**: Edit existing game OR continue creation after initial generation
- **Behavior**:
  - Loads game config by ID
  - If ID exists: shows editor in "edit mode" with game preview
  - If ID is new: shows vibe coding completion → then editor
  - User can modify config → see live preview → save changes
- **Components**: Delegates to `GameEditor` client component with `id` prop

### Unified Create/Edit Flow

The magic is that `/play/page.js` and `/play/[id]/page.js` both render the **same client component** (`GameEditor`) but with different props:

```javascript
// app/play/page.js (Server)
export default function CreateGamePage() {
  return <GameEditor mode="create" />
}

// app/play/[id]/page.js (Server)
export default function EditGamePage({ params }) {
  const { id } = params
  return <GameEditor mode="edit" id={id} />
}
```

The `GameEditor` client component handles all the complexity:
- Detects mode (create vs edit)
- Loads existing config if in edit mode
- Shows vibe coder overlay during initial creation
- Displays live game preview once config exists
- Provides editing controls to modify game parameters

---

## Component Architecture

### Server vs Client Components

#### Server Components (app/ folder)
- **Purpose**: Routing, initial data fetching, SEO
- **Examples**: `app/page.js`, `app/play/page.js`, `app/play/[id]/page.js`, `app/layout.js`
- **Rules**: 
  - No hooks (useState, useEffect)
  - No browser APIs
  - Can fetch data directly
  - Can pass data to client components as props

#### Client Components (marked with 'use client')
- **Purpose**: Interactivity, game rendering, state management
- **Location**: `app/play/_components/`, `components/`
- **Examples**: All game logic, vibe coder UI, interactive forms
- **Rules**:
  - Must have `'use client'` directive at top
  - Can use hooks and browser APIs
  - Cannot be async

### Component Hierarchy

```
app/play/[id]/page.js (Server)
  └── GameEditor.jsx (Client)
      ├── VibeCoderOverlay.jsx (Client) [shown during creation]
      │   ├── ChatInterface.jsx
      │   ├── AssetInitializationGrid.jsx
      │   └── LogicProcessingSession.jsx
      │
      └── GamePreview.jsx (Client) [shown after generation]
          └── PhaserGame.jsx
              └── GameHUD.jsx
              └── PauseMenu.jsx
              └── GameOver.jsx
```

---

## Game Variants Specification

### Shooter Games (5 Variants)

#### Variant 1: Space Invaders Style
**Visual Identity**: Classic arcade, grid-based enemies, retro pixel art

**Layout Characteristics**:
- Player ship fixed at bottom of screen
- Enemies arranged in grid formation at top
- Vertical shooting only
- Horizontal player movement (left/right arrow keys)
- Shields/barriers between player and enemies

**Core Mechanics**:
- Wave-based progression (enemies move down incrementally)
- Enemies shoot back randomly
- Limited lives (3 hearts)
- Increasing difficulty (faster movement each wave)

**Win/Loss Conditions**:
- Win: Clear all enemy waves
- Lose: Enemies reach bottom OR player loses all lives

**Config Parameters**:
- Enemy grid size (rows × columns)
- Enemy types and health
- Movement speed and pattern
- Shield positions and durability
- Player fire rate and bullet speed

---

#### Variant 2: Top-Down Shooter
**Visual Identity**: Modern twin-stick aesthetic, arena-based, particle effects

**Layout Characteristics**:
- Player in center of scrolling arena
- 360-degree movement (WASD keys)
- Mouse-aim shooting
- Camera follows player
- Enemies spawn from all edges

**Core Mechanics**:
- Continuous enemy waves
- Multiple weapon types (pistol, shotgun, rifle)
- Ammo management or cooldowns
- Score multiplier for consecutive kills
- Power-ups drop from enemies

**Win/Loss Conditions**:
- Win: Survive for X minutes OR reach score threshold
- Lose: Health depletes to zero

**Config Parameters**:
- Arena size and boundary type
- Enemy spawn rates and positions
- Weapon stats (damage, fire rate, spread)
- Player movement speed and health
- Power-up types and drop rates

---

#### Variant 3: Side-Scroller Shooter
**Visual Identity**: Platformer-meets-shooter, layered parallax background

**Layout Characteristics**:
- Side view (player moves left/right)
- Jump mechanic (spacebar)
- Auto-scroll OR manual progression
- Enemies on platforms and flying
- Terrain obstacles

**Core Mechanics**:
- Platform jumping + shooting
- Gravity and collision with terrain
- Enemies patrol or fly in patterns
- Checkpoints for respawn
- Boss fights at end of levels

**Win/Loss Conditions**:
- Win: Reach end of level
- Lose: Fall into pit OR lose all lives

**Config Parameters**:
- Scroll speed (if auto-scroll)
- Platform layout and difficulty
- Enemy types and patrol patterns
- Weapon power-ups
- Level length

---

#### Variant 4: Twin-Stick Shooter
**Visual Identity**: Neon arena, fast-paced, swarm enemies

**Layout Characteristics**:
- Fixed arena with visible boundaries
- WASD for movement
- Arrow keys for shooting direction
- Top-down perspective
- Tight, claustrophobic space

**Core Mechanics**:
- Move and shoot independently
- Enemy swarms increase over time
- Dodge-focused gameplay (fast enemies, slow bullets)
- Score-based survival
- Power-ups appear periodically

**Win/Loss Conditions**:
- Win: Survive until timer ends
- Lose: Get hit (often one-hit death or very low HP)

**Config Parameters**:
- Arena size and shape
- Enemy aggression and count
- Player movement speed
- Weapon cooldown and power
- Power-up frequency

---

#### Variant 5: Bullet Hell
**Visual Identity**: Anime-inspired, dense bullet patterns, small player hitbox

**Layout Characteristics**:
- Vertical scrolling playfield
- Narrow arena (emphasizes dodging)
- Player ship at bottom
- Enemies and bosses at top
- Bullet patterns fill screen

**Core Mechanics**:
- Precision dodging (small hitbox visualization)
- Focus mode (slow movement for tight dodges)
- Bomb/special attack (clears bullets)
- Pattern memorization
- Boss phases

**Win/Loss Conditions**:
- Win: Defeat boss
- Lose: Player hitbox touches bullet

**Config Parameters**:
- Bullet pattern complexity
- Boss phases and health
- Player hitbox size
- Bomb count and power
- Scroll speed

---

### Racing Games (5 Variants)

#### Variant 1: Arcade Racer
**Visual Identity**: Top-down view, bright colors, simple circuits

**Layout Characteristics**:
- Oval or figure-8 track
- Top-down camera (entire track visible or section visible)
- 3-4 AI opponents
- Boost pads scattered on track
- Clear track boundaries (walls)

**Core Mechanics**:
- Accelerate/brake (up/down arrows)
- Steering (left/right arrows)
- Drift boost (hold spacebar while turning)
- Position-based racing (1st/2nd/3rd/4th)
- Lap counting and checkpoints

**Win/Loss Conditions**:
- Win: Finish 1st place after 3 laps
- Lose: Finish 4th place

**Config Parameters**:
- Track shape and length
- Number of laps
- AI opponent skill level
- Car stats (speed, acceleration, handling)
- Boost pad count and power

---

#### Variant 2: Drift Racer
**Visual Identity**: Mountain roads, sharp corners, drift trails

**Layout Characteristics**:
- Winding track with hairpin turns
- Side-view or angled top-down
- Single player (vs ghost or time)
- Drift zones highlighted
- Narrow roads with cliff edges

**Core Mechanics**:
- Drift initiation (tap brake while turning)
- Drift scoring (longer drift = higher score)
- Drift chain multipliers
- Speed management (too fast = crash)
- Perfect drift bonuses

**Win/Loss Conditions**:
- Win: Complete track under target time OR beat drift score threshold
- Lose: Crash off road 3 times

**Config Parameters**:
- Track curvature and elevation
- Drift scoring multipliers
- Car grip and drift responsiveness
- Target time or score
- Road width

---

#### Variant 3: Obstacle Course
**Visual Identity**: Straight or slightly curved track, moving hazards

**Layout Characteristics**:
- Lane-based (3-5 lanes)
- Forward-scrolling (auto or manual)
- Obstacles move across lanes
- Jump ramps and gaps
- Speed boosts and slowdowns

**Core Mechanics**:
- Lane switching (left/right arrows)
- Jump (spacebar)
- Speed control (up/down arrows)
- Collision damage (health bar)
- Distance-based progression

**Win/Loss Conditions**:
- Win: Reach finish line within time limit
- Lose: Health depletes OR time runs out

**Config Parameters**:
- Lane count
- Obstacle types and speed
- Track length
- Health and damage values
- Time limit

---

#### Variant 4: Time Trial
**Visual Identity**: Complex circuit, ghost racer, clean UI

**Layout Characteristics**:
- Multi-path circuit track
- Checkpoints throughout
- Ghost car (player's best time or developer time)
- Optional shortcuts
- Clean racing line indicators

**Core Mechanics**:
- Pure racing (no combat/obstacles)
- Checkpoint timer (must reach each within time)
- Ghost comparison in real-time
- Optimal line rewards (inside corners)
- Lap time recording

**Win/Loss Conditions**:
- Win: Beat target time
- Lose: Miss checkpoint time limit

**Config Parameters**:
- Track complexity and paths
- Checkpoint time allowances
- Ghost car difficulty
- Car performance tuning
- Track surface friction

---

#### Variant 5: Combat Racing
**Visual Identity**: Battle arena + race track hybrid, power-up pickups

**Layout Characteristics**:
- Circular or mixed arena/track
- Weapon pickups on track
- Destructible track elements
- 3 AI opponents (armed)
- Health bars visible

**Core Mechanics**:
- Racing + shooting
- Weapon pickups (missiles, mines, shields)
- Vehicle damage affects performance
- Position matters (1st place = target)
- Eliminate OR outpace opponents

**Win/Loss Conditions**:
- Win: Finish 1st after 3 laps OR be last car standing
- Lose: Car destroyed OR finish last

**Config Parameters**:
- Weapon spawn rate and types
- Damage values and effects
- Track hazards
- AI aggression
- Health and armor values

---

## Configuration System

### Purpose of Configs
Configs are the **single source of truth** for each game, now centralized in `lib/gameRegistry.js`. They define:
- How the game looks (sprites, colors, layout)
- How the game plays (mechanics, difficulty, controls)
- What assets to load (sprites, sounds, music)
- How the game ends (win/loss conditions)

By keeping all this in a central registry, we:
- Centralize management of dozens of variants
- Enable easy selection based on user input
- Can "deep clone" and modify configs for custom vibes

### Central Registry Structure

The `lib/gameRegistry.js` file contains a mapping of game IDs to their full configurations. For example:

```javascript
// lib/gameRegistry.js

export const GAME_REGISTRY = {
  'space-invaders-01': {
    id: 'space-invaders-01',
    name: 'Galactic Defenders',
    category: 'shooter',
    config: {
      player: { speed: 400, asset: '...', hp: 3 },
      weapon: { fireRate: 200, bulletSpeed: 800, type: 'bullet' },
      spawn: { type: 'grid', count: 12, asset: '...' },
      background: '...'
    }
  },
  // ... 20+ other variants
}
```

---

## Vibe Coder System (Detailed)

### What is Vibe Coding?
The vibe coder is a **simulated AI coding experience** that creates the illusion of watching an AI build a game in real-time. It's entirely deterministic—no actual code generation happens. Instead, it's a carefully choreographed sequence of UI animations and messages that:

1. Makes the user feel like an AI is understanding their request
2. Displays asset preparation and logic handling progress
3. Concludes with a playable game

### Vibe Coder Stages (Implemented)

#### Stage 1: ASSETS (4 seconds)
**Visual**: `AssetInitializationGrid` showing progress bars for Hero Sprite, Enemy Sheet, World Texture, etc.

**What Happens**:
- Parse user input to select a template ID using `lib/gameSelector.js`
- Match keywords (e.g., "space" → `space-invaders-01`)
- Prepare assets for the selected variant

#### Stage 2: LOGIC (6 seconds)
**Visual**: `LogicProcessingSession` showing an "Informative Session" with gameplay tips and a rotating engine core icon.

**What Happens**:
- `lib/configBuilder.js` creates a deep clone of the registry config
- Applies "Vibe" overrides (e.g., increasing speed if prompt says "fast")
- Initializes physics and collision layers in simulation

#### Stage 3: READY (1 second)
**Visual**: Scale-up animation of a bolt icon with "ENGINE READY" status.

**What Happens**:
- Final config is saved to `lib/storage.js`
- Transitions from `generating` status to `ready`

### Vibe Coder Implementation Structure

The simulation is controlled by `lib/vibeCoder.js`, which defines step durations and identifiers:

```javascript
// lib/vibeCoder.js
export const VIBE_STEPS = {
    ASSETS: 'assets',
    LOGIC: 'logic',
    READY: 'ready'
};

export const getSimulationConfig = (prompt) => {
    return {
        steps: [
            { id: VIBE_STEPS.ASSETS, duration: 4000 },
            { id: VIBE_STEPS.LOGIC, duration: 6000 },
            { id: VIBE_STEPS.READY, duration: 1000 }
        ]
    };
};
```

---

## User Flow (Step-by-Step)

### Flow 1: Creating a New Game

**Step 1**: User lands on home page (`/`)
- Sees grid of existing games
- Clicks "Create New Game" button

**Step 2**: Navigates to `/play`
- `app/play/page.js` renders
- Shows `GameEditor` in `mode="create"`

**Step 3**: `GameEditor` displays input form
- "What kind of game do you want?"
- Category selector: Shooter / Racing
- Text input: "Describe your game..."
- Examples shown: "Space shooter with aliens", "Fast arcade racing"

**Step 4**: User submits form
- Example input: "I want a top-down shooter with lots of enemies"
- Click "Generate Game"

**Step 5**: Vibe Coder activates
- Full-screen overlay appears
- THINKING stage (2s): "Analyzing..."
- APPROACH stage (3s): Chat explains architecture
- ASSETS stage (4s): Progress bars for sprites/sounds
- CODING stage (6s): Terminal shows file creation
- FINALIZING stage (2s): "Your game is ready!"

**Step 6**: Reveal
- Vibe coder fades out
- Game preview fades in (shows Phaser game running)
- URL changes to `/play/top-down-shooter-abc123`
- Control panel appears on side (edit controls)

**Step 7**: User plays the game
- Game is fully playable in preview
- Can pause, restart, see score
- Can click "Edit" to modify config

---

### Flow 2: Editing an Existing Game

**Step 1**: User on home page
- Sees game card for "Galactic Defenders"
- Clicks "Edit" button on card

**Step 2**: Navigates to `/play/space-invaders-01`
- `app/play/[id]/page.js` renders
- Fetches config for `space-invaders-01`
- Renders `GameEditor` in `mode="edit"` with `id="space-invaders-01"`

**Step 3**: Editor loads
- NO vibe coder (game already exists)
- Game preview shown immediately (Phaser game running)
- Control panel open on side

**Step 4**: User edits config
- Control panel shows sliders/inputs:
  - Enemy speed: [slider]
  - Player health: [number input]
  - Fire rate: [slider]
  - Enemy count: [number input]
- User changes "Enemy speed" from 30 to 50

**Step 5**: Live preview updates
- Game restarts with new config
- Enemies move faster
- User can test immediately

**Step 6**: User saves
- Clicks "Save Changes"
- Config saved to localStorage (or database in future)
- Success toast: "Game updated!"

---

### Flow 3: Playing a Game from Home

**Step 1**: User clicks "Play" on game card
- Could navigate to `/play/[id]?mode=play`
- OR open game in full-screen modal
- Game loads in play-only mode (no edit controls)

**Step 2**: Game runs
- Full Phaser game experience
- HUD shows score, health, etc.
- Pause menu available

**Step 3**: Game ends
- Win/lose screen shows
- Options: "Play Again", "Edit", "Back to Home"

---

## Design Integration

### Design Files Location
```
design/
├── home.png              # Complete home page design
├── create.png            # Create/edit page design
├── guidelines.md         # Color palette, fonts, spacing rules
└── components/
    ├── buttons.png       # Button states and variants
    ├── cards.png         # Game card designs
    └── forms.png         # Input field designs
```

### Design System Rules

The project **must strictly follow** the provided design files. Here's how:

#### 1. Home Page (`/`)
**Reference**: `design/home.png`

**Must Match**:
- Header layout and navigation
- Hero section text, button styles, spacing
- Game grid: card size, spacing, hover effects
- Category filter placement and styling
- Footer layout

**Extraction Steps**:
1. Measure exact spacing between elements (use browser devtools or Figma/Sketch)
2. Extract hex colors for background, text, accents
3. Note font families and sizes
4. Identify button border radius, padding, shadows
5. Document hover/active states for interactive elements

**Implementation**:
```javascript
// Extract from design/guidelines.md
const colors = {
  primary: '#FF6B35',      // From design
  background: '#0F0F1E',   // From design
  cardBg: '#1A1A2E',       // From design
  // ... etc
}

const spacing = {
  cardGap: '24px',         // Measured from design
  sectionPadding: '80px',  // Measured from design
  // ... etc
}
```

---

#### 2. Create/Edit Page (`/play` and `/play/[id]`)
**Reference**: `design/create.png`

**Must Match**:
- Input form layout (centered? sidebar?)
- Vibe coder overlay appearance (full-screen? modal?)
- Code simulator terminal styling (font, colors, animations)
- Game preview frame (border? shadow? size?)
- Control panel (sidebar width, toggle button, input styles)

**Key Design Elements to Extract**:
- Vibe coder background color and blur
- Terminal font (typically monospace: 'Courier New', 'Fira Code')
- Progress bar height, color, animation speed
- Chat message bubble styling
- Control panel input styling (sliders, number inputs, dropdowns)

**Layout Modes** (based on design):

**Mode A: Side-by-Side**
```
+------------------+----------------------+
| Control Panel    |   Game Preview       |
| (30% width)      |   (70% width)        |
|                  |                      |
| [inputs]         |   [Phaser canvas]    |
| [sliders]        |                      |
|                  |                      |
+------------------+----------------------+
```

**Mode B: Overlay**
```
+------------------------------------------+
|          Full Game Preview               |
|                                          |
|  [Floating control button]               |
|                                          |
+------------------------------------------+

Click button → Control panel slides in from right
```

**Mode C: Tabbed**
```
+------------------------------------------+
| [Edit] [Preview] [Code]                  |
+------------------------------------------+
|                                          |
|   Active tab content here                |
|                                          |
+------------------------------------------+
```

The actual mode depends on `design/create.png`—implement exactly what's shown.

---

#### 3. Component Design
**Reference**: `design/components/`

**Buttons** (`design/components/buttons.png`):
- Primary button: style, hover, active, disabled states
- Secondary button: outline vs filled
- Icon buttons: size, spacing

**Cards** (`design/components/cards.png`):
- Border radius, shadow, padding
- Hover effect (lift? glow? border change?)
- Badge styling (category labels)
- Thumbnail aspect ratio

**Forms** (`design/components/forms.png`):
- Input field: border, focus state, padding
- Label positioning and typography
- Error state styling
- Slider track and thumb design

---

### Tailwind Configuration

Based on extracted design tokens, configure Tailwind:

```javascript
// tailwind.config.js

module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#FF6B35',         // Extracted from design
        secondary: '#4ECDC4',
        background: {
          dark: '#0F0F1E',
          card: '#1A1A2E',
          overlay: 'rgba(0, 0, 0, 0.8)'
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#A0A0A0',
          accent: '#FF6B35'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],        // From design/guidelines.md
        mono: ['Fira Code', 'monospace']      // For code simulator
      },
      spacing: {
        'card-gap': '24px',                   // Measured from design
        'section': '80px'
      },
      borderRadius: {
        'card': '12px',                       // From design
        'button': '8px'
      },
      boxShadow: {
        'card': '0 4px 20px rgba(0, 0, 0, 0.3)',
        'card-hover': '0 8px 30px rgba(255, 107, 53, 0.4)'
      }
    }
  }
}
```

---

## Asset Management

### Asset Sourcing Strategy

All assets will be provided by you (the user), but here's how to organize them:

#### Folder Structure (per variant)
```
public/assets/shooter/space-invaders/
├── sprites/
│   ├── player.png              # 32x32 or 64x64
│   ├── enemy-1.png
│   ├── enemy-2.png
│   ├── bullet.png
│   ├── enemy-bullet.png
│   ├── explosion.png           # Spritesheet or single frame
│   └── shield.png
├── sounds/
│   ├── shoot.mp3
│   ├── explosion.mp3
│   ├── hit.mp3
│   └── game-over.mp3
├── music/
│   └── theme.mp3
└── thumbnail.png               # For home page card
```

### Asset Loading System

```javascript
// lib/assetLoader.js

export function loadGameAssets(config, phaserScene) {
  // Load sprites
  config.assets.sprites.forEach(sprite => {
    phaserScene.load.image(sprite.key, sprite.path)
  })
  
  // Load spritesheets (if any)
  config.assets.spritesheets?.forEach(sheet => {
    phaserScene.load.spritesheet(sheet.key, sheet.path, {
      frameWidth: sheet.frameWidth,
      frameHeight: sheet.frameHeight
    })
  })
  
  // Load sounds
  config.assets.sounds.forEach(sound => {
    phaserScene.load.audio(sound.key, sound.path)
  })
  
  // Load music
  config.assets.music.forEach(music => {
    phaserScene.load.audio(music.key, music.path)
  })
}
```

### Asset Checklist (per variant)

For **each of the 10 variants**, you need:

**Shooter Variants**:
- [ ] Player sprite (1 file)
- [ ] Enemy sprites (3-5 files)
- [ ] Bullet sprite (1 file)
- [ ] Enemy bullet sprite (1 file)
- [ ] Explosion effect (1-3 frames)
- [ ] Power-up sprites (optional, 2-3 files)
- [ ] Shoot sound (1 file)
- [ ] Explosion sound (1 file)
- [ ] Hit sound (1 file)
- [ ] Game over sound (1 file)
- [ ] Background music (1 file)
- [ ] Thumbnail (1 file, 300x200px)

**Racing Variants**:
- [ ] Player car sprite (1 file)
- [ ] Opponent car sprites (3 files)
- [ ] Track image or tileset (1 file)
- [ ] Boost pad sprite (1 file)
- [ ] Obstacle sprites (2-4 files)
- [ ] Engine sound (1 file, loopable)
- [ ] Drift sound (1 file)
- [ ] Boost sound (1 file)
- [ ] Collision sound (1 file)
- [ ] Background music (1 file)
- [ ] Thumbnail (1 file, 300x200px)

**Total Assets Needed**: ~200 files across 10 variants

---

## Game Implementation Guidelines

### Phaser Integration

Each game variant follows this structure:

```javascript
// games/shooter/variants/space-invaders/index.js

import Phaser from 'phaser'
import { GameScene } from './scenes/GameScene'
import { UIScene } from './scenes/UIScene'
import { MenuScene } from './scenes/MenuScene'
import { SpaceInvadersConfig } from './config'

export function createSpaceInvadersGame(containerId, config = SpaceInvadersConfig) {
  const phaserConfig = {
    type: Phaser.AUTO,
    parent: containerId,
    width: config.layout.canvasWidth,
    height: config.layout.canvasHeight,
    backgroundColor: config.layout.backgroundColor,
    pixelArt: config.layout.pixelArt,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 0 },
        debug: false
      }
    },
    scene: [MenuScene, GameScene, UIScene]
  }
  
  const game = new Phaser.Game(phaserConfig)
  
  // Pass config to scenes
  game.registry.set('gameConfig', config)
  
  return game
}
```

### Base Classes (Core Systems)

#### Base Shooter
```javascript
// games/shooter/core/BaseShooter.js

export class BaseShooter extends Phaser.Scene {
  constructor(key) {
    super(key)
    this.config = null
    this.player = null
    this.enemies = null
    this.bullets = null
  }
  
  init() {
    this.config = this.registry.get('gameConfig')
  }
  
  preload() {
    // Load assets from config
    this.config.assets.sprites.forEach(sprite => {
      this.load.image(sprite.key, sprite.path)
    })
  }
  
  create() {
    this.createPlayer()
    this.createEnemies()
    this.setupCollisions()
    this.setupInput()
  }
  
  createPlayer() {
    const { startX, startY, sprite } = this.config.player
    this.player = this.physics.add.sprite(startX, startY, sprite)
    // ... more setup
  }
  
  // ... more base methods
}
```

#### Weapon System
```javascript
// games/shooter/core/WeaponSystem.js

export class WeaponSystem {
  constructor(scene, config) {
    this.scene = scene
    this.config = config
    this.lastFired = 0
  }
  
  fire(x, y, direction) {
    const now = Date.now()
    if (now - this.lastFired < this.config.fireRate) {
      return null
    }
    
    this.lastFired = now
    
    const bullet = this.scene.physics.add.sprite(x, y, this.config.sprite)
    bullet.setVelocityY(direction * this.config.bulletSpeed)
    
    this.scene.sound.play(this.config.sound)
    
    return bullet
  }
}
```

### Scene Structure

Each game has 3 scenes:

#### 1. MenuScene
- Shows game title, start button, instructions
- Loads config
- Transitions to GameScene on start

#### 2. GameScene
- Main game logic
- Player, enemies, collision handling
- Game loop (update method)
- Win/lose condition checking

#### 3. UIScene
- Runs parallel to GameScene
- Displays HUD (score, health, timer)
- Pause menu
- Game over / victory screens

---

## Development Task List

### Phase 1: Foundation (Week 1)

#### Task 1.1: Project Setup
- [ ] Initialize Next.js project with App Router
- [ ] Install dependencies: Phaser, Tailwind, Framer Motion
- [ ] Set up folder structure as documented
- [ ] Configure Tailwind with design tokens from `design/guidelines.md`
- [ ] Create root layout with header/footer

**Deliverable**: Empty Next.js app with structure ready

---

#### Task 1.2: Design Integration
- [ ] Extract design tokens from `design/home.png` and `design/create.png`
- [ ] Document colors, fonts, spacing in `design/guidelines.md`
- [ ] Create Tailwind config with extracted values
- [ ] Build shared components: Button, Card, Input (from `design/components/`)

**Deliverable**: Design system documented and implemented

---

#### Task 1.3: Game Registry Setup
- [ ] Create `lib/gameRegistry.js`
- [ ] Define structure for variant registration
- [ ] Create placeholder configs for all 10 variants
- [ ] Implement `getGameConfig()` and `getAllGames()` functions

**Deliverable**: Registry system that can return game configs

---

### Phase 2: First Game (Week 2)

#### Task 2.1: Space Invaders Config
- [ ] Write complete config in `games/shooter/variants/space-invaders/config.js`
- [ ] Define all parameters: player, enemies, weapons, scoring, assets
- [ ] Reference asset paths (even if assets don't exist yet)

**Deliverable**: Complete Space Invaders config file

---

#### Task 2.2: Space Invaders Assets
- [ ] Gather/create player ship sprite
- [ ] Gather/create enemy sprites (alien)
- [ ] Gather/create bullet sprites
- [ ] Gather/create explosion effect
- [ ] Gather/create sound effects (shoot, explosion, hit)
- [ ] Gather/create background music
- [ ] Place all in `public/assets/shooter/space-invaders/`

**Deliverable**: Full asset set for Space Invaders

---

#### Task 2.3: Space Invaders Game Logic
- [ ] Create `games/shooter/variants/space-invaders/scenes/GameScene.js`
- [ ] Implement player movement (left/right arrows)
- [ ] Implement shooting (spacebar)
- [ ] Implement enemy grid formation
- [ ] Implement enemy movement (horizontal sweep + descend)
- [ ] Implement collision detection (bullet-enemy, enemy-player, enemy-bottom)
- [ ] Implement scoring system
- [ ] Implement win/lose conditions

**Deliverable**: Fully playable Space Invaders game

---

#### Task 2.4: Space Invaders UI Scene
- [ ] Create `UIScene.js`
- [ ] Display score (top-left)
- [ ] Display lives (top-right)
- [ ] Display current wave (center-top)
- [ ] Create pause menu
- [ ] Create game over screen
- [ ] Create victory screen

**Deliverable**: Complete UI for Space Invaders

---

### Phase 3: Vibe Coder (Week 3)

#### Task 3.1: Vibe Coder Engine
- [ ] Create `lib/vibeCoder.js`
- [ ] Implement stage system (THINKING, APPROACH, ASSETS, CODING, FINALIZING)
- [ ] Write timing logic for stage transitions
- [ ] Write progress calculation
- [ ] Implement callback system for stage changes

**Deliverable**: Vibe coder simulation engine

---

#### Task 3.2: Variant Selection Logic
- [ ] Create `lib/gameSelector.js`
- [ ] Implement keyword extraction from user input
- [ ] Write matching logic: keywords → variant
- [ ] Test with various inputs (e.g., "space shooter", "racing game", "lots of enemies")

**Deliverable**: Smart variant selection from user input

---

#### Task 3.3: Vibe Coder Components
- [ ] Create `ChatInterface.jsx` (displays AI messages)
- [ ] Create `ApproachExplainer.jsx` (shows game architecture)
- [ ] Create `AssetGenerator.jsx` (progress bars for assets)
- [ ] Create `CodeSimulator.jsx` (terminal with file names)
- [ ] Create `ProgressSteps.jsx` (stage indicator)
- [ ] Create `VibeCoderOverlay.jsx` (full-screen container)

**Deliverable**: All vibe coder UI components

---

#### Task 3.4: Vibe Coder Integration
- [ ] Connect `VibeCoderOverlay` to vibe coder engine
- [ ] Test stage transitions with animations
- [ ] Ensure timing feels natural (not too fast/slow)
- [ ] Add sound effects for stage completions (optional)

**Deliverable**: Working vibe coder that simulates game creation

---

### Phase 4: Create/Edit Page (Week 4)

#### Task 4.1: Server Routes
- [ ] Create `app/play/page.js` (create mode)
- [ ] Create `app/play/[id]/page.js` (edit mode)
- [ ] Implement ID generation for new games
- [ ] Implement config loading for existing games

**Deliverable**: Routing infrastructure for create/edit

---

#### Task 4.2: GameEditor Component
- [ ] Create `app/play/_components/GameEditor.jsx`
- [ ] Implement mode detection (create vs edit)
- [ ] Show input form in create mode
- [ ] Trigger vibe coder on form submit
- [ ] Load game preview after vibe coder completes
- [ ] Load game preview immediately in edit mode

**Deliverable**: Main editor container component

---

#### Task 4.3: Game Preview Component
- [ ] Create `app/play/_components/GamePreview.jsx`
- [ ] Create `app/play/_components/PhaserGame.jsx` (wraps Phaser instance)
- [ ] Mount Phaser game in React component
- [ ] Handle game restart on config change
- [ ] Clean up Phaser instance on unmount

**Deliverable**: Live game preview that updates on config changes

---

#### Task 4.4: Control Panel
- [ ] Create `app/play/_components/ControlPanel.jsx`
- [ ] Build input controls for config editing:
  - Number inputs (health, speed, fire rate)
  - Sliders (difficulty, enemy count)
  - Dropdowns (variant selection)
- [ ] Connect controls to config state
- [ ] Implement "Save" button
- [ ] Implement "Reset to Default" button

**Deliverable**: Fully functional control panel for editing

---

#### Task 4.5: State Management
- [ ] Set up React Context for game config state
- [ ] Implement config update logic
- [ ] Connect control panel to state
- [ ] Connect preview to state (reload on change)
- [ ] Implement localStorage for saving games

**Deliverable**: Centralized state management for configs

---

### Phase 5: Home Page (Week 5)

#### Task 5.1: Home Components
- [ ] Create `components/home/Hero.jsx` (match `design/home.png`)
- [ ] Create `components/home/GameGrid.jsx`
- [ ] Create `components/home/GameCard.jsx`
- [ ] Create `components/home/CategoryFilter.jsx`
- [ ] Create `components/home/SearchBar.jsx`

**Deliverable**: All home page components

---

#### Task 5.2: Home Page Assembly
- [ ] Build `app/page.js`
- [ ] Fetch all games from registry
- [ ] Pass games to GameGrid
- [ ] Implement filtering by category
- [ ] Implement search functionality
- [ ] Link cards to `/play/[id]`

**Deliverable**: Functional home page

---

#### Task 5.3: Navigation
- [ ] Create `components/shared/Header.jsx`
- [ ] Add logo and site name
- [ ] Add navigation links (Home, Create)
- [ ] Add user menu (future: auth)
- [ ] Make responsive (mobile menu)

**Deliverable**: Site header with navigation

---

### Phase 6: Additional Shooter Variants (Week 6-7)

Repeat for each remaining shooter variant:

#### Task 6.1: Top-Down Shooter
- [ ] Write config (`games/shooter/variants/top-down-shooter/config.js`)
- [ ] Gather assets
- [ ] Implement GameScene (360° movement, mouse aim)
- [ ] Implement UIScene
- [ ] Test thoroughly

#### Task 6.2: Side-Scroller
- [ ] Write config
- [ ] Gather assets
- [ ] Implement GameScene (platforming + shooting)
- [ ] Implement UIScene
- [ ] Test thoroughly

#### Task 6.3: Twin-Stick
- [ ] Write config
- [ ] Gather assets
- [ ] Implement GameScene (WASD + arrow shooting)
- [ ] Implement UIScene
- [ ] Test thoroughly

#### Task 6.4: Bullet Hell
- [ ] Write config
- [ ] Gather assets
- [ ] Implement GameScene (bullet patterns, small hitbox)
- [ ] Implement UIScene
- [ ] Test thoroughly

**Deliverable**: 5 complete, unique shooter games

---

### Phase 7: Racing Variants (Week 8-9)

Repeat for each racing variant:

#### Task 7.1: Arcade Racer
- [ ] Write config (`games/racing/variants/arcade-racer/config.js`)
- [ ] Gather assets (cars, track, boost pads)
- [ ] Implement RaceScene (top-down racing)
- [ ] Implement lap system
- [ ] Implement AI opponents
- [ ] Implement UIScene
- [ ] Test thoroughly

#### Task 7.2: Drift Racer
- [ ] Write config
- [ ] Gather assets
- [ ] Implement RaceScene (drift mechanics)
- [ ] Implement drift scoring
- [ ] Implement UIScene
- [ ] Test thoroughly

#### Task 7.3: Obstacle Course
- [ ] Write config
- [ ] Gather assets
- [ ] Implement RaceScene (lane-based obstacles)
- [ ] Implement jump mechanic
- [ ] Implement UIScene
- [ ] Test thoroughly

#### Task 7.4: Time Trial
- [ ] Write config
- [ ] Gather assets
- [ ] Implement RaceScene (checkpoint system)
- [ ] Implement ghost racer
- [ ] Implement UIScene
- [ ] Test thoroughly

#### Task 7.5: Combat Racing
- [ ] Write config
- [ ] Gather assets
- [ ] Implement RaceScene (racing + weapons)
- [ ] Implement weapon system
- [ ] Implement damage mechanics
- [ ] Implement UIScene
- [ ] Test thoroughly

**Deliverable**: 5 complete, unique racing games

---

### Phase 8: Polish & Testing (Week 10)

#### Task 8.1: Performance Optimization
- [ ] Profile Phaser games (ensure 60fps)
- [ ] Optimize asset loading (lazy load, preload properly)
- [ ] Optimize React rendering (memoization)
- [ ] Test on various devices (desktop, tablet, mobile)

#### Task 8.2: Responsive Design
- [ ] Make home page responsive
- [ ] Make create/edit page responsive (especially game preview)
- [ ] Test on different screen sizes
- [ ] Adjust Phaser canvas sizing dynamically

#### Task 8.3: Accessibility
- [ ] Add keyboard navigation
- [ ] Add ARIA labels
- [ ] Ensure sufficient color contrast
- [ ] Test with screen readers

#### Task 8.4: Error Handling
- [ ] Handle missing assets gracefully
- [ ] Handle invalid IDs in `/play/[id]`
- [ ] Show error messages to user
- [ ] Add fallback UI

#### Task 8.5: User Feedback
- [ ] Add loading states (spinners, skeletons)
- [ ] Add success/error toasts
- [ ] Add confirmation dialogs (delete, reset)
- [ ] Add tooltips for controls

**Deliverable**: Polished, production-ready platform

---

### Phase 9: Documentation (Week 11)

#### Task 9.1: Code Documentation
- [ ] Add JSDoc comments to all functions
- [ ] Document config schema
- [ ] Document component props
- [ ] Add inline comments for complex logic

#### Task 9.2: User Documentation
- [ ] Write README.md with setup instructions
- [ ] Create user guide (how to create/edit games)
- [ ] Document keyboard controls for each game
- [ ] Create FAQ

#### Task 9.3: Developer Documentation
- [ ] Write "Adding a New Variant" guide
- [ ] Document Phaser integration approach
- [ ] Explain vibe coder system
- [ ] Document design system usage

**Deliverable**: Complete documentation

---

### Phase 10: Deployment (Week 12)

#### Task 10.1: Build Preparation
- [ ] Test production build locally
- [ ] Optimize bundle size
- [ ] Configure environment variables
- [ ] Set up error tracking (Sentry, etc.)

#### Task 10.2: Deployment
- [ ] Deploy to Vercel/Netlify
- [ ] Configure domain
- [ ] Set up analytics
- [ ] Test deployed version thoroughly

#### Task 10.3: Launch
- [ ] Announce launch
- [ ] Gather user feedback
- [ ] Monitor for bugs
- [ ] Plan Phase 2 (AI integration)

**Deliverable**: Live, deployed platform

---

## Success Metrics

### Technical Metrics
- ✅ All 10 game variants are fully playable
- ✅ Games run at 60fps on mid-range hardware
- ✅ No major bugs or crashes
- ✅ Design matches reference files exactly
- ✅ Code is clean, documented, and maintainable

### User Experience Metrics
- ✅ Vibe coder feels convincing and delightful
- ✅ Game preview updates smoothly when editing
- ✅ Controls are intuitive and responsive
- ✅ Loading states prevent user confusion
- ✅ Error handling is graceful and helpful

### Architecture Metrics
- ✅ Configs are truly the single source of truth
- ✅ Adding a new variant takes < 1 day
- ✅ Base classes are reusable across variants
- ✅ Client/server split is clean
- ✅ Asset management is scalable

---

## Future Considerations (Phase 2)

This Phase 1 platform is designed to seamlessly transition to Phase 2 (real AI generation). Here's how:

### What Changes in Phase 2
- **Vibe coder becomes real**: Replace simulation with actual LLM API calls
- **Configs generated dynamically**: AI writes configs based on user input
- **More variants possible**: Not limited to 10 pre-built games
- **Asset generation**: Integrate with image/sound generation APIs

### What Stays the Same
- **Config structure**: AI generates same config format
- **Phaser integration**: Games still use same scene/entity structure
- **UI/UX**: Create/edit flow remains identical
- **Base classes**: Core systems (weapon, spawn, lap) still used

### How to Prepare Now
- Keep configs as pure data (no logic)
- Document config schema rigorously
- Keep base classes generic and flexible
- Design API-ready data flow

---

## Critical Notes for Development

### DO's
✅ Follow design files exactly (pixel-perfect)
✅ Use server components for routing, client for interactivity
✅ Keep all game logic in config files
✅ Test each variant thoroughly before moving to next
✅ Document as you build (not at the end)
✅ Commit frequently with clear messages

### DON'Ts
❌ Don't deviate from provided designs
❌ Don't put game logic outside config/scene files
❌ Don't skip asset organization
❌ Don't over-engineer (YAGNI principle)
❌ Don't hardcode values that should be in configs
❌ Don't forget to clean up Phaser instances

### Common Pitfalls to Avoid
1. **Phaser memory leaks**: Always destroy game instance on component unmount
2. **Config mutations**: Never mutate config directly, always clone
3. **Asset 404s**: Double-check all asset paths in configs
4. **Performance**: Profile early and often, especially collision detection
5. **Responsive canvas**: Phaser canvas must resize properly

---

## Final Checklist

Before considering Phase 1 complete, verify:

- [ ] All 10 game variants are implemented and playable
- [ ] Home page matches `design/home.png` exactly
- [ ] Create/edit page matches `design/create.png` exactly
- [ ] Vibe coder simulation is smooth and convincing
- [ ] All games run at 60fps
- [ ] Config editing updates preview in real-time
- [ ] All assets are properly organized
- [ ] Code is documented with JSDoc
- [ ] User documentation exists (README, guides)
- [ ] Project is deployed and accessible online
- [ ] No critical bugs or errors
- [ ] Design system is consistent across all pages

---

## Conclusion

This documentation provides a complete, detailed blueprint for building a game generation platform. The architecture is:

- **Deterministic**: No real AI, just smart selection
- **Scalable**: Easy to add new variants
- **User-friendly**: Vibe coder creates magical UX
- **Maintainable**: Config-driven, well-organized
- **Future-proof**: Ready for Phase 2 AI integration

Follow this documentation step-by-step, and you'll have a production-ready platform that delights users while maintaining a clean, professional codebase.

**Total estimated timeline**: 12 weeks for one developer working full-time.

Good luck building! 🚀