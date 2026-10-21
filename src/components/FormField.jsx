export default function FormField({ id, label, error, children }) {
  return (
    <div className="learning-form-field">
      <label htmlFor={id}>{label}</label>
      {children}
      {error && <p className="learning-field-error" id={`${id}-error`} role="alert">{error}</p>}
    </div>
  );
}
