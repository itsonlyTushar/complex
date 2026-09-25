type CenteredMessageProps = {
  eyebrow?: string | null;
  title: string;
  message: string;
  action?: React.ReactNode;
};

// Full-screen state for when there's nothing to order from: closed, or a bad QR code.
export function CenteredMessage({ eyebrow, title, message, action }: CenteredMessageProps) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="flex flex-col gap-1">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="text-h1">{title}</h1>
        <p className="text-body text-fg-secondary">{message}</p>
      </div>
      {action}
    </div>
  );
}
