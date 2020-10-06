import { useContext, useState, useEffect } from 'react'
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
import useProfile from '../hooks/use-profile'
import Header from '../components/Header'
import useNewMessage from '../hooks/use-new-message'
import { agent } from '../daf/setup'

const Welcome = props => {
  const [isOpen, setIsOpen] = useState(false)
  const [requestType, setRequestType] = useState('')
  const [sdrCredentials, setSdrCredentials] = useState()
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>({})
  const [hasError, setError] = useState(false)

  const closeModal = () => {
    setIsOpen(false)
  }
  const openModal = () => {
    setIsOpen(true)
  }
  const { killSession, address, walletConnector } = useContext(
    WalletConnectContext,
  )

  const getUser = async () => {
    if (!walletConnector) {
      return
    }

    const { accounts } = walletConnector
    const address = accounts[0]
    const user = await useProfile(address)

    console.log('USER', user)
    setUser(user)
  }

  useEffect(() => {
    getUser()
  }, [walletConnector, sdrCredentials])

  const receiveCredential = async (shouldWait: boolean) => {
    if (!walletConnector) {
      return
    }
    const { accounts } = walletConnector
    const address = accounts[0]

    console.log(address)

    const credential = await useSignVC(address)

    const customRequest = {
      id: 1000,
      jsonrpc: '2.0',
      method: shouldWait ? 'issue_credential_callback' : 'issue_credential',
      params: [credential],
    }

    if (shouldWait) {
      setError(false)
      setRequestType('CREDENTIAL_ISSUE')
      setLoading(true)
      openModal()
    }

    try {
      const response = await walletConnector.sendCustomRequest(customRequest)
      if (shouldWait && response === 'CREDENTIAL_ACCEPTED') {
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
      setError(true)
    }
  }

  const requestUsername = async () => {
    if (!walletConnector) {
      return
    }

    const threadId = Date.now()
    const sdr = await useSignSDR(threadId.toString())

    const customRequest = {
      id: threadId,
      jsonrpc: '2.0',
      method: 'request_credentials',
      params: [{ proof: { jwt: sdr } }],
    }

    setError(false)
    setLoading(true)
    setRequestType('SELECTIVE_DISCLOSURE_RESPONSE')
    openModal()

    try {
      const response = await walletConnector.sendCustomRequest(customRequest)
      if (response) {
        console.log(response)
        await useNewMessage(response.proof.jwt)
        setSdrCredentials(response.verifiableCredential)
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
      setError(true)
    }
  }

  return (
    <main>
      <PageHead title="Dafhub" description="Demo of daf + walletconnect" />
      <Box>
        <RequestModal
          isOpen={isOpen}
          closeModal={closeModal}
          requestType={requestType}
          sdrCredentials={sdrCredentials}
          loading={loading}
          hasError={hasError}
        />
        <Header loggedIn />

        <Box p={4}>
          <Box>
            <Heading as={'h2'}>
              Hey {user && user.name ? user.name : 'there'}!
            </Heading>
            <Text>
              Receive veriable credentials and update your username with a
              selective disclosure request
            </Text>
          </Box>

          <Box mt={4}>
            <Heading as={'h3'}>Verifiable Credentials</Heading>
          </Box>
          <Box flexDirection={'row'} display={'flex'} mt={3}>
            <ContentBlock
              title={'Receive credential with callback'}
              text={
                'Issue a credential from DafHub to your mobile. This will wait for you to accept the credential.'
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
              title={'Update username'}
              text={'Issue a credential request (SDR) to update your username.'}
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
          <Box mt={5} mb={4}>
            <Heading as={'h3'}>Ethereum Signing</Heading>
            <Text>Coming soon</Text>
          </Box>
          <Box flexDirection={'row'} display={'flex'} mt={3} opacity={0.3}>
            <ContentBlock
              title={'Send Transaction*'}
              text={
                'Gwei based on a fundamental analysis although Zilliqa froze some safe ICO! Since Basic Attention Token detected the stablecoin'
              }
              action={() => {}}
              buttonText={'Send'}
              buttonDisabled
            />
            <ContentBlock
              title={'Personal Sign'}
              text={
                'Gwei based on a fundamental analysis although Zilliqa froze some safe ICO! Since Basic Attention Token detected the stablecoin'
              }
              action={() => {}}
              buttonText={'Sign'}
              buttonDisabled
            />
            <ContentBlock
              title={'Sign Eth Typed Data'}
              text={
                'Gwei based on a fundamental analysis although Zilliqa froze some safe ICO! Since Basic Attention Token detected the stablecoin'
              }
              action={() => {}}
              buttonText={'Sign'}
              buttonDisabled
            />
          </Box>
        </Box>
      </Box>
    </main>
  )
}

export default Welcome
