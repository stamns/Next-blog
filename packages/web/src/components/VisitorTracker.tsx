'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

// 生成或获取访客ID
function getVisitorId(): string {
  if (typeof window === 'undefined') return '';
  
  let visitorId = localStorage.getItem('visitor_id');
  if (!visitorId) {
    visitorId = 'v_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem('visitor_id', visitorId);
  }
  return visitorId;
}

// 获取或创建会话ID
function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  
  const sessionKey = 'session_id';
  const sessionTimeKey = 'session_time';
  const sessionTimeout = 30 * 60 * 1000; // 30分钟超时
  
  const now = Date.now();
  const lastTime = parseInt(sessionStorage.getItem(sessionTimeKey) || '0');
  let sessionId = sessionStorage.getItem(sessionKey);
  
  // 如果会话超时或不存在，创建新会话
  if (!sessionId || (now - lastTime > sessionTimeout)) {
    sessionId = 's_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
    sessionStorage.setItem(sessionKey, sessionId);
  }
  
  sessionStorage.setItem(sessionTimeKey, now.toString());
  return sessionId;
}

// 解析User-Agent获取设备信息
function getDeviceInfo() {
  if (typeof window === 'undefined') return {};
  
  const ua = navigator.userAgent;
  
  // 浏览器检测
  let browser = 'unknown';
  let browserVer = '';
  if (ua.includes('Firefox/')) {
    browser = 'Firefox';
    browserVer = ua.match(/Firefox\/(\d+)/)?.[1] || '';
  } else if (ua.includes('Edg/')) {
    browser = 'Edge';
    browserVer = ua.match(/Edg\/(\d+)/)?.[1] || '';
  } else if (ua.includes('Chrome/')) {
    browser = 'Chrome';
    browserVer = ua.match(/Chrome\/(\d+)/)?.[1] || '';
  } else if (ua.includes('Safari/') && !ua.includes('Chrome')) {
    browser = 'Safari';
    browserVer = ua.match(/Version\/(\d+)/)?.[1] || '';
  }
  
  // 操作系统检测
  let os = 'unknown';
  let osVer = '';
  if (ua.includes('Windows')) {
    os = 'Windows';
    osVer = ua.match(/Windows NT (\d+\.\d+)/)?.[1] || '';
  } else if (ua.includes('Mac OS X')) {
    os = 'macOS';
    osVer = ua.match(/Mac OS X (\d+[._]\d+)/)?.[1]?.replace('_', '.') || '';
  } else if (ua.includes('Linux')) {
    os = 'Linux';
  } else if (ua.includes('Android')) {
    os = 'Android';
    osVer = ua.match(/Android (\d+)/)?.[1] || '';
  } else if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) {
    os = 'iOS';
    osVer = ua.match(/OS (\d+)/)?.[1] || '';
  }
  
  // 设备类型检测
  let device = 'desktop';
  if (/Mobile|Android|iPhone|iPod/.test(ua)) {
    device = 'mobile';
  } else if (/iPad|Tablet/.test(ua)) {
    device = 'tablet';
  }
  
  return {
    browser,
    browserVer,
    os,
    osVer,
    device,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
}

// 获取UTM参数
function getUtmParams() {
  if (typeof window === 'undefined') return {};
  
  const params = new URLSearchParams(window.location.search);
  return {
    utmSource: params.get('utm_source') || undefined,
    utmMedium: params.get('utm_medium') || undefined,
    utmCampaign: params.get('utm_campaign') || undefined,
  };
}

// 发送追踪数据
async function sendTrackingData(data: any) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
    await fetch(`${apiUrl}/api/analytics/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      keepalive: true, // 确保页面关闭时也能发送
    });
  } catch (error) {
    console.error('Tracking error:', error);
  }
}

export function VisitorTracker() {
  const pathname = usePathname();
  const enterTimeRef = useRef<number>(Date.now());
  const lastPathRef = useRef<string>('');
  const sessionIdRef = useRef<string>('');

  useEffect(() => {
    // 初始化
    const visitorId = getVisitorId();
    sessionIdRef.current = getSessionId();
    const deviceInfo = getDeviceInfo();
    const utmParams = getUtmParams();

    // 发送页面浏览事件
    const trackPageView = () => {
      enterTimeRef.current = Date.now();
      
      sendTrackingData({
        visitorId,
        sessionId: sessionIdRef.current,
        path: pathname,
        title: document.title,
        referer: document.referrer || undefined,
        ...deviceInfo,
        ...utmParams,
        eventType: 'pageview',
      });
    };

    // 发送页面离开事件
    const trackPageLeave = () => {
      const duration = Math.floor((Date.now() - enterTimeRef.current) / 1000);
      const scrollDepth = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );

      sendTrackingData({
        visitorId,
        sessionId: sessionIdRef.current,
        path: lastPathRef.current || pathname,
        eventType: 'pageleave',
        duration,
        scrollDepth: isNaN(scrollDepth) ? 0 : Math.min(100, scrollDepth),
      });
    };

    // 页面变化时
    if (lastPathRef.current && lastPathRef.current !== pathname) {
      trackPageLeave();
    }
    
    lastPathRef.current = pathname;
    trackPageView();

    // 页面关闭/隐藏时发送离开事件
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        trackPageLeave();
      }
    };

    const handleBeforeUnload = () => {
      trackPageLeave();
      // 发送会话结束事件
      sendTrackingData({
        visitorId,
        sessionId: sessionIdRef.current,
        path: pathname,
        eventType: 'session_end',
      });
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [pathname]);

  return null; // 不渲染任何内容
}
