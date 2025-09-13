import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

interface ShopAddressPickerProps {
  value: { address: string; lat?: number; lng?: number };
  onChange: (val: { address: string; lat?: number; lng?: number }) => void;
}

const ShopAddressPicker = ({ value, onChange }: ShopAddressPickerProps) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState(value.address || "");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const marker = useRef<any>(null);

  const API_KEY = import.meta.env.VITE_2GIS_API_KEY;

  useEffect(() => {
    if (!query) return;

    const controller = new AbortController();
    const fetchSuggestions = async () => {
      try {
        const res = await fetch(
          `https://catalog.api.2gis.com/3.0/suggests?q=${encodeURIComponent(
            query
          )}&key=${API_KEY}`,
          { signal: controller.signal }
        );
        const data = await res.json();
        if (data?.result?.items) {
          setSuggestions(data.result.items);
        }
      } catch (err) {
        console.error("Suggest error:", err);
      }
    };

    fetchSuggestions();
    return () => controller.abort();
  }, [query]);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    // @ts-ignore
    window.DG.then((DG: any) => {
      mapInstance.current = DG.map(mapRef.current, {
        center: [47.0945, 51.923],
        zoom: 13,
      });

      marker.current = DG.marker([47.0945, 51.923]).addTo(mapInstance.current);

      mapInstance.current.on("click", (e: any) => {
        const { lat, lng } = e.latlng;
        marker.current.setLatLng([lat, lng]);
        onChange({ ...value, lat, lng });
      });
    });
  }, []);

  const handleSelect = (item: any) => {
    const addr = item.full_name || item.name;
    const lat = item.point?.lat;
    const lng = item.point?.lon;

    setQuery(addr);
    setSuggestions([]);
    onChange({ address: addr, lat, lng });

    if (mapInstance.current && lat && lng) {
      mapInstance.current.setView([lat, lng], 16);
      marker.current.setLatLng([lat, lng]);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm text-gray-600">
        {t("shopAddress.label")}
      </label>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t("shopAddress.placeholder")}
        className="border rounded-md w-full px-3 py-2"
      />
      {suggestions.length > 0 && (
        <ul className="border rounded-md bg-white max-h-48 overflow-y-auto">
          {suggestions.map((s) => (
            <li
              key={s.id}
              onClick={() => handleSelect(s)}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
            >
              {s.full_name || s.name}
            </li>
          ))}
        </ul>
      )}
      <div ref={mapRef} className="w-full h-64 rounded-md border" />
    </div>
  );
};

export default ShopAddressPicker;
