import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import { execSync } from 'child_process';

let container: StartedPostgreSqlContainer;

export async function setup() {
  console.log('🚀 Starting PostgreSQL Testcontainer...');

  // 1. Start the ephemeral PostgreSQL Docker container
  container = await new PostgreSqlContainer('postgres:16-alpine')
    .withDatabase('personal_journal_test')
    .withUsername('test_user')
    .withPassword('test_password')
    .start();
  const connectionString = container.getConnectionUri();
  console.log(`✅ Test database started: ${connectionString}`);
  // 2. Override the environment variable so all worker threads use this test DB
  process.env.DATABASE_URL = connectionString;
  // 3. Run Prisma migrations against the test database
  console.log('🔄 Running database migrations...');
  execSync('pnpm prisma migrate deploy', {
    env: { ...process.env, DATABASE_URL: connectionString },
    stdio: 'inherit',
  });
  console.log('✅ Migrations completed successfully.');
}

export async function teardown() {
  console.log('🛑 Stopping PostgreSQL Testcontainer...');
  if (container) {
    await container.stop();
    console.log('✅ Container stopped.');
  }
}
