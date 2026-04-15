import { ReactNode } from "react";
import { FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface EmptyStateCardProps {
  title: string;
  buttonText?: string;
  onButtonClick?: () => void;
  icon?: ReactNode;
  mainMessage: string;
  subMessage: string;
}

export function EmptyStateCard({
  title,
  buttonText,
  onButtonClick,
  icon,
  mainMessage,
  subMessage,
}: EmptyStateCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>{title}</CardTitle>
        {buttonText && onButtonClick ? (
          <Button variant="link" onClick={onButtonClick}>
            {buttonText}
          </Button>
        ) : null}
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center py-8 text-center">
        {icon ? (
          <div className="mb-4">{icon}</div>
        ) : (
          <FileText className="h-12 w-12 text-gray-400 mb-4" />
        )}
        <p className="text-lg font-medium text-gray-900">{mainMessage}</p>
        <p className="text-sm text-gray-500 mt-1">{subMessage}</p>
      </CardContent>
    </Card>
  );
}
