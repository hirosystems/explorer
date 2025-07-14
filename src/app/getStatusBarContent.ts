import { CMS_URL } from '../common/constants/env';
import { IncidentContent } from '../common/types/incidents';

export async function getStatusBarContent(): Promise<IncidentContent | null> {
  const timestamp = new Date().toISOString();
  const nodeEnv = process.env.NODE_ENV || 'unknown';
  const nextRuntime = process.env.NEXT_RUNTIME || 'nodejs';

  console.log(`🚨 getStatusBarContent called at ${timestamp}`);
  console.log(`   Environment: NODE_ENV=${nodeEnv}, RUNTIME=${nextRuntime}`);
  console.log(`   Cache expected: ${nodeEnv === 'production' ? 'YES' : 'NO (not production)'}`);

  if (!CMS_URL) {
    console.log(`   ⚠️ No CMS_URL configured, returning null`);
    return Promise.resolve(null);
  }

  console.log(`   📡 Fetching from: ${CMS_URL}`);
  console.log(`   ⏱️ Cache config: revalidate=240s (4 minutes)`);

  const startTime = Date.now();

  try {
    const response = await fetch(CMS_URL, {
      next: { revalidate: 60 * 4 }, // Revalidate every 4 minutes
    });

    const endTime = Date.now();
    const duration = endTime - startTime;

    console.log(`   ✅ Response received in ${duration}ms`);
    console.log(
      `   ${duration < 100 ? '🟢 FAST (likely cached)' : '🟡 SLOW (likely fresh fetch)'}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`   📊 CMS data received:`, { hasData: !!data, type: typeof data });
    
    return data;
  } catch (error) {
    console.log(`   ❌ getStatusBarContent failed:`, error);
    console.log(`   🔄 Returning null as fallback`);
    return null;
  }
}
