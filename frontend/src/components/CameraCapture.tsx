import React, { useRef, useCallback, useState } from 'react';
import Webcam from 'react-webcam';
import { Camera, ImagePlus, RefreshCcw } from 'lucide-react';

interface Props {
    onCapture: (file: File) => void;
}

export const CameraCapture: React.FC<Props> = ({ onCapture }) => {
    const webcamRef = useRef<Webcam>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imageSrc, setImageSrc] = useState<string | null>(null);

    const capture = useCallback(() => {
        const image = webcamRef.current?.getScreenshot();
        if (image) {
            setImageSrc(image);
            // Convert base64 to file
            fetch(image)
                .then(res => res.blob())
                .then(blob => {
                    const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
                    onCapture(file);
                });
        }
    }, [webcamRef, onCapture]);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImageSrc(e.target?.result as string);
            };
            reader.readAsDataURL(file);
            onCapture(file);
        }
    };

    const retake = () => setImageSrc(null);

    return (
        <div className="flex flex-col items-center bg-white rounded-2xl shadow-sm p-4 w-full max-w-md mx-auto">
            {!imageSrc ? (
                <div className="w-full relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 flex flex-col items-center justify-center border-2 border-dashed border-gray-300">
                    <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        videoConstraints={{ facingMode: "environment" }}
                        className="w-full h-full object-cover absolute inset-0"
                    />
                </div>
            ) : (
                <div className="w-full relative aspect-[4/3] rounded-xl overflow-hidden shadow-inner">
                    <img src={imageSrc} alt="Captured meal" className="w-full h-full object-cover" />
                </div>
            )}

            <div className="mt-6 flex gap-4 w-full">
                {!imageSrc ? (
                    <>
                        <button
                            onClick={capture}
                            className="flex-1 flex items-center justify-center gap-2 bg-nature-600 hover:bg-nature-700 text-white font-semibold py-3 px-4 rounded-xl transition-all"
                        >
                            <Camera size={20} />
                            <span>Capture Meal</span>
                        </button>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 font-semibold py-3 px-4 rounded-xl transition-all"
                        >
                            <ImagePlus size={20} />
                        </button>
                        <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
                    </>
                ) : (
                    <button
                        onClick={retake}
                        className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 font-semibold py-3 px-4 rounded-xl transition-all"
                    >
                        <RefreshCcw size={20} />
                        <span>Retake Photo</span>
                    </button>
                )}
            </div>
        </div>
    );
};
