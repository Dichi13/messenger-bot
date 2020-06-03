const
  express = require('express'),
  bodyParser = require('body-parser'),
  dotenv = require('dotenv'),
  app = express()

dotenv.config()
app.use(bodyParser.json())

app.use('/webhook', require('./api/webhook'))

// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'))