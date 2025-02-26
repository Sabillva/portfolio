import { Sliders } from "lucide-react";

const Filters = ({ filters, setFilters }) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <Sliders className="mr-2" /> Filterlər
      </h2>
      <div className="space-y-4">
        <div>
          <label className="block mb-2 text-sm font-medium">
            Qiymət Aralığı
          </label>
          <input
            type="range"
            name="maxPrice"
            min="0"
            max="100"
            value={filters.maxPrice}
            onChange={handleChange}
            className="w-full"
          />
          <div className="flex justify-between text-sm">
            <span>0 AZN</span>
            <span>{filters.maxPrice} AZN</span>
          </div>
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium">Məsafə (km)</label>
          <input
            type="number"
            name="maxDistance"
            value={filters.maxDistance}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Maksimum məsafə"
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium">Saat Aralığı</label>
          <select
            name="timeSlot"
            value={filters.timeSlot}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Bütün saatlar</option>
            <option value="10:00-11:00">10:00-11:00</option>
            <option value="11:00-12:00">11:00-12:00</option>
            <option value="12:00-13:00">12:00-13:00</option>
            <option value="13:00-14:00">13:00-14:00</option>
            <option value="14:00-15:00">14:00-15:00</option>
            <option value="15:00-16:00">15:00-16:00</option>
            <option value="16:00-17:00">16:00-17:00</option>
            <option value="17:00-18:00">17:00-18:00</option>
            <option value="18:00-19:00">18:00-19:00</option>
            <option value="19:00-20:00">19:00-20:00</option>
            <option value="20:00-21:00">20:00-21:00</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="block mb-2 text-sm font-medium">İmkanlar</label>
          <div>
            <input
              type="checkbox"
              id="shower"
              name="shower"
              checked={filters.shower}
              onChange={handleChange}
            />
            <label htmlFor="shower" className="ml-2">
              Duş
            </label>
          </div>
          <div>
            <input
              type="checkbox"
              id="changingRoom"
              name="changingRoom"
              checked={filters.changingRoom}
              onChange={handleChange}
            />
            <label htmlFor="changingRoom" className="ml-2">
              Soyunub-geyinmə otağı
            </label>
          </div>
          <div>
            <input
              type="checkbox"
              id="tea"
              name="tea"
              checked={filters.tea}
              onChange={handleChange}
            />
            <label htmlFor="tea" className="ml-2">
              Çay
            </label>
          </div>
          <div>
            <input
              type="checkbox"
              id="parking"
              name="parking"
              checked={filters.parking}
              onChange={handleChange}
            />
            <label htmlFor="parking" className="ml-2">
              Parking
            </label>
          </div>
          <div>
            <input
              type="checkbox"
              id="camera"
              name="camera"
              checked={filters.camera}
              onChange={handleChange}
            />
            <label htmlFor="camera" className="ml-2">
              Kamera
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filters;
