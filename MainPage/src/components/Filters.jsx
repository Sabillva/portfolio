import { useState } from "react";
import { Sliders, Search, Check } from "lucide-react";

const Filters = ({ filters, setFilters }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(filters.timeSlot);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleTimeSlotClick = (time) => {
    setSelectedTimeSlot(time);
    setIsDropdownOpen(false);
    setFilters((prevFilters) => ({
      ...prevFilters,
      timeSlot: time,
    }));
  };

  return (
    <div className="bg-[#171717] p-6 rounded-3xl shadow-lg border-2 border-white/20 text-white">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <Sliders className="mr-2 text-green-400" /> Filterlər
      </h2>

      <div className="space-y-5">
        {/* Qiymət Aralığı */}
        <div className="p-4 bg-[#222] rounded-3xl border-2 border-white/20">
  <label className="block mb-3 text-base font-semibold text-white">
    Qiymət Aralığı
  </label>
  <div className="relative">
    {/* Qiymət Göstəricisi (Tooltip) */}
    <div
      className="absolute top-[-35px]"
      style={{
        left: `calc(${(filters.maxPrice / 250) * 100}% - 20px)`, // Slider thumb ilə sinxron hərəkət
      }}
    >
      <div className="bg-green-400 text-black text-xs font-semibold px-2 py-1 rounded-md">
        {filters.maxPrice} AZN
      </div>
    </div>

    {/* Custom Range Input */}
    <input
      type="range"
      name="maxPrice"
      min="0"
      max="250"
      value={filters.maxPrice}
      onChange={handleChange}
      className="w-full cursor-pointer appearance-none h-2 bg-gray-700 rounded-lg accent-green-400 transition-all"
      style={{
        WebkitAppearance: "none",
        appearance: "none",
        background: `linear-gradient(to right, #22c55e ${(filters.maxPrice / 250) * 100}%, #4b5563 ${(filters.maxPrice / 250) * 100}%)`,
      }}
    />

    {/* Custom Thumb (Slider Düyməsi) */}
    <style>
      {`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          background-color: #22c55e;
          border-radius: 50%;
          border: 2px solid white;
          cursor: pointer;
          transition: transform 0.2s ease-in-out;
        }
        input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }
      `}
    </style>
  </div>

  {/* Min və Max Qiymətləri */}
  <div className="flex justify-between items-center text-sm mt-3 text-white">
    <span className="bg-gray-800 px-3 py-1 rounded-lg text-xs">
      0 AZN
    </span>
    <span className="text-gray-400">—</span>
    <span className="bg-gray-800 px-3 py-1 rounded-lg text-xs">
      250 AZN
    </span>
  </div>
</div>



        {/* Məsafə */}
        <div>
          <label className="block mb-2 text-sm font-medium">Məsafə (km)</label>
          <input
            type="number"
            name="maxDistance"
            value={filters.maxDistance}
            onChange={handleChange}
            className="w-full p-3 border-2 border-white/20 rounded-full bg-[#222] text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Maksimum məsafə"
          />
        </div>

        {/* Saat Aralığı Dropdown */}
        <div className="relative">
          <div
            className="flex items-center border-2 border-white/20 rounded-full p-3 bg-[#222] cursor-pointer hover:border-green-400 transition w-full"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <Search className="text-gray-400 ml-3" size={18} />
            <span className="flex-1 text-white px-2">
              {selectedTimeSlot || "Bütün saatlar"}
            </span>
          </div>

          {isDropdownOpen && (
            <div className="absolute z-10 bg-[#222] border-2 border-white/20 rounded-lg w-full mt-2 shadow-lg">
              {[
                "10:00-11:00",
                "11:00-12:00",
                "12:00-13:00",
                "13:00-14:00",
                "14:00-15:00",
                "15:00-16:00",
                "16:00-17:00",
                "17:00-18:00",
                "18:00-19:00",
                "19:00-20:00",
                "20:00-21:00",
              ].map((time) => (
                <div
                  key={time}
                  onClick={() => handleTimeSlotClick(time)}
                  className="px-4 py-2 text-white hover:bg-green-400 cursor-pointer rounded-lg"
                >
                  {time}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* İmkanlar */}
        <div className="grid grid-cols-2 gap-6">
          {[
            { id: "shower", name: "Duş" },
            { id: "changingRoom", name: "Soyunub-geyinmə otağı" },
            { id: "tea", name: "Çay" },
            { id: "parking", name: "Parking" },
            { id: "camera", name: "Kamera" },
          ].map((feature) => (
            <div
              key={feature.id}
              className={`flex items-center p-2 rounded-xl border-2 text-md ${
                filters[feature.id]
                  ? "bg-green-400 text-gray-900"
                  : "bg-[#222] border-white/20 text-white"
              } cursor-pointer transition hover:bg-green-400 hover:text-gray-900 text-base`}
              onClick={() =>
                setFilters((prevFilters) => ({
                  ...prevFilters,
                  [feature.id]: !prevFilters[feature.id],
                }))
              }
            >
              <Check className="mr-3" size={20} />
              <span>{feature.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Filters;
