import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load .env
dotenv.config({ path: resolve(__dirname, '../../../../.env.local') });
dotenv.config({ path: resolve(__dirname, '../../../.env') });
dotenv.config({ path: resolve(__dirname, '../../.env') });

async function seed() {
  console.log('Starting seed process...');
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('DATABASE_URL is not set in environment.');
    process.exit(1);
  }

  const pool = new Pool({ connectionString });
  const db = drizzle(pool, { schema });

  const defaultPassword = await bcrypt.hash('password123', 10);

  const ajayAbey = {
    email: 'ajayabey@gmail.com',
    password: defaultPassword,
    name: 'Ajay Abey',
    values: '#Equity # Compassion #Love',
    professionalProfile:
      'Ajay is the Director of Centre for Sustainable Built and Natural Environment (C.S.B.N.E). founded by Prof Eugene Pandala. Ajay has Master Degree in Urban Design from National University of Singapore and has fifteen years of Architecture, Master planning and Urban Design experience in India and Singapore. Ajay is actively involved in managing the office affairs of CSBNE and has been responsible for design and delivery of projects in various regions.',
    geographicalSpread: 'Across India mainly in Kerala',
    interventions: '“A happy healthy Living Environment”-',
    problem:
      'Housing is a vital need for all citizens. Consequently, the provision of housing became a key policy aim for all succeeding governments in India, both central and state. The development of low-cost housing projects for affordable living is a government priority. In India, affordable housing is rapidly gaining prominence. Numerous housing projects are being developed in various nations around the world, but do they meet the demands of low-income individuals?',
    systemChange:
      "For the poor, a home is more than simply a roof over their heads; it's also a springboard to better circumstances and greater independence. Construction of low-cost housing with low-cost building materials and resource friendly methods expands access to housing for all segments of society through addressing the social ,environmental and economic factors.",
    systemImpact:
      'The necessity of the hour is a new method of building that preserves ecosystem balance through the use of an all-inclusive, resource-saving, environment-improving construction typology. In the context of Kerala, the prototype is designed to meet the desires and requirements of a single-family household. This prototype was created in accordance with the principles of Resource Conservation, Environmental Protection and Upgrading, Ecologically Sensitive Design, and Cost-Effective Design.',
    abundance:
      'Creative energy to strategise new methods and systems\nKnots within to untie\nTo eliminate unnecessary stress upon perfections and achievements\nSelf transformation challenges for self\nLess stressful days and a better quality life',
    helpNeeded:
      'Encouragement to continue current niche research methods\nSystems transformations\nMore emphasis on resource conservation, cost-cutting, and a healthy living environment, notwithstanding their limitations, But will promote a shift towards a more sustainable planet.',
  };

  const otherNames = [
    'Aditi Kundu',
    'Ajay Nayak',
    'Ashish Mehta',
    'Gulan Kripalani',
    'Keyur Sharda',
    'Lokesh Ohri',
    'Mandvi Kulshreshtha',
    'Neera Kathuria',
    'Pinaki Roy',
    'Rishi Aggarwal',
    'Sanjib Kundu',
    'Satrajit Sanyal',
    'Shruti Kulkarni',
    'Tanisha Tewari',
  ];

  const seedData = [ajayAbey];

  otherNames.forEach((name) => {
    seedData.push({
      ...ajayAbey,
      name,
      email: `${name.toLowerCase().replace(/\s+/g, '')}@example.com`,
    });
  });

  // Generate 15 more dummy records to reach the 30 count requirement.
  for (let i = 1; i <= 15; i++) {
    seedData.push({
      ...ajayAbey,
      name: `Person Placeholder ${i}`,
      email: `placeholder${i}@example.com`,
    });
  }

  try {
    await db
      .insert(schema.users)
      .values(seedData)
      .onConflictDoNothing({ target: schema.users.email });
    console.log(`Successfully seeded ${seedData.length} records!`);
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await pool.end();
  }
}

seed();
