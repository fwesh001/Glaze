export const loaderRegistry = [
  {
    id: 'glassmorphic-pulse-loader',
    name: 'Glassmorphic Pulse Loader',
    category: 'loader',
    description: 'A kinetic loader blueprint for future platform stress states.',
    directoryPath: '/library/loaders/pulse-loader',
    settingsConfig: [
      { id: 'speed', label: 'Pulse Speed', type: 'slider', min: 0.2, max: 3, default: 1 },
      { id: 'size', label: 'Loader Size', type: 'slider', min: 32, max: 160, default: 72 },
    ],
  },
];

export const loaderRegistryMap = new Map(loaderRegistry.map((entry) => [entry.id, entry]));

export default loaderRegistry;
