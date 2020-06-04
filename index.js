const
  express = require('express'),
  bodyParser = require('body-parser'),
  dotenv = require('dotenv'),
  store = require('store'),
  app = express()

dotenv.config()
store.set('sessions', [])
store.set('messages', [])
app.use(bodyParser.json())

app.use('/webhook', require('./api/webhook'))
app.use('/messages', require('./api/messages'))

// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('Webhook is listening'))

module.exports = app