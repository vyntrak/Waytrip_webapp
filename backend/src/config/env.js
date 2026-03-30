const dotenv = require('dotenv');

dotenv.config();

const env = {
  port: Number(process.env.PORT || 4000),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
};

if (!env.databaseUrl) {
  throw new Error('DATABASE_URL is required');
}

if (!env.jwtSecret) {
  throw new Error('JWT_SECRET is required');
}

module.exports = env;
