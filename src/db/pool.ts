import { Pool } from 'pg';

const getConnectionString = (): string | undefined => {
    return process.env.DATABASE_URL;
};

export const pool = new Pool(
    getConnectionString()
        ? {
              connectionString: getConnectionString(),
              ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : undefined,
          }
        : {
              host: process.env.PGHOST || 'localhost',
              port: Number(process.env.PGPORT) || 5432,
              user: process.env.PGUSER || 'postgres',
              password: process.env.PGPASSWORD || 'postgres',
              database: process.env.PGDATABASE || 'backend_survey_app',
          }
);
