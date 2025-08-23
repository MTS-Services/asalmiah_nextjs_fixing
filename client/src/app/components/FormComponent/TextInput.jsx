import { useField } from "formik";

const TextInput = ({ label, disabled, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <>
      {label && (
        <label htmlFor={props.id || props.name} className="mb-2">
          {label}
        </label>
      )}
      <input
        disabled={disabled}
        className="form-control"
        {...field}
        {...props}
      />
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </>
  );
};

export default TextInput;

