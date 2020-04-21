import {
  Box,
  Heading,
  Text,
  Icon,
  Modal,
  Card,
  Flex,
  Loader,
  Link,
} from 'rimble-ui'

const REQUEST_TYPES = {
  CREDENTIAL_ISSUE: 'CREDENTIAL_ISSUE',
  SELECTIVE_DISCLOSURE_RESPONSE: 'SELECTIVE_DISCLOSURE_RESPONSE',
}

const TEXT: { [index: string]: { [index: string]: string } } = {
  CREDENTIAL_ISSUE: {
    title: 'You have been issued a credential',
    body: 'Accept the credential that has appeared on your device',
    response: 'Waiting for you to accept...',
    complete:
      'Great! You have accepted the credential. You can close this modal now.',
    error: 'Credential was rejected by user',
  },
  SELECTIVE_DISCLOSURE_RESPONSE: {
    title: 'You have been requested to share information',
    body: 'Tap share on your device to share',
    response: 'Waiting for you to share...',
    complete:
      'Thanks! We received your credentials. You can now close this modal.',
    error: 'Request was rejected by user',
  },
}

const RequestModal = ({
  isOpen,
  requestType,
  sdrCredentials,
  closeModal,
  loading,
  hasError,
}) => {
  return (
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
          <Heading textAlign="center" as="h1" fontSize={[2, 3]} px={[3, 0]}>
            {isOpen && TEXT[requestType].title}
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
          <Text textAlign="center">{isOpen && TEXT[requestType].body}</Text>
        </Box>
        <Box px={[3, 4]} pb={[3, 4]}>
          {loading ? (
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
                <Text fontWeight={4}>
                  {isOpen && TEXT[requestType].response}
                </Text>
              </Flex>
            </Flex>
          ) : (
            <Flex
              flexDirection={['column', 'row']}
              bg={'primary-2x-light'}
              p={[3, 4]}
              alignItems={['center', 'auto']}
            >
              <Flex
                flexDirection="column"
                alignItems={['center', 'flex-start']}
              >
                <Text fontWeight={4}>
                  {isOpen && !hasError && TEXT[requestType].complete}
                  {isOpen && hasError && TEXT[requestType].error}
                </Text>
              </Flex>
            </Flex>
          )}
        </Box>
      </Card>
    </Modal>
  )
}

export default RequestModal
