import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

// 清除缓存 API
// POST /api/revalidate
// Body: { path?: string, tag?: string, secret?: string }
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { path, tag, secret } = body;

    // 简单的密钥验证（可选，防止滥用）
    const expectedSecret = process.env.REVALIDATE_SECRET;
    if (expectedSecret && secret !== expectedSecret) {
      return NextResponse.json({ success: false, error: 'Invalid secret' }, { status: 401 });
    }

    if (tag) {
      // 按标签清除缓存
      revalidateTag(tag);
      return NextResponse.json({ success: true, revalidated: true, tag });
    }

    if (path) {
      // 按路径清除缓存
      revalidatePath(path);
      return NextResponse.json({ success: true, revalidated: true, path });
    }

    // 默认清除首页和设置相关缓存
    revalidateTag('settings');
    revalidateTag('themes');
    revalidatePath('/');
    
    return NextResponse.json({ success: true, revalidated: true, message: 'All settings cache cleared' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to revalidate' }, { status: 500 });
  }
}
