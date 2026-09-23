import { ErrorPage } from "../../components/error-page";

export function NotFoundError() {
  return (
    <ErrorPage
      code="404"
      title="Page Not Found"
      message="The page you are looking for doesn't exist or has been moved to another location."
    />
  );
}
