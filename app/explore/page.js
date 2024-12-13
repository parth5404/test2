import Link from 'next/link';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

async function getCreators() {
  await connectDB();
  const creators = await User.find({})
    .select('username name bio image')
    .sort({ createdAt: -1 })
    .limit(50);
  return creators;
}

export default async function ExplorePage() {
  const creators = await getCreators();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-gray-900">Explore Creators</h1>
        <p className="text-gray-600 mb-8">Discover amazing creators and support their work</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {creators.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600 text-lg">No creators found yet</p>
              <p className="text-gray-500 mt-2">Be the first to join!</p>
            </div>
          ) : (
            creators.map((creator) => (
              <Link 
                key={creator._id} 
                href={`/${creator.username}`}
                className="block group"
              >
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-orange-200">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img
                        src={creator.image || '/default-avatar.png'}
                        alt={creator.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-gray-100 group-hover:border-orange-200 transition-colors"
                      />
                      <div className="absolute inset-0 rounded-full bg-orange-500 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                        {creator.name}
                      </h2>
                      <p className="text-gray-500">@{creator.username}</p>
                    </div>
                  </div>
                  {creator.bio && (
                    <p className="mt-4 text-gray-600 line-clamp-2 group-hover:text-gray-900 transition-colors">
                      {creator.bio}
                    </p>
                  )}
                  <div className="mt-4 text-sm text-orange-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    View Profile →
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
