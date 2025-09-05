import { useEffect, useRef, useState } from "react";
import { BrowserQRCodeReader } from "@zxing/browser";
import type { IScannerControls } from "@zxing/browser";
import { CheckCircle, ChevronLeft, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { acceptOrder, getScanData } from "../api/seller";

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
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const onResult = async (res: TypeScanData) => {
    try {
      const data = await getScanData(res.id);
      setScannedData(data);
      setShowPreview(true);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch order details. Please try again.");
    }
  };

  const handleAccept = async () => {
    try {
      await acceptOrder(scannedData?.id!);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setScannedData(null);
        setShowPreview(false);
      }, 2000);
    } catch (err) {
      console.error(err);
      setError("Failed to accept the order. Please try again.");
    }
  };

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
      } catch {
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
        .decodeFromVideoDevice("", videoRef.current, (result, error, controls) => {
          if (result && !scannedData) {
            try {
              onResult(JSON.parse(result.getText()));
            } catch {
              setError("Invalid QR Code format.");
              console.log(error);
            }
          }
          if (!controlsRef.current) {
            controlsRef.current = controls;
          }
        })
        .catch((err) => {
          console.error("QR Scanner init error:", err);
          setError("Failed to initialize camera.");
        });
    }

    return () => {
      controlsRef.current?.stop();
    };
  }, [cameraAllowed, scannedData]);

  return (
    <div className="w-full h-screen flex flex-col bg-black text-white relative overflow-hidden">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 flex items-center gap-2 px-3 py-2 bg-black/60 rounded-full text-white z-20"
      >
        <ChevronLeft className="w-5 h-5" />
        <span className="text-sm font-medium">Back</span>
      </button>


      {success && (
        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-6 text-center">
          <CheckCircle className="w-16 h-16 text-green-400 mb-4" />
          <h2 className="text-lg font-bold">Order Confirmed!</h2>
        </div>
      )}

      {/* Camera View */}
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
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Dark overlay with hole */}
        <div className="absolute inset-0 bg-black/70">
          <div className="absolute left-1/2 top-1/2 w-64 h-64 -translate-x-1/2 -translate-y-1/2 bg-transparent outline outline-[9999px] outline-black/70" />
        </div>

        {/* Corner borders */}
        <div className="absolute w-64 h-64 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
          {["top-0 left-0", "top-0 right-0", "bottom-0 left-0", "bottom-0 right-0"].map(
            (pos, i) => (
              <span
                key={i}
                className={`absolute ${pos} w-10 h-10 border-4 border-primaryColor`}
                style={{
                  borderTop: i < 2 ? "4px solid var(--primaryColor)" : "none",
                  borderBottom: i >= 2 ? "4px solid var(--primaryColor)" : "none",
                  borderLeft: i % 2 === 0 ? "4px solid var(--primaryColor)" : "none",
                  borderRight: i % 2 === 1 ? "4px solid var(--primaryColor)" : "none",
                }}
              />
            )
          )}
        </div>
      </div>
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

      {/* Error Overlay */}
      {error && (
        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-6 text-center">
          <XCircle className="w-16 h-16 text-red-500 mb-4" />
          <h2 className="text-lg font-bold mb-2">Something went wrong</h2>
          <p className="text-sm text-gray-300 mb-4">{error}</p>
          <button
            onClick={() => setError(null)}
            className="px-6 py-3 bg-red-500 rounded-xl font-medium text-white shadow-lg hover:bg-red-500/90 transition"
          >
            Close
          </button>
        </div>
      )}

      {/* Result Preview */}
      {showPreview && scannedData && (
        <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center p-6 text-center">
          <CheckCircle className="w-16 h-16 text-green-400 mb-4" />
          <h2 className="text-xl font-bold mb-4">Order Found</h2>

          <div className="bg-white text-black rounded-2xl p-4 w-full max-w-md text-left space-y-3 shadow-lg">
            <div>
              <span className="font-semibold">Customer:</span>{" "}
              {scannedData.username}
            </div>
            <div>
              <span className="font-semibold">Product:</span>{" "}
              {scannedData.product_name}
            </div>
            <div>
              <span className="font-semibold">Shop:</span>{" "}
              {scannedData.shop_name}
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={handleAccept}
              className="px-6 py-3 bg-primaryColor rounded-xl font-medium text-white shadow-lg hover:bg-primaryColor/90 transition"
            >
              Confirm
            </button>
            <button
              onClick={() => {
                setShowPreview(false);
                setScannedData(null);
              }}
              className="px-6 py-3 bg-red-500 rounded-xl font-medium text-white shadow-lg hover:bg-red-500/90 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
