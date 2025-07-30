import { useSelector } from "react-redux";

const useCountryState = () => {
  return useSelector((state) => state?.country?.country);
};

export default useCountryState;
