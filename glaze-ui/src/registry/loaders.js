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
  }
];

export const loaderRegistryMap = new Map(loaderRegistry.map((entry) => [entry.id, entry]));

export default loaderRegistry;
