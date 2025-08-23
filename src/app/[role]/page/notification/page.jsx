/**
@copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >
 
All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of ToXSL Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
"use client";

import { getNotifications } from "../../../../../services/APIServices";
import moment from "moment";
import { useEffect, useState } from "react";
import { MdNotifications } from "react-icons/md";
import Breadcrums from "../../../components/Breadcrums";

const Notifications = () => {
  const [notificationList, setNotificationList] = useState({
    data: [],
    page: 1,
    total: null,
  });

  useEffect(() => {
    notifications();
  }, []);

  const notifications = async () => {
    const response = await getNotifications();
    if (response?.status === 200) {
      setNotificationList((prevState) => ({
        ...prevState,
        data: response?.data?.data,
        total: response?.data?._meta?.totalCount,
      }));
    }
  };
  return (
    <>
      <Breadcrums firstLink="Home" secondLink="Notification" />
      <section className="accountmain">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-md-4 mb-md-0 mb-4"></div>
            <div className="col-lg-9 col-md-8">
              <div className="dashboard-right">
                <div className="row">
                  <div className="col-md-12">
                    <div className="main-title-tab">
                      <h4>
                        <MdNotifications />
                        Notifications
                      </h4>
                    </div>
                    <div className="pt-4">
                      <div className="notifyscrol">
                        {notificationList?.data?.length > 0 ? (
                          notificationList?.data?.map((data,index) => {
                            return (
                              <div key={index} className="flex-grow-1 card card-body mb-3">
                                <p className="mb-0 fs-11 fw-medium text-uppercase text-muted">
                                  <small>
                                    <span>
                                      <i className="mdi mdi-clock-outline"></i>{" "}
                                      {data?.description}
                                    </span>
                                  </small>
                                </p>
                                <p className="mb-0 fs-11 fw-medium text-uppercase text-muted">
                                  <small>
                                    <span>
                                      <i className="mdi mdi-clock-outline"></i>{" "}
                                      {moment(data?.createdAt).fromNow()}
                                    </span>
                                  </small>
                                </p>
                              </div>
                            );
                          })
                        ) : (
                          <div className="empty-state">
                            <div className="empty-state__content">
                              <div className="empty-state__icon"></div>
                              <div className="empty-state__message">
                                Notification not found
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Notifications;
