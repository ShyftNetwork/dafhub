import { useContext, useState } from 'react'
import {
  Box,
  Button,
  Heading,
  Text,
  Icon,
  Blockie,
  Modal,
  Card,
  Flex,
  Loader,
  Link,
} from 'rimble-ui'
import PageHead from '../components/PageHead'
import { WalletConnectContext } from '../components/WalletConnectContext'
import RequestModal from '../components/RequestModal'
import ContentBlock from '../components/ContentBlock'
import useSignVC from '../hooks/use-sign-vc'
import useSignSDR from '../hooks/use-sign-sdr'
import useNewMessage from '../hooks/use-new-message'
import useCredentials from '../hooks/use-credentials'

import Header from '../components/Header'

const Welcome = props => {
  const [isOpen, setIsOpen] = useState(false)
  const [requestType, setRequestType] = useState('')
  const closeModal = () => {
    setIsOpen(false)
  }
  const openModal = () => {
    setIsOpen(true)
  }
  const { killSession, address, walletConnector } = useContext(
    WalletConnectContext,
  )

  const receiveCredential = async (shouldWait: boolean) => {
    if (!walletConnector) {
      return
    }
    const { accounts } = walletConnector
    const address = accounts[0]

    console.log(address)

    const { data } = await useSignVC(address)

    const customRequest = {
      id: 1000,
      jsonrpc: '2.0',
      method: shouldWait ? 'issue_credential_callback' : 'issue_credential',
      params: [data],
    }

    if (shouldWait) {
      openModal()
      setRequestType('CREDENTIAL_ISSUE')
    }

    const response = await walletConnector.sendCustomRequest(customRequest)

    if (shouldWait && response === 'CREDENTIAL_ACCEPTED') {
      closeModal()
    }
  }

  const requestUsername = async () => {
    if (!walletConnector) {
      return
    }

    const threadId = Date.now()
    const { data } = await useSignSDR(threadId.toString())

    const customRequest = {
      id: threadId,
      jsonrpc: '2.0',
      method: 'request_credentials',
      params: [data],
    }

    console.log(customRequest)

    const response = await walletConnector.sendCustomRequest(customRequest)

    if (response) {
      const { data: message } = await useNewMessage(response)
      const { data: credentials } = await useCredentials(message.id)

      console.log(credentials)
    }
  }

  return (
    <main>
      <PageHead title="Dafhub" description="Demo of daf + walletconnect" />
      <Box>
        <RequestModal isOpen={isOpen} requestType={requestType} />
        <Header loggedIn />

        <Box p={4}>
          <Box>
            <Heading as={'h2'}>Hey username!</Heading>
          </Box>

          <Box mt={4}>
            <Heading as={'h3'}>Verifiable Credentials</Heading>
          </Box>
          <Box flexDirection={'row'} display={'flex'} mt={3}>
            <ContentBlock
              title={'Receive credential with callback'}
              text={
                'Issue a credential from DafHub to your mobile. This will wait for you to accept the credential'
              }
              action={() => receiveCredential(true)}
              buttonText={'Receive'}
            />
            <ContentBlock
              title={'Receive credential standard'}
              text={
                'Issue a credential from DafHub to your mobile. The credential will just appear on your device without a response from you.'
              }
              action={() => receiveCredential(false)}
              buttonText={'Receive'}
            />
            <ContentBlock
              title={'Request credentials'}
              text={
                'Gwei based on a fundamental analysis although Zilliqa froze some safe ICO! Since Basic Attention Token detected the stablecoin'
              }
              action={requestUsername}
              buttonText={'Request'}
            />
            {/* <ContentBlock
            title={'Issue credential'}
            text={
              'Issue a credential to another identity from you '
            }
            action={() => {}}
            buttonText={'Issue'}
          /> */}
          </Box>
          <Box mt={6}>
            <Heading as={'h3'}>Ethereum Signing</Heading>
          </Box>
          <Box flexDirection={'row'} display={'flex'} mt={3}>
            <ContentBlock
              title={'Send Transaction*'}
              text={
                'Gwei based on a fundamental analysis although Zilliqa froze some safe ICO! Since Basic Attention Token detected the stablecoin'
              }
              action={() => {}}
              buttonText={'Send'}
            />
            <ContentBlock
              title={'Personal Sign'}
              text={
                'Gwei based on a fundamental analysis although Zilliqa froze some safe ICO! Since Basic Attention Token detected the stablecoin'
              }
              action={() => {}}
              buttonText={'Sign'}
            />
            <ContentBlock
              title={'Sign Eth Typed Data'}
              text={
                'Gwei based on a fundamental analysis although Zilliqa froze some safe ICO! Since Basic Attention Token detected the stablecoin'
              }
              action={() => {}}
              buttonText={'Sign'}
            />
          </Box>
        </Box>
      </Box>
    </main>
  )
}

export default Welcome
