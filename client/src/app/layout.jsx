'use client';

import Cookies from 'js-cookie';
import Script from 'next/script';

import { Provider } from 'react-redux';
import { SessionProvider } from 'next-auth/react';
import { PersistGate } from 'redux-persist/integration/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { persistor, store } from '../../redux/store.js';
import { toastAlert } from '../../utils/SweetAlert';

import './rtl.scss';
import './globals.scss';
import './responsive.scss';
import 'bootstrap/dist/css/bootstrap.css';

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-W43NTGXF';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      throwOnError: (error) => {
        if (error?.response) {
          if (
            error.response?.status === 403 ||
            error.response?.status === 401
          ) {
            localStorage.clear();
            Cookies.remove('userDetail');
            window.location.reload();
            toastAlert('error', error.response?.data?.message);
          } else {
            toastAlert('error', error?.response?.data?.message);
          }
        } else {
          toastAlert('error', error?.message);
        }
      },
    },
    mutations: {
      onError: (error) => {
        if (error) {
          if (
            error.response?.status === 403 ||
            error.response?.status === 401
          ) {
            localStorage.clear();
            Cookies.remove('userDetail');
            window.location.reload();
            toastAlert('error', error.response?.data?.message);
          } else {
            toastAlert('error', error?.response?.data?.message);
          }
        } else {
          toastAlert('error', error?.message);
        }
      },
    },
  },
});

export default function RootLayout({ children, session, ...pageProps }) {
  return (
    <html lang='en'>
      <head>
        <title>Offarat</title>
        {/*
          Initialize the dataLayer BEFORE the GTM script.
          This must be done before the GTM script loads.
          We keep this direct `script` tag as it's a critical early initialization.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
            `,
          }}
        />

        {/*
          Use Next.js Script component for the GTM head snippet.
          The 'afterInteractive' strategy ensures it loads after the page is interactive,
          avoiding hydration issues.
        */}
        <Script
          id='google-tag-manager-head' // Unique ID for the script
          strategy='afterInteractive'
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${GTM_ID}');
            `,
          }}
        />

        <link
          rel='stylesheet'
          type='text/css'
          charSet='UTF-8'
          href='https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css'
        />
        <link
          rel='stylesheet'
          type='text/css'
          href='https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css'
        />
      </head>

      <body>
        {/*
          The GTM noscript snippet can be directly placed using dangerouslySetInnerHTML
          immediately after the opening <body> tag. This resolves hydration errors
          that sometimes occur when `next/script` attempts to process iframes within the noscript tag,
          by ensuring React treats it as raw HTML to be inserted.
        */}
        <noscript
          dangerouslySetInnerHTML={{
            __html: `
              <iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}"
                height="0" width="0" style="display:none;visibility:hidden"></iframe>
            `,
          }}
        />

        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <QueryClientProvider client={queryClient}>
              {children}
            </QueryClientProvider>
          </PersistGate>
        </Provider>
      </body>
    </html>
  );
}
