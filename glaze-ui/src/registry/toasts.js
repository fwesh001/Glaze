export const toastRegistry = [
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
  }
];

export const toastRegistryMap = new Map(toastRegistry.map((entry) => [entry.id, entry]));

export default toastRegistry;
