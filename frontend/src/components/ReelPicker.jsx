function ReelPicker({ label, value, options, onChange }) {
  return (
    <div className="reel-picker">
      <label>{label}</label>
      <select value={value} onChange={(e) => onChange(Number(e.target.value))}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export default ReelPicker;