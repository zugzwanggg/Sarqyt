import { useEffect, useRef } from "react";
import { BrowserQRCodeReader } from "@zxing/browser";
import type {IScannerControls} from "@zxing/browser";
import { useNavigate } from "react-router-dom";




export default function QRScanner() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const nav = useNavigate();

  const onResult = async (res:string|number) => {
    nav('/')
    console.log(res);
  }

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
      <div>
        <video
          ref={videoRef}
          style={{ width: "100%", height: "100%"}}
          autoPlay
          muted
          playsInline
        />

        <span className="absolute flex items-center justify-center border-4 border-primaryColor w-60 h-60">
          {/* Square */}
        </span>
      </div>
    </div>
  );
}
