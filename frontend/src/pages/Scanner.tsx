import { useEffect, useRef } from "react";
import { BrowserQRCodeReader } from "@zxing/browser";
import type {IScannerControls} from "@zxing/browser";


type QRScannerProps = {
  onResult: (text: string) => void;
};

export default function QRScanner({ onResult }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const controlsRef = useRef<IScannerControls | null>(null);

  useEffect(() => {
    const codeReader = new BrowserQRCodeReader();

    if (videoRef.current) {
      codeReader
        .decodeFromVideoDevice('', videoRef.current, (result, error, controls) => {
          if (result) {
            onResult(result.getText());
          }
          if (!controlsRef.current) {
            controlsRef.current = controls;
          }

          console.log(error);
        })
        .catch(err => console.error("QR Scanner init error:", err));
    }

    return () => {
      controlsRef.current?.stop();
    };
  }, [onResult]);

  return (
    <div className="w-full flex flex-col items-center">
      <video
        ref={videoRef}
        style={{ width: "100%", borderRadius: "12px" }}
        autoPlay
        muted
        playsInline
      />
    </div>
  );
}
