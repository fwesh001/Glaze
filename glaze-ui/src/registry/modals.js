export const modalRegistry = [
  {
    "id": "chamber-drop",
    "name": "Mercury Chamber Drop",
    "category": "modal",
    "description": "Premium glass capsule modal that drops from above and stabilizes through squish-stretch bounce dynamics.",
    "directoryPath": "/modals/chamber-drop",
    "settingsConfig": [
      {
        "id": "title",
        "label": "Modal Title",
        "type": "text",
        "default": "Chamber Initialized"
      },
      {
        "id": "message",
        "label": "Body Message",
        "type": "text",
        "default": "Drop sequence completed. Continue calibration?"
      },
      {
        "id": "speed",
        "label": "Drop Speed",
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
    "id": "decryption-breach",
    "name": "Glitched Decryption Breach",
    "category": "modal",
    "description": "Cybernetic breach panel with snapping entry and ASCII text scrambling that settles into readable strings.",
    "directoryPath": "/modals/decryption-breach",
    "settingsConfig": [
      {
        "id": "title",
        "label": "Modal Title",
        "type": "text",
        "default": "Decryption Breach"
      },
      {
        "id": "message",
        "label": "Body Message",
        "type": "text",
        "default": "Cipher stream stabilized. Deploy secure handoff?"
      },
      {
        "id": "speed",
        "label": "Glitch Speed",
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
    "id": "depth-inversion",
    "name": "Depth-Inversion Overlay",
    "category": "modal",
    "description": "High-contrast glass plate while the global workspace recedes, tilts, and blurs into depth.",
    "directoryPath": "/modals/depth-inversion",
    "settingsConfig": [
      {
        "id": "title",
        "label": "Modal Title",
        "type": "text",
        "default": "Depth Inversion"
      },
      {
        "id": "message",
        "label": "Body Message",
        "type": "text",
        "default": "Foreground plate active. Background context shifted to depth mode."
      },
      {
        "id": "speed",
        "label": "Depth Speed",
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
    "id": "glassmorphic-liquid-modal",
    "name": "Glassmorphic Liquid Modal",
    "category": "modal",
    "description": "A layered dialog frame reserved for future control deck overlays.",
    "directoryPath": "/library/modals/glassmorphic-liquid-modal",
    "settingsConfig": [
      {
        "id": "title",
        "label": "Modal Title",
        "type": "text",
        "default": "Confirm action"
      },
      {
        "id": "message",
        "label": "Modal Message",
        "type": "text",
        "default": "Are you sure?"
      },
      {
        "id": "tone",
        "label": "Tone",
        "type": "select",
        "options": [
          "Neutral",
          "Warning",
          "Critical"
        ],
        "default": "Neutral"
      }
    ],
    "deprecated": false
  },
  {
    "id": "paper-origami-modal",
    "name": "Paper Origami Modal",
    "category": "modal",
    "description": "A soft paper modal that unfolds from the center like an origami letter.",
    "directoryPath": "/library/modals/paper-origami-modal",
    "settingsConfig": [
      {
        "id": "title",
        "label": "Modal Title",
        "type": "text",
        "default": "Open document"
      },
      {
        "id": "message",
        "label": "Modal Message",
        "type": "text",
        "default": "This paper fold can reveal any content."
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
        "default": "Ivory"
      },
      {
        "id": "speed",
        "label": "Unfold Speed",
        "type": "slider",
        "min": 0.35,
        "max": 2.5,
        "default": 1
      },
      {
        "id": "shadow",
        "label": "Shadow Strength",
        "type": "slider",
        "min": 4,
        "max": 26,
        "default": 14
      }
    ],
    "deprecated": false
  },
  {
    "id": "prism-reveal",
    "name": "Radial Prism Reveal",
    "category": "modal",
    "description": "Blurred circular glass dialog with SVG clip-path expansion and rainbow prism lens flare sweep.",
    "directoryPath": "/modals/prism-reveal",
    "settingsConfig": [
      {
        "id": "title",
        "label": "Modal Title",
        "type": "text",
        "default": "Prism Channel"
      },
      {
        "id": "message",
        "label": "Body Message",
        "type": "text",
        "default": "Spectrum gate expanded. Apply refracted profile now?"
      },
      {
        "id": "speed",
        "label": "Reveal Speed",
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
    "id": "sidebar-dock",
    "name": "Elastic Sidebar Dock",
    "category": "modal",
    "description": "Drawer-like panel that detaches from sidebar coordinates and elastically expands into center stage.",
    "directoryPath": "/modals/sidebar-dock",
    "settingsConfig": [
      {
        "id": "title",
        "label": "Modal Title",
        "type": "text",
        "default": "Dock Detached"
      },
      {
        "id": "message",
        "label": "Body Message",
        "type": "text",
        "default": "Sidebar payload migrated to central workspace."
      },
      {
        "id": "speed",
        "label": "Dock Speed",
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
    "id": "split-pane",
    "name": "Kinetic Split-Pane Matrix",
    "category": "modal",
    "description": "Centerline splits into equal utility columns that slide apart like kinetic security doors.",
    "directoryPath": "/modals/split-pane",
    "settingsConfig": [
      {
        "id": "title",
        "label": "Modal Title",
        "type": "text",
        "default": "Split Matrix"
      },
      {
        "id": "message",
        "label": "Body Message",
        "type": "text",
        "default": "Panels deployed. Adjust matrix parameters before commit."
      },
      {
        "id": "speed",
        "label": "Split Speed",
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

export const modalRegistryMap = new Map(modalRegistry.map((entry) => [entry.id, entry]));

export default modalRegistry;
