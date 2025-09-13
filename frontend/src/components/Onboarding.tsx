import { useState } from "react";
import { useTranslation } from "react-i18next";

const steps = [
  {
    img: "/images/step1-food-savings.png", // placeholder: a plate of food or food basket
    titleKey: "onboarding.step1.title",
    descriptionKey: "onboarding.step1.description",
  },
  {
    img: "/images/step2-surprise-food.png", // placeholder: wrapped meal or takeaway surprise
    titleKey: "onboarding.step2.title",
    descriptionKey: "onboarding.step2.description",
  },
  {
    img: "/images/step3-community.png", // placeholder: people/community icon, Kazakh elements
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
      onFinish();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  };

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col justify-between p-6">
      {/* Skip */}
      <div className="flex justify-end">
        <button
          onClick={onFinish}
          className="text-gray-500 hover:text-gray-700 transition font-medium"
        >
          {t("onboarding.skip")}
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col items-center text-center mt-10 space-y-6">
        <div className="w-64 h-64 bg-gray-100 rounded-xl overflow-hidden shadow-lg flex items-center justify-center">
          <img src={img} alt={titleKey} className="w-full h-full object-cover" />
        </div>
        <h2 className="text-3xl font-bold text-primaryColor">{t(titleKey)}</h2>
        <p className="text-gray-700 text-base md:text-lg max-w-md">{t(descriptionKey)}</p>
      </div>

      {/* Step Indicators */}
      <div className="flex justify-center mt-6 gap-3">
        {steps.map((_, index) => (
          <span
            key={index}
            onClick={() => setCurrentStep(index)}
            className={`w-4 h-4 rounded-full cursor-pointer transition-all ${
              currentStep === index
                ? "bg-primaryColor scale-125"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-10">
        {currentStep > 0 ? (
          <button
            onClick={prevStep}
            className="px-5 py-2 bg-gray-200 hover:bg-gray-300 rounded-full font-semibold transition"
          >
            {t("onboarding.back")}
          </button>
        ) : (
          <div />
        )}
        <button
          onClick={nextStep}
          className="px-5 py-2 bg-gradient-to-r from-primaryColor to-blue-500 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition"
        >
          {t("onboarding.next")}
        </button>
      </div>
    </div>
  );
};

export default Onboarding;