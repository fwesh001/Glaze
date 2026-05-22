import { loaderRegistry, loaderRegistryMap } from './loaders.js';
import { modalRegistry, modalRegistryMap } from './modals.js';
import { toastRegistry, toastRegistryMap } from './toasts.js';
import { registryAliases } from './aliases.js';

export const componentRegistries = {
  toast: toastRegistry,
  modal: modalRegistry,
  loader: loaderRegistry,
};

export const registryCatalog = Object.freeze([...toastRegistry, ...modalRegistry, ...loaderRegistry]);

export const registryIndex = new Map(registryCatalog.map((entry) => [entry.id, entry]));

export const registryGroups = Object.freeze({
  all: registryCatalog,
  toast: toastRegistry,
  toasts: toastRegistry,
  modal: modalRegistry,
  modals: modalRegistry,
  loader: loaderRegistry,
  loaders: loaderRegistry,
});

export function getRegistryEntriesByCategory(category = 'all') {
  return registryGroups[category] ?? [];
}

export function getRegistryEntryById(id) {
  const direct = registryIndex.get(id);
  if (direct) return direct;

  // Fallback to aliases mapping (legacy ids -> current id)
  const mapped = registryAliases?.[id];
  if (mapped) return registryIndex.get(mapped) ?? null;

  return null;
}

export function getRegistryCounts() {
  return {
    toasts: toastRegistry.length,
    modals: modalRegistry.length,
    loaders: loaderRegistry.length,
    total: registryCatalog.length,
  };
}

export function getRegistryMaps() {
  return {
    toastRegistryMap,
    modalRegistryMap,
    loaderRegistryMap,
  };
}

export function walkRegistryEntries(callback) {
  registryCatalog.forEach((entry, index) => callback(entry, index));
  return registryCatalog;
}

export default registryCatalog;
