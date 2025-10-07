import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb-mock';
import MockVaultItem from '@/models/MockVaultItem';
import { getUserFromRequest } from '@/lib/auth';
import { encryptVaultItem, VaultItemData } from '@/lib/crypto';

// GET - Fetch all vault items for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();
    
    const vaultItems = await MockVaultItem.find({ userId: user.userId });

    return NextResponse.json({
      items: vaultItems,
    });
  } catch (error) {
    console.error('Error fetching vault items:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create a new vault item
export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { vaultData, userPassword } = await request.json();

    // Validate required fields
    if (!vaultData || !userPassword) {
      return NextResponse.json(
        { error: 'Vault data and user password are required' },
        { status: 400 }
      );
    }

    // Validate vault data structure
    const requiredFields = ['title', 'username', 'password', 'url', 'notes'];
    for (const field of requiredFields) {
      if (!(field in vaultData)) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    await dbConnect();

    // Encrypt the vault data
    const encryptedData = encryptVaultItem(vaultData as VaultItemData, userPassword);

    // Create the vault item
    const vaultItem = await MockVaultItem.create({
      userId: user.userId,
      encryptedData,
    });

    return NextResponse.json({
      message: 'Vault item created successfully',
      item: {
        id: vaultItem._id,
        createdAt: vaultItem.createdAt,
        updatedAt: vaultItem.updatedAt,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating vault item:', error);
    return NextResponse.json(
      { error: 'Failed to create vault item' },
      { status: 500 }
    );
  }
}