module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: '127.0.0.1',
      database: 'arxiv_browser_dev',
      user: 'ruggeri',
      password: null,
    },
    debug: true,
  },
};
