import { notFound } from 'next/navigation';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import DonateButton from '@/components/DonateButton';

async function getCreator(username) {
  await connectDB();
  const creator = await User.findOne({ username });
  if (!creator) return null;
  return creator;
}

export default async function CreatorProfile({ params }) {
  const creator = await getCreator(params.username);
  
  if (!creator) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="text-center mb-8">
          <img
            src={creator.image || '/default-avatar.png'}
            alt={creator.name}
            className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-orange-100"
          />
          <h1 className="text-3xl font-bold mb-2 text-gray-900">{creator.name}</h1>
          <p className="text-gray-600 mb-4">{creator.bio || 'No bio yet'}</p>
          
          {/* Social Links */}
          {creator.socialLinks && Object.keys(creator.socialLinks).length > 0 && (
            <div className="flex justify-center space-x-4 mb-4">
              {creator.socialLinks.twitter && (
                <a
                  href={creator.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-500 transition-colors"
                >
                  Twitter
                </a>
              )}
              {creator.socialLinks.instagram && (
                <a
                  href={creator.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-500 hover:text-pink-600 transition-colors"
                >
                  Instagram
                </a>
              )}
              {creator.socialLinks.website && (
                <a
                  href={creator.socialLinks.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Website
                </a>
              )}
            </div>
          )}
        </div>

        {/* Goals */}
        {creator.goals && creator.goals.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Goals</h2>
            <div className="space-y-4">
              {creator.goals.map((goal, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                  <h3 className="font-medium mb-3 text-gray-900">{goal.title}</h3>
                  <div className="w-full bg-gray-100 rounded-full h-2.5 mb-2">
                    <div
                      className="bg-orange-600 h-2.5 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min((goal.current / goal.amount) * 100, 100)}%`
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <p>₹{goal.current.toLocaleString('en-IN')} raised</p>
                    <p>Goal: ₹{goal.amount.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Donation Button */}
        <DonateButton creatorId={creator._id} creatorName={creator.name} />
      </div>
    </div>
  );
}
