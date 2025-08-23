import React from "react";
import "./page.scss";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { toastAlert } from "../../../../../utils/SweetAlert";
import { resetPasswordLink } from "../../../../../services/APIServices";
import { useRouter } from "next/navigation";
function LinkExpired({ role, email }) {
  let navigate = useRouter();
  const mutation = useMutation({
    mutationFn: (body) => resetPasswordLink(body),
    onSuccess: (res) => {
      toastAlert("success", res?.data?.message);

      navigate.push("/login");
    },
  });

  return (
    <>
      <div className="link-expired-page">
        <header>
          <h1>Link Expired</h1>
        </header>
        <div className="content">
          <p>
            The password reset link has expired. Please request a new link or
            contact support.
          </p>
          <div className="actions">
            <button
              className="request-new-link btn btn-theme"
              onClick={() => {
                let body = {
                  email: email,
                  roleId: role,
                };
                mutation.mutate(body);
              }}
            >
              Request New Link
            </button>
            <Link href="/" className="contact-support btn btn-theme">
              Go Back
            </Link>
          </div>
        </div>
        <footer>
          <p>&copy; 2023 Offarat. All Rights Reserved.</p>
        </footer>
      </div>
    </>
  );
}

export default LinkExpired;
