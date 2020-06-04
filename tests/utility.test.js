const expect = require('chai').expect
const birthdayCalculator = require('../utilities/birthdayCalculator')

describe('Utilities test', () => {
  describe('Birthday calculator test', () => {
    it('Should return 0', () => {
      const result = birthdayCalculator('1999-06-04', new Date('2020-06-04'))
      expect(result).to.equal(0)
    })
    it('Should return 1', () => {
      const result = birthdayCalculator('1999-06-05', new Date('2020-06-04'))
      expect(result).to.equal(1)
    })
    it('Should return 364', () => {
      const result = birthdayCalculator('1999-06-03', new Date('2020-06-04'))
      expect(result).to.equal(364)
    })
    it('Should return 365', () => {
      const result = birthdayCalculator('1999-06-03', new Date('2019-06-04'))
      expect(result).to.equal(365)
    })
  })
})