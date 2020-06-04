const
  express = require('express'),
  store = require('store'),
  router = express.Router()

function getAllMessages(req, res) {
  const messages = store.get('messages')
  res.json(messages)
}

function getMessageById(req, res) {
  const
    messages = store.get('messages'),
    selectedMessage = messages.find(obj => obj.messageId === req.params.messageId)

  if (selectedMessage) res.json({status: true, message: selectedMessage})
  else res.status(404).json({ status: false, message: "Cannot find a message with specified messageId." })
}

function deleteMessageById(req, res) {
  const
    messages = store.get('messages'),
    selectedIndex = messages.findIndex(obj => obj.messageId === req.body.messageId)

  if (selectedIndex !== -1) {
    messages.splice(selectedIndex, 1)
    store.set('messages', messages)
    res.json({ status: true, message: "Message deleted successfully." })
  } else {
    res.status(404).json({ status: false, message: "Cannot find a message with specified messageId." })
  }
}

router.get('/', getAllMessages)
router.get('/:messageId', getMessageById)
router.post('/delete', deleteMessageById)

module.exports = router