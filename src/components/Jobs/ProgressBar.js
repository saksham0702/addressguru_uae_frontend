export default function ProgressBar({
  title,
  value,
  min,
  max,
  step,
  onChange,
  jobCount = {},
}) {
  const applied = false; // Remove internal state logic for general use

  return (
    <div className="w-full max-w-sm">
      <h2 className="font-semibold text-sm">{title}</h2>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        className="accent-orange-500 h-[1px] cursor-pointer w-30 bg-black relative left-2 transition-all duration-200"
      />

      <p className="text-orange-500 text-center font-semibold text-[11px] mt-1.5">
        {title === "EXPERIENCE"
          ? `${value} ${value === 1 ? "Year" : "Years"} (${
              jobCount[value]
            } jobs)`
          : `${value} Lakh`}
      </p>


        <div className="flex gap-2 pl-3 text-[10px] mt-3 w-35">
          <button
            onClick={() => console.log("Apply logic goes here")}
            className="bg-orange-500 text-white font-semibold cursor-pointer py-1 px-3 rounded hover:bg-orange-600 transition"
          >
            APPLY
          </button>
          <button
            onClick={() => onChange({ target: { value: 0 } })}
            className="border border-gray-400 text-gray-700 font-semibold py-1 px-3 rounded cursor-pointer hover:bg-gray-100 transition"
          >
            CLEAR
          </button>
        </div>
  
    </div>
  );
}
