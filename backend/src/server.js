const app = require('./app');
const env = require('./config/env');
const initializeDatabase = require('./db/init');

async function bootstrap() {
  await initializeDatabase();

  app.listen(env.port, () => {
    console.log(`WAYTRIP backend running on http://localhost:${env.port}`);
  });
}

bootstrap();
