import { MapPin, DollarSign } from "lucide-react"
import { Link } from "react-router-dom"

const StadiumCard = ({ stadium }) => {
  return (
    <Link to={`/stadium/${stadium.id}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <img src={stadium.image || "/placeholder.svg"} alt={stadium.name} className="w-full h-48 object-cover" />
        <div className="p-4">
          <h3 className="text-xl font-semibold mb-2">{stadium.name}</h3>
          <div className="flex items-center text-gray-600 mb-2">
            <MapPin size={16} className="mr-1" />
            <span>{stadium.city}</span>
          </div>
          <div className="flex items-center text-gray-600 mb-2">
            <DollarSign size={16} className="mr-1" />
            <span>{stadium.price} AZN/saat</span>
          </div>
          <p className="text-sm text-gray-500">Məsafə: {stadium.distance} km</p>
        </div>
      </div>
    </Link>
  )
}

export default StadiumCard

