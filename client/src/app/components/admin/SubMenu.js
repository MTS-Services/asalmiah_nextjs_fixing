import Link from "next/link";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { usePathname } from "next/navigation";
const SidebarLabel = styled.span`
  margin-left: 16px;
`;

const DropdownLink = styled(Link)`
  background: #414757;
  height: 60px;
  padding-left: 3rem;
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #f5f5f5;
  font-size: 18px;

  &:hover {
    background: #632ce4;
    cursor: pointer;
  }
`;

const SubMenu = ({ item }) => {
  const [subnav, setSubnav] = useState(false);

  const showSubnav = () => setSubnav(!subnav);
  const pathname = usePathname();
  let pathNameSplit = pathname.split("/");
  let activeLinkName = pathNameSplit[3];

  if (!activeLinkName) {
    activeLinkName = "page";
  }


  return (
    <>
      <div className={item?.cName} onClick={item?.subNav && showSubnav}>
        <Link
          href={item?.subNav?.length > 0 ? `javascript:void(0)` : item?.path ? item?.path :`javascript:void(0)` }
        >
          {item?.icon}
          <SidebarLabel>{item?.title}</SidebarLabel>
        </Link>
        <div>
          {item?.subNav && subnav
            ? item?.iconOpened
            : item?.subNav
            ? item?.iconClosed
            : null}
        </div>
      </div>
      {subnav &&
        item?.subNav?.map((item, index) => {
          return (
            <div className="dropdownlist" key={index}>
              <DropdownLink href={item?.path} key={index}>
                {item?.icon}
                <SidebarLabel>{item?.title}</SidebarLabel>
              </DropdownLink>
            </div>
          );
        })}
    </>
  );
};

export default SubMenu;
