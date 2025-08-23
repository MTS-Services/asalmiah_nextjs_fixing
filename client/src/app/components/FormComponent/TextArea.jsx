import { useField } from "formik";
import React from "react";

const Textarea = ({ label, disabled, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <>
      {label && <label htmlFor={props.id || props.name}>{label}</label>}
      <textarea
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

export default Textarea;


