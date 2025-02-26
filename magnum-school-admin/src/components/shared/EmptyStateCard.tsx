import { ReactNode } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';

interface EmptyStateCardProps {
  /**
   * The title displayed in the card header.
   */
  title: string;

  /**
   * Text for the button in the card header.
   */
  buttonText?: string;

  /**
   * Handler function to be called when the button is clicked.
   */
  onButtonClick?: () => void;

  /**
   * Optional icon to display in the empty state area.
   * Defaults to a <FileText /> icon if not provided.
   */
  icon?: ReactNode;

  /**
   * The main (bold) message displayed in the center of the card.
   */
  mainMessage: string;

  /**
   * The sub (lighter) message displayed below the main message.
   */
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
      {/* Card Header */}
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>{title}</CardTitle>
        {buttonText && onButtonClick && (
          <Button variant="link" onClick={onButtonClick}>
            {buttonText}
          </Button>
        )}
      </CardHeader>

      {/* Card Content */}
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
