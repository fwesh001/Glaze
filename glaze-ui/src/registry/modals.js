export const modalRegistry = [
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
  }
];

export const modalRegistryMap = new Map(modalRegistry.map((entry) => [entry.id, entry]));

export default modalRegistry;
