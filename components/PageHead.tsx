import Head from 'next/head'

const PageHead = ({ title, description }) => (
  <Head>
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta name="profile" content={'abcdedfeggdkds'} />
    <meta charSet="utf-8" />
    <meta httpEquiv="content-language" content="en" />
    <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    <link rel="shortcut icon" href="/static/favicon.ico" />
    <link rel="manifest" href="/static/manifest.json" />
  </Head>
)
export default PageHead
