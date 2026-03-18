import { createI18nMiddleware } from 'fumadocs-core/i18n/middleware';
import { i18n } from '@/lib/i18n';
import { isMarkdownPreferred, rewritePath } from 'fumadocs-core/negotiation';
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';


const withI18n = createI18nMiddleware(i18n);

const { rewrite: rewriteLLM } = rewritePath('/docs{/*path}', '/llms.mdx/docs{/*path}');
export default function proxy(
  request: NextRequest,
  event: NextFetchEvent
) {
  if (isMarkdownPreferred(request)) {
    const result = rewriteLLM(request.nextUrl.pathname);
    if (result) {
      return NextResponse.rewrite(new URL(result, request.nextUrl));
    }
  }
  return withI18n(request, event);
}



export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  // You may need to adjust it to ignore static assets in `/public` folder
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};