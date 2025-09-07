import { useEffect, useRef, useState } from "react";

interface ShopAddressPickerProps {
  onSelect: (data: { lat: number; lng: number; address: string }) => void;
}

interface Suggestion {
  id: string;
  name: string;
  full_name: string;
  point: { lat: number; lon: number };
}

const ShopAddressPicker: React.FC<ShopAddressPickerProps> = ({ onSelect }) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<any>(null);
  const markerRef = useRef<any>(null);

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>("");

  const API_KEY = import.meta.env.VITE_2GIS_API_KEY;

  useEffect(() => {
    const initMap = async () => {
      const DG = (window as any).DG;
      if (!DG || !mapRef.current) return;

      mapInstance.current = DG.map(mapRef.current, {
        center: [47.0945, 51.9230], 
        zoom: 13,
      });

      mapInstance.current.on("click", async (e: any) => {
        const { lat, lng } = e.latlng;
        placeMarker(lat, lng);

        const address = await reverseGeocode(lat, lng);
        setSelectedAddress(address);
        onSelect({ lat, lng, address });
      });
    };

    initMap();
  }, []);

  const placeMarker = (lat: number, lng: number) => {
    const DG = (window as any).DG;
    if (!mapInstance.current) return;

    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
    } else {
      markerRef.current = DG.marker([lat, lng]).addTo(mapInstance.current);
    }

    mapInstance.current.setView([lat, lng], 15);
  };

  const fetchSuggestions = async (text: string) => {
    if (!text.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await fetch(
        `https://catalog.api.2gis.com/3.0/suggests?q=${encodeURIComponent(
          text
        )}&key=${API_KEY}&region_id=152`
      );
      const data = await res.json();
      if (data.result?.items) {
        setSuggestions(
          data.result.items.map((item: any) => ({
            id: item.id,
            name: item.name,
            full_name: item.full_name || item.name,
            point: item.point,
          }))
        );
      }
    } catch (err) {
      console.error("2GIS suggest error:", err);
    }
  };

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://catalog.api.2gis.com/3.0/items/geocode?lat=${lat}&lon=${lng}&key=YOUR_API_KEY`
      );
      const data = await res.json();
      return data?.result?.items?.[0]?.full_name || "Unknown address";
    } catch {
      return "Unknown address";
    }
  };
  const handleSelectSuggestion = (s: Suggestion) => {
    placeMarker(s.point.lat, s.point.lon);
    setQuery(s.full_name);
    setSuggestions([]);
    setSelectedAddress(s.full_name);

    onSelect({ lat: s.point.lat, lng: s.point.lon, address: s.full_name });
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            fetchSuggestions(e.target.value);
          }}
          placeholder="Search address or shop name..."
          className="border rounded-md px-3 py-2 w-full"
        />
        {suggestions.length > 0 && (
          <ul className="absolute z-10 bg-white border rounded-md w-full max-h-40 overflow-y-auto">
            {suggestions.map((s) => (
              <li
                key={s.id}
                onClick={() => handleSelectSuggestion(s)}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              >
                {s.full_name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div ref={mapRef} className="w-full h-64 rounded-md border" />

      {selectedAddress && (
        <p className="text-sm text-gray-700">
          📍 Selected: <span className="font-medium">{selectedAddress}</span>
        </p>
      )}
    </div>
  );
};

export default ShopAddressPicker;
