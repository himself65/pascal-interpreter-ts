const INTEGER = 'INTEGER'
const PLUS = 'PLUS'
const MINUS = 'MINUS'
const MUL = 'MUL'
const DIV = 'DIV'
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

class Lexer {
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
    throw Error('Invalid character')
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
      } else if (this.currentChar === '*') {
        this.advance()
        return new Token(MUL, '*')
      } else if (this.currentChar === '/') {
        this.advance()
        return new Token(DIV, '/')
      }
      return this.error()
    }
    return new Token(EOF, null)
  }
}

export class Interpreter {
  lexer: Lexer
  currentToken: Token

  constructor (text: string) {
    this.lexer = new Lexer(text)
    this.currentToken = this.lexer.getNextToken()
  }

  error = (): never => {
    throw Error('Invalid syntax')
  }

  eat = (tokenType: string) => {
    if (this.currentToken.type === tokenType) {
      this.currentToken = this.lexer.getNextToken()
    } else {
      this.error()
    }
  }

  factor = () => {
    const token = this.currentToken
    this.eat(INTEGER)
    return token.value
  }

  term = () => {
    let result = this.factor()

    while ([MUL, DIV].indexOf(this.currentToken.type) !== -1) {
      const token = this.currentToken
      if (token.type === MUL) {
        this.eat(MUL)
        result *= this.factor()
      } else if (token.type === DIV) {
        this.eat(DIV)
        result /= this.factor()
      }
    }
    return result
  }

  expr = () => {
    let result = this.term()
    while ([PLUS, MINUS].indexOf(this.currentToken.type) !== -1) {
      const token = this.currentToken
      if (token.type === PLUS) {
        this.eat(PLUS)
        result += this.term()
      } else if (token.type === MINUS) {
        this.eat(MINUS)
        result -= this.term()
      }
    }
    return result
  }
}
