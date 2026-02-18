import { NextResponse } from 'next/server';
import {
  getUserById,
  updateUser,
  deleteUser
} from '@/models/user.model';

export async function GET(_, { params }) {
  try {
    const user = await getUserById(params.id);
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const body = await request.json();
    await updateUser(params.id, body);

    return NextResponse.json({
      message: 'User updated'
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(_, { params }) {
  try {
    await deleteUser(params.id);

    return NextResponse.json({
      message: 'User deleted'
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
