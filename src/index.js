const app = require('./server');
const db = require('./config/db.config')
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const PORT = process.env.PORT || 8000;

db.sequelize.sync({ force: true }).then(() => {
  console.log("db has been re sync")

  bcrypt.hash('admin', 10).then(password => {
    db.users.create({
      username: 'admin',
      email: 'admin@admin.com',
      password,
      role: 'admin'
    }).then(adminUser => {
      if (adminUser) {
        console.info('adminUser.id', adminUser.id)
        let token = jwt.sign({ id: adminUser.id }, process.env.SECRET_KEY, {
          expiresIn: 1 * 24 * 60 * 60 * 1000,
        });
        console.info('\n admin token: ', token);
      }
    })
  })
})

app.listen(PORT, () => {
  console.log('Server is listening on port ' + PORT);
});