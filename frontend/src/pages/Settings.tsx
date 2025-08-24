import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const SettingsPage = () => {
  const { user, setIsSelectLocation } = useUser();
  const navigate = useNavigate();

  return (
    <div className="p-4 space-y-6">
      {/* Go Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 mb-4"
      >
        <ChevronLeft className="w-5 h-5" />
        <span className="text-sm font-medium">Back</span>
      </button>

      {/* Profile Section */}
      <section className="bg-white shadow rounded-2xl p-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold text-primaryColor">
            {user?.username?.[0]?.toUpperCase()}
          </div>
          <div>
            <h2 className="text-lg font-semibold">{user?.username}</h2>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>
      </section>

      {/* Information Section */}
      <section className="bg-white shadow rounded-2xl p-4 space-y-3">
        <h3 className="text-md font-semibold">Information</h3>
        <div className="space-y-2">
          {/* <div className="flex justify-between items-center">
            <span className="text-gray-600">Phone Number</span>
            <span className="text-gray-800">{user?.phone || "Not added"}</span>
          </div> */}
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Location</span>
            <button
              onClick={() => setIsSelectLocation(true)}
              className="text-primaryColor text-sm underline"
            >
              {user?.city || "Set Location"}
            </button>
          </div>
        </div>
      </section>

      {/* Language Section */}
      <section className="bg-white shadow rounded-2xl p-4 space-y-3">
        <h3 className="text-md font-semibold">Language</h3>
        <select className="border rounded-md px-3 py-2 w-full">
          <option>English</option>
          <option>Русский</option>
          <option>Қазақша</option>
        </select>
      </section>

      {/* Become Seller Section */}
      <section className="bg-white shadow rounded-2xl p-4">
        <h3 className="text-md font-semibold mb-2">Become a Seller</h3>
        <p className="text-sm text-gray-600 mb-3">
          Start selling your products and reach more customers.
        </p>
        <button className="bg-primaryColor text-white w-full py-2 rounded-md">
          Apply Now
        </button>
      </section>
    </div>
  );
};

export default SettingsPage;