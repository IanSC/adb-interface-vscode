import { execSync } from 'child_process'
import { IConsoleInterface } from './iconsole-interface'
import { isArray } from 'util'

interface ConsoleCallback {
  (myArgument: string): Buffer
}

export class ConsoleInterfaceMock implements IConsoleInterface {
  public interceptor = (input, output) => {
    return output
  }
  private _callback: ConsoleCallback
  private _returnStack: Array<Buffer> = []
  public returnInfinity: boolean = true

  constructor() {
    this._callback = null
  }

  setConsoleOutput(value: string): void {
    return this.pushToReturnStack(
      value ? Buffer.from(value, 'utf8') : Buffer.from('', 'utf8')
    )
  }

  pushToReturnStack(toReturn: Array<Buffer> | Buffer) {
    if (toReturn instanceof Buffer) {
      this._returnStack.push(toReturn)
    } else {
      toReturn.forEach(element => {
        this._returnStack.push(element)
      })
    }
  }

  setCallbackMock(callback: ConsoleCallback): void {
    this._callback = callback
  }

  execConsoleSync(command: string): Buffer {
    let result = Buffer.from('')

    if (this._callback) {
      result = this._callback(command)
    } else {
      if (this._returnStack.length == 1 && this.returnInfinity) {
        result = this._returnStack[this._returnStack.length - 1]
      } else {
        result = this._returnStack.shift()
      }
    }

    if (this.interceptor) return this.interceptor(command, result)

    return result
  }
}
