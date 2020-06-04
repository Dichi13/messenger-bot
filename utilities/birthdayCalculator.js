function birthdayCalculator(dateString, today = new Date()) {
  const
    birthDate = new Date(dateString),
    nextBirthday = birthDate,
    millisecondsInADay = 1000*60*60*24

  if (today.getMonth() > birthDate.getMonth()
    || today.getMonth() === birthDate.getMonth() && today.getDate() > birthDate.getDate()) {
    nextBirthday.setFullYear(today.getFullYear() + 1)
  } else {
    nextBirthday.setFullYear(today.getFullYear())
  }

  return Math.ceil((nextBirthday.getTime() - today.getTime())/(millisecondsInADay))
}

module.exports = birthdayCalculator