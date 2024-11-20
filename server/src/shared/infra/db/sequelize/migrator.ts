/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs';
import { join, resolve } from 'path';
import { Sequelize } from 'sequelize';
import { SequelizeStorage, Umzug, UmzugOptions } from 'umzug';

const coreDir = join(process.cwd(), 'src/core');

export function migrator(
  sequelize: Sequelize,
  options?: Partial<UmzugOptions>,
) {
  const migrationDirectories = getDMigrationirectories();

  let migrationFiles: string[] = [];
  migrationDirectories.forEach((dir) => {
    migrationFiles.push(...getMigrationFiles(dir));
  });

  migrationFiles = migrationFiles.sort((a, b) => {
    const migrationDateRegex = /(\d{4}\.\d{2}\.\d{2}T\d{2}\.\d{2}\.\d{2})/;
    const [dateA] = a.match(migrationDateRegex)!;
    const [dateB] = b.match(migrationDateRegex)!;
    return dateA.localeCompare(dateB);
  });

  return new Umzug({
    migrations: migrationFiles.map((file) => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const migration = require(resolve(file));
      return {
        name: file,
        up: async () => migration.up({ context: sequelize }),
        down: async () => migration.down({ context: sequelize }),
      };
    }),
    context: sequelize as any,
    storage: new SequelizeStorage({ sequelize }),
    logger: console,
    ...(options || {}),
  });
}

function getDMigrationirectories(): string[] {
  return fs
    .readdirSync(coreDir)
    .filter((file) => fs.statSync(join(coreDir, file)).isDirectory())
    .map((dir) => join(coreDir, dir, 'infra/db/sequelize/migrations'));
}

function getMigrationFiles(baseDir: string): string[] {
  const files: string[] = [];

  try {
    fs.readdirSync(baseDir).forEach((file) => {
      const fullPath = join(baseDir, file);
      if (file.endsWith('.ts')) {
        files.push(fullPath);
      }
    });
  } catch (err) {
    console.warn('No migrations found in', baseDir);
  }

  return files;
}
