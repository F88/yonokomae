/**
 * Manual test to verify delay functionality works in practice
 * Run this file manually: npx tsx src/yk/repo/core/test-delays.ts
 */
import { DemoJaBattleReportRepository } from '../demo/demo-ja/repositories.demo-ja';
import { getBattleReportRepository } from './repository-provider';

async function testDelays() {
  console.log('🧪 Testing BattleReportRepository Delays\n');

  // Test 1: Manual delay
  console.log('1️⃣ Manual 2-second delay...');
  const start1 = Date.now();
  const manualRepo = new DemoJaBattleReportRepository({ delay: 2000 });
  await manualRepo.generateReport();
  const elapsed1 = Date.now() - start1;
  console.log(`✅ Completed in ${elapsed1}ms (expected: ~2000ms)\n`);

  // Test 2: Range delay
  console.log('2️⃣ Range delay (1-3 seconds)...');
  const start2 = Date.now();
  const rangeRepo = new DemoJaBattleReportRepository({
    delay: { min: 1000, max: 3000 },
  });
  await rangeRepo.generateReport();
  const elapsed2 = Date.now() - start2;
  console.log(`✅ Completed in ${elapsed2}ms (expected: 1000-3000ms)\n`);

  // Test 3: Provider auto-delay (historical-evidence mode)
  console.log('3️⃣ Auto delay via provider (historical-evidence mode)...');
  const start3 = Date.now();
  const providerRepo = await getBattleReportRepository({
    id: 'historical-research',
    title: 'HISTORICAL RESEARCH',
    description: 'Test mode',
    enabled: true,
    srLabel: 'Historical research test mode',
  });
  await providerRepo.generateReport();
  const elapsed3 = Date.now() - start3;
  console.log(`✅ Completed in ${elapsed3}ms (expected: 1000-2000ms)\n`);

  // Test 4 removed: API mode no longer supported for battle reports.

  console.log('🎉 Delay testing completed!');
}

// Only run if this file is executed directly
if (require.main === module) {
  testDelays().catch(console.error);
}

export { testDelays };
