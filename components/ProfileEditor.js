'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfileEditor({ user }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    bio: user?.bio || '',
    socialLinks: {
      twitter: user?.socialLinks?.twitter || '',
      instagram: user?.socialLinks?.instagram || '',
      website: user?.socialLinks?.website || ''
    },
    goals: user?.goals || []
  });

  const handleInputChange = (e, field, goalIndex = null, goalField = null) => {
    if (goalIndex !== null && goalField !== null) {
      // Handle goal field updates
      const updatedGoals = [...formData.goals];
      updatedGoals[goalIndex] = {
        ...updatedGoals[goalIndex],
        [goalField]: goalField === 'amount' ? Number(e.target.value) : e.target.value
      };
      setFormData({ ...formData, goals: updatedGoals });
    } else if (field.startsWith('social.')) {
      // Handle social links updates
      const socialField = field.split('.')[1];
      setFormData({
        ...formData,
        socialLinks: {
          ...formData.socialLinks,
          [socialField]: e.target.value
        }
      });
    } else {
      // Handle other fields
      setFormData({ ...formData, [field]: e.target.value });
    }
  };

  const addGoal = () => {
    setFormData({
      ...formData,
      goals: [
        ...formData.goals,
        { title: '', amount: 1000, current: 0 }
      ]
    });
  };

  const removeGoal = (index) => {
    const updatedGoals = formData.goals.filter((_, i) => i !== index);
    setFormData({ ...formData, goals: updatedGoals });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/profile/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update profile');
      }

      setIsEditing(false);
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isEditing) {
    return (
      <button
        onClick={() => setIsEditing(true)}
        className="text-orange-600 hover:text-orange-700 font-medium text-sm"
      >
        Edit Profile
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      {/* Bio Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Bio
        </label>
        <textarea
          value={formData.bio}
          onChange={(e) => handleInputChange(e, 'bio')}
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          placeholder="Tell your supporters about yourself..."
        />
      </div>

      {/* Social Links */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-700">Social Links</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Twitter</label>
            <input
              type="url"
              value={formData.socialLinks.twitter}
              onChange={(e) => handleInputChange(e, 'social.twitter')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="https://twitter.com/username"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Instagram</label>
            <input
              type="url"
              value={formData.socialLinks.instagram}
              onChange={(e) => handleInputChange(e, 'social.instagram')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="https://instagram.com/username"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Website</label>
            <input
              type="url"
              value={formData.socialLinks.website}
              onChange={(e) => handleInputChange(e, 'social.website')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="https://yourwebsite.com"
            />
          </div>
        </div>
      </div>

      {/* Goals Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium text-gray-700">Funding Goals</h3>
          <button
            type="button"
            onClick={addGoal}
            className="text-sm text-orange-600 hover:text-orange-700 font-medium"
          >
            Add Goal
          </button>
        </div>
        
        {formData.goals.map((goal, index) => (
          <div key={index} className="p-4 bg-gray-50 rounded-md space-y-3">
            <div className="flex justify-between items-start">
              <div className="flex-grow">
                <input
                  type="text"
                  value={goal.title}
                  onChange={(e) => handleInputChange(e, null, index, 'title')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Goal title"
                />
              </div>
              <button
                type="button"
                onClick={() => removeGoal(index)}
                className="ml-2 text-red-600 hover:text-red-700"
              >
                Remove
              </button>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Target Amount (₹)</label>
              <input
                type="number"
                value={goal.amount}
                onChange={(e) => handleInputChange(e, null, index, 'amount')}
                min="100"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
        <button
          type="button"
          onClick={() => setIsEditing(false)}
          className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
