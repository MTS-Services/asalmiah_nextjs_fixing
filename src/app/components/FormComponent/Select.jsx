import { useField } from "formik";

const Select = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <>
      {label && <label htmlFor={props.id || props.name}>{label}</label>}
      <select {...field} {...props} className="form-control" />
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </>
  );
};

export default Select;

