 const express = require('express');
 const routes = require('./routes/index');
 const app = express();
 const cors = require('cors');
 const fileUpload = require('express-fileupload');

 app.use(fileUpload());
 app.use(cors());
 app.use(require('cookie-parser')());
 app.use(require('body-parser').urlencoded({ limit: '100mb', extended: true }));
 app.use(require("body-parser").json({ limit: '100mb' }));
 app.use('/', routes);

 const port_running = 3001;
 app.listen(port_running, function () {
  console.log("Application of detection facial running at: " + port_running);
 });
