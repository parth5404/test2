import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verify } from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import ProfileEditor from '@/components/ProfileEditor';

async function getUser() {
  const cookieStore = cookies();
  const token = cookieStore.get('token');

  if (!token) {
    return null;
  }

  try {
    const decoded = verify(token.value, process.env.JWT_SECRET);
    await connectDB();
    return await User.findById(decoded.userId);
  } catch (error) {
    console.error('Auth error:', error);
    return null;
  }
}

export default async function DashboardPage() {
  const user = await getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">Creator Dashboard</h1>
        <p className="text-gray-600 mb-8">Welcome back, {user.name}!</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Quick Stats */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Quick Stats</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <span className="text-2xl font-bold text-orange-600">₹{user.totalDonations || 0}</span>
                <p className="text-sm text-gray-600 mt-1">Total Earnings</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <span className="text-2xl font-bold text-orange-600">{user.supporters?.length || 0}</span>
                <p className="text-sm text-gray-600 mt-1">Supporters</p>
              </div>
            </div>
          </div>

          {/* Profile Status */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Profile Status</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Profile Completion</span>
                <span className="text-sm font-medium text-orange-600">
                  {calculateProfileCompletion(user)}%
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div 
                  className="bg-orange-600 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${calculateProfileCompletion(user)}%` }}
                ></div>
              </div>
              <ProfileEditor user={user} className="mt-4" />
            </div>
          </div>
        </div>

        {/* Goals Section */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Funding Goals</h2>
            <button className="text-sm text-orange-600 hover:text-orange-700 font-medium">
              Add New Goal
            </button>
          </div>
          
          {user.goals && user.goals.length > 0 ? (
            <div className="space-y-6">
              {user.goals.map((goal, index) => (
                <div key={index} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-900">{goal.title}</h3>
                    <span className="text-sm text-gray-500">
                      ₹{goal.current} of ₹{goal.amount}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5 mb-2">
                    <div
                      className="bg-orange-600 h-2.5 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min((goal.current / goal.amount) * 100, 100)}%`
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No goals set yet</p>
              <p className="text-sm mt-2">Set your first funding goal to engage supporters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function calculateProfileCompletion(user) {
  const fields = [
    user.name,
    user.bio,
    user.image,
    user.socialLinks?.twitter,
    user.socialLinks?.instagram,
    user.socialLinks?.website
  ];
  
  const filledFields = fields.filter(field => field).length;
  return Math.round((filledFields / fields.length) * 100);
}
