import "./StatusCheckbox.css";

function StatusCheckbox({ checked, onChange }) {
  return (
    <input
      type="checkbox"
      className="status-checkbox"
      checked={checked}
      onChange={onChange}
    />
  );
}

export default StatusCheckbox;