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
    } catch (parseError) {
      // body 为空或解析失败，使用默认值
      console.log('[Revalidate] Body parse info:', parseError instanceof Error ? parseError.message : 'empty body');
    }

    const { path, tag, secret } = body;

    // 简单的密钥验证（可选，防止滥用）
    const expectedSecret = process.env.REVALIDATE_SECRET;
    if (expectedSecret && secret !== expectedSecret) {
      console.log('[Revalidate] Invalid secret provided');
      return NextResponse.json({ success: false, error: 'Invalid secret' }, { status: 401 });
    }

    if (tag) {
      // 按标签清除缓存
      console.log('[Revalidate] Revalidating tag:', tag);
      revalidateTag(tag);
      return NextResponse.json({ success: true, revalidated: true, tag });
    }

    if (path) {
      // 按路径清除缓存
      console.log('[Revalidate] Revalidating path:', path);
      revalidatePath(path);
      return NextResponse.json({ success: true, revalidated: true, path });
    }

    // 默认清除所有常用缓存
    console.log('[Revalidate] Clearing all cache...');
    const tags = ['settings', 'themes', 'articles', 'categories', 'tags', 'projects', 'friend-links'];
    
    for (const t of tags) {
      try {
        revalidateTag(t);
        console.log('[Revalidate] Cleared tag:', t);
      } catch (tagError) {
        console.error('[Revalidate] Failed to clear tag:', t, tagError);
      }
    }
    
    try {
      revalidatePath('/', 'layout');
      console.log('[Revalidate] Cleared layout path');
    } catch (pathError) {
      console.error('[Revalidate] Failed to clear layout path:', pathError);
    }
    
    console.log('[Revalidate] All cache cleared successfully');
    return NextResponse.json({ success: true, revalidated: true, message: 'All cache cleared' });
  } catch (error) {
    console.error('[Revalidate] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: `Failed to revalidate: ${errorMessage}` }, { status: 500 });
  }
}
