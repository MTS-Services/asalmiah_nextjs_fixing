/**
@copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >
 
All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of ToXSL Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import styled from "styled-components";
import logo from "../../../../public/assets/img/logo.png";
import "./sidebar.scss";
import {
  DesignedUserData,
  PromotionUserData,
  SidebarData,
} from "./SidebarData";
import SubMenu from "./SubMenu";
import { usePathname, useRouter } from "next/navigation";
import useDetails from "../../../../hooks/useDetails";
import { constant } from "../../../../utils/constants";
const Nav = styled.div`
  background: #15171c;
  height: 80px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const NavIcon = styled(Link)`
  margin-left: 2rem;
  font-size: 2rem;
  height: 80px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const SidebarNav = styled.nav`
  background: #15171c;
  width: 265px;
  height: 100vh;
  display: flex;
  justify-content: center;
  position: fixed;
  top: 0;
  left: ${({ sidebar }) => (sidebar ? "0" : "-100%")};
  transition: 350ms;
  z-index: 10;
`;

const SidebarWrap = styled.div`
  width: 100%;
`;

const AdminSidebar = ({ sidebar, setSidebar }) => {
  let detail = useDetails();

  const [hydrated, setHydrated] = useState(false);
  const [state, setState] = useState(false);
  useEffect(() => {
    setHydrated(true);
    return () => {
      setHydrated(false);
    };
  }, []);

  const showSidebar = () => setSidebar(!sidebar);
  let router = useRouter();
  let pathName = usePathname();
  useEffect(() => {
    if (state == true) {
      if (detail?.roleId == constant.PROMOTION_USER) {
        router.push("/promotion-user/page");

      } else if (detail?.roleId == constant.DESIGNED_USER) {
        router.push("/designed-user/page")
      } else if (detail?.roleId == constant.ADMIN) {
        router.push("/admin/page");
      } else {
        router.push("/");

      }
      if (pathName == "/admin/page" || pathName == "/designed-user/page" || pathName == "/promotion-user/page") {
        window.location?.reload();
      }
    }
  }, [state, pathName == "/admin/page", pathName == "/designed-user/page", pathName == "/promotion-user/page"]);

  return (
    <>
      {hydrated && (
        <nav className={sidebar ? "nav-menu inactive" : "nav-menu active"}>
          <SidebarNav sidebar={sidebar} className="nav-menu active">
            <SidebarWrap className="nav-menu-items">
              <li className="navbar-toggle">
                <Link
                  href="#"
                  onClick={() => {
                    setState(true);
                  }}
                >
                  <Image height={57} width={156} src={logo} alt="logo" />
                </Link>
              </li>
              {detail?.roleId == constant.ADMIN
                ? SidebarData.map((item, index) => {
                  return <SubMenu item={item} key={index} />;
                })
                : detail?.roleId == constant.PROMOTION_USER || detail?.roleId == constant.DESIGNED_USER
                  ? PromotionUserData?.map((item, index) => {
                    return <SubMenu item={item} key={index} />;
                  })
                  : ""}
            </SidebarWrap>
          </SidebarNav>
        </nav>
      )}
    </>
  );
};

export default AdminSidebar;
