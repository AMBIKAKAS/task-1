import { NextRequest, NextResponse } from 'next/server';
import { generatePassword, PasswordOptions } from '@/lib/crypto';

export async function POST(request: NextRequest) {
  try {
    const options: PasswordOptions = await request.json();

    // Validate options
    if (!options.length || options.length < 4 || options.length > 128) {
      return NextResponse.json(
        { error: 'Password length must be between 4 and 128 characters' },
        { status: 400 }
      );
    }

    // Generate password
    const password = generatePassword(options);

    return NextResponse.json({
      password,
    });
  } catch (error) {
    console.error('Error generating password:', error);
    return NextResponse.json(
      { error: 'Failed to generate password' },
      { status: 500 }
    );
  }
}