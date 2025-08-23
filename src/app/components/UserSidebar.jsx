import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import useDetails from "../../../hooks/useDetails";
import userDummyImage from "../../../public/assets/img/default.png";
import Swal from "sweetalert2";
import { deleteAccount, logOut } from "../../../services/APIServices";
import { logoutUser } from "../../../redux/features/userSlice";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { clearCart } from "../../../redux/features/cartSlice";
import { signOut } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
export default function UserSidebar() {
  let detail = useDetails();
  let pathName = usePathname();
  let router = useRouter();
  const translations = {
    en: {
      payment: "Payment",
    },
    ar: {
      payment: "بطاقه الدفع",
    },
  };
  let language = localStorage.getItem("language");
  const languageCode = language && language.startsWith("Arabic") ? "ar" : "en";
  const { payment: paymentText } = translations[languageCode];
  let dispatch = useDispatch();
  function removeAllCookies() {
    // Get all cookies
    const allCookies = Cookies.get();

    // Loop through each cookie and remove it
    for (const cookie in allCookies) {
      Cookies.remove(cookie);
    }
  }
  const logoutMutation = useMutation({
    mutationFn: () => logOut(),
    onSuccess: () => {
      signOut();

      removeAllCookies();
      localStorage.clear();
      sessionStorage.clear();
      dispatch(logoutUser(null));
      dispatch(clearCart(null));

      router.push(`/login`);
    },
  });

  const accountDeleteFunc = async () => {
    try {
      const response = await deleteAccount();
      if (response?.status === 200) {
        logoutMutation.mutate();
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: response?.data?.message,
          showConfirmButton: false,
          timer: 3000,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="dashboard-left-sidebar sticky">
      <div className="profile-box">
        <div className="profile-contain">
          <div className="profile-image">
            <Image
              className="img-fluid"
              src={detail?.profileImg ? detail?.profileImg : userDummyImage}
              width={120}
              height={90}
              alt="profile-img"
            />
          </div>
          <div className="profile-name">
            <h4 dir="ltr" translate="no">
              {detail?.fullName}
            </h4>
            <h6 dir="ltr" translate="no">
              {detail?.email}
            </h6>
            <Link
              href="/edit-profile"
              className="text-capitalize text-decoration-none btn-white mt-3"
            >
              {" "}
              edit profile
            </Link>
          </div>
        </div>
      </div>
      <ul className="dashboard-tab">
        <li>
          <Link
            href="/dashboard"
            className={pathName == "/dashboard" ? "active" : ""}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 18V15"
                stroke="#fff"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
              <path
                d="M10.07 2.81997L3.14002 8.36997C2.36002 8.98997 1.86002 10.3 2.03002 11.28L3.36002 19.24C3.60002 20.66 4.96002 21.81 6.40002 21.81H17.6C19.03 21.81 20.4 20.65 20.64 19.24L21.97 11.28C22.13 10.3 21.63 8.98997 20.86 8.36997L13.93 2.82997C12.86 1.96997 11.13 1.96997 10.07 2.81997Z"
                stroke="#fff"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </svg>
            dashboard
          </Link>
        </li>
        <li>
          <Link href="/order" className={pathName == "/order" ? "active" : ""}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 22.75H9C3.57 22.75 1.25 20.43 1.25 15V9C1.25 3.57 3.57 1.25 9 1.25H15C20.43 1.25 22.75 3.57 22.75 9V15C22.75 20.43 20.43 22.75 15 22.75ZM9 2.75C4.39 2.75 2.75 4.39 2.75 9V15C2.75 19.61 4.39 21.25 9 21.25H15C19.61 21.25 21.25 19.61 21.25 15V9C21.25 4.39 19.61 2.75 15 2.75H9Z"
                fill="#fff"
              ></path>
              <path
                d="M12 18.6294C11.44 18.6294 10.91 18.3494 10.54 17.8594L9.94 17.0594C9.87 16.9694 9.79001 16.9194 9.70001 16.9094C9.61001 16.9094 9.53001 16.9494 9.45001 17.0294L8.89999 16.5194L9.45001 17.0294C8.48001 18.0694 7.68999 17.9694 7.29999 17.8194C6.90999 17.6594 6.25 17.1794 6.25 15.6994V9.06938C6.25 6.28938 7.14 5.35938 9.78 5.35938H14.23C16.87 5.35938 17.76 6.29938 17.76 9.06938V15.6994C17.76 17.1794 17.1 17.6694 16.71 17.8194C16.33 17.9694 15.54 18.0694 14.56 17.0294C14.48 16.9494 14.39 16.9094 14.3 16.9094C14.21 16.9094 14.13 16.9694 14.06 17.0594L13.47 17.8494C13.09 18.3494 12.56 18.6294 12 18.6294ZM9.69 15.4094C9.72 15.4094 9.75 15.4094 9.78 15.4094C10.31 15.4394 10.8 15.7094 11.13 16.1594L11.73 16.9594C11.9 17.1794 12.09 17.1794 12.25 16.9594L12.84 16.1694C13.17 15.7194 13.67 15.4494 14.2 15.4194C14.72 15.3794 15.25 15.6094 15.63 16.0194C15.91 16.3194 16.09 16.3994 16.16 16.4194C16.15 16.3694 16.24 16.1694 16.24 15.7094V9.07938C16.24 7.02938 15.93 6.86937 14.21 6.86937H9.76001C8.04001 6.86937 7.73001 7.02938 7.73001 9.07938V15.7094C7.73001 16.1694 7.82001 16.3694 7.85001 16.4294C7.88001 16.3894 8.05999 16.3094 8.32999 16.0094C8.32999 15.9994 8.34001 15.9994 8.35001 15.9894C8.72001 15.6294 9.2 15.4094 9.69 15.4094Z"
                fill="#fff"
              ></path>
            </svg>
            my orders
          </Link>
        </li>
        <li>
          <Link
            href="/notification"
            className={pathName == "/notification" ? "active" : ""}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20.78 13.6499V18.5899H3.21997V13.6499C3.21997 8.82993 7.11997 4.92993 11.94 4.92993H12.06C16.88 4.92993 20.78 8.82993 20.78 13.6499Z"
                stroke="#fff"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
              <path
                d="M12 2V4.92999"
                stroke="#fff"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
              <path
                d="M15.65 18.59C15.52 20.5 13.93 22 12 22C10.07 22 8.47998 20.5 8.34998 18.59H15.65Z"
                stroke="#fff"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </svg>
            notifications
          </Link>
        </li>
        {/* <li>
          <a href="./order-list">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 22.75H9C3.57 22.75 1.25 20.43 1.25 15V9C1.25 3.57 3.57 1.25 9 1.25H15C20.43 1.25 22.75 3.57 22.75 9V15C22.75 20.43 20.43 22.75 15 22.75ZM9 2.75C4.39 2.75 2.75 4.39 2.75 9V15C2.75 19.61 4.39 21.25 9 21.25H15C19.61 21.25 21.25 19.61 21.25 15V9C21.25 4.39 19.61 2.75 15 2.75H9Z"
                fill="#fff"
              ></path>
              <path
                d="M12 18.6294C11.44 18.6294 10.91 18.3494 10.54 17.8594L9.94 17.0594C9.87 16.9694 9.79001 16.9194 9.70001 16.9094C9.61001 16.9094 9.53001 16.9494 9.45001 17.0294L8.89999 16.5194L9.45001 17.0294C8.48001 18.0694 7.68999 17.9694 7.29999 17.8194C6.90999 17.6594 6.25 17.1794 6.25 15.6994V9.06938C6.25 6.28938 7.14 5.35938 9.78 5.35938H14.23C16.87 5.35938 17.76 6.29938 17.76 9.06938V15.6994C17.76 17.1794 17.1 17.6694 16.71 17.8194C16.33 17.9694 15.54 18.0694 14.56 17.0294C14.48 16.9494 14.39 16.9094 14.3 16.9094C14.21 16.9094 14.13 16.9694 14.06 17.0594L13.47 17.8494C13.09 18.3494 12.56 18.6294 12 18.6294ZM9.69 15.4094C9.72 15.4094 9.75 15.4094 9.78 15.4094C10.31 15.4394 10.8 15.7094 11.13 16.1594L11.73 16.9594C11.9 17.1794 12.09 17.1794 12.25 16.9594L12.84 16.1694C13.17 15.7194 13.67 15.4494 14.2 15.4194C14.72 15.3794 15.25 15.6094 15.63 16.0194C15.91 16.3194 16.09 16.3994 16.16 16.4194C16.15 16.3694 16.24 16.1694 16.24 15.7094V9.07938C16.24 7.02938 15.93 6.86937 14.21 6.86937H9.76001C8.04001 6.86937 7.73001 7.02938 7.73001 9.07938V15.7094C7.73001 16.1694 7.82001 16.3694 7.85001 16.4294C7.88001 16.3894 8.05999 16.3094 8.32999 16.0094C8.32999 15.9994 8.34001 15.9994 8.35001 15.9894C8.72001 15.6294 9.2 15.4094 9.69 15.4094Z"
                fill="#fff"
              ></path>
            </svg>
            order list
          </a>
        </li> */}

        <li>
          <Link
            href="/wishlist"
            className={pathName == "/wishlist" ? "active" : ""}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              width="24"
              height="24"
              fill="none"
            >
              <path
                fill="#fff"
                d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8l0-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5l0 3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20-.1-.1s0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5l0 3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2l0-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z"
              />
            </svg>
            Wishlist
          </Link>
        </li>
        <li>
          <Link
            href="/address"
            className={pathName == "/address" ? "active" : ""}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              width="24"
              height="24"
              fill="none"
            >
              <path
                fill="#fff"
                d="M384 48c8.8 0 16 7.2 16 16l0 384c0 8.8-7.2 16-16 16L96 464c-8.8 0-16-7.2-16-16L80 64c0-8.8 7.2-16 16-16l288 0zM96 0C60.7 0 32 28.7 32 64l0 384c0 35.3 28.7 64 64 64l288 0c35.3 0 64-28.7 64-64l0-384c0-35.3-28.7-64-64-64L96 0zM240 256a64 64 0 1 0 0-128 64 64 0 1 0 0 128zm-32 32c-44.2 0-80 35.8-80 80c0 8.8 7.2 16 16 16l192 0c8.8 0 16-7.2 16-16c0-44.2-35.8-80-80-80l-64 0zM512 80c0-8.8-7.2-16-16-16s-16 7.2-16 16l0 64c0 8.8 7.2 16 16 16s16-7.2 16-16l0-64zM496 192c-8.8 0-16 7.2-16 16l0 64c0 8.8 7.2 16 16 16s16-7.2 16-16l0-64c0-8.8-7.2-16-16-16zm16 144c0-8.8-7.2-16-16-16s-16 7.2-16 16l0 64c0 8.8 7.2 16 16 16s16-7.2 16-16l0-64z"
              />
            </svg>
            Address
          </Link>
        </li>

        <li>
          <Link
            href="/card"
            className={
              pathName == "/card" || pathName == "/add-card" ? "active" : ""
            }
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22 9.25H2C1.59 9.25 1.25 8.91 1.25 8.5C1.25 8.09 1.59 7.75 2 7.75H22C22.41 7.75 22.75 8.09 22.75 8.5C22.75 8.91 22.41 9.25 22 9.25Z"
                fill="#fff"
              ></path>
              <path
                d="M8 17.25H6C5.59 17.25 5.25 16.91 5.25 16.5C5.25 16.09 5.59 15.75 6 15.75H8C8.41 15.75 8.75 16.09 8.75 16.5C8.75 16.91 8.41 17.25 8 17.25Z"
                fill="#fff"
              ></path>
              <path
                d="M14.5 17.25H10.5C10.09 17.25 9.75 16.91 9.75 16.5C9.75 16.09 10.09 15.75 10.5 15.75H14.5C14.91 15.75 15.25 16.09 15.25 16.5C15.25 16.91 14.91 17.25 14.5 17.25Z"
                fill="#fff"
              ></path>
              <path
                d="M17.56 21.25H6.44C2.46 21.25 1.25 20.05 1.25 16.11V7.89C1.25 3.95 2.46 2.75 6.44 2.75H17.55C21.53 2.75 22.74 3.95 22.74 7.89V16.1C22.75 20.05 21.54 21.25 17.56 21.25ZM6.44 4.25C3.3 4.25 2.75 4.79 2.75 7.89V16.1C2.75 19.2 3.3 19.74 6.44 19.74H17.55C20.69 19.74 21.24 19.2 21.24 16.1V7.89C21.24 4.79 20.69 4.25 17.55 4.25H6.44Z"
                fill="#fff"
              ></path>
            </svg>
            {/* payment */}
            {paymentText}
          </Link>
        </li>

        <li>
          <Link
            href="/transactions"
            className={pathName == "/transactions" ? "active" : ""}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 640 512"
              width="24"
              height="24"
            >
              <path
                d="M535 41c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l64 64c4.5 4.5 7 10.6 7 17s-2.5 12.5-7 17l-64 64c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l23-23L384 112c-13.3 0-24-10.7-24-24s10.7-24 24-24l174.1 0L535 41zM105 377l-23 23L256 400c13.3 0 24 10.7 24 24s-10.7 24-24 24L81.9 448l23 23c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0L7 441c-4.5-4.5-7-10.6-7-17s2.5-12.5 7-17l64-64c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9zM96 64l241.9 0c-3.7 7.2-5.9 15.3-5.9 24c0 28.7 23.3 52 52 52l117.4 0c-4 17 .6 35.5 13.8 48.8c20.3 20.3 53.2 20.3 73.5 0L608 169.5 608 384c0 35.3-28.7 64-64 64l-241.9 0c3.7-7.2 5.9-15.3 5.9-24c0-28.7-23.3-52-52-52l-117.4 0c4-17-.6-35.5-13.8-48.8c-20.3-20.3-53.2-20.3-73.5 0L32 342.5 32 128c0-35.3 28.7-64 64-64zm64 64l-64 0 0 64c35.3 0 64-28.7 64-64zM544 320c-35.3 0-64 28.7-64 64l64 0 0-64zM320 352a96 96 0 1 0 0-192 96 96 0 1 0 0 192z"
                fill="#fff"
              />
            </svg>
            Transactions
          </Link>
        </li>
        <li>
          <Link
            href="/my-refund"
            className={pathName == "/my-refund" ? "active" : ""}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              width="24"
              height="24"
            >
              <path
                fill="#fff"
                d="M470.7 9.4c3 3.1 5.3 6.6 6.9 10.3s2.4 7.8 2.4 12.2c0 0 0 .1 0 .1c0 0 0 0 0 0l0 96c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-18.7L310.6 214.6c-11.8 11.8-30.8 12.6-43.5 1.7L176 138.1 84.8 216.3c-13.4 11.5-33.6 9.9-45.1-3.5s-9.9-33.6 3.5-45.1l112-96c12-10.3 29.7-10.3 41.7 0l89.5 76.7L370.7 64 352 64c-17.7 0-32-14.3-32-32s14.3-32 32-32l96 0s0 0 0 0c8.8 0 16.8 3.6 22.6 9.3l.1 .1zM0 304c0-26.5 21.5-48 48-48l416 0c26.5 0 48 21.5 48 48l0 160c0 26.5-21.5 48-48 48L48 512c-26.5 0-48-21.5-48-48L0 304zM48 416l0 48 48 0c0-26.5-21.5-48-48-48zM96 304l-48 0 0 48c26.5 0 48-21.5 48-48zM464 416c-26.5 0-48 21.5-48 48l48 0 0-48zM416 304c0 26.5 21.5 48 48 48l0-48-48 0zm-96 80a64 64 0 1 0 -128 0 64 64 0 1 0 128 0z"
              />
            </svg>
            Refund
          </Link>
        </li>

        <li>
          <Link
            href="/wallet"
            className={pathName == "/wallet" ? "active" : ""}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-wallet2"
              viewBox="0 0 16 16"
            >
              <path d="M12.136.326A1.5 1.5 0 0 1 14 1.78V3h.5A1.5 1.5 0 0 1 16 4.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 13.5v-9a1.5 1.5 0 0 1 1.432-1.499zM5.562 3H13V1.78a.5.5 0 0 0-.621-.484zM1.5 4a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5z" />
            </svg>
            Wallet
          </Link>
        </li>
        <li>
          <Link
            href="/reports"
            className={pathName == "/reports" ? "active" : ""}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 384 512"
              width="24"
              height="24"
            >
              <path
                d="M64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-288-128 0c-17.7 0-32-14.3-32-32L224 0 64 0zM256 0l0 128 128 0L256 0zM80 64l64 0c8.8 0 16 7.2 16 16s-7.2 16-16 16L80 96c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64l64 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-64 0c-8.8 0-16-7.2-16-16s7.2-16 16-16zm16 96l192 0c17.7 0 32 14.3 32 32l0 64c0 17.7-14.3 32-32 32L96 352c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32zm0 32l0 64 192 0 0-64L96 256zM240 416l64 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-64 0c-8.8 0-16-7.2-16-16s7.2-16 16-16z"
                fill="#fff"
              />
            </svg>
            Reports
          </Link>
        </li>

        <li>
          <Link
            href="#"
            onClick={() => {
              Swal.fire({
                title: "Are you sure you want to delete your account?",
                icon: "warning",
                confirmButtonColor: "#d33",
                confirmButtonText: "Yes",
                showCancelButton: true,
                cancelButtonText: "No",

                allowOutsideClick: false,
                showCloseButton: true,
              }).then((result) => {
                if (result.isConfirmed) {
                  accountDeleteFunc();
                }
              });
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 384 512"
              width="24"
              height="24"
            >
              <path
                d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"
                fill="#fff"
              />
            </svg>
            Delete Account
          </Link>
        </li>
      </ul>
    </div>
  );
}
