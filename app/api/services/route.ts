import { NextRequest, NextResponse } from 'next/server';
import { 
  createBusinessService,
  updateBusinessService
} from '@/app/owner/business-profiles/actions';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      business_id, 
      name, 
      category_id, 
      description, 
      price, 
      price_description, 
      is_featured 
    } = body;
    
    if (!business_id || !name) {
      return NextResponse.json(
        { error: 'Business ID and name are required' },
        { status: 400 }
      );
    }
    
    const result = await createBusinessService({
      business_id,
      name,
      category_id: category_id || undefined,
      description: description || undefined,
      price,
      price_description: price_description || undefined,
      is_featured: is_featured || false,
    });
    
    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true, data: result.data });
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      id, 
      name, 
      category_id, 
      description, 
      price, 
      price_description, 
      is_featured 
    } = body;
    
    if (!id || !name) {
      return NextResponse.json(
        { error: 'Service ID and name are required' },
        { status: 400 }
      );
    }
    
    const result = await updateBusinessService(id, {
      name,
      category_id: category_id || undefined,
      description: description || undefined,
      price,
      price_description: price_description || undefined,
      is_featured: is_featured || false,
    });
    
    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true, data: result.data });
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 