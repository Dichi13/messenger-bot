function birthdayCalculator(dateString) {
  const
    today = new Date(),
    birthDate = new Date(dateString),
    nextBirthday = birthDate,
    millisecondsInADay = 1000*60*60*24

  if (today.getMonth() > birthDate.getMonth()
    || today.getMonth() === birthDate.getMonth() && today.getDate() > birthDate.getMonth()) {
    nextBirthday.setFullYear(today.getFullYear() + 1)
  } else {
    nextBirthday.setFullYear(today.getFullYear())
  }

  return Math.ceil((nextBirthday.getTime() - today.getTime())/(millisecondsInADay))
}

module.exports = birthdayCalculator