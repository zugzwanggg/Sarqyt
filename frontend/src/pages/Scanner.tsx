import { useEffect, useRef, useState } from "react";
import { BrowserQRCodeReader } from "@zxing/browser";
import { CheckCircle } from "lucide-react";
import type {IScannerControls} from "@zxing/browser";

export default function QRScanner() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const controlsRef = useRef<IScannerControls | null>(null);

  const [scannedData, setScannedData] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const onResult = async (res: string | number) => {
    setScannedData(res.toString());
    setShowPreview(true);
  };

  useEffect(() => {
    const codeReader = new BrowserQRCodeReader();

    if (videoRef.current) {
      codeReader
        .decodeFromVideoDevice(
          "",
          videoRef.current,
          (result, error, controls) => {
            if (result && !scannedData) {
              onResult(result.getText());
            }
            if (!controlsRef.current) {
              controlsRef.current = controls;
            }

            console.log(error);
            
          }
        )
        .catch((err) => console.error("QR Scanner init error:", err));
    }

    return () => {
      controlsRef.current?.stop();
    };
  }, [scannedData]);

  return (
    <div className="w-full h-screen flex flex-col bg-black text-white relative">
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

      {showPreview && scannedData && (
        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-6 text-center">
          <CheckCircle className="w-16 h-16 text-green-400 mb-4" />
          <h2 className="text-xl font-bold mb-2">QR Code Scanned</h2>
          <p className="mb-6 text-gray-300 break-words max-w-md">
            {scannedData || "Sample QR code data goes here..."}
          </p>

          <button
            onClick={() => {
              setShowPreview(false);
              setScannedData(null);
            }}
            className="px-6 py-3 bg-primaryColor rounded-xl font-medium text-white shadow-lg hover:bg-primaryColor/90 transition"
          >
            Accept
          </button>
        </div>
      )}
    </div>
  );
}
