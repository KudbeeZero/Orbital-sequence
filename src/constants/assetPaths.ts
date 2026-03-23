/** Centralized asset path registry — all model/texture/audio paths referenced here */

export const MODELS = {
  playerShip: {
    scout: '/models/ships/scout.glb',
    cruiser: '/models/ships/cruiser.glb',
    miner: '/models/ships/miner.glb',
    destroyer: '/models/ships/destroyer.glb',
    carrier: '/models/ships/carrier.glb',
  },
  enemies: {
    drone: '/models/enemies/drone.glb',
    fighter: '/models/enemies/fighter.glb',
    capital: '/models/enemies/capital.glb',
  },
  environment: {
    asteroid: '/models/environment/asteroid.glb',
    station: '/models/environment/station.glb',
  },
} as const;

export const TEXTURES = {
  earth: {
    diffuse: '/textures/earth/earth_diffuse.jpg',
    normal: '/textures/earth/earth_normal.jpg',
    specular: '/textures/earth/earth_specular.jpg',
    clouds: '/textures/earth/earth_clouds.png',
    night: '/textures/earth/earth_night.jpg',
  },
  skybox: '/textures/skybox/stars.jpg',
  particles: {
    spark: '/textures/particles/spark.png',
    smoke: '/textures/particles/smoke.png',
    glow: '/textures/particles/glow.png',
  },
} as const;

export const AUDIO = {
  music: {
    menu: '/audio/music/menu_theme.mp3',
    combat: '/audio/music/combat_theme.mp3',
    exploration: '/audio/music/exploration_theme.mp3',
  },
  sfx: {
    laser: '/audio/sfx/laser_fire.mp3',
    missile: '/audio/sfx/missile_launch.mp3',
    explosion: '/audio/sfx/explosion.mp3',
    hit: '/audio/sfx/hit_impact.mp3',
    shield: '/audio/sfx/shield_hit.mp3',
    engine: '/audio/sfx/engine_hum.mp3',
  },
} as const;

export const FONTS = {
  primary: '/fonts/Orbitron-Regular.woff2',
  bold: '/fonts/Orbitron-Bold.woff2',
} as const;
