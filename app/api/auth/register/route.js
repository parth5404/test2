import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  try {
    // Connect to database
    try {
      await connectDB();
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }
    
    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('Request parsing error:', parseError);
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }

    const { username, email, password, name } = body;

    // Validate required fields
    if (!username || !email || !password || !name) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    try {
      const userExists = await User.findOne({ 
        $or: [{ email }, { username }] 
      });

      if (userExists) {
        return NextResponse.json(
          { error: userExists.email === email ? 'Email already registered' : 'Username already taken' },
          { status: 400 }
        );
      }
    } catch (checkError) {
      console.error('User check error:', checkError);
      return NextResponse.json(
        { error: 'Error checking existing user' },
        { status: 500 }
      );
    }

    // Create user
    let user;
    try {
      user = await User.create({
        username,
        email,
        password,
        name
      });
    } catch (createError) {
      console.error('User creation error:', createError);
      if (createError.name === 'ValidationError') {
        const validationErrors = Object.values(createError.errors).map(err => err.message);
        return NextResponse.json(
          { error: validationErrors.join(', ') },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: 'Error creating user' },
        { status: 500 }
      );
    }

    // Create token
    let token;
    try {
      token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
    } catch (tokenError) {
      console.error('Token creation error:', tokenError);
      return NextResponse.json(
        { error: 'Error creating authentication token' },
        { status: 500 }
      );
    }

    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Registration successful'
    });

    // Set cookie
    try {
      response.cookies.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 // 7 days
      });
    } catch (cookieError) {
      console.error('Cookie setting error:', cookieError);
      return NextResponse.json(
        { error: 'Error setting authentication cookie' },
        { status: 500 }
      );
    }

    return response;

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed: ' + error.message },
      { status: 500 }
    );
  }
}
