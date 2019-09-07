const INTEGER = 'INTEGER'
const PLUS = 'PLUS'
const EOF = 'EOF'

class Token {
  type: string
  value: string

  constructor (type: string, value: any) {
    this.type = type
    this.value = value
  }

  toString = () => `Token(${this.type}, ${this.value})`
}

export class Interpreter {
  text: string
  pos = 0
  currentToken: Token = new Token(EOF, null)

  constructor (text: string) {
    this.text = text
  }

  error = (): never => {
    throw Error('Error parsing input')
  }

  getNextToken = (): Token => {
    const text = this.text
    if (this.pos > text.length - 1) {
      return new Token(EOF, null)
    }

    const currentChar = text[this.pos]

    if (/[0-9]/.test(currentChar)) {
      this.pos++
      return new Token(INTEGER, Number(currentChar))
    } else if (currentChar === '+') {
      this.pos++
      return new Token(PLUS, Number(currentChar))
    } else {
      return this.error()
    }
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
    this.eat(PLUS)

    const right = this.currentToken
    this.eat(INTEGER)

    return left.value + right.value
  }
}
