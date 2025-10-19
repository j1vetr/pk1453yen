import { storage } from "./storage";
import { turkishToSlug } from "../shared/utils";
import { db } from "./db";
import { postalCodes } from "../shared/schema";
import { eq, and } from "drizzle-orm";

async function fixAllSlugs() {
  console.log("🔧 Starting slug fix...\n");

  try {
    // Get all unique mahalle combinations
    const allRecords = await db.select().from(postalCodes).execute();
    
    console.log(`📊 Total records: ${allRecords.length}`);
    
    let fixedCount = 0;
    let alreadyCorrectCount = 0;
    let errorCount = 0;
    
    // Group by unique combinations
    const uniqueCombos = new Map<string, { il: string; ilce: string; mahalle: string }>();
    
    for (const record of allRecords) {
      const key = `${record.il}|${record.ilce}|${record.mahalle}`;
      if (!uniqueCombos.has(key)) {
        uniqueCombos.set(key, {
          il: record.il,
          ilce: record.ilce,
          mahalle: record.mahalle,
        });
      }
    }
    
    console.log(`📋 Unique location combinations: ${uniqueCombos.size}\n`);
    
    // Fix each unique combination
    let processed = 0;
    for (const combo of Array.from(uniqueCombos.values())) {
      processed++;
      
      if (processed % 100 === 0) {
        console.log(`⏳ Progress: ${processed}/${uniqueCombos.size}`);
      }
      
      const correctIlSlug = turkishToSlug(combo.il);
      const correctIlceSlug = turkishToSlug(combo.ilce);
      const correctMahalleSlug = turkishToSlug(combo.mahalle);
      
      // Get current slugs
      const currentRecord = allRecords.find(
        (r: any) => r.il === combo.il && r.ilce === combo.ilce && r.mahalle === combo.mahalle
      );
      
      if (!currentRecord) continue;
      
      const needsUpdate = 
        currentRecord.ilSlug !== correctIlSlug ||
        currentRecord.ilceSlug !== correctIlceSlug ||
        currentRecord.mahalleSlug !== correctMahalleSlug;
      
      if (needsUpdate) {
        // Show what's being fixed
        if (currentRecord.mahalleSlug !== correctMahalleSlug) {
          console.log(`❌ Wrong: ${currentRecord.mahalleSlug}`);
          console.log(`✅ Fixed: ${correctMahalleSlug}`);
          console.log(`   (${combo.mahalle})\n`);
        }
        
        try {
          // Update all records with this combination
          await db
            .update(postalCodes)
            .set({
              ilSlug: correctIlSlug,
              ilceSlug: correctIlceSlug,
              mahalleSlug: correctMahalleSlug,
            })
            .where(
              and(
                eq(postalCodes.il, combo.il),
                eq(postalCodes.ilce, combo.ilce),
                eq(postalCodes.mahalle, combo.mahalle)
              )
            )
            .execute();
          
          fixedCount++;
        } catch (error) {
          console.error(`   ⚠️  Error updating: ${error}`);
          errorCount++;
        }
      } else {
        alreadyCorrectCount++;
      }
    }
    
    console.log("\n✅ Slug fix completed!");
    console.log(`   Fixed: ${fixedCount} location combinations`);
    console.log(`   Already correct: ${alreadyCorrectCount} location combinations`);
    console.log(`   Errors: ${errorCount}`);
    console.log(`   Total: ${uniqueCombos.size}\n`);
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error fixing slugs:", error);
    process.exit(1);
  }
}

fixAllSlugs();
