export const loaderRegistry = [
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
  }
];

export const loaderRegistryMap = new Map(loaderRegistry.map((entry) => [entry.id, entry]));

export default loaderRegistry;
