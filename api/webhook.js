const
  express = require('express'),
  {handleMessage, handlePostback} = require('../utilities/handler'),
  router = express.Router()

function receiveMessage(req, res) {
  const body = req.body

  if (body.object === 'page') {
    body.entry.forEach(function(entry) {
      const webhook_event = entry.messaging[0]
      console.log(webhook_event)

      const sender_psid = webhook_event.sender.id
      console.log('Sender PSID: ' + sender_psid)

      if (webhook_event.message) {
        handleMessage(sender_psid, webhook_event.message)
      } else if (webhook_event.postback) {
        handlePostback(sender_psid, webhook_event.postback)
      }
    });

    res.status(200).send('EVENT_RECEIVED')
  } else {
    res.sendStatus(404)
  }
}

function verifyWebhook(req, res) {
  let VERIFY_TOKEN = process.env.VERIFY_TOKEN

  let mode = req.query['hub.mode']
  let token = req.query['hub.verify_token']
  let challenge = req.query['hub.challenge']

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('WEBHOOK_VERIFIED')
      res.status(200).send(challenge)
    } else {
      res.sendStatus(403)
    }
  } else {
    res.sendStatus(404)
  }
}

router.post('/', receiveMessage);
router.get('/', verifyWebhook);

module.exports = router