export const toastRegistry = [
  {
    "id": "countdown-capsule",
    "name": "Telemetry Countdown Capsule",
    "category": "toast",
    "description": "Horizontal message capsule with neon status line countdown that auto-transitions out.",
    "directoryPath": "/toasts/countdown-capsule",
    "settingsConfig": [
      {
        "id": "message",
        "label": "Toast Message",
        "type": "text",
        "default": "Telemetry uplink active"
      },
      {
        "id": "timer",
        "label": "Countdown Seconds",
        "type": "slider",
        "min": 1,
        "max": 12,
        "step": 0.5,
        "default": 4
      },
      {
        "id": "speed",
        "label": "Animation Speed",
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
    "id": "depth-stacker",
    "name": "Holographic Depth Stacker",
    "category": "toast",
    "description": "3D spatial toast stack where latest instance moves to foreground while older alerts recede.",
    "directoryPath": "/toasts/depth-stacker",
    "settingsConfig": [
      {
        "id": "message",
        "label": "Toast Message",
        "type": "text",
        "default": "Depth focus lock acquired"
      },
      {
        "id": "stack",
        "label": "Stack Count",
        "type": "slider",
        "min": 2,
        "max": 5,
        "step": 1,
        "default": 4
      },
      {
        "id": "speed",
        "label": "Cycle Speed",
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
    "id": "edge-snapper",
    "name": "Screen-Edge Snapper",
    "category": "toast",
    "description": "Fluid free-moving module that elastically snaps to screen boundaries with geometry deformation.",
    "directoryPath": "/toasts/edge-snapper",
    "settingsConfig": [
      {
        "id": "message",
        "label": "Toast Message",
        "type": "text",
        "default": "Boundary magnet active"
      },
      {
        "id": "snapThreshold",
        "label": "Snap Threshold",
        "type": "slider",
        "min": 20,
        "max": 160,
        "step": 5,
        "default": 70
      },
      {
        "id": "speed",
        "label": "Snap Speed",
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
    "id": "glassmorphic-liquid-toast",
    "name": "Glassmorphic Liquid Toast",
    "category": "toast",
    "description": "Deeply futuristic fluid capsule with ambient biological glow.",
    "directoryPath": "/library/toasts/liquid-toast",
    "settingsConfig": [
      {
        "id": "message",
        "label": "Toast Message",
        "type": "text",
        "default": "Operation successful"
      },
      {
        "id": "viscosity",
        "label": "Liquid Viscosity",
        "type": "slider",
        "min": 0.1,
        "max": 2,
        "default": 1
      },
      {
        "id": "blur",
        "label": "Blur Intensity",
        "type": "slider",
        "min": 5,
        "max": 40,
        "default": 20
      },
      {
        "id": "glow",
        "label": "Status Alert",
        "type": "select",
        "options": [
          "Success Green",
          "Error Red",
          "Neon Cyan"
        ],
        "default": "Success Green"
      }
    ],
    "deprecated": false
  },
  {
    "id": "paper-receipt-toast",
    "name": "Paper Receipt Toast",
    "category": "toast",
    "description": "A warm receipt-style toast that slides into view like a paper slip from a cash register.",
    "directoryPath": "/library/toasts/paper-receipt-toast",
    "settingsConfig": [
      {
        "id": "message",
        "label": "Toast Message",
        "type": "text",
        "default": "Payment received"
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
        "default": "Kraft"
      },
      {
        "id": "speed",
        "label": "Slide Speed",
        "type": "slider",
        "min": 0.35,
        "max": 2.5,
        "default": 1
      },
      {
        "id": "depth",
        "label": "Shadow Depth",
        "type": "slider",
        "min": 4,
        "max": 28,
        "default": 14
      }
    ],
    "deprecated": false
  },
  {
    "id": "particle-shatter",
    "name": "Particle Deconstruction Alert",
    "category": "toast",
    "description": "Glass alert shell that vaporizes into 24 scattering vector particles on dismiss.",
    "directoryPath": "/toasts/particle-shatter",
    "settingsConfig": [
      {
        "id": "message",
        "label": "Toast Message",
        "type": "text",
        "default": "Container integrity compromised"
      },
      {
        "id": "speed",
        "label": "Shatter Speed",
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
    "id": "radial-shockwave",
    "name": "Expanding Radial Shockwave",
    "category": "toast",
    "description": "Neon droplet impact that drops, lands, and morphs into a readable glass notification plate.",
    "directoryPath": "/toasts/radial-shockwave",
    "settingsConfig": [
      {
        "id": "message",
        "label": "Toast Message",
        "type": "text",
        "default": "Shockwave event registered"
      },
      {
        "id": "speed",
        "label": "Impact Speed",
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
    "id": "telemetry-ticker",
    "name": "Hardware Telemetry Ticker",
    "category": "toast",
    "description": "Terminal-like diagnostic ticker with rapid typewriter reveal and binary flicker lock-in.",
    "directoryPath": "/toasts/telemetry-ticker",
    "settingsConfig": [
      {
        "id": "message",
        "label": "Primary Message",
        "type": "text",
        "default": "Diagnostic bus synchronized"
      },
      {
        "id": "lines",
        "label": "Line Count",
        "type": "slider",
        "min": 3,
        "max": 6,
        "step": 1,
        "default": 4
      },
      {
        "id": "speed",
        "label": "Ticker Speed",
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

export const toastRegistryMap = new Map(toastRegistry.map((entry) => [entry.id, entry]));

export default toastRegistry;
