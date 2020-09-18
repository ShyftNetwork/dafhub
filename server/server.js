const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const port = process.env.PORT || 3008
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true)
    const { pathname } = parsedUrl

    /**
     * Add logic to generate this dynamically
     */
    if (pathname === '/.well-known/did.json') {
      res.setHeader('Content-Type', 'application/json')
      res.end(
        JSON.stringify({
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
        }),
      )
    } else {
      handle(req, res, parsedUrl)
    }
  }).listen(port, err => {
    if (err) throw err
    console.log(
      dev
        ? '> Ready on http://localhost:3008'
        : '> Running in production on port ' + port,
    )
  })
})
