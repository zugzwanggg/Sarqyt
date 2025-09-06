import { useEffect, useRef, useState } from "react";
import { BrowserQRCodeReader } from "@zxing/browser";
import type { IScannerControls } from "@zxing/browser";
import { CheckCircle, ChevronLeft, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { completeOrder, getScanData } from "../api/seller";

export type TypeScanData = {
  id: number;
  quantity: number;
  total_price: string;
  status: string;
  payment_method: string;
  payment_status: string;
  pickup_code?: string;
  pickup_time?: string;
  created_at: string;
  updated_at?: string;

  sarqyt_id: number;
  sarqyt_title: string;
  sarqyt_image: string;
  discounted_price: string;
  original_price: string;

  shop_id: number;
  shop_name: string;
  shop_image: string;
  shop_address: string;

  username: string;
  email: string;
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

  const handleConfirm = async () => {
    try {
      await completeOrder(scannedData?.id!, scannedData?.pickup_code!);
      setShowPreview(false);
      setScannedData(null);
      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
      }, 2000);
    } catch (err) {
      console.error(err);
      setError("Failed to confirm the order. Please try again.");
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
    if (!cameraAllowed || scannedData || success) return;

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
  }, [cameraAllowed, scannedData, success]);

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

      {/* Success Overlay */}
      {success && (
        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-6 text-center z-30">
          <CheckCircle className="w-20 h-20 text-green-400 mb-4" />
          <h2 className="text-2xl font-bold">Order Confirmed!</h2>
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
              <svg className="absolute inset-0 w-full h-full">
                <defs>
                  <mask id="mask">
                    <rect width="100%" height="100%" fill="white" />
                    <rect
                      x="50%"
                      y="50%"
                      width="256"
                      height="256"
                      fill="black"
                      transform="translate(-128, -128)"
                    />
                  </mask>
                </defs>
                <rect
                  width="100%"
                  height="100%"
                  fill="black"
                  fillOpacity="0.4"
                  mask="url(#mask)"
                />
              </svg>
            
              <div className="absolute w-64 h-64 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 pointer-events-none">
                <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-[var(--primaryColor)] rounded-tl-xl" />
                <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-[var(--primaryColor)] rounded-tr-xl" />
                <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-[var(--primaryColor)] rounded-bl-xl" />
                <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-[var(--primaryColor)] rounded-br-xl" />
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
        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-6 text-center z-30">
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
        <div className="absolute inset-0 bg-white flex flex-col items-center justify-between z-20 text-gray-700">
          <div className="w-full max-w-md flex-1 p-6 overflow-y-auto">
            <img
              src={scannedData.sarqyt_image}
              alt={scannedData.sarqyt_title}
              className="w-full h-40 object-cover rounded-xl mb-4 shadow"
            />

            <h2 className="text-2xl font-bold mb-2">{scannedData.sarqyt_title}</h2>
            <p className="text-gray-500 mb-4">{scannedData.shop_name}</p>

            <div className="space-y-2 text-sm">
              <div><span className="font-semibold">Customer:</span> {scannedData.username}</div>
              <div><span className="font-semibold">Quantity:</span> {scannedData.quantity}</div>
              <div><span className="font-semibold">Total Price:</span> {scannedData.total_price}</div>
              <div><span className="font-semibold">Status:</span> {scannedData.status}</div>
              <div><span className="font-semibold">Payment:</span> {scannedData.payment_status} ({scannedData.payment_method})</div>
              <div><span className="font-semibold">Pickup Code:</span> {scannedData.pickup_code}</div>
              <div><span className="font-semibold">Pickup Time:</span> {scannedData.pickup_time || "—"}</div>
              <div><span className="font-semibold">Shop Address:</span> {scannedData.shop_address}</div>
            </div>
          </div>

          {/* Fixed bottom buttons */}
          <div className="w-full max-w-md flex gap-4 p-4 border-t bg-white">
            <button
              onClick={handleConfirm}
              className="flex-1 px-6 py-3 bg-primaryColor rounded-xl font-medium text-white shadow-lg hover:bg-primaryColor/90 transition"
            >
              Confirm
            </button>
            <button
              onClick={() => {
                setShowPreview(false);
                setScannedData(null);
              }}
              className="flex-1 px-6 py-3 bg-red-500 rounded-xl font-medium text-white shadow-lg hover:bg-red-500/90 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
