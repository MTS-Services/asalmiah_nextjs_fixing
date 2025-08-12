import AdminFooter from "../components/admin/AdminFooter.jsx";


export const metadata = {
  title: "Offarat ",
  description:
    "Offarat  All Rights Reserved. ToXSL Technologies Pvt. Ltd. < www.toxsl.com >",
};

export default function RootLayout({ children }) {
  return (
    <>
      {children}
      {/* <AdminFooter /> */}
    </>
  );
}
