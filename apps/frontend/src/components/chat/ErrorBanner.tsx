import styles from "./ErrorBanner.module.css";

interface ErrorBannerProps {
  message: string;
}

export function ErrorBanner({ message }: ErrorBannerProps) {
  return (
    <div className={styles.banner} role="alert">
      <span className={styles.icon} aria-hidden="true">
        !
      </span>
      <p className={styles.message}>{message}</p>
    </div>
  );
}
