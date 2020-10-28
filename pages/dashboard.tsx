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
import useLoggedInUser from '../hooks/use-logged-in-user'
import useCredentials from '../hooks/use-credentials'
import Header from '../components/Header'

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
    const { data: user } = await useLoggedInUser(address)

    setUser(user)
  }

  useEffect(() => {
    getUser()
  }, [walletConnector, sdrCredentials])

  const sendCredential = async (shouldWait: boolean) => {
    if (!walletConnector) {
      return
    }
    const { accounts } = walletConnector
    const address = accounts[0]

    console.log(address)

    const { data } = await useSignVC(address)

    console.log('data', [data])

    const customRequest = {
      id: 1000,
      jsonrpc: '2.0',
      method: shouldWait ? 'issue_credential_callback' : 'issue_credential',
      params: [data],
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

  const requestCredentials = async () => {
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

    setError(false)
    setLoading(true)
    setRequestType('SELECTIVE_DISCLOSURE_RESPONSE')
    openModal()

    try {
      const response = await walletConnector.sendCustomRequest(customRequest)
      if (response) {
        const { data: credentials } = await useCredentials(response)
        console.log('creds', credentials[0]._credentialSubject);
        setSdrCredentials(credentials[0]._credentialSubject)
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
      setError(true)
    }
  }
  const rendorAttributes = async (att) => {
    return Object.keys(att).map((key, i) => {
      <p key={i}>
        <span>Key Name: {key}</span>
        <span>Value: {att.object[key]}</span>
      </p>
    })
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

          <Box mt={4}>
            <Heading as={'h3'}>Verifiable Credentials</Heading>
          </Box>
          <Box flexDirection={'row'} display={'flex'} mt={3}>
            <ContentBlock
              title={'Step 1: Request Credential Info and Update Data'}
              text={'Issue a credential request (SDR) to update your username.'}
              action={requestCredentials}
              buttonText={'Request'}
            />
            <ContentBlock
              title={'Step2: Check Credential information'}
              text={user.documentType}
              action={rendorAttributes}
              buttonText={'Verified!'}
            />
            <ContentBlock
              title={'Step 3: Send credential with callback'}
              text={
                'Issue a credential from DafHub to your mobile. This will wait for you to accept the credential.'
              }
              action={() => sendCredential(true)}
              buttonText={'Send'}
            />
            {/* <ContentBlock
              title={'Receive credential standard'}
              text={
                'Issue a credential from DafHub to your mobile. The credential will just appear on your device without a response from you.'
              }
              action={() => receiveCredential(false)}
              buttonText={'Receive'}
            /> */}
            {/* <ContentBlock
            title={'Issue credential'}
            text={
              'Issue a credential to another identity from you '
            }
            action={() => {}}
            buttonText={'Issue'}
          /> */}
          </Box>
        </Box>
        <Box p={4}>
          <Box mb={2}>
            <Heading as={'h3'}>Credential Information</Heading>
          </Box>
          <Box>
            { JSON.stringify(sdrCredentials)  }
          </Box>
          <Box>

          </Box>
        </Box>
      </Box>
    </main>
  )
}

export default Welcome
