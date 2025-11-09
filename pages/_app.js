import '../styles/globals.css';
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>IFSC Lookup | Find Bank Branch Details Instantly</title>
        <meta name="description" content="Search and find any bank branch's IFSC code, address, contact, and more. Fast and free IFSC lookup for all Indian banks." />
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp;
