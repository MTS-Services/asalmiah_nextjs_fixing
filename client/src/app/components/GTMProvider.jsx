// components/GTMProvider.tsx
'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

if (!GTM_ID) {
  console.warn('Missing NEXT_PUBLIC_GTM_ID environment variable');
}

export function GTMProvider() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window !== 'undefined' && GTM_ID) {
      // Ensure dataLayer exists
      window.dataLayer = window.dataLayer || [];

      // Push page view event
      window.dataLayer.push({
        event: 'page_view',
        page_path:
          pathname + (searchParams.toString() ? `?${searchParams}` : ''),
        page_location:
          window.location.origin +
          pathname +
          (searchParams.toString() ? `?${searchParams}` : ''),
        page_title: document.title,
      });
    }
  }, [pathname, searchParams]);

  if (!GTM_ID) return null;

  return (
    <>
      {/* Inject GTM Script */}
      <Script
        id='gtm-script'
        strategy='afterInteractive'
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){
              w[l]=w[l]||[];
              w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
              var f=d.getElementsByTagName(s)[0],
                  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
              j.async=true;
              j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
              f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID}');
          `,
        }}
      />
    </>
  );
}

export function GTMBody() {
  if (!GTM_ID) return null;

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height='0'
        width='0'
        style={{ display: 'none', visibility: 'hidden' }}
      />
    </noscript>
  );
}
