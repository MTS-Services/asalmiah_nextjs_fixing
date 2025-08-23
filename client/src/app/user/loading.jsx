import Image from "next/image";
import logo from "../../../public/assets/img/logo.png";
const Loading = () => {
  return (
    <div className="customloader">
      <div className="ripple"></div>
      <div className="logocontent">
        <Image height={57} width={154} src={logo} alt="loading" />
      </div>
    </div>
  );
};

export default Loading;
