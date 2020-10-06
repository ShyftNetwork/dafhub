import { useEffect, useState } from 'react'
import Router from 'next/router'
import { WalletConnectContext } from '../components/WalletConnectContext'
import { ExtensionContext } from '../components/ExtensionContext'
import WalletConnect from '@walletconnect/browser'
import { BaseStyles, theme } from 'rimble-ui'
import { ThemeProvider } from 'styled-components'
import '../styles/base.css'

const customTheme = Object.assign({}, theme, {
  colors: {
    ...theme.colors, // keeps existing colors
    text: '#333', // sets color for text
    background: '#EEE', // sets color for background
    primary: '#3259D6', // sets primary color
  },
  fontSizes: [12, 14, 16, 20, 24, 32, 48, 64], // sets font scale
  space: [0, 4, 8, 16, 32, 64, 128, 256], // sets spacing scale
})

function MyApp({ Component, pageProps }) {
  const [walletConnector, updateWalletConnect] = useState(null)
  const [address, updateAddress] = useState(null)
  const [accounts, updateAccounts] = useState([])
  const [chainId, updateChainId] = useState(null)
  const [connected, updateConnected] = useState(false)

  const [extension, updateExtension] = useState()

  /**
   * Reset state back to default
   */
  const reset = () => {
    updateWalletConnect(null)
    updateConnected(false)
    updateAddress(null)
    updateAccounts([])
    updateChainId(null)
  }

  /**
   * Initialize extension
   */

  const initExtention = () => {
    console.log(window.idWallet)
    updateExtension(window.idWallet)
  }

  const connectAddress = address => {
    updateAddress(address)
    updateConnected(true)
  }

  /**
   * Initialize walletconnect
   */
  const init = async () => {
    const newWalletConnector = new WalletConnect({
      bridge: 'https://bridge.walletconnect.org',
    })

    /**
     * Walletconnect uses localstorage and window to rehydrate its sesion cache
     */
    window.walletConnector = newWalletConnector
    updateWalletConnect(newWalletConnector)

    if (!newWalletConnector.connected) {
      await newWalletConnector.createSession()
    }

    return newWalletConnector.uri
  }

  /**
   * Subscribe to walletconnect events
   */
  const subscribeToEvents = () => {
    console.log('Subscribing to events')

    if (!walletConnector) {
      return
    }

    walletConnector.on('session_update', async (error, payload) => {
      console.log('walletConnector.on("session_update")') // tslint:disable-line

      if (error) {
        throw error
      }

      const { chainId, accounts } = payload.params[0]
    })

    walletConnector.on('connect', (error, payload) => {
      console.log('walletConnector.on("connect")') // tslint:disable-line

      const challengeRequest = {
        id: 1000,
        jsonrpc: '2.0',
        method: 'challenge_request',
        params: ['auth'],
      }

      if (error) {
        throw error
      }

      const { chainId, accounts } = payload.params[0]
      const address = accounts[0]

      updateConnected(true)
      updateAddress(address)
      updateAccounts(accounts)
      updateChainId(chainId)
    })

    if (walletConnector.connected) {
      const { chainId, accounts } = walletConnector
      const address = accounts[0]

      updateConnected(true)
      updateAddress(address)
      updateChainId(chainId)
      updateAccounts(accounts)
    }
  }

  /**
   * Kill walletconnect session
   */
  const killSession = () => {
    if (walletConnector) {
      Router.push('/login')
      walletConnector.killSession()
      reset()
    }
  }

  /**
   * Check for previous state on refresh
   */
  useEffect(() => {
    init()
  }, [])

  /**
   * Wait for load event to do stuff
   */
  useEffect(() => {
    window.addEventListener('load', () => {
      initExtention()
    })
  }, [])

  /**
   * Subscribe to events on change
   */
  useEffect(() => {
    if (walletConnector) {
      subscribeToEvents()
    }
  }, [walletConnector])

  /**
   * Subscribe to connection status
   */
  useEffect(() => {
    // Check user endpoint
    console.log(connected)

    if (connected) {
      Router.push('/dashboard')
    } else {
      Router.push('/login')
    }
  }, [connected])

  return (
    <WalletConnectContext.Provider
      value={{ init, killSession, address, walletConnector }}
    >
      <ExtensionContext.Provider value={{ extension, connectAddress }}>
        <ThemeProvider theme={customTheme}>
          <BaseStyles id={'base_styles_container'}>
            <Component {...pageProps} />
          </BaseStyles>
        </ThemeProvider>
      </ExtensionContext.Provider>
    </WalletConnectContext.Provider>
  )
}

export default MyApp
