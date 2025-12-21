import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

// 清除缓存 API
// POST /api/revalidate
// Body: { path?: string, tag?: string, secret?: string }
export async function POST(request: NextRequest) {
  try {
    let body: { path?: string; tag?: string; secret?: string } = {};
    
    // 安全解析 body（可能为空）
    try {
      const text = await request.text();
      if (text) {
        body = JSON.parse(text);
      }
    } catch {
      // body 为空或解析失败，使用默认值
    }

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

    // 默认清除所有常用缓存
    revalidateTag('settings');
    revalidateTag('themes');
    revalidateTag('articles');
    revalidateTag('categories');
    revalidateTag('tags');
    revalidateTag('projects');
    revalidateTag('friend-links');
    revalidatePath('/', 'layout');
    
    return NextResponse.json({ success: true, revalidated: true, message: 'All cache cleared' });
  } catch (error) {
    console.error('Revalidate error:', error);
    return NextResponse.json({ success: false, error: 'Failed to revalidate' }, { status: 500 });
  }
}
