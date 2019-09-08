const INTEGER = 'INTEGER'
const PLUS = 'PLUS'
const MINUS = 'MINUS'
const EOF = 'EOF'

class Token {
  type: string
  value: any

  constructor (type: string, value: any) {
    this.type = type
    this.value = value
  }

  toString = () => `Token(${this.type}, ${this.value})`
}

export class Interpreter {
  text: string
  pos: number
  currentToken: Token = new Token(EOF, null)
  currentChar: string | null

  constructor (text: string) {
    this.text = text
    this.pos = 0
    this.currentChar = this.text[this.pos]
  }

  error = (): never => {
    throw Error('Error parsing input')
  }

  advance = () => {
    this.pos++
    if (this.pos > this.text.length - 1) {
      this.currentChar = null
    } else {
      this.currentChar = this.text[this.pos]
    }
  }

  skipWhitespace = () => {
    while (this.currentChar != null && this.currentChar === ' ') {
      this.advance()
    }
  }

  integer = () => {
    let result = ''
    while (this.currentChar != null && /[0-9]/.test(this.currentChar)) {
      result += this.currentChar
      this.advance()
    }
    return Number(result)
  }

  getNextToken = (): Token => {
    while (this.currentChar != null) {
      if (/ /.test(this.currentChar)) {
        this.skipWhitespace()
        continue
      }

      if (/[0-9]/.test(this.currentChar)) {
        return new Token(INTEGER, this.integer())
      } else if (this.currentChar === '+') {
        this.advance()
        return new Token(PLUS, '+')
      } else if (this.currentChar === '-') {
        this.advance()
        return new Token(MINUS, '-')
      }
      return this.error()
    }
    return new Token(EOF, null)
  }

  eat = (tokenType: string) => {
    if (this.currentToken.type === tokenType) {
      this.currentToken = this.getNextToken()
    } else {
      this.error()
    }
  }

  expr = () => {
    this.currentToken = this.getNextToken()

    const left = this.currentToken
    this.eat(INTEGER)

    const op = this.currentToken
    if (op.type === PLUS) {
      this.eat(PLUS)
    } else {
      this.eat(MINUS)
    }

    const right = this.currentToken
    this.eat(INTEGER)

    if (op.type === PLUS) {
      return left.value + right.value
    } else {
      return left.value - right.value
    }
  }
}
