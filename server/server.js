const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const { createConnection } = require('typeorm')
const Daf = require('daf-core')

const port = process.env.PORT || 3000

const config = {
  type: 'sqlite',
  database: './database.sqlite',
  synchronize: true,
  logging: false,
  entities: [...Daf.Entities],
}

app.prepare().then(() => {
  console.log('Custom server')

  createConnection(config)
    .then(async connection => {
      createServer((req, res) => {
        const parsedUrl = parse(req.url, true)

        handle(req, res, parsedUrl)
      }).listen(port, err => {
        if (err) throw err
        console.log(
          dev
            ? '> Ready on http://localhost:3000'
            : '> Running in production on port ' + port,
        )
      })
    })
    .catch(error => console.log('TypeORM connection error: ', error))
})
