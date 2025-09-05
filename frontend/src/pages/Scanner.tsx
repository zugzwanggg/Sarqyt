import { useEffect, useRef, useState } from "react";
import { BrowserQRCodeReader } from "@zxing/browser";
import type { IScannerControls } from "@zxing/browser";
import { CheckCircle, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { acceptOrder,getScanData } from "../api/seller";

type TypeScanData = {
  id: number;
  pickup_code: string;
  username: string;
  email: string;
  product_name: string;
  shop_name: string;
};

export default function QRScanner() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const navigate = useNavigate();

  const [scannedData, setScannedData] = useState<TypeScanData | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [cameraAllowed, setCameraAllowed] = useState<boolean | null>(null);

  const onResult = async (res:TypeScanData) => {
    try {
      const data = await getScanData(res.id)
      setScannedData(data);
      setShowPreview(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAccept =async () => {
    try {
      await acceptOrder(scannedData?.id!);
      setScannedData(null);
      setShowPreview(false);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const checkPermission = async () => {
      try {
        const status = await (navigator as any).permissions.query({
          name: "camera",
        });
        if (status.state === "granted" || status.state === "prompt") {
          setCameraAllowed(true);
        } else {
          setCameraAllowed(false);
        }
      } catch (err) {
        setCameraAllowed(true);
      }
    };
    checkPermission();
  }, []);

  useEffect(() => {
    if (!cameraAllowed || scannedData) return;

    const codeReader = new BrowserQRCodeReader();

    if (videoRef.current) {
      codeReader
        .decodeFromVideoDevice(
          "",
          videoRef.current,
          (result, error, controls) => {
            if (result && !scannedData) {
              onResult(JSON.parse(result.getText()));
            }
            if (!controlsRef.current) {
              controlsRef.current = controls;
            }
            if (error) console.warn(error);
          }
        )
        .catch((err) => console.error("QR Scanner init error:", err));
    }

    return () => {
      controlsRef.current?.stop();
    };
  }, [cameraAllowed, scannedData]);

  return (
    <div className="w-full h-screen flex flex-col bg-black text-white relative">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 p-4 mb-4"
      >
        <ChevronLeft className="w-5 h-5" />
        <span className="text-sm font-medium">Back</span>
      </button>


      {cameraAllowed ? (
        <div className="relative flex-1 flex items-center justify-center">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            muted
            playsInline
          />

          {!showPreview && (
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border-4 border-primaryColor w-60 h-60 rounded-lg shadow-[0_0_20px_rgba(0,0,0,0.5)]" />
          )}
        </div>
      ) : cameraAllowed === false ? (
        <div className="flex-1 flex items-center justify-center text-gray-400">
          Camera access denied. Please enable it in settings.
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-400">
          Checking permissions...
        </div>
      )}

      {showPreview && scannedData && (
        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-6 text-center">
          <CheckCircle className="w-16 h-16 text-green-400 mb-4" />
          <h2 className="text-xl font-bold mb-4">Order Found</h2>

          <div className="bg-white text-black rounded-2xl p-4 w-full max-w-md text-left space-y-2">
            {/* <p>
              <span className="font-semibold">Pickup Code:</span>{" "}
              {scannedData.pickup_code}
            </p> */}
            <p>
              <span className="font-semibold">Customer:</span>{" "}
              {scannedData.username}
            </p>
            <p>
              <span className="font-semibold">Product:</span>{" "}
              {scannedData.product_name}
            </p>
            <p>
              <span className="font-semibold">Shop:</span>{" "}
              {scannedData.shop_name}
            </p>
          </div>

          <div className="flex items-center justify-center">
            <button
              onClick={() =>handleAccept()}
              className="mt-6 px-6 py-3 bg-primaryColor rounded-xl font-medium text-white shadow-lg hover:bg-primaryColor/90 transition"
            >
              Accept
            </button>
            <button
              onClick={() => {
                setShowPreview(false);
                setScannedData(null);
              }}
              className="mt-6 px-6 py-3 bg-red-500 rounded-xl font-medium text-white shadow-lg hover:bg-red-500/90 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
