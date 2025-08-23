/**
@copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >
 
All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of ToXSL Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import useSlider from "../../../../hooks/useSlider";
import styles from "./footer.module.scss";
import { getLinkHref } from "../../../../utils/helper";
import useDetails from "../../../../hooks/useDetails";

const AdminFooter = () => {
  const [footer, setFooter] = useState(true);
  const showFooter = () => setFooter(!footer);
  const toggleVal = useSlider();
let detail = useDetails()
  const pathname = usePathname();
  if (
    pathname.includes("admin") ||
    pathname.includes("designed-user") ||
    pathname.includes("promotion-user")
  ) {
    return (
      <footer
        className={
          toggleVal
            ? "footer text-center pt-3 pb-3"
            : "pt-3 pb-3 footer text-center collapsenavbar"
        }
      >
        <div className={`${styles.footer_bottom} clearfix`}>
          <div className="container">
            <div className={styles.copyright}>
              <p className="mb-0">
                © {new Date().getFullYear()}
                <Link
                  href={getLinkHref(detail?.roleId)}
                  className="text-danger"
                >
                  {" "}
                  Offarat{" "}
                </Link>{" "}
                | All Rights Reserved. Developed By{" "}
                <Link
                  href="https://toxsl.com/"
                  target="_blank"
                  className="text-danger"
                >
                  Toxsl Technologies
                </Link>
              </p>
            </div>
          </div>
        </div>
      </footer>
    );
  }
};

export default AdminFooter;
