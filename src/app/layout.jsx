'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import 'bootstrap/dist/css/bootstrap.css';
import Cookies from 'js-cookie';
import { SessionProvider } from 'next-auth/react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from '../../redux/store.js';
import { toastAlert } from '../../utils/SweetAlert';
import './globals.scss';
import './responsive.scss';
import './rtl.scss';
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
    <html>
      <title>Offarat</title>
      <body>
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

        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <QueryClientProvider client={queryClient}>
              <SessionProvider
                basePath='/social-login/api/auth'
                session={pageProps?.session}
                NEXTAUTH_URL={process.env.NEXTAUTH_URL}
              >
                {children}
              </SessionProvider>
            </QueryClientProvider>
          </PersistGate>
        </Provider>
      </body>
    </html>
  );
}
