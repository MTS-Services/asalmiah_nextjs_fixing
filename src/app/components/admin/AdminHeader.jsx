"use client";
import Link from "next/link";
/**
@copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >
 
All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of ToXSL Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
import { useMutation, useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { IconContext } from "react-icons";
import * as FaIcons from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { useDispatch } from "react-redux";
import useCountryState from "../../../../hooks/useCountryState";
import useDetails from "../../../../hooks/useDetails";
import user from "../../../../public/assets/img/default.png";
import { country } from "../../../../redux/features/CountrySlice";
import { slider } from "../../../../redux/features/sliderSlice";
import { logOut, USER_ROLES_PRIVILIGES } from "../../../../services/APIServices";
import { getLinkHref } from "../../../../utils/helper";
import { toastAlert } from "../../../../utils/SweetAlert";
import TranslateWidget from "../../../../utils/TranslateWidget";
import AdminSidebar from "./AdminSidebar";
import { Form } from "react-bootstrap";

const AdminHeader = ({ refetchAPI }) => {
  const dispatch = useDispatch();
  const userDetail = useDetails();
  const selectedCountry = useCountryState();
  const router = useRouter();
  const [sidebar, setSidebar] = useState(false);
  const [navbar, setNavbar] = useState(true);
  const [hydrated, setHydrated] = useState(false);
  const [dSidebar, setDSidebar] = useState(true);
  const showSidebar = () => setSidebar(!sidebar);
  const showNavbar = () => setNavbar(!navbar);
  const [bodymain, setBodymain] = useState(true);
  const showBodymain = () => setBodymain(!bodymain);
  const [footer, setFooter] = useState(true);
  const showFooter = () => setFooter(!footer);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    setHydrated(true);
    return () => {
      setHydrated(false);
    };
  }, []);
  // const [notificationList, setNotificationList] = useState({
  //   data: [],
  //   // page: 1,
  //   // total: null,
  // });

  // useEffect(() => {
  //   notifications();
  // }, []);

  // const notifications = async () => {
  //   const response = await getNotifications();
  //   if (response?.status === 200) {
  //     setNotificationList((prevState) => ({
  //       ...prevState,
  //       data: response?.data?.data,
  //       // total: response?.data?._meta?.totalCount,
  //     }));
  //   }
  // };

  const logoutMutation = useMutation({
    mutationFn: () => logOut(),
    onSuccess: () => {
      toastAlert("success", "Logout Successfully");
      Cookies.remove("userDetail");
      Cookies.remove("cartItems");
      localStorage.clear();

      router.push(getLinkHref(userDetail?.roleId, "/"));
      // dispatch(logoutUser(null));
    },
  });

  const handleCountryChange = (e) => {
    const selectedCountry = e.target.value;
    dispatch(country(selectedCountry));
  };

  useQuery({
    queryKey: ["roles-priviliges-detail"],
    queryFn: async ({ queryKey }) => {
      const [_key] = queryKey;

      const response = await USER_ROLES_PRIVILIGES();
      if (response?.data?.data) {
        const newPermission = response?.data?.data;
        let currentPermissions = JSON.parse(localStorage.getItem("permissionStore")) || [];
        currentPermissions = newPermission;
        if (currentPermissions) {
          localStorage.setItem("permissionStore", JSON.stringify(currentPermissions));
        } else {
          localStorage.removeItem("permissionStore");
        }

      }
      return response?.data?.data;
    },
  });


  return (
    <>
      <IconContext.Provider value={{ color: " #fff" }}>
        <div
          className={
            navbar
              ? "adminnavbar navbar uncollapse"
              : "adminnavbar navbar  collapsenavbar"
          }
        >
          <Link href="javascript:void(0)" className="menu-bars">
            <FaIcons.FaBars
              onClick={() => {
                showSidebar();
                showNavbar();
                showBodymain();
                showFooter();
                setDSidebar(!dSidebar);
                dispatch(slider(dSidebar));
              }}
            />
          </Link>

          <ul className={"navbar-top ms-auto me-0 mb-0"}>
            {/* <li>
              <div className="form-group position-relative selectform mb-0">
                <Form.Select
                  onChange={handleCountryChange}
                  value={selectedCountry}
                >
                  <option value={"Kuwait"}>Kuwait</option>

                  <option value={"Jordan"}>Jordan</option>
                  <option value={"UAE"}>UAE</option>
                </Form.Select>
              </div>
            </li> */}

            <li>
              {" "}
              <TranslateWidget />
            </li>
            <li>
              <Dropdown>
                <Dropdown.Toggle className="bg-transparent" id="dropdown-basic">
                  <span className="d-flex align-items-center">
                    {hydrated && (
                      <Image
                        height={42}
                        width={42}
                        className="rounded-circle header-profile-user"
                        src={
                          userDetail?.profileImg ? userDetail?.profileImg : user
                        }
                        alt="Avatar"
                      />
                    )}
                    <span className={"text-start ms-xl-2"}>
                      {hydrated && (
                        <p className="username mb-0">{userDetail?.fullName}</p>
                      )}
                    </span>
                    <div className="drop-arrow">
                      <IoIosArrowDown />
                    </div>
                  </span>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  {hydrated && (
                    <h6 className="dropdown-header">
                      Welcome {userDetail?.fullName}!
                    </h6>
                  )}
                  <Dropdown.Item
                    style={{ color: "inherit" }}
                    href={getLinkHref(userDetail?.roleId, `/page/profile`)}
                    className="admin-right-txt"
                  >
                    <FaIcons.FaUserAlt /> &nbsp;Profile
                  </Dropdown.Item>{" "}
                  <Dropdown.Item
                    style={{ color: "inherit" }}
                    href={getLinkHref(userDetail?.roleId, `/page/change-password`)}
                    className="admin-right-txt"
                  >
                    <FaIcons.FaUserLock /> &nbsp; Change Password
                  </Dropdown.Item>
                  <Dropdown.Item
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();

                      logoutMutation.mutate();
                    }}
                    className="admin-right-txt"
                  >
                    <FaIcons.FaSignOutAlt /> &nbsp; Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </li>
          </ul>
        </div>

        {dSidebar && <AdminSidebar sidebar={sidebar} setSidebar={setSidebar} />}
      </IconContext.Provider>
    </>
  );
};

export default AdminHeader;
