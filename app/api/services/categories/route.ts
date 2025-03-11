import { NextRequest, NextResponse } from 'next/server';
import { 
  createBusinessServiceCategory,
  updateBusinessServiceCategory
} from '@/app/owner/business-profiles/actions';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { business_id, name, description } = body;
    
    if (!business_id || !name) {
      return NextResponse.json(
        { error: 'Business ID and name are required' },
        { status: 400 }
      );
    }
    
    const result = await createBusinessServiceCategory({
      business_id,
      name,
      description: description || undefined,
    });
    
    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true, data: result.data });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, description } = body;
    
    if (!id || !name) {
      return NextResponse.json(
        { error: 'Category ID and name are required' },
        { status: 400 }
      );
    }
    
    const result = await updateBusinessServiceCategory(id, {
      name,
      description: description || undefined,
    });
    
    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true, data: result.data });
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 