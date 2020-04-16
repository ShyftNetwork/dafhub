const handler = async (req, res) => {
  res.status(200).json({
    '@context': 'https://w3id.org/did/v1',
    id: 'did:web:example.com',
    publicKey: [
      {
        id: 'did:web:example.com#owner',
        type: 'Secp256k1VerificationKey2018',
        owner: 'did:web:example.com',
        publicKeyHex:
          '04ab0102bcae6c7c3a90b01a3879d9518081bc06123038488db9cb109b082a77d97ea3373e3dfde0eccd9adbdce11d0302ea5c098dbb0b310234c8689501749274',
      },
    ],
    authentication: [
      {
        type: 'Secp256k1SignatureAuthentication2018',
        publicKey: 'did:web:example.com#owner',
      },
    ],
  })
}

export default handler
