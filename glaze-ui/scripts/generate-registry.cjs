const fs = require('fs');
const path = require('path');

const LIB_ROOT = path.resolve(__dirname, '..', 'src', 'library');
const REGISTRY_DIR = path.resolve(__dirname, '..', 'src', 'registry');

function readMetaFiles() {
  const entries = [];
  const categories = fs.readdirSync(LIB_ROOT, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name);

  categories.forEach((category) => {
    const catPath = path.join(LIB_ROOT, category);
    const items = fs.readdirSync(catPath, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name);

    items.forEach((item) => {
      const metaPath = path.join(catPath, item, 'meta.json');
      if (fs.existsSync(metaPath)) {
        try {
          const raw = fs.readFileSync(metaPath, 'utf8');
          const meta = JSON.parse(raw);
          entries.push({ ...meta, _fsCategory: category });
        } catch (err) {
          console.error('Failed to parse meta for', item, err);
        }
      }
    });
  });

  return entries;
}

function makeRegistry(entries, categoryId) {
  const filtered = entries.filter((e) => e.category === categoryId);
  const items = filtered.map((e) => ({
    id: e.id,
    name: e.name,
    category: e.category,
    description: e.description || '',
    directoryPath: e.directoryPath || `/${e._fsCategory}/${e.id}`,
    settingsConfig: e.settingsConfig || [],
    deprecated: e.deprecated || false,
  }));

  const fileContent = `export const ${categoryId}Registry = ${JSON.stringify(items, null, 2)};

export const ${categoryId}RegistryMap = new Map(${categoryId}Registry.map((entry) => [entry.id, entry]));

export default ${categoryId}Registry;
`;

  return fileContent;
}

function writeRegistryFiles(entries) {
  const categories = ['toast', 'modal', 'loader'];

  if (!fs.existsSync(REGISTRY_DIR)) fs.mkdirSync(REGISTRY_DIR, { recursive: true });

  categories.forEach((cat) => {
    const content = makeRegistry(entries, cat);
    const target = path.join(REGISTRY_DIR, `${cat}s.js`); // toasts.js, modals.js, loaders.js
    fs.writeFileSync(target, content, 'utf8');
    console.log('Wrote', target);
  });

  // Build aliases mapping: read `aliases` array from meta entries and write aliases.js
  const aliases = {};
  entries.forEach((e) => {
    if (Array.isArray(e.aliases)) {
      e.aliases.forEach((aliasId) => {
        // Only map if not already mapped to avoid accidental overwrites
        if (!aliases[aliasId]) aliases[aliasId] = e.id;
      });
    }
  });

  const aliasesPath = path.join(REGISTRY_DIR, 'aliases.js');
  const aliasesContent = `export const registryAliases = ${JSON.stringify(aliases, null, 2)};\n\nexport default registryAliases;\n`;
  fs.writeFileSync(aliasesPath, aliasesContent, 'utf8');
  console.log('Wrote', aliasesPath);
}

function main() {
  const entries = readMetaFiles();
  writeRegistryFiles(entries);
}

main();
