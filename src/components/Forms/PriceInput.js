import React from "react";

const SUPPORTED_CURRENCIES = [
  { code: "AED", name: "UAE Dirham",       symbol: "د.إ" },
  { code: "USD", name: "US Dollar",         symbol: "$"   },
  { code: "SGD", name: "Singapore Dollar",  symbol: "S$"  },
  { code: "EUR", name: "Euro",              symbol: "€"   },
  { code: "GBP", name: "British Pound",     symbol: "£"   },
  { code: "INR", name: "Indian Rupee",      symbol: "₹"   },
  { code: "SAR", name: "Saudi Riyal",       symbol: "﷼"   },
  { code: "QAR", name: "Qatari Riyal",      symbol: "ر.ق" },
  { code: "KWD", name: "Kuwaiti Dinar",     symbol: "د.ك" },
  { code: "BHD", name: "Bahraini Dinar",    symbol: ".د.ب"},
  { code: "OMR", name: "Omani Rial",        symbol: "ر.ع."},
  { code: "MYR", name: "Malaysian Ringgit", symbol: "RM"  },
  { code: "AUD", name: "Australian Dollar", symbol: "A$"  },
  { code: "CAD", name: "Canadian Dollar",   symbol: "C$"  },
];

/**
 * PriceInput
 * value shape: { amount: "", currency: "AED" }
 * onChange receives the same shape
 */
const PriceInput = ({ field, value = { amount: "", currency: "AED" }, onChange }) => {
  const selected = SUPPORTED_CURRENCIES.find((c) => c.code === value.currency) || SUPPORTED_CURRENCIES[0];

  const handleAmount = (e) => {
    onChange({ ...value, amount: e.target.value });
  };

  const handleCurrency = (e) => {
    onChange({ ...value, currency: e.target.value });
  };

  return (
    <div className="space-y-1">
      {field.field_label && (
        <label className="block text-sm font-medium text-gray-700">
          {field.field_label}
          {field.is_required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="flex rounded-lg border border-gray-200 overflow-hidden focus-within:border-orange-400 transition-colors">
        {/* Currency selector */}
        <div className="flex items-center border-r border-gray-200 bg-gray-50 px-1">
          <span className="text-sm text-gray-500 px-2 select-none">{selected.symbol}</span>
          <select
            value={value.currency}
            onChange={handleCurrency}
            className="bg-transparent text-sm text-gray-700 font-medium pr-1 py-2.5 focus:outline-none cursor-pointer"
          >
            {SUPPORTED_CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code}
              </option>
            ))}
          </select>
        </div>

        {/* Amount input */}
        <input
          type="number"
          min={field.min_value ?? 0}
          max={field.max_value ?? undefined}
          placeholder={field.placeholder || "Enter amount"}
          value={value.amount}
          onChange={handleAmount}
          required={field.is_required}
          className="flex-1 px-4 py-2.5 text-sm text-gray-800 focus:outline-none bg-white"
        />
      </div>

      {field.help_text && (
        <p className="text-xs text-gray-400">{field.help_text}</p>
      )}
    </div>
  );
};

export default PriceInput;