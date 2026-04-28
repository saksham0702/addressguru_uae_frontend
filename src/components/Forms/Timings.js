import React from "react";

const Timings = ({ schedule, setSchedule }) => {
  // Convert time from 12-hour format (09:00 AM) to 24-hour format (09:00)
  const convertTo24Hour = (time12h) => {
    if (!time12h) return "09:00";

    const [time, period] = time12h.split(" ");
    let [hours, minutes] = time.split(":");
    hours = parseInt(hours);

    if (period === "PM" && hours !== 12) {
      hours += 12;
    } else if (period === "AM" && hours === 12) {
      hours = 0;
    }

    return `${hours.toString().padStart(2, "0")}:${minutes}`;
  };

  // Convert time from 24-hour format (09:00) to 12-hour format (09:00 AM)
  const convertTo12Hour = (time24h) => {
    if (!time24h) return "09:00 AM";

    let [hours, minutes] = time24h.split(":");
    hours = parseInt(hours);
    const period = hours >= 12 ? "PM" : "AM";

    if (hours === 0) {
      hours = 12;
    } else if (hours > 12) {
      hours -= 12;
    }

    return `${hours.toString().padStart(2, "0")}:${minutes} ${period}`;
  };

  const toggleDay = (day) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        is_open: prev[day].is_open === "1" ? null : "1",
        open_time:
          prev[day].is_open === "1" ? null : prev[day].open_time || "09:00",
        close_time:
          prev[day].is_open === "1" ? null : prev[day].close_time || "20:00",
        is_24_hours: prev[day].is_open === "1" ? null : prev[day].is_24_hours,
      },
    }));
  };

  const toggle24Hours = (day) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        is_24_hours: prev[day].is_24_hours === "1" ? null : "1",
        open_time: prev[day].is_24_hours === "1" ? "09:00" : "00:00",
        close_time: prev[day].is_24_hours === "1" ? "20:00" : "23:59",
      },
    }));
  };

  const updateTime = (day, field, value12h) => {
    const value24h = convertTo24Hour(value12h);

    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field === "from" ? "open_time" : "close_time"]: value24h,
      },
    }));
  };

  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 1; hour <= 12; hour++) {
      for (let minute of ["00", "30"]) {
        times.push(`${hour.toString().padStart(2, "0")}:${minute} AM`);
      }
    }
    for (let hour = 1; hour <= 12; hour++) {
      for (let minute of ["00", "30"]) {
        times.push(`${hour.toString().padStart(2, "0")}:${minute} PM`);
      }
    }
    return times;
  };

  const timeOptions = generateTimeOptions();

  return (
    <div className="">
      <span className="flex mb-2">
        <h3 className="2xl:text-[16px] text-sm font-medium text-black">
          Opening and Closing Hours
        </h3>
        <span className="text-red-600 ml-1 font-semibold">&#42;</span>
      </span>

      <div className="px-4">
        {Object.entries(schedule).map(([day, settings]) => {
          const isOpen = settings.is_open === "1";
          const is24Hours = settings.is_24_hours === "1";
          const fromTime12h = convertTo12Hour(settings.open_time);
          const toTime12h = convertTo12Hour(settings.close_time);

          return (
            <div key={day} className="flex items-center justify-between py-3">
              {/* Toggle Switch and Day */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => toggleDay(day)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    isOpen ? "bg-orange-500" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isOpen ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
                <span className="text-gray-800 font-medium">{day}</span>
              </div>

              {/* Time Selectors and 24 Hours */}
              <div className="flex items-center space-x-4">
                {/* From */}
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500 text-sm">From</span>
                  <select
                    value={fromTime12h}
                    onChange={(e) => updateTime(day, "from", e.target.value)}
                    disabled={!isOpen || is24Hours}
                    className={`px-3 py-1 border rounded-md text-sm ${
                      isOpen && !is24Hours
                        ? "border-gray-300 text-gray-800 bg-white"
                        : "border-gray-200 text-gray-400 bg-gray-50"
                    } focus:outline-none focus:border-orange-500`}
                  >
                    {timeOptions.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>

                {/* To */}
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500 text-sm">To</span>
                  <select
                    value={toTime12h}
                    onChange={(e) => updateTime(day, "to", e.target.value)}
                    disabled={!isOpen || is24Hours}
                    className={`px-3 py-1 border rounded-md text-sm ${
                      isOpen && !is24Hours
                        ? "border-gray-300 text-gray-800 bg-white"
                        : "border-gray-200 text-gray-400 bg-gray-50"
                    } focus:outline-none focus:border-orange-500`}
                  >
                    {timeOptions.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 24 Hours Toggle */}
                {isOpen && (
                  <div className="flex items-center space-x-2 ml-2">
                    <input
                      type="checkbox"
                      id={`24hours-${day}`}
                      checked={is24Hours}
                      onChange={() => toggle24Hours(day)}
                      className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500 cursor-pointer"
                    />
                    <label
                      htmlFor={`24hours-${day}`}
                      className="text-sm text-gray-700 cursor-pointer whitespace-nowrap"
                    >
                      Open 24H
                    </label>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Timings;
