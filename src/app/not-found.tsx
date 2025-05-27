import Link from "next/link";

export default function NotFound() {
  return (
    <div className="text-center py-[140px]">
      <h1 className="text-8xl font-bold">404</h1>
      <h2 className="mt-4 text-2xl">Page not found</h2>
      <p className="mt-2 text-lg font-semibold">
        The page you are looking for does not exist.
      </p>
      <Link
        href="/"
        className="mt-6 rounded block w-fit mx-auto bg-primary py-2 px-6 text-white font-semibold"
      >
        Back to Home
      </Link>
    </div>
  );
}
