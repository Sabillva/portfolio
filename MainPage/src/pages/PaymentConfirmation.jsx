import { useLocation, Link } from "react-router-dom";
import { CheckCircle, Calendar, DollarSign } from "lucide-react";

const PaymentConfirmation = () => {
  const location = useLocation();
  const { stadiumId, date, time, price, paymentMethod } = location.state || {};

  if (!stadiumId || !date || !time || !price) {
    return <div className="text-white text-center">Xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto bg-[#333] rounded-3xl shadow-md p-6">
        <div className="text-center mb-6">
          <CheckCircle className="mx-auto text-green-500" size={64} />
          <h1 className="text-2xl font-bold mt-4 text-white">Ödəniş Uğurla Tamamlandı!</h1>
        </div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4 text-white">Rezervasiya Məlumatları</h2>
          <div className="flex items-center mb-2 text-white">
            <Calendar className="mr-2" size={18} />
            <span>{new Date(date).toLocaleDateString()} - {time}</span>
          </div>
          <div className="flex items-center mb-2 text-white">
            <DollarSign className="mr-2" size={18} />
            <span>{price} AZN</span>
          </div>
          <div className="mb-2 text-white">
            <span className="font-medium">Ödəniş Metodu:</span>{" "}
            {paymentMethod === "credit_card" ? "Kredit Kartı" : "Debet Kartı"}
          </div>
        </div>
        <p className="text-center text-gray-300 mb-6">
          Rezervasiya təsdiqiniz e-poçt ünvanınıza göndəriləcək.
        </p>
        <Link
          to="/stadiums"
          className="block w-full text-center bg-gradient-to-br from-green-400 to-green-600 text-gray-900 py-2 px-4 rounded-full shadow-lg hover:bg-gradient-to-bl hover:shadow-2xl transition duration-300"
        >
          Ana Səhifəyə Qayıt
        </Link>
      </div>
    </div>
  );
};

export default PaymentConfirmation;
