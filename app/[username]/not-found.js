import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Creator Not Found</h2>
        <p className="text-gray-600 mb-8">
          The creator you're looking for doesn't exist or has changed their username.
        </p>
        <Link
          href="/explore"
          className="bg-chai-brown text-white px-6 py-3 rounded-full hover:bg-chai-light transition-colors"
        >
          Explore Creators
        </Link>
      </div>
    </div>
  );
}
