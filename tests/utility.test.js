const
  expect = require('chai').expect,
  birthdayCalculator = require('../utilities/birthdayCalculator')

describe('Utilities test', () => {
  describe('Birthday calculator test', () => {
    it('should return 0', () => {
      const result = birthdayCalculator('1999-06-04', new Date('2020-06-04'))
      expect(result).to.equal(0)
    })
    it('should return 1', () => {
      const result = birthdayCalculator('1999-06-05', new Date('2020-06-04'))
      expect(result).to.equal(1)
    })
    it('should return 364', () => {
      const result = birthdayCalculator('1999-06-03', new Date('2020-06-04'))
      expect(result).to.equal(364)
    })
    it('should return 365', () => {
      const result = birthdayCalculator('1999-06-03', new Date('2019-06-04'))
      expect(result).to.equal(365)
    })
  })
})