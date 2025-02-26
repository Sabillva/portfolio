import Azal from "../images/azal-arena.jpg"
import Dalga from "../images/dalga-arena.jpg"
import KapitalBank from "../images/kapital-bank-arena.jpg"
import Kepez from "../images/kepez-arena.jpg"

export const stadiumsData = [
  {
    id: 1,
    name: "Azal Arena",
    city: "Bakı",
    image: Azal,
    distance: 2.5,
    price: 50,
    availableHours: ["10:00-11:00", "11:00-12:00", "12:00-13:00", "13:00-14:00"],
    facilities: {
      shower: true,
      changingRoom: true,
      tea: false,
      parking: true,
      camera: true,
    },
  },
  {
    id: 2,
    name: "Dalğa Arena",
    city: "Bakı",
    image: Dalga,
    distance: 5.1,
    price: 60,
    availableHours: ["14:00-15:00", "15:00-16:00", "16:00-17:00", "17:00-18:00"],
    facilities: {
      shower: true,
      changingRoom: true,
      tea: true,
      parking: true,
      camera: false,
    },
  },
  {
    id: 3,
    name: "Kapital Bank Arena",
    city: "Sumqayıt",
    image: KapitalBank,
    distance: 35.7,
    price: 45,
    availableHours: ["18:00-19:00", "19:00-20:00", "20:00-21:00"],
    facilities: {
      shower: false,
      changingRoom: true,
      tea: false,
      parking: true,
      camera: true,
    },
  },
  {
    id: 4,
    name: "Kəpəz Stadionu",
    city: "Gəncə",
    image: Kepez,
    distance: 360.2,
    price: 40,
    availableHours: ["10:00-11:00", "11:00-12:00", "12:00-13:00", "13:00-14:00", "14:00-15:00"],
    facilities: {
      shower: true,
      changingRoom: true,
      tea: true,
      parking: false,
      camera: false,
    },
  },
  // Daha çox stadion əlavə edə bilərsiniz
]

