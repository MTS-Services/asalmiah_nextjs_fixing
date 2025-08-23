import { useField } from "formik";

const Radio = ({ children, ...props }) => {
  const [field, meta] = useField({
    ...props,
    type: "radio",
  });

  return (
    <>
      <label className="checkbox-input">
        <input type="radio" {...field} {...props} className="me-2" />
        {children}
      </label>      
    </>
  );
};

export default Radio;
