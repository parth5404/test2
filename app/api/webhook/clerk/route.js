import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req) {
  try {
    const body = await req.json();
    const { type, data } = body;

    await connectDB();

    switch (type) {
      case 'user.created':
        const { email, username, name, image } = data;
        
        // Check if user already exists
        const existingUser = await User.findOne({ 
          $or: [{ email }, { username }] 
        });
        
        if (existingUser) {
          return NextResponse.json({
            success: false,
            message: 'User already exists'
          }, { status: 400 });
        }

        // Create new user
        const newUser = new User({
          email,
          username,
          name: name || username,
          image: image || null,
          createdAt: new Date(),
          updatedAt: new Date()
        });

        await newUser.save();
        
        return NextResponse.json({
          success: true,
          message: 'User created successfully',
          user: newUser
        });

      case 'user.updated':
        const { userId, updates } = data;
        
        const updatedUser = await User.findByIdAndUpdate(
          userId,
          { 
            ...updates,
            updatedAt: new Date()
          },
          { new: true }
        );

        if (!updatedUser) {
          return NextResponse.json({
            success: false,
            message: 'User not found'
          }, { status: 404 });
        }

        return NextResponse.json({
          success: true,
          message: 'User updated successfully',
          user: updatedUser
        });

      case 'user.deleted':
        const { userId: deleteUserId } = data;
        
        const deletedUser = await User.findByIdAndDelete(deleteUserId);

        if (!deletedUser) {
          return NextResponse.json({
            success: false,
            message: 'User not found'
          }, { status: 404 });
        }

        return NextResponse.json({
          success: true,
          message: 'User deleted successfully'
        });

      default:
        return NextResponse.json({
          success: false,
          message: 'Unsupported event type'
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Webhook Error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: error.message
    }, { status: 500 });
  }
}
