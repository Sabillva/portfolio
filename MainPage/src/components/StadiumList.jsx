import StadiumCard from "./StadiumCard"

const StadiumList = ({ stadiums }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stadiums.map((stadium) => (
        <StadiumCard key={stadium.id} stadium={stadium} />
      ))}
    </div>
  )
}

export default StadiumList

