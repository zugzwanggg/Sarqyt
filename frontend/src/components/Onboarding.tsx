import {useState} from "react";

const steps = [
  {
    img: "/onboarding-1.svg",
    title: "How Sarqyt works",
    description: "We connect you with nearby cafés, shops, and bakeries offering unsold food - fresh, affordable, and saved from waste."
  },
  {
    img: "/onboarding-2.svg",
    title: "What’s in a Surprise Bag?",
    description: "You won’t know exactly what you get - that’s the fun part! All items are fresh, tasty, and saved from being thrown away."
  },
  {
    img: "/onboarding-3.svg",
    title: "What’s in a Surprise Bag?",
    description: "ou won’t know exactly what you get - that’s the fun part! All items are fresh, tasty, and saved from being thrown away."
  },
]

type Props = {
  onFinish: () => void;
}


const Onboarding = ({onFinish}:Props) => {
  const [currentStep, setCurrentStep] = useState(0);
  const {img, title, description} = steps[currentStep];

  const nextStep = () => {
    if (currentStep == 2) {
      handleSkip();
    }
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    }
  }

  const prevStep = () => {
    if (currentStep >= 0) {
      setCurrentStep(prev => prev - 1);
    }
  }

  const handleSkip = () => {
    onFinish();
  }

  return (
    <div className="fixed w-full h-full top-0 left-0 bg-white px-5 py-10 flex flex-col justify-between just gap-4">
      <button onClick={handleSkip} className="text-gray-500 text-right">
        Skip
      </button>


      <div className="text-center">
        <img className="w-52 mx-auto mb-5" src={img} alt={img.replace('.svg', '')} />
        <h2 className="font-bold text-primaryColor text-2xl">{title}</h2>
        <p className="opacity-80 text-blackColor text-sm">
          {description}
        </p>
      </div>

      <ul className="absolute left-1/2 -translate-x-1/2 bottom-40 flex items-center justify-center gap-4">
        {
          steps.map((_, i)=> {
            if (currentStep === i) {
              return <li onClick={()=>setCurrentStep(i)} className="w-3 h-3 bg-primaryColor rounded-full">

              </li>
            } else {
              return <li onClick={()=>setCurrentStep(i)} className="w-3 h-3  rounded-full border border-primaryColor">

              </li>
            }
          })
        }
        
      </ul>
    

      <div className="flex items-center justify-between">
        {
          currentStep > 0
          ?
          <button className="w-full text-left text-primaryColor font-bold" onClick={prevStep}>
            Back
          </button>
          :
          ''
        }
       
        <button className="text-right w-full text-primaryColor font-bold" onClick={nextStep}>
          Next
        </button>
      </div>

    </div>
  )
}

export default Onboarding