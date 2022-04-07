const { existsSync, readFileSync } = require('fs')
const { join } = require('path')

const { platform, arch } = process

let nativeBinding = null
let localFileExisted = false
let loadError = null

switch (platform) {
    case 'win32':
        switch (arch) {
            case 'x64':
                localFileExisted = existsSync(join(__dirname, 'node-keyring.win32-x64-msvc.node'))
                try {
                    if (localFileExisted) {
                        nativeBinding = require('./node-keyring.win32-x64-msvc.node')
                    } else {
                        nativeBinding = require('node-keyring-win32-x64-msvc')
                    }
                } catch (e) {
                    loadError = e
                }
                break
            default:
                throw new Error(`Unsupported architecture on Windows: ${arch}`)
        }
        break
    case 'darwin':
        switch (arch) {
            case 'x64':
            case 'arm64':
                localFileExisted = existsSync(join(__dirname, 'node-keyring.darwin-universal.node'))
                try {
                    if (localFileExisted) {
                        nativeBinding = require('./node-keyring.darwin-universal.node')
                    } else {
                        nativeBinding = require('node-keyring-darwin-universal')
                    }
                } catch (e) {
                    loadError = e
                }
                break
            default:
                throw new Error(`Unsupported architecture on macOS: ${arch}`)
        }
        break
    case 'linux':
        switch (arch) {
            case 'x64':
                localFileExisted = existsSync(join(__dirname, 'node-keyring.linux-x64-gnu.node'))
                try {
                    if (localFileExisted) {
                        nativeBinding = require('./node-keyring.linux-x64-gnu.node')
                    } else {
                        nativeBinding = require('node-keyring-linux-x64-gnu')
                    }
                } catch (e) {
                    loadError = e
                }
                break
            default:
                throw new Error(`Unsupported architecture on Linux: ${arch}`)
        }
        break
    default:
        throw new Error(`Unsupported OS: ${platform}, architecture: ${arch}`)
}

if (!nativeBinding) {
    if (loadError) {
        throw loadError
    }
    throw new Error(`Failed to load native binding`)
}

const { getPassword, setPassword, deletePassword } = nativeBinding

module.exports.getPassword = getPassword
module.exports.setPassword = setPassword
module.exports.deletePassword = deletePassword