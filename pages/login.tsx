import { useContext, useState, useEffect } from 'react'
import {
  Box,
  Heading,
  Button,
  Text,
  QR,
  Modal,
  Card,
  Flex,
  Loader,
  Link,
  Icon,
} from 'rimble-ui'
import PageHead from '../components/PageHead'
import { WalletConnectContext } from '../components/WalletConnectContext'
import { ExtensionContext } from '../components/ExtensionContext'
import Header from '../components/Header'

const Login = () => {
  const { init } = useContext(WalletConnectContext)
  const { extension, connectAddress } = useContext(ExtensionContext)
  const [uri, updateUri] = useState()
  const [isOpen, setIsOpen] = useState(false)

  const connect = async e => {
    const uri = await init()
    updateUri(uri)
    openModal(e)
    console.log(uri)
  }

  const connectExtension = async () => {
    const identity = await extension.connect()
    if (identity) {
      connectAddress(identity.payload.did)
    }
  }

  const closeModal = e => {
    setIsOpen(false)
  }

  const openModal = e => {
    setIsOpen(true)
  }

  return (
    <main>
      <PageHead title="Dafhub" description="Demo of daf + walletconnect" />
      <Box>
        <Header loggedIn={false} />
        <Box
          bg={'#373B40'}
          height={650}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <Box
            width={1200}
            display={'flex'}
            flexDirection={'row'}
            alignItems={'center'}
            justifyContent={'center'}
          >
            <Box width={500} mr={5}>
              <Heading as={'h1'} color={'#FFFFFF'} mb={3} mt={5}>
                Identity solutions for everyone
              </Heading>
              <Text as={'p'} color={'#C4C4C4'} fontSize={18}>
                Because Litecoin launched a peer-to-peer price, Monero is wary
                of some dormant Lambo, and Bitcoin generated few ICO after a
                ledger because Cardano rejoins many instant airdrop of some
                consensus point.
              </Text>
            </Box>

            <Box
              bg={'#FFFFFF'}
              height={450}
              width={400}
              p={4}
              display={'flex'}
              flexDirection={'column'}
              justifyContent={'flex-end'}
            >
              <Text as={'p'} color={'#C4C4C4'} fontSize={18} mb={5}>
                Zcash thought some robust bear after some moon when someone
                rejoins lots of digital signature after some dump.
              </Text>
              <Button width={'100%'} onClick={connect}>
                Connect
              </Button>
            </Box>
          </Box>
        </Box>
        <Box
          bg={'#F5F5F5'}
          height={400}
          pt={5}
          justifyContent={'center'}
          display={'flex'}
        >
          <Box
            bg={'#FFFFFF'}
            boxShadow={`0 0 20px rgba(0,0,0,0.1)`}
            borderRadius={10}
            width={1200}
            height={400}
          ></Box>
        </Box>
        <Box height={600}></Box>
        <Modal isOpen={isOpen}>
          <Card p={0} borderRadius={1}>
            <Flex
              justifyContent="space-between"
              alignItems="center"
              borderBottom={1}
              borderColor="near-white"
              p={[3, 4]}
              pb={3}
            >
              <Icon
                name="CenterFocusStrong"
                color="primary"
                aria-hidden="true"
              />
              <Heading textAlign="center" as="h4" fontSize={[2, 3]} px={[3, 0]}>
                Scan with mobile wallet
              </Heading>
              <Link onClick={closeModal}>
                <Icon
                  name="Close"
                  color="moon-gray"
                  aria-label="Close and cancel connection"
                />
              </Link>
            </Flex>
            <Box p={[3, 4]}>
              <Text textAlign="center">
                Scan this QR code with your mobile wallet and follow the
                instructions.
              </Text>
              <Flex my={4} justifyContent="center">
                <Card p={3} borderRadius={16}>
                  {uri && <QR size={200} value={uri} />}
                </Card>
              </Flex>
              {extension && (
                <>
                  <Text textAlign={['left', 'center']}>
                    Alternatively, you can can login with the browser extension
                  </Text>
                  <Flex justifyContent="center" mt={5}>
                    <Button onClick={connectExtension}>
                      Connect with extension
                    </Button>
                  </Flex>
                </>
              )}
            </Box>
            <Box p={[3, 4]}>
              <Flex
                flexDirection={['column', 'row']}
                bg={'primary-2x-light'}
                p={[3, 4]}
                alignItems={['center', 'auto']}
              >
                <Loader size={'3em'} mr={[0, 3]} mb={[2, 0]} />
                <Flex
                  flexDirection="column"
                  alignItems={['center', 'flex-start']}
                >
                  <Text fontWeight={4}>Waiting for you to connect...</Text>
                  <Text fontWeight={2}>This won’t cost you any Ether</Text>
                </Flex>
              </Flex>
            </Box>
          </Card>
        </Modal>
      </Box>
    </main>
  )
}

export default Login
