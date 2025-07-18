import { Link } from "react-router-dom";

export default function NotFoundPage ()  {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12 text-text-primary">
      <h1 className="text-6xl font-bold text-button-primary mb-4">404</h1>
      <p className="text-2xl font-semibold text-text-primary mb-8 text-center">
        Oops! The page you're looking for doesn't exist.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-button-primary text-button-text rounded-lg shadow-md hover:bg-button-primary-hover transition duration-300 text-lg font-medium"
      >
        Go to Homepage
      </Link>
    </div>
  );
};

