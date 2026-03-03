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

  const aditiKundu = {
    email: 'aditi_kundu@rediffmail.com',
    password: defaultPassword,
    name: 'Aditi Kundu',
    values: '#integrity #compassion #equality',
    professionalProfile:
      'I am trained as an architect; however, teaching is my forte. I am inclined towards social sciences in architecture such as History and Sociology. Besides that, I like design. From designing building to graphics and craft-based products, I find it all very interesting and challenging.',
    geographicalSpread: 'New Delhi, Noida (UP)',
    interventions:
      'Educating the young minds comes with a lot of responsibility. It is imperative that the students are familiarised with the value system associated with architecture and allied subjects. The objective should be to inculcate a thinking environment rather than preparing a workforce ready for the race.',
    problem: '',
    systemChange: 'Better learning environment, better students, better tomorrow',
    systemImpact: '',
    abundance:
      'Integrity\nKnots within to untie\nSelf transformation challenges for self\nBe more patient. Not to lose my cool. Develop the ability to think from others perspective',
    helpNeeded:
      'Self-development by increasing my knowledge base to come up with better arguments\nSystems transformations\nBetter learning environment, better students, better tomorrow',
  };

  const otherNames = [
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

  const seedData = [
    ajayAbey,
    aditiKundu,
    {
      name: 'Ajay Nayak',
      email: 'ajay_nayak@example.com',
      password: defaultPassword,
      role: 'Individual',
      expertise: 'Environment',
      values: '#Sustainability #GreenLiving',
      professionalProfile:
        'Ajay is an environmental consultant specializing in sustainable urban development.',
      geographicalSpread: 'Maharashtra, Gujarat',
      abundance: 'Knowledge of eco-friendly materials',
      helpNeeded: 'Networking with local government bodies',
    },
    {
      name: 'Ashish Mehta',
      email: 'ashish_mehta@example.com',
      password: defaultPassword,
      role: 'Volunteer',
      expertise: 'Education',
      values: '#Mentorship #Growth',
      professionalProfile:
        'Ashish has been mentoring students in underprivileged communities for over a decade.',
      geographicalSpread: 'Delhi NCR',
      abundance: 'Patience and teaching skills',
      helpNeeded: 'Educational resources and digital tools',
    },
    {
      name: 'Gulan Kripalani',
      email: 'gulan_k@example.com',
      password: defaultPassword,
      role: 'Organization',
      expertise: 'Healthcare',
      values: '#Compassion #Access',
      professionalProfile:
        'Gulan leads an NGO focused on bringing primary healthcare to rural villages.',
      geographicalSpread: 'Rajasthan',
      abundance: 'Strong volunteer network',
      helpNeeded: 'Medical supplies and funding',
    },
    {
      name: 'Keyur Sharda',
      email: 'keyur_sharda@example.com',
      password: defaultPassword,
      role: 'Donor',
      expertise: 'Education',
      values: '#Legacy #Giving',
      professionalProfile:
        'Keyur is a philanthropist dedicated to improving literacy rates across India.',
      geographicalSpread: 'West Bengal, Odisha',
      abundance: 'Financial resources and strategic vision',
      helpNeeded: 'Trusted local implementation partners',
    },
    {
      name: 'Lokesh Ohri',
      email: 'lokesh_ohri@example.com',
      password: defaultPassword,
      role: 'Individual',
      expertise: 'History & Heritage',
      values: '#Culture #Preservation',
      professionalProfile:
        'An anthropologist and historian working on documenting minority cultures in the Himalayas.',
      geographicalSpread: 'Uttarakhand',
      abundance: 'Historical knowledge and archival access',
      helpNeeded: 'Digital documentation experts',
    },
    {
      name: 'Mandvi Kulshreshtha',
      email: 'mandvi_k@example.com',
      password: defaultPassword,
      role: 'Individual',
      expertise: 'Social Justice',
      values: '#Equity #Reform',
      professionalProfile:
        "Mandvi is a human rights advocate with a focus on women's legal rights.",
      geographicalSpread: 'Uttar Pradesh',
      abundance: 'Legal expertise and advocacy skills',
      helpNeeded: 'Paralegal support and community outreach',
    },
    {
      name: 'Neera Kathuria',
      email: 'neera_kathuria@example.com',
      password: defaultPassword,
      role: 'Volunteer',
      expertise: 'Mental Health',
      values: '#Wellness #Healing',
      professionalProfile: 'A counselor providing psychological support to trauma survivors.',
      geographicalSpread: 'Punjab, Haryana',
      abundance: 'Emotional intelligence and counseling techniques',
      helpNeeded: 'Safe spaces for group therapy',
    },
    {
      name: 'Pinaki Roy',
      email: 'pinaki_roy@example.com',
      password: defaultPassword,
      role: 'Individual',
      expertise: 'Public Policy',
      values: '#Data #Transparency',
      professionalProfile:
        'Pinaki works with data to influence urban planning and transportation policies.',
      geographicalSpread: 'Karnataka, Telangana',
      abundance: 'Analytical skills and data visualization',
      helpNeeded: 'Access to government planning departments',
    },
    {
      name: 'Rishi Aggarwal',
      email: 'rishi_aggarwal@example.com',
      password: defaultPassword,
      role: 'Individual',
      expertise: 'Waste Management',
      values: '#CircularEconomy #ZeroWaste',
      professionalProfile:
        "Rishi is an urban activist working to fix Mumbai's waste management systems.",
      geographicalSpread: 'Mumbai',
      abundance: 'Systemic thinking and deep local knowledge',
      helpNeeded: 'Technology for tracking waste flows',
    },
    {
      name: 'Sanjib Kundu',
      email: 'sanjib_kundu@example.com',
      password: defaultPassword,
      role: 'Volunteer',
      expertise: 'Arts & Crafts',
      values: '#Creativity #Heritage',
      professionalProfile:
        'Sanjib promotes traditional terracotta art from Bankura to global markets.',
      geographicalSpread: 'West Bengal',
      abundance: 'Artistic vision and craft connections',
      helpNeeded: 'E-commerce and marketing support',
    },
    {
      name: 'Satrajit Sanyal',
      email: 'satrajit_sanyal@example.com',
      password: defaultPassword,
      role: 'Individual',
      expertise: 'Journalism',
      values: '#Truth #Accountability',
      professionalProfile:
        'An investigative reporter focusing on rural development and governance.',
      geographicalSpread: 'East India',
      abundance: 'Writing skills and investigative networks',
      helpNeeded: 'Legal protection and secure communication tools',
    },
    {
      name: 'Shruti Kulkarni',
      email: 'shruti_k@example.com',
      password: defaultPassword,
      role: 'Individual',
      expertise: 'Technology for Good',
      values: '#Innovation #Efficiency',
      professionalProfile:
        'Shruti builds open-source tools for agricultural supply chain transparency.',
      geographicalSpread: 'Karnataka',
      abundance: 'Coding skills and product management',
      helpNeeded: 'Field testers and agricultural experts',
    },
    {
      name: 'Tanisha Tewari',
      email: 'tanisha_t@example.com',
      password: defaultPassword,
      role: 'Volunteer',
      expertise: 'Animal Welfare',
      values: '#Kindness #Protection',
      professionalProfile: 'Tanisha manages a rescue shelter for stray animals in suburban Delhi.',
      geographicalSpread: 'Delhi NCR',
      abundance: 'Veterinary connections and safe housing',
      helpNeeded: 'Volunteers for foster care programs',
    },
  ];

  try {
    // Clear existing users to ensure clean seed data for the 15 names
    await db.delete(schema.users);
    console.log('Cleared existing users.');

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
