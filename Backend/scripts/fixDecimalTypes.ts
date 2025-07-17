import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

async function fixDecimalTypes() {
  try {
    await mongoose.connect(process.env.DB_URL || process.env.MONGODB_URI || 'mongodb://localhost:27017/feeshay');
    console.log('🔗 Connected to MongoDB');

    const db = mongoose.connection.db;
    
    // Fix Jobs collection
    console.log('🔧 Fixing Jobs collection...');
    await db!.collection('jobs').updateMany({}, [
      {
        $set: {
          budget_min: {
            $cond: {
              if: { $eq: [{ $type: "$budget_min" }, "decimal"] },
              then: { $toDouble: "$budget_min" },
              else: "$budget_min"
            }
          },
          budget_max: {
            $cond: {
              if: { $eq: [{ $type: "$budget_max" }, "decimal"] },
              then: { $toDouble: "$budget_max" },
              else: "$budget_max"
            }
          }
        }
      }
    ]);

    // Fix Proposals collection
    console.log('🔧 Fixing Proposals collection...');
    await db!.collection('proposals').updateMany({}, [
      {
        $set: {
          proposed_price: {
            $cond: {
              if: { $eq: [{ $type: "$proposed_price" }, "decimal"] },
              then: { $toDouble: "$proposed_price" },
              else: "$proposed_price"
            }
          }
        }
      }
    ]);

    // Fix Services collection
    console.log('🔧 Fixing Services collection...');
    await db!.collection('services').updateMany({}, [
      {
        $set: {
          price: {
            $cond: {
              if: { $eq: [{ $type: "$price" }, "decimal"] },
              then: { $toDouble: "$price" },
              else: "$price"
            }
          }
        }
      }
    ]);

    console.log('✅ Successfully converted all Decimal128 to Number types');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error fixing decimal types:', error);
    process.exit(1);
  }
}

fixDecimalTypes(); 