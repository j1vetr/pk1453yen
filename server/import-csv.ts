import { readFileSync } from 'fs';
import { parse } from 'csv-parse/sync';
import { storage } from './storage';
import { turkishToSlug } from '@shared/utils';

async function importCSV() {
  try {
    console.log('📦 Starting CSV import...');
    
    const csvContent = readFileSync('data/posta_kodlari.csv', 'utf-8');
    
    const records = parse(csvContent, {
      columns: false,
      skip_empty_lines: true,
      delimiter: ';',
      trim: true,
      bom: true,
    });
    
    console.log(`📊 Found ${records.length - 1} records (excluding header)`);
    
    const postalCodesToInsert: any[] = [];
    let successCount = 0;
    let failedCount = 0;
    
    for (let i = 1; i < records.length; i++) {
      const row = records[i];
      
      try {
        const [il, ilce, semt, mahalle, pk] = row;
        
        if (!il || !ilce || !mahalle || !pk) {
          console.log(`⚠️  Skipping row ${i + 1}: Missing data`);
          failedCount++;
          continue;
        }
        
        postalCodesToInsert.push({
          il: il.trim(),
          ilce: ilce.trim(),
          semt: semt?.trim() || null,
          mahalle: mahalle.trim(),
          pk: pk.trim(),
          ilSlug: turkishToSlug(il.trim()),
          ilceSlug: turkishToSlug(ilce.trim()),
          mahalleSlug: turkishToSlug(mahalle.trim()),
        });
        
        successCount++;
        
        if (successCount % 10000 === 0) {
          console.log(`✅ Processed ${successCount} records...`);
        }
      } catch (error: any) {
        console.log(`❌ Error on row ${i + 1}: ${error.message}`);
        failedCount++;
      }
    }
    
    console.log(`💾 Inserting ${postalCodesToInsert.length} records into database...`);
    await storage.insertBulkPostalCodes(postalCodesToInsert);
    
    console.log(`✅ Import completed!`);
    console.log(`   Success: ${successCount}`);
    console.log(`   Failed: ${failedCount}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Import failed:', error);
    process.exit(1);
  }
}

importCSV();
