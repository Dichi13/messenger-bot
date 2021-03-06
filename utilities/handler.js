const
  fetch = require('node-fetch'),
  store = require('store'),
  birthdayCalculator = require('./birthdayCalculator')

// Handles messages events
function handleMessage(senderId, receivedMessage) {
  let response
  response = {}

  if (receivedMessage.text) {
    const
      sessions = store.get('sessions'),
      messages = store.get('messages'),
      currSessionIdx = sessions.findIndex(obj => obj.senderId === senderId),
      currSessionObj = currSessionIdx === -1 ? null : sessions[currSessionIdx],
      context = currSessionObj ? currSessionObj.context : ''

    // Reply user according to current context
    switch(context) {
      case 'ENTER_BIRTHDATE':
        response['text'] = `Oh, hello, ${receivedMessage.text}! When is your birth date? (YYYY-MM-DD)`
        currSessionObj.context = 'ENTER_YESNO'
        break

      case 'ENTER_YESNO':
        currSessionObj.birthday = receivedMessage.text
        response['attachment'] = {
          "type": "template",
          "payload": {
            "template_type": "button",
            "text": "Do you want to know when is your next birthday?",
            "buttons": [
              { "type": "postback", "title": "Yes", "payload": "yes" },
              { "type": "postback", "title": "No", "payload": "no" },
            ]
          }
        }
        currSessionObj.context = 'FINAL'
        break

      case 'FINAL':
        const lowerCaseMessage = receivedMessage.text.toLowerCase()
        if (lowerCaseMessage[0] === 'y') {
          const daysLeft = birthdayCalculator(currSessionObj.birthday)

          if (daysLeft === 1) response['text'] = 'Tomorrow is your birthday!!'
          else if (daysLeft === 0) response['text'] = 'Woohoo! Today is your birthday! Go celebrate with your friends!'
          else response['text'] = `There are ${daysLeft} days left until your next birthday.`

          response['text'] += '\n\nThank you for chatting with me!'
        } else {
          response['text'] = 'Goodbye! 👋'
        }
        sessions.splice(currSessionIdx, 1) // Delete this session
        break

      default:
        // Create new session
        response['text'] = `Hi! I'm AdaKerja Chatbot. What's your first name?`
        sessions.push({senderId, context: 'ENTER_BIRTHDATE'})
    }

    messages.push({senderId, messageId: receivedMessage.mid, message: receivedMessage.text})
    store.set('sessions', sessions)
    store.set('messages', messages)
  } else {
    response = {
      'text': `I'm sorry! This bot only accepts text messages.`
    }
  }

  callSendAPI(senderId, response)
}

// Handles messaging_postbacks events
function handlePostback(senderId, receivedPostback) {
  // This function assumes that user has already initiated a session
  const
    sessions = store.get('sessions'),
    currSessionIdx = sessions.findIndex(obj => obj.senderId === senderId),
    payload = receivedPostback.payload

  let response = { 'text': '' }

  if (payload === 'yes') {
    const daysLeft = birthdayCalculator(sessions[currSessionIdx].birthday)

    if (daysLeft === 1) response['text'] = 'Tomorrow is your birthday!!'
    else if (daysLeft === 0) response['text'] = 'Woohoo! Today is your birthday! Go celebrate with your friends!'
    else response['text'] = `There are ${daysLeft} days left until your next birthday.`

    response['text'] += '\n\nThank you for chatting with me!'
  } else if (payload === 'no') {
    response['text'] = 'Goodbye! 👋'
  }

  sessions.splice(currSessionIdx, 1) // Delete this session
  store.set('sessions', sessions)

  callSendAPI(senderId, response)
}

// Sends response messages via the Send API
function callSendAPI(senderId, response) {
  let request_body = {
    'recipient': {
      'id': senderId
    },
    'message': response
  }

  const token = process.env.ACCESS_TOKEN
  const uri = `https://graph.facebook.com/v2.6/me/messages?access_token=${token}`
  fetch(uri, {
    method: 'post',
    body: JSON.stringify(request_body),
    headers: { 'Content-Type': 'application/json' }
  })
    .then(res => res.json())
    .then(res => console.log(res))
    .catch(e => console.error('Unable to send message: ' + e))
}

module.exports = {
  handleMessage,
  handlePostback,
}