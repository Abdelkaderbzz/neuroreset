"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { createTask, Task, Task } from "@/api";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(20);
  const [formData, setFormData] = useState({
    addictionType: "",
    duration: 0,
    severity: 0,
    triggers: "",
    goals: "",
  });

  const totalSteps = 5;

  const handleNext = async () => {
    if (step < totalSteps) {
      setStep(step + 1);
      setProgress(((step + 1) / totalSteps) * 100);
    } else {
      const prompt = `I am struggling with addiction to ${formData.addictionType}. My addiction severity is ${formData.severity} out of 10, and I have been dealing with it for ${formData.duration} years. My main goals are: ${formData.goals}. I also have specific triggers: ${formData.triggers}, which I want to avoid. Based on this information, generate a structured list of daily habits that can help me recover from my addiction, avoid my triggers, and achieve my goals.

The output should be in this JSON format:
[
    {
        "title": "Habit title",
        "description": "Detailed explanation of the habit and how it helps.",
        "time": "Scheduled time for the habit (e.g., 8:00 AM)",
        "priority": "Low/Medium/High"
    }
]
    Make sure the habits are practical, achievable, and relevant to my addiction recovery journey.
`;
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const {data} = await res.json();
      if(data){
        data.map(async (task: Task) => {
          await createTask(task).then(() => {
            console.log(`task created successfully: ${task.title}`);
          }).catch(error => {
            console.error(`Error creating task: ${task.title}`, error);
          })
        })
      }
      console.log(data);
      // Submit and redirect to dashboard
      router.push("/dashboard");
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setProgress(((step - 1) / totalSteps) * 100);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">
            Personalize Your Recovery Journey
          </h1>
          <p className="text-muted-foreground">
            Answer a few questions to help us create your personalized recovery
            plan.
          </p>
        </div>

        <div className="mb-6">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between mt-2 text-sm text-muted-foreground">
            <span>Getting Started</span>
            <span>
              {step} of {totalSteps}
            </span>
          </div>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>
              {step === 1 && "What are you seeking recovery from?"}
              {step === 2 && "How long have you been dealing with this?"}
              {step === 3 && "How would you rate its impact on your life?"}
              {step === 4 && "What are your main triggers?"}
              {step === 5 && "What are your recovery goals?"}
            </CardTitle>
            <CardDescription>
              {step === 1 &&
                "Select the option that best describes your situation."}
              {step === 2 && "This helps us understand your history."}
              {step === 3 &&
                "Rate from 1 (minimal impact) to 10 (severe impact)."}
              {step === 4 &&
                "Describe situations, emotions, or environments that trigger your addiction."}
              {step === 5 && "What do you hope to achieve through recovery?"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 1 && (
              <RadioGroup
                value={formData.addictionType}
                onValueChange={(value) => handleChange("addictionType", value)}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="alcohol" id="alcohol" />
                  <Label htmlFor="alcohol">Alcohol</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="drugs" id="drugs" />
                  <Label htmlFor="drugs">Drugs</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="gambling" id="gambling" />
                  <Label htmlFor="gambling">Gambling</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="technology" id="technology" />
                  <Label htmlFor="technology">Technology/Internet</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other">Other</Label>
                </div>
              </RadioGroup>
            )}

            {step === 2 && (
              <RadioGroup
                value={formData.duration.toString()}
                onValueChange={(value) =>
                  handleChange("duration", Number.parseInt(value))
                }
                className="space-y-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="0" id="less-than-year" />
                  <Label htmlFor="less-than-year">Less than 1 year</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1" id="one-to-three" />
                  <Label htmlFor="one-to-three">1-3 years</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="2" id="three-to-five" />
                  <Label htmlFor="three-to-five">3-5 years</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="3" id="five-to-ten" />
                  <Label htmlFor="five-to-ten">5-10 years</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="4" id="more-than-ten" />
                  <Label htmlFor="more-than-ten">More than 10 years</Label>
                </div>
              </RadioGroup>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Impact Level: {formData.severity}</Label>
                  <Slider
                    value={[formData.severity]}
                    min={1}
                    max={10}
                    step={1}
                    onValueChange={(value) =>
                      handleChange("severity", value[0])
                    }
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Minimal</span>
                    <span>Moderate</span>
                    <span>Severe</span>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <Textarea
                  placeholder="E.g., stress, certain friends, specific locations, emotions like boredom or anxiety..."
                  value={formData.triggers}
                  onChange={(e) => handleChange("triggers", e.target.value)}
                  rows={5}
                />
              </div>
            )}

            {step === 5 && (
              <div className="space-y-4">
                <Textarea
                  placeholder="E.g., maintain sobriety, improve relationships, develop healthy coping mechanisms..."
                  value={formData.goals}
                  onChange={(e) => handleChange("goals", e.target.value)}
                  rows={5}
                />
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 1}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button onClick={handleNext}>
              {step === totalSteps ? (
                <>
                  Complete
                  <Check className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
