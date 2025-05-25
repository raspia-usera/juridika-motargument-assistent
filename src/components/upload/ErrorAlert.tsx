
import React from 'react';

interface ErrorAlertProps {
  error: string | null;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ error }) => {
  if (!error) return null;

  return (
    <div className="alert alert-error mb-6">
      <strong>Anslutningsfel:</strong> {error}
    </div>
  );
};

export default ErrorAlert;
