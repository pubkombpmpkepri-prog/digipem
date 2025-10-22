import { Progress } from '@/components/ui/progress';

interface StepIndicatorProps {
  currentStep: number;
}

const steps = ['Biodata', 'Pertanyaan', 'Simpulan'];

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  const progressValue = ((currentStep - 1) / (steps.length -1)) * 100;

  return (
    <div className="w-full">
      <div className="mb-2 flex justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = currentStep >= stepNumber;
          return (
            <div
              key={step}
              className={`flex flex-col items-center font-medium ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors ${
                  isActive ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card'
                }`}
              >
                {stepNumber}
              </div>
              <p className="mt-1 text-xs sm:text-sm">{step}</p>
            </div>
          );
        })}
      </div>
      <Progress value={progressValue} className="h-2" />
    </div>
  );
}
