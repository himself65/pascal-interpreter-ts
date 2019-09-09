import { Interpreter } from '../src'

describe('Unit test', () => {
  it('Interpreter run success', () => {
    expect((new Interpreter('1+2')).expr()).toBe(3)
    expect((new Interpreter('1+9')).expr()).toBe(10)
    expect((new Interpreter('20+20')).expr()).toBe(40)
    expect((new Interpreter('20-20')).expr()).toBe(0)
    expect((new Interpreter('1-2')).expr()).toBe(-1)
    expect((new Interpreter('1+2+3+4')).expr()).toBe(10)
    expect((new Interpreter('10 + 1 + 2 - 3 + 4 + 6 - 15')).expr()).toBe(5)
  })
})
