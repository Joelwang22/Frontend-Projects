export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS', [
      'some','random','strings','here'
    ])
  },
  admin: {
    url: env('STRAPI_ADMIN_URL', '/admin'),
    serveAdminPanel: true,
  },
});
