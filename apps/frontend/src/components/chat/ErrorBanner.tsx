interface ErrorBannerProps {
  message: string;
}

export function ErrorBanner({ message }: ErrorBannerProps) {
  return (
    <div role="alert">
      <p>{message}</p>
    </div>
  );
}
