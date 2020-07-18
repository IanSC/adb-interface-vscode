import * as os from 'os'
import { ConsoleChannel } from '../Infraestructure/console/console-channel'
import * as FIREBASE_COMMANDS from './firebase-commands'
import { ADBInterfaceError } from '../adb-wrapper'
import { ADBResolver } from '../adb-resolver'
import { IConsoleInterface } from '../Infraestructure/console/console-interface/iconsole-interface'
import { MementoMock } from '../mock/memento-mock'
import { Memento } from 'vscode'

export class FirebaseManagerChannel extends ConsoleChannel {
  private resolverInstance: ADBResolver
  constructor(ciInstance: IConsoleInterface, currentStorage: Memento) {
    super(ciInstance)
    this.resolverInstance = new ADBResolver(
      os.homedir(),
      os.type(),
      ciInstance,
      currentStorage
    )
  }

  public async enableFirebaseDebugView(appPackageID: string): Promise<string> {
    let result: string = null

    const output = (
      await this.resolverInstance.sendADBCommand(
        FIREBASE_COMMANDS.SHELL_SETPROP_FIREBASE_ANALYTICS(appPackageID)
      )
    ).toString()

    if (output.length < 2) {
      result = `Setted firebase debug mode to [${appPackageID}] app`
    }

    if (!output) {
      throw new ADBInterfaceError('Error cause: ' + output)
    }
    return result ?? 'Wrong response: ' + output
  }
  public async disableFirebaseDebugView(): Promise<string> {
    let finalResult: string = null

    const output: string = (
      await this.resolverInstance.sendADBCommand(
        FIREBASE_COMMANDS.DISABLE_FIREBASE_ANALYTICS()
      )
    ).toString()

    if (output == '') {
      finalResult = 'Disabled firebase debug mode'
    }

    if (!finalResult) {
      throw new ADBInterfaceError('Error cause: ' + output)
    }
    return finalResult ?? 'No valid return'
  }
}
