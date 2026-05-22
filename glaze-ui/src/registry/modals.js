export const modalRegistry = [
  {
    id: 'glassmorphic-liquid-modal',
    name: 'Glassmorphic Liquid Modal',
    category: 'modal',
    description: 'A layered dialog frame reserved for future control deck overlays.',
      directoryPath: '/library/modals/glassmorphic-liquid-modal',
    settingsConfig: [
      { id: 'title', label: 'Modal Title', type: 'text', default: 'Confirm action' },
      {
        id: 'tone',
        label: 'Tone',
        type: 'select',
        options: ['Neutral', 'Warning', 'Critical'],
        default: 'Neutral',
      },
    ],
  },
];

export const modalRegistryMap = new Map(modalRegistry.map((entry) => [entry.id, entry]));

export default modalRegistry;
