import { NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function PUT(req) {
  try {
    // Get token from cookies
    const cookieStore = cookies();
    const token = cookieStore.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = verify(token.value, process.env.JWT_SECRET);
    if (!decoded?.userId) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const { bio, socialLinks, goals } = await req.json();

    await connectDB();

    // Find user by decoded userId
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update user profile
    if (bio !== undefined) user.bio = bio;
    if (socialLinks !== undefined) user.socialLinks = socialLinks;
    if (goals !== undefined) user.goals = goals;
    user.updatedAt = new Date();

    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        name: user.name,
        username: user.username,
        email: user.email,
        bio: user.bio,
        socialLinks: user.socialLinks,
        goals: user.goals,
        image: user.image,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update profile' },
      { status: 500 }
    );
  }
}
