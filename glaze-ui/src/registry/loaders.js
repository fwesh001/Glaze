export const loaderRegistry = [
  {
    "id": "bezier-wave",
    "name": "Vector Bezier Wave",
    "category": "loader",
    "description": "Liquid sine wave ripple traversing across a dark grid backdrop with dynamic amplitude and frequency control.",
    "directoryPath": "/loaders/bezier-wave",
    "settingsConfig": [
      {
        "id": "speed",
        "label": "Wave Velocity",
        "type": "slider",
        "min": 0.35,
        "max": 2.5,
        "step": 0.05,
        "default": 1
      },
      {
        "id": "amplitude",
        "label": "Wave Height",
        "type": "slider",
        "min": 0.5,
        "max": 3,
        "step": 0.1,
        "default": 1.5
      },
      {
        "id": "frequency",
        "label": "Wave Frequency",
        "type": "slider",
        "min": 0.5,
        "max": 3,
        "step": 0.1,
        "default": 1
      }
    ],
    "deprecated": false
  },
  {
    "id": "binary-stream",
    "name": "Binary Data Stream",
    "category": "loader",
    "description": "High-frequency 1s and 0s cascading through a frosted glass buffer with progressive row locking and neon CRT glow.",
    "directoryPath": "/loaders/binary-stream",
    "settingsConfig": [
      {
        "id": "speed",
        "label": "Buffer Velocity",
        "type": "slider",
        "min": 0.35,
        "max": 2.5,
        "step": 0.05,
        "default": 1
      }
    ],
    "deprecated": false
  },
  {
    "id": "fibonacci-spiral",
    "name": "Fibonacci Spiral Trace",
    "category": "loader",
    "description": "Mathematical logarithmic spiral with stroke dash animation tracing inward at exponentially accelerating velocity.",
    "directoryPath": "/loaders/fibonacci-spiral",
    "settingsConfig": [
      {
        "id": "speed",
        "label": "Trace Velocity",
        "type": "slider",
        "min": 0.35,
        "max": 2.5,
        "step": 0.05,
        "default": 1
      }
    ],
    "deprecated": false
  },
  {
    "id": "glassmorphic-liquid-loader",
    "name": "Glassmorphic Liquid Loader",
    "category": "loader",
    "description": "A luminous rotating loader with glassmorphic depth and liquid glow.",
    "directoryPath": "/library/loaders/glassmorphic-liquid-loader",
    "settingsConfig": [
      {
        "id": "speed",
        "label": "Spin Speed",
        "type": "slider",
        "min": 0.2,
        "max": 3,
        "default": 1
      },
      {
        "id": "size",
        "label": "Loader Size",
        "type": "slider",
        "min": 48,
        "max": 220,
        "default": 112
      },
      {
        "id": "message",
        "label": "Loading Text",
        "type": "text",
        "default": "Loading your experience"
      }
    ],
    "deprecated": false
  },
  {
    "id": "memory-blocks",
    "name": "Hardware Memory Allocation Block",
    "category": "loader",
    "description": "10-block glass memory segment array with aggressive flicker allocation, bounce physics, and random read-retry red states.",
    "directoryPath": "/loaders/memory-blocks",
    "settingsConfig": [
      {
        "id": "speed",
        "label": "Allocation Rate",
        "type": "slider",
        "min": 0.35,
        "max": 2.5,
        "step": 0.05,
        "default": 1
      }
    ],
    "deprecated": false
  },
  {
    "id": "mercury-spill",
    "name": "Kinetic Liquid Blob / Mercury Spill",
    "category": "loader",
    "description": "Two organic liquid glass droplets drifting and morphing with CSS metaball filter technique and surface tension simulation.",
    "directoryPath": "/loaders/mercury-spill",
    "settingsConfig": [
      {
        "id": "speed",
        "label": "Drift Velocity",
        "type": "slider",
        "min": 0.35,
        "max": 2.5,
        "step": 0.05,
        "default": 1
      }
    ],
    "deprecated": false
  },
  {
    "id": "paper-fold-loader",
    "name": "Paper Fold Loader",
    "category": "loader",
    "description": "A crisp paper sheet that folds and refolds in a minimalist loop.",
    "directoryPath": "/library/loaders/paper-fold-loader",
    "settingsConfig": [
      {
        "id": "message",
        "label": "Loading Text",
        "type": "text",
        "default": "Preparing the paper"
      },
      {
        "id": "tone",
        "label": "Paper Tone",
        "type": "select",
        "options": [
          "Kraft",
          "Ivory",
          "Parchment"
        ],
        "default": "Parchment"
      },
      {
        "id": "speed",
        "label": "Fold Speed",
        "type": "slider",
        "min": 0.35,
        "max": 2.5,
        "default": 1
      },
      {
        "id": "thickness",
        "label": "Paper Thickness",
        "type": "slider",
        "min": 1,
        "max": 10,
        "default": 4
      }
    ],
    "deprecated": false
  },
  {
    "id": "quantum-grid",
    "name": "Quantum Grid Orbit",
    "category": "loader",
    "description": "16-node geometric matrix with chaotic particle dispersion and elastic magnetic snap-back to grid coordinates.",
    "directoryPath": "/loaders/quantum-grid",
    "settingsConfig": [
      {
        "id": "speed",
        "label": "Snap Velocity",
        "type": "slider",
        "min": 0.35,
        "max": 2.5,
        "step": 0.05,
        "default": 1
      }
    ],
    "deprecated": false
  }
];

export const loaderRegistryMap = new Map(loaderRegistry.map((entry) => [entry.id, entry]));

export default loaderRegistry;
