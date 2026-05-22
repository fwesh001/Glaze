import { getRegistryCounts, registryCatalog, walkRegistryEntries } from '../src/registry/index.js';

console.log('Glaze UI registry smoke test');
console.log(JSON.stringify(getRegistryCounts(), null, 2));

walkRegistryEntries((entry, index) => {
  console.log(
    `${index + 1}. ${entry.id} :: ${entry.name} :: ${entry.category} :: ${entry.directoryPath}`,
  );
});

console.table(
  registryCatalog.map(({ id, name, category, directoryPath, settingsConfig }) => ({
    id,
    name,
    category,
    directoryPath,
    settings: settingsConfig.length,
  })),
);
