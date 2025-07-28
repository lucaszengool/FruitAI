import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    { 
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'FruitAI Freshness Analyzer'
    },
    { status: 200 }
  );
}