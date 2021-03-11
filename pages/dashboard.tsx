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
import Moment from 'moment'
import base64 from 'base-64'
import defaultURL from './defaultImage'

const Welcome = props => {
  const [isOpen, setIsOpen] = useState(false)
  const [requestType, setRequestType] = useState('')
  const [sdrCredentials, setSdrCredentials] = useState<any>({})
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>({})
  const [hasError, setError] = useState(false)
  const [isDisabled, setIsDisabled] = useState(true)
  const [assetData, setassetData] = useState(defaultURL)

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

    const { data } = await useSignVC(address, sdrCredentials)

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
    setassetData(defaultURL)
    setRequestType('SELECTIVE_DISCLOSURE_RESPONSE')
    openModal()

    try {
      const response = await walletConnector.sendCustomRequest(customRequest)
      if (response) {
        const { data: credentials } = await useCredentials(response)
        setSdrCredentials(credentials[0]._credentialSubject)
        setLoading(false)
        setIsDisabled(true)
      }
    } catch (error) {
      setLoading(false)
      setError(true)
    }
  }
  const handleAttributes = async (att) => {
    setIsDisabled(false);
  }

  const getAsset = async (id: string) => {
    try{
      if(!id || id === '') {
        return;
      }
      const baseUrl = 'https://testnet.burstiq.com/api/burstchain/shyft/ppk_owners/' + id + '/latest';
      const headers = new Headers()
      headers.append(
        'Authorization',
        'Basic ' + base64.encode('perseid_burstiq@shyft.network:9w4OP6Z9xk6%'),
      )
      headers.append('Content-Type', 'application/json')
      const options = {
        method: 'GET',
        headers: headers
      }
      const response = await fetch(baseUrl, options)
      const data = await response.json();
      setassetData(data.asset_metadata.data);
    } catch (error) {
      console.log(error)
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
              title={'Step2: Check document information'}
              action={handleAttributes}
              buttonText={'Verified!'}
            />
            <ContentBlock
              title={'Step 3: Send credential with callback'}
              text={
                'Issue a credential from PerseID Hub to your mobile. This will wait for you to accept the credential.'
              }
              action={() => sendCredential(true)}
              buttonDisabled={isDisabled}
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
        <Box p={4} className='content-box'>
          <Box mb={2}>
            <Heading as={'h3'}>Credential Information</Heading>
          </Box>
          {/* <Box>
            { JSON.stringify(sdrCredentials)  }
          </Box> */}
          <Box className='margin-top'>
            Document Type: { sdrCredentials.documentType  }
          </Box>
          <Box className='margin-top'>
            First Name: { sdrCredentials.firstName  }
          </Box>
          <Box className='margin-top'>
            Middle Name: { sdrCredentials.middleName  }
          </Box>
          <Box className='margin-top'>
            Last Name: { sdrCredentials.lastName  }
          </Box>
          <Box className='margin-top'>
            Date of Birth: { sdrCredentials.dateOfBirth ? Moment(sdrCredentials.dateOfBirth).format('ll') : '' }
          </Box>
          <Box className='margin-top'>
            Expiry Date: { sdrCredentials.expiryDate ? Moment(sdrCredentials.expiryDate).format('ll') : '' }
          </Box>
          <Box className='margin-top'>
            Nationality: { sdrCredentials.nationality  }
          </Box>
          <Box className='margin-top'>
            Birth Place: { sdrCredentials.birthPlace  }
          </Box>
          <Box className='margin-top'>
            Document Number: { sdrCredentials.documentNumber  }
          </Box>
          <Box className='margin-top'>
            <Button onClick={() => getAsset(sdrCredentials.assetId)}>Get Document Image </Button>
          </Box>
        </Box>
        <Box className='box-size'>
          <img className='docImage' src={`data:image/jpeg;base64,${assetData}`}/>
        </Box>
      </Box>
    </main>
  )
}

export default Welcome
