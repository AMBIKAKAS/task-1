import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb-mock';
import MockVaultItem from '@/models/MockVaultItem';
import { getUserFromRequest } from '@/lib/auth';
import { encryptVaultItem, VaultItemData } from '@/lib/crypto';

// PUT - Update a vault item
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
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

    await dbConnect();

    // Encrypt the updated vault data
    const encryptedData = encryptVaultItem(vaultData as VaultItemData, userPassword);

    // Update the vault item
    const vaultItem = await MockVaultItem.findOneAndUpdate(
      { _id: params.id, userId: user.userId },
      { encryptedData }
    );

    if (!vaultItem) {
      return NextResponse.json(
        { error: 'Vault item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Vault item updated successfully',
      item: {
        id: vaultItem._id,
        updatedAt: vaultItem.updatedAt,
      },
    });
  } catch (error) {
    console.error('Error updating vault item:', error);
    return NextResponse.json(
      { error: 'Failed to update vault item' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a vault item
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    // Find and delete the vault item
    const vaultItem = await MockVaultItem.findOneAndDelete({
      _id: params.id,
      userId: user.userId,
    });

    if (!vaultItem) {
      return NextResponse.json(
        { error: 'Vault item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Vault item deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting vault item:', error);
    return NextResponse.json(
      { error: 'Failed to delete vault item' },
      { status: 500 }
    );
  }
}