import { notFound } from 'next/navigation';

import WorkspaceShell from '../../../components/WorkspaceShell.jsx';
import { getRegistryEntryById } from '../../../registry/index.js';

export function generateMetadata({ params }) {
  const registryItem = getRegistryEntryById(params.id);

  return {
    title: registryItem ? `${registryItem.name} | Glaze UI` : 'Component | Glaze UI',
  };
}

export default function ComponentWorkspacePage({ params }) {
  const registryItem = getRegistryEntryById(params.id);

  if (!registryItem) {
    notFound();
  }

  return <WorkspaceShell registryItem={registryItem} />;
}
