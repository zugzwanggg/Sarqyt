import { useState } from "react";
import { useTranslation } from "react-i18next";

const steps = [
  {
    img: "/onboarding-1.svg",
    titleKey: "onboarding.step1.title",
    descriptionKey: "onboarding.step1.description",
  },
  {
    img: "/onboarding-2.svg",
    titleKey: "onboarding.step2.title",
    descriptionKey: "onboarding.step2.description",
  },
  {
    img: "/onboarding-3.svg",
    titleKey: "onboarding.step3.title",
    descriptionKey: "onboarding.step3.description",
  },
];

type Props = {
  onFinish: () => void;
};

const Onboarding = ({ onFinish }: Props) => {
  const [currentStep, setCurrentStep] = useState(0);
  const { t } = useTranslation();
  const { img, titleKey, descriptionKey } = steps[currentStep];

  const nextStep = () => {
    if (currentStep === steps.length - 1) {
      handleSkip();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    onFinish();
  };

  return (
    <div className="fixed z-50 w-full h-full top-0 left-0 bg-white px-5 py-10 flex flex-col justify-between gap-4">
      <button onClick={handleSkip} className="text-gray-500 text-right">
        {t("onboarding.skip")}
      </button>

      <div className="text-center">
        <img className="w-52 mx-auto mb-5" src={img} alt={img.replace(".svg", "")} />
        <h2 className="font-bold text-primaryColor text-2xl">{t(titleKey)}</h2>
        <p className="opacity-80 text-blackColor text-sm">{t(descriptionKey)}</p>
      </div>

      <ul className="absolute left-1/2 -translate-x-1/2 bottom-40 flex items-center justify-center gap-4">
        {steps.map((_, i) => (
          <li
            key={i}
            onClick={() => setCurrentStep(i)}
            className={`w-3 h-3 rounded-full ${
              currentStep === i ? "bg-primaryColor" : "border border-primaryColor"
            }`}
          />
        ))}
      </ul>

      <div className="flex items-center justify-between">
        {currentStep > 0 && (
          <button className="w-full text-left text-primaryColor font-bold" onClick={prevStep}>
            {t("onboarding.back")}
          </button>
        )}
        <button className="text-right w-full text-primaryColor font-bold" onClick={nextStep}>
          {t("onboarding.next")}
        </button>
      </div>
    </div>
  );
};

export default Onboarding;