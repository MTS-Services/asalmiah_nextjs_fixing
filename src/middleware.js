import { NextResponse } from "next/server";
import { constant } from "../utils/constants";

function getLocale(request) {
  // Negotiator expects plain object so we need to transform headers
  const negotiatorHeaders = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  // @ts-ignore locales are readonly
  const locales = i18n.locales;

  // Use negotiator and intl-localematcher to get best locale
  let languages = new Negotiator({ headers: negotiatorHeaders }).languages(
    locales
  );

  const locale = matchLocale(languages, locales, i18n.defaultLocale);

  return locale;
}

export const middleware = (request) => {
  const pathName = request.nextUrl.pathname;
  const hostname = request.headers.get("referer");
  const host = request.headers.get("host");

  let currentPath = hostname?.replace(`http://${host}`, "");

  const data =
    request?.cookies?.get("userDetail")?.value &&
    JSON?.parse(request?.cookies?.get("userDetail")?.value);
  const headers = new Headers(request.headers);
  headers.set("token", data?.token);

  // function cartLengthFunc() {
  //   const cartData = request?.cookies?.get("cartItems")?.value;

  //   if (cartData) {
  //     const cartItems = JSON?.parse(cartData);
  //     return cartItems?.length;
  //   } else {
  //     return 0;
  //   }
  // }

  const cartData = request?.cookies?.get("cartItems")?.value;
  const cartLength = cartData ? JSON.parse(cartData).length : 0;

  const resp = NextResponse.next({
    request: {
      headers,
    },
  });

  // Add this block to check for API 403 status code
  if (resp?.status == 403 || resp?.status == 401) {
    return NextResponse.redirect(new URL(`/login`, request.url));
  }
  if (
    data?.roleId == constant.USER &&
    data?.token &&
    request.nextUrl.pathname === "/login"
  ) {
    const searchParams = new URLSearchParams(request.nextUrl.search);
    const returnUrl = searchParams.get("pathname");
    if (returnUrl) {
      return NextResponse.redirect(
        new URL(decodeURIComponent(returnUrl), request.url)
      );
    } else {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  const isAdmin = data && data?.roleId == constant.ADMIN;
  const isDesignedUser = data && data?.roleId == constant.DESIGNED_USER;
  const isPromotionUser = data && data?.roleId == constant.PROMOTION_USER;

  // Check if the request is for the user login or signup page
  const isUserLoginPage =
    request.nextUrl.pathname.startsWith(`/login`) ||
    request.nextUrl.pathname.startsWith(`/signup`);

  if (isAdmin && isUserLoginPage) {
    // If the user is an admin, redirect them to the admin dashboard
    return NextResponse.redirect(new URL(`/admin`, request.url));
  }

  const isUserLoginPageDesignedUser =
    request.nextUrl.pathname.startsWith(`/login`) ||
    request.nextUrl.pathname.startsWith(`/signup`) ||
    request.nextUrl.pathname.startsWith(`/admin`) ||
    request.nextUrl.pathname.startsWith(`/promotion-user`);

  if (isDesignedUser && isUserLoginPageDesignedUser) {
    return NextResponse.redirect(new URL(`/designed-user`, request.url));
  }

  const isUserLoginPagePromotionalUser =
    request.nextUrl.pathname.startsWith(`/login`) ||
    request.nextUrl.pathname.startsWith(`/signup`) ||
    request.nextUrl.pathname.startsWith(`/admin`) ||
    request.nextUrl.pathname.startsWith(`/designed-user`);

  if (isPromotionUser && isUserLoginPagePromotionalUser) {
    return NextResponse.redirect(new URL(`/promotion-user`, request.url));
  }

  if (isAdmin && request.nextUrl.pathname === "/") {
    // Redirect to /admin
    return NextResponse.redirect(new URL(`/admin`, request.url), {
      replace: true,
    });
  }

  if (isPromotionUser && request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL(`/promotion-user`, request.url), {
      replace: true,
    });
  }

  if (isDesignedUser && request.nextUrl.pathname === "/") {
    // Redirect to /admin
    return NextResponse.redirect(new URL(`/designed-user`, request.url), {
      replace: true,
    });
  }

  if (request.nextUrl.pathname.startsWith(`/admin/page`)) {
    if (data && data?.roleId == constant.ADMIN) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(new URL(`/admin`, request.url));
    }
  }

  if (request.nextUrl.pathname.startsWith(`/designed-user/page`)) {
    if (data && data?.roleId == constant.DESIGNED_USER) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(
        new URL(`/designed-user`, request.url)
      );
    }
  }

  if (request.nextUrl.pathname.startsWith(`/promotion-user/page`)) {
    if (data && data?.roleId == constant.PROMOTION_USER) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(
        new URL(`/promotion-user`, request.url)
      );
    }
  }

  if (
    request.nextUrl.pathname.startsWith(`/admin`) ||
    request.nextUrl.pathname.startsWith(`/designed-user`) ||
    request.nextUrl.pathname.startsWith(`/promotion-user`)
  ) {
    if (data) {
      if (data?.roleId == constant.ADMIN) {
        return NextResponse.redirect(new URL(`/admin/page`, request.url));
      } else if (data?.roleId == constant.DESIGNED_USER) {
        return NextResponse.redirect(
          new URL(`/designed-user/page`, request.url)
        );
      } else if (data?.roleId == constant.PROMOTION_USER) {
        return NextResponse.redirect(
          new URL(`/promotion-user/page`, request.url)
        );
      } else if (data?.roleId == constant.USER) {
        return NextResponse.redirect(new URL(`/dashboard`, request.url));
      } else {
        return NextResponse.next();
      }
    } else {
      return NextResponse.next();
    }
  }

  if (request.nextUrl.pathname.startsWith(`/login`)) {
    if (data) {
      if (data?.roleId == constant.ADMIN) {
        return NextResponse.redirect(new URL(`/admin/page`, request.url));
      } else if (data?.roleId == constant.DESIGNED_USER) {
        return NextResponse.redirect(
          new URL(`/designed-user/page`, request.url)
        );
      } else if (data?.roleId == constant.PROMOTION_USER) {
        return NextResponse.redirect(
          new URL(`/promotion-user/page`, request.url)
        );
      } else {
        return NextResponse.redirect(new URL(`/`, request.url));
      }
    } else {
      return NextResponse.next();
    }
  }

  if (request.nextUrl.pathname.startsWith(`/profile`)) {
    if (data?.roleId !== constant.USER) {
      return NextResponse.redirect(new URL(`/login`, request.url));
    } else {
      return NextResponse.next();
    }
  }

  if (request.nextUrl.pathname.startsWith(`/change-password`)) {
    if (data?.roleId !== constant.USER) {
      return NextResponse.redirect(new URL(`/login`, request.url));
    } else {
      return NextResponse.next();
    }
  }
  if (request.nextUrl.pathname.startsWith(`/edit-profile`)) {
    if (data?.roleId !== constant.USER) {
      return NextResponse.redirect(new URL(`/login`, request.url));
    } else {
      return NextResponse.next();
    }
  }
  if (request.nextUrl.pathname.startsWith(`/wishlist`)) {
    if (data?.roleId !== constant.USER) {
      return NextResponse.redirect(new URL(`/login`, request.url));
    } else {
      return NextResponse.next();
    }
  }
  // if (request.nextUrl.pathname.startsWith(`/cart`)) {
  //   if (data?.roleId !== constant.USER) {
  //     return NextResponse.redirect(new URL(`/login`, request.url));
  //   } else {
  //     return NextResponse.next();
  //   }
  // }
  if (request.nextUrl.pathname.startsWith(`/dashboard`)) {
    if (data?.roleId !== constant.USER) {
      return NextResponse.redirect(new URL(`/login`, request.url));
    } else {
      return NextResponse.next();
    }
  }
  if (request.nextUrl.pathname.startsWith(`/checkout`)) {
    if (data?.roleId !== constant.USER) {
      return NextResponse.redirect(new URL(`/login`, request.url));
    }

    // else if (data?.roleId == constant.USER && cartLength == 0) {
    //   return NextResponse.redirect(new URL(`/product-list`, request.url));
    // }
    else {
      return NextResponse.next();
    }
  }
  if (request.nextUrl.pathname.startsWith(`/notification`)) {
    if (data?.roleId !== constant.USER) {
      return NextResponse.redirect(new URL(`/login`, request.url));
    } else {
      return NextResponse.next();
    }
  }
  if (request.nextUrl.pathname.startsWith(`/payment`)) {
    if (data?.roleId !== constant.USER) {
      return NextResponse.redirect(new URL(`/login`, request.url));
    }

    // else if (data?.roleId == constant.USER && cartLength == 0) {
    //   return NextResponse.redirect(new URL(`/product-list`, request.url));
    // }
    else {
      return NextResponse.next();
    }
  }
  if (request.nextUrl.pathname.startsWith(`/transactions`)) {
    if (data?.roleId !== constant.USER) {
      return NextResponse.redirect(new URL(`/login`, request.url));
    } else {
      return NextResponse.next();
    }
  }
  if (request.nextUrl.pathname.startsWith(`/my-refund`)) {
    if (data?.roleId !== constant.USER) {
      return NextResponse.redirect(new URL(`/login`, request.url));
    } else {
      return NextResponse.next();
    }
  }
  if (request.nextUrl.pathname.startsWith(`/wallet`)) {
    if (data?.roleId !== constant.USER) {
      return NextResponse.redirect(new URL(`/login`, request.url));
    } else {
      return NextResponse.next();
    }
  }
  if (request.nextUrl.pathname.startsWith(`/reports`)) {
    if (data?.roleId !== constant.USER) {
      return NextResponse.redirect(new URL(`/login`, request.url));
    } else {
      return NextResponse.next();
    }
  }
  if (request.nextUrl.pathname.startsWith(`/order`)) {
    if (data?.roleId !== constant.USER) {
      return NextResponse.redirect(new URL(`/login`, request.url));
    } else {
      return NextResponse.next();
    }
  }
  if (request.nextUrl.pathname.startsWith(`/address`)) {
    if (data?.roleId !== constant.USER) {
      return NextResponse.redirect(new URL(`/login`, request.url));
    } else {
      return NextResponse.next();
    }
  }
  if (request.nextUrl.pathname.startsWith(`/thankyou`)) {
    if (data?.roleId !== constant.USER) {
      return NextResponse.redirect(new URL(`/login`, request.url));
    } else {
      return NextResponse.next();
    }
  }
  return resp;
};

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    "/((?!_next).*)",
    // Optional: only run on root (/) URL
    // '/'
  ],
};
