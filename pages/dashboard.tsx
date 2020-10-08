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
import { AppContext } from '../components/AppContext'
import { ExtensionContext } from '../components/ExtensionContext'
import RequestModal from '../components/RequestModal'
import ContentBlock from '../components/ContentBlock'
import useSignVC from '../hooks/use-sign-vc'
import useSignSDR from '../hooks/use-sign-sdr'
import useProfile from '../hooks/use-profile'
import Header from '../components/Header'
import useNewMessage from '../hooks/use-new-message'

const Welcome = props => {
  const { address, isExtensionUser } = useContext(AppContext)
  const { extension } = useContext(ExtensionContext)
  const { killSession, walletConnector } = useContext(WalletConnectContext)

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

  const getUser = async () => {
    if (!walletConnector) {
      return
    }
    // const { accounts } = walletConnector
    // const address = accounts[0]
    const user = await useProfile(address)

    setUser(user)
  }

  useEffect(() => {
    getUser()
  }, [walletConnector, sdrCredentials])

  const receiveCredential = async (shouldWait: boolean) => {
    if (!isExtensionUser && !walletConnector) {
      return
    }

    // const { accounts } = walletConnector
    // const address = accounts[0]
    const credential = await useSignVC(address)

    console.log(credential)

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
      if (isExtensionUser) {
        const response = await extension.save(credential, !shouldWait)

        if (shouldWait && response.payload.action === 'CREDENTIAL_ACCEPTED') {
          setLoading(false)
        }
      } else {
        const response = await walletConnector.sendCustomRequest(customRequest)

        if (shouldWait && response === 'CREDENTIAL_ACCEPTED') {
          setLoading(false)
        }
      }
    } catch (error) {
      setLoading(false)
      setError(true)
    }
  }

  const requestUsername = async () => {
    if (!isExtensionUser && !walletConnector) {
      return
    }
    const threadId = Date.now()
    const sdr = await useSignSDR(threadId.toString())

    setError(false)
    setLoading(true)
    setRequestType('SELECTIVE_DISCLOSURE_RESPONSE')
    openModal()

    try {
      console.log(extension)
      if (isExtensionUser) {
        const response = await extension.request(sdr)
        if (response) {
          console.log(response)
          await useNewMessage(response.payload.verifiablePresentation.proof.jwt)
          setSdrCredentials(
            response.payload.verifiablePresentation.verifiableCredential,
          )
          setLoading(false)
        }
      } else {
        const customRequest = {
          id: threadId,
          jsonrpc: '2.0',
          method: 'request_credentials',
          params: [{ proof: { jwt: sdr } }],
        }
        const response = await walletConnector.sendCustomRequest(customRequest)
        if (response) {
          console.log(response)
          await useNewMessage(response.proof.jwt)
          setSdrCredentials(response.verifiableCredential)
          setLoading(false)
        }
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
            <Box
              backgroundColor={'#d0f3d0'}
              borderRadius={5}
              padding={2}
              mt={3}
            >
              <Text>
                <b>{address}</b>
              </Text>
            </Box>
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
            <ContentBlock
              title={'Peer to Peer'}
              text={'Issue a credential to another identity'}
              action={() => {}}
              buttonText={'Issue'}
              buttonDisabled
            />
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
