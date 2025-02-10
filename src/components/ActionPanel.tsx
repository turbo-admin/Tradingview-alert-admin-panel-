import React from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { Check, X } from "lucide-react";

interface ActionPanelProps {
  onAccept?: (values: { sl: string; tp1: string; tp2: string }) => void;
  onReject?: () => void;
  isLoading?: boolean;
  initialValues?: {
    sl?: number;
    tp1?: number;
    tp2?: number;
  };
}

const ActionPanel = ({
  onAccept = () => {},
  onReject = () => {},
  isLoading = false,
  initialValues = {},
}: ActionPanelProps) => {
  const [values, setValues] = React.useState({
    sl: initialValues?.sl?.toString() || "",
    tp1: initialValues?.tp1?.toString() || "",
    tp2: initialValues?.tp2?.toString() || "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAccept = () => {
    onAccept(values);
  };

  return (
    <Card className="w-full h-[200px] bg-background border-t p-4 flex flex-col gap-4">
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-muted-foreground block mb-2">
                Stop Loss
              </label>
              <Input
                type="text"
                name="sl"
                value={values.sl}
                onChange={handleInputChange}
                placeholder="Enter SL"
                className="w-full"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground block mb-2">
                Take Profit 1
              </label>
              <Input
                type="text"
                name="tp1"
                value={values.tp1}
                onChange={handleInputChange}
                placeholder="Enter TP1"
                className="w-full"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground block mb-2">
                Take Profit 2
              </label>
              <Input
                type="text"
                name="tp2"
                value={values.tp2}
                onChange={handleInputChange}
                placeholder="Enter TP2"
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-4">
        <Button
          variant="destructive"
          onClick={onReject}
          disabled={isLoading}
          className="w-32"
        >
          <X className="mr-2 h-4 w-4" />
          Reject
        </Button>
        <Button
          variant="default"
          onClick={handleAccept}
          disabled={isLoading}
          className="w-32"
        >
          <Check className="mr-2 h-4 w-4" />
          Accept
        </Button>
      </div>
    </Card>
  );
};

export default ActionPanel;
