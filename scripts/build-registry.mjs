import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const srcDir = path.join(rootDir, 'src');
const registryDir = path.join(rootDir, 'registry');
const demoPublicRegistryDir = path.join(rootDir, 'demo', 'public', 'registry');

const targetFiles = [
  'SeasonalLounge.tsx',
  'SeasonalParticles.tsx',
  'audio.ts',
  'presets.ts',
  'themePresets.ts',
  'types.ts',
  'styles.css',
  'index.ts',
];

export function buildRegistryItem() {
  const files = targetFiles.map((filename) => {
    const filePath = path.join(srcDir, filename);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Registry source file not found: ${filePath}`);
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    return {
      path: filename,
      content,
      type: 'registry:ui',
      target: `components/seasonal-lounge/${filename}`,
    };
  });

  const registryItem = {
    $schema: 'https://ui.shadcn.com/schema/registry-item.json',
    name: 'seasonal-lounge',
    type: 'registry:ui',
    title: 'Seasonal Lounge',
    description:
      'A configurable React lounge with seasonal scenes, ambient audio loops, particle effects, calm full-screen mode, and theme builder.',
    dependencies: [],
    devDependencies: [],
    registryDependencies: [],
    files,
  };

  const registryIndex = {
    $schema: 'https://ui.shadcn.com/schema/registry.json',
    name: 'seasonal-lounge',
    homepage: 'https://seasonal-lounge.vercel.app',
    items: [
      {
        name: 'seasonal-lounge',
        type: 'registry:ui',
        title: 'Seasonal Lounge',
        description: registryItem.description,
      },
    ],
  };

  return { registryItem, registryIndex };
}

export function writeRegistryFiles() {
  const { registryItem, registryIndex } = buildRegistryItem();

  for (const dir of [registryDir, demoPublicRegistryDir]) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(
      path.join(dir, 'seasonal-lounge.json'),
      JSON.stringify(registryItem, null, 2),
      'utf-8',
    );
    fs.writeFileSync(
      path.join(dir, 'index.json'),
      JSON.stringify(registryIndex, null, 2),
      'utf-8',
    );
  }

  console.log(`Registry built successfully:`);
  console.log(`- ${path.join(registryDir, 'seasonal-lounge.json')}`);
  console.log(`- ${path.join(demoPublicRegistryDir, 'seasonal-lounge.json')}`);
}

// When executed directly
if (process.argv[1] === __filename) {
  writeRegistryFiles();
}
