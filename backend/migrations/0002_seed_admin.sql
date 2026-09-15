INSERT OR IGNORE INTO users (id, name, email, password_hash, role, created_at, updated_at)
VALUES (
  'local-admin-001',
  'Maguru Administrator',
  'admin@maguruauto.com',
  'local-dev-salt:b26015a28e98c407fef0c8801ca2c84411f1268a10ff846a9d3e22be58d84bc6',
  'admin',
  '2026-09-15T00:00:00.000Z',
  '2026-09-15T00:00:00.000Z'
);