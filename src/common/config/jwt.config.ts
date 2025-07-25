import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: process.env['JWT_SECRET'] || 'your-secret-key',
  accessTokenExpiration: process.env['JWT_ACCESS_EXPIRATION'] || '15m',
  refreshTokenExpiration: process.env['JWT_REFRESH_EXPIRATION'] || '7d',
  resetPasswordExpiration: process.env['JWT_RESET_PASSWORD_EXPIRATION'] || '1h',
  verifyEmailExpiration: process.env['JWT_VERIFY_EMAIL_EXPIRATION'] || '24h',
})); 