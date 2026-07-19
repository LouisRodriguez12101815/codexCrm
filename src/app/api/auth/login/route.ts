import { NextResponse } from 'next/server';import { setSession } from '@/lib/auth';
export async function POST(req:Request){ const f=await req.formData(); if(f.get('email')===process.env.DEMO_EMAIL && f.get('password')===process.env.DEMO_PASSWORD){ await setSession(); return NextResponse.redirect(new URL('/leads',req.url)); } return NextResponse.redirect(new URL('/?error=login',req.url)); }
