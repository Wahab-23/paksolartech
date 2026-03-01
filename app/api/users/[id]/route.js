import { NextResponse } from 'next/server';
import {
  getUserById,
  updateUser,
  deleteUser
} from '@/app/models/user.model';

export async function GET(_, context) {
  try {
    const params = await context.params;
    const user = await getUserById(params.id);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, context) {
  try {
    const params = await context.params;
    const body = await request.json();

    await updateUser(params.id, body);

    return NextResponse.json({ message: 'User updated' });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(_, context) {
  try {
    const params = await context.params;
    await deleteUser(params.id);

    return NextResponse.json({ message: 'User deleted' });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
