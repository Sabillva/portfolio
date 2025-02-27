import { MapPin, DollarSign, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const StadiumCard = ({ stadium }) => {
  return (
    <Link to={`/stadium/${stadium.id}`} className="block">
      <div className="bg-[#222] rounded-3xl border-2 border-white/20 shadow-lg p-6 transition transform hover:scale-101 hover:border-gray-300">
        {/* Stadion Şəkili */}
        <img
          src={stadium.image || "/placeholder.svg"}
          alt={stadium.name}
          className="w-full h-56 object-cover rounded-2xl mb-4"
        />
        
        {/* Stadion Məlumatları */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white">{stadium.name}</h3>
          
          <div className="flex items-center text-gray-300">
            <MapPin className="mr-2" size={18} />
            <span>{stadium.city}</span>
          </div>

          <div className="flex items-center text-gray-300">
            <DollarSign className="mr-2" size={18} />
            <span>{stadium.price} AZN/saat</span>
          </div>

          <div className="flex items-center text-gray-300">
            <Calendar className="mr-2" size={18} />
            <span>{stadium.availableDates}</span>
          </div>

          <p className="text-sm text-gray-400">Məsafə: {stadium.distance} km</p>
        </div>

        {/* Ətraflı Bax Buttonu */}
        <Link
          to={`/stadium/${stadium.id}`}
          className="mt-4 block text-center border-2 border-white text-white py-2 px-6 rounded-full bg-[#222] font-medium transition-all duration-300 shadow-lg hover:bg-white hover:text-[#222] hover:border-[#222] hover:scale-105"
        >
          Ətraflı Bax
        </Link>
      </div>
    </Link>
  );
};

export default StadiumCard;
