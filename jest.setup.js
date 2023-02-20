const app = require('./src/server');
const db = require('./src/config/db.config');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
let http = require('http');

const server = http.createServer(app);
jest.setTimeout(9000);

beforeAll(done => {
  db.sequelize.sync({ force: true, logging: console.log }).then(() => {
    bcrypt.hash('admin', 10).then(password => {
      db.users.create({
        username: 'admin',
        email: 'admin@admin.com',
        password,
        role: 'admin'
      }).then(adminUser => {
        if (adminUser) {
          let token = jwt.sign({ id: adminUser.id }, process.env.SECRET_KEY, {
            expiresIn: 1 * 24 * 60 * 60 * 1000,
          });
          process.env.ADMIN_TOKEN_TEST = token;
          console.info('\n admin token: ', token);
        }
        server.listen();
        done();
      })
    })
  })
  .catch(err => {
    server.listen();
    done();
  });
});

afterAll(async () => {
  await server.close();
});
