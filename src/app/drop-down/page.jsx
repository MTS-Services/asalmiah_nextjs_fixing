"use client";
import Cookies from "js-cookie";
import { usePathname, useRouter } from "next/navigation";

export default function DropDownComponent({
  params,
  translatePath,
  check,
  translatePathAdmin,
}) {
  const router = useRouter();
  const Pathname = usePathname();

  const handleChange = (value) => {
    let newpath;
    if (params?.lang === "en") {
      newpath = Pathname.replace(/en/, "ar");
    } else {
      newpath = Pathname.replace(/ar/, "en");
    }
    router.push(newpath && newpath);
    if (check && !window.undefined) {
      window.location.href = newpath;
    }
    if (Cookies.get("userDetail")) {
      let body = {
        language: value,
      };
      languageAPI(body).then((res) => {
        if (res?.status == 200) {
          return;
        }
      });
    }
  };
  return (
    <>
      <span className="dropdownnew">
        <a href="#" defaultValue={params?.lang ? params?.lang : translatePath}>
          {params?.lang == "ar"
            ? "عربي"
            : params?.lang == "en"
            ? "English"
            : translatePath}
          &nbsp;&nbsp;
          <svg
            fill="#000000"
            width="800px"
            height="800px"
            viewBox="-8.5 0 32 32"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>angle-down</title>
            <path d="M7.28 20.040c-0.24 0-0.44-0.080-0.6-0.24l-6.44-6.44c-0.32-0.32-0.32-0.84 0-1.2 0.32-0.32 0.84-0.32 1.2 0l5.84 5.84 5.84-5.84c0.32-0.32 0.84-0.32 1.2 0 0.32 0.32 0.32 0.84 0 1.2l-6.44 6.44c-0.16 0.16-0.4 0.24-0.6 0.24z"></path>
          </svg>
        </a>
        <ul className="dropdownsubnew">
          <li
            className="text-center"
            onClick={(e) => handleChange(e.target.value)}
          >
            <span>English</span>
          </li>
          <li
            className="text-center"
            onClick={(e) => handleChange(e.target.value)}
          >
            <span>Arabic</span>
          </li>
        </ul>
      </span>
    </>
  );
}
