import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
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
      values: '#Sustainability #GreenLiving #Innovation',
      professionalProfile:
        'Ajay is an environmental consultant specializing in sustainable urban development. He has worked on numerous projects across India to integrate green technology into public infrastructure.',
      geographicalSpread: 'Maharashtra, Gujarat',
      interventions: 'Promoting passive cooling in urban housing.',
      problem:
        'Rapid urbanization in India often leads to energy-inefficient buildings that rely heavily on air conditioning.',
      systemChange: 'Shifting the construction industry towards climate-responsive design.',
      systemImpact: 'Reduction in urban heat island effect and lower energy consumption.',
      abundance: 'Knowledge of eco-friendly materials and green building certifications.',
      helpNeeded: 'Networking with local government bodies and policy makers.',
    },
    {
      name: 'Ashish Mehta',
      email: 'ashish_mehta@example.com',
      password: defaultPassword,
      values: '#Mentorship #Growth #Equity',
      professionalProfile:
        'Ashish has been mentoring students in underprivileged communities for over a decade. He believes that quality education is the strongest lever for social mobility.',
      geographicalSpread: 'Delhi NCR',
      interventions: 'Digital literacy workshops for youth.',
      problem:
        'The digital divide prevents children from low-income families from accessing modern educational resources.',
      systemChange: 'Equalizing access to digital learning tools.',
      systemImpact: 'Improved employability and self-reliance for community youth.',
      abundance: 'Patience and a large network of volunteer educators.',
      helpNeeded: 'Educational resources and affordable digital tools.',
    },
    {
      name: 'Gulan Kripalani',
      email: 'gulan_k@example.com',
      password: defaultPassword,
      values: '#Compassion #Access #PublicHealth',
      professionalProfile:
        'Gulan leads an NGO focused on bringing primary healthcare to rural villages. She has a background in social work and community health.',
      geographicalSpread: 'Rajasthan',
      interventions: 'Mobile health clinics and prenatal care.',
      problem: 'Rural areas often lack basic medical facilities within a reasonable distance.',
      systemChange: 'Decentralized healthcare delivery models.',
      systemImpact: 'Significantly lowered infant mortality rates in supported districts.',
      abundance: 'Strong volunteer network and community trust.',
      helpNeeded: 'Medical supplies and sustainable funding streams.',
    },
    {
      name: 'Keyur Sharda',
      email: 'keyur_sharda@example.com',
      password: defaultPassword,
      values: '#Legacy #Giving #StrategicAction',
      professionalProfile:
        'Keyur is a philanthropist dedicated to improving literacy rates across India. He focuses on scalable solutions that empower local teachers.',
      geographicalSpread: 'West Bengal, Odisha',
      interventions: 'Setting up community-led libraries.',
      problem: 'High dropout rates in primary schools due to lack of engaging reading materials.',
      systemChange: 'Cultivating a culture of reading outside the classroom.',
      systemImpact: 'Long-term increase in secondary school enrollment.',
      abundance: 'Financial resources and strategic vision for scale.',
      helpNeeded: 'Trusted local implementation partners and evaluators.',
    },
    {
      name: 'Lokesh Ohri',
      email: 'lokesh_ohri@example.com',
      password: defaultPassword,
      values: '#Culture #Preservation #Integrity',
      professionalProfile:
        'An anthropologist and historian working on documenting minority cultures in the Himalayas. Lokesh is passionate about oral histories.',
      geographicalSpread: 'Uttarakhand',
      interventions: 'Digitizing oral folk traditions.',
      problem: 'Traditional knowledge is being lost as younger generations migrate to cities.',
      systemChange: 'Validating cultural identity as a tool for community resilience.',
      systemImpact: 'Preservation of diverse languages and customs for future generations.',
      abundance: 'Historical knowledge and archival access.',
      helpNeeded: 'Digital documentation experts and audio equipment.',
    },
    {
      name: 'Mandvi Kulshreshtha',
      email: 'mandvi_k@example.com',
      password: defaultPassword,
      values: '#Equity #Reform #Justice',
      professionalProfile:
        "Mandvi is a human rights advocate with a focus on women's legal rights. She provides legal aid and conducts awareness campaigns.",
      geographicalSpread: 'Uttar Pradesh',
      interventions: 'Legal literacy camps for rural women.',
      problem: 'Lack of awareness about inheritance and protection laws among marginalized women.',
      systemChange: 'Empowering women through knowledge of their legal rights.',
      systemImpact: 'Increased legal reporting of domestic issues and property claims.',
      abundance: 'Legal expertise and public speaking skills.',
      helpNeeded: 'Paralegal support and community outreach volunteers.',
    },
    {
      name: 'Neera Kathuria',
      email: 'neera_kathuria@example.com',
      password: defaultPassword,
      values: '#Wellness #Healing #Patience',
      professionalProfile:
        'A counselor providing psychological support to trauma survivors. Neera advocates for mental health awareness in conservative settings.',
      geographicalSpread: 'Punjab, Haryana',
      interventions: 'Support groups for domestic abuse survivors.',
      problem: 'Severe stigma surrounding mental health prevents people from seeking help.',
      systemChange: 'Normalizing mental healthcare as essential well-being.',
      systemImpact: 'Reduction in self-harm incidents and improved family cohesion.',
      abundance: 'Emotional intelligence and specialized counseling techniques.',
      helpNeeded: 'Safe spaces for group therapy and empathetic listeners.',
    },
    {
      name: 'Pinaki Roy',
      email: 'pinaki_roy@example.com',
      password: defaultPassword,
      values: '#Data #Transparency #Accountability',
      professionalProfile:
        'Pinaki works with data to influence urban planning and transportation policies. He believes in evidence-based governance.',
      geographicalSpread: 'Karnataka, Telangana',
      interventions: 'Open data platforms for city traffic.',
      problem: 'Opaque planning processes lead to inefficient public transport routes.',
      systemChange: 'Democratizing urban data for better public oversight.',
      systemImpact: 'Optimized bus routes based on actual commuter demand data.',
      abundance: 'Analytical skills and expertise in data visualization.',
      helpNeeded: 'Access to government planning departments and datasets.',
    },
    {
      name: 'Rishi Aggarwal',
      email: 'rishi_aggarwal@example.com',
      password: defaultPassword,
      values: '#CircularEconomy #ZeroWaste #Accountability',
      professionalProfile:
        "Rishi is an urban activist working to fix Mumbai's waste management systems. He promotes composting and segregation at source.",
      geographicalSpread: 'Mumbai',
      interventions: 'Community-led composting initiatives.',
      problem: 'Overburdened landfills causing environmental and health hazards in city outskirts.',
      systemChange: 'Moving towards a circular waste management model.',
      systemImpact: '30% reduction in wet waste sent to landfills in participating wards.',
      abundance: 'Systemic thinking and deep local knowledge of civic systems.',
      helpNeeded: 'Technology for tracking waste flows and more citizen volunteers.',
    },
    {
      name: 'Sanjib Kundu',
      email: 'sanjib_kundu@example.com',
      password: defaultPassword,
      values: '#Creativity #Heritage #FairTrade',
      professionalProfile:
        'Sanjib promotes traditional terracotta art from Bankura to global markets. He works directly with artisans to improve their livelihoods.',
      geographicalSpread: 'West Bengal',
      interventions: 'Direct-to-consumer digital marketplace for artisans.',
      problem:
        'Middlemen exploit traditional artisans, leaving them in poverty despite high-value skills.',
      systemChange: 'Ensuring fair wages through disintermediation.',
      systemImpact: 'Doubled income for over 100 artisan families in the region.',
      abundance: 'Artistic vision and long-standing craft connections.',
      helpNeeded: 'E-commerce logistics and digital marketing support.',
    },
    {
      name: 'Satrajit Sanyal',
      email: 'satrajit_sanyal@example.com',
      password: defaultPassword,
      values: '#Truth #Accountability #Courage',
      professionalProfile:
        'An investigative reporter focusing on rural development and governance. Satrajit uncovers irregularities in public spending.',
      geographicalSpread: 'East India',
      interventions: 'Hyper-local investigative reporting.',
      problem: 'Lack of media attention on rural corruption leads to misuse of development funds.',
      systemChange: 'Creating a culture of local accountability through journalism.',
      systemImpact: 'Action taken against several local contractors for substandard work.',
      abundance: 'Sharp writing skills and extensive investigative networks.',
      helpNeeded: 'Legal protection and encrypted communication tools.',
    },
    {
      name: 'Shruti Kulkarni',
      email: 'shruti_k@example.com',
      password: defaultPassword,
      values: '#Innovation #Efficiency #OpenSource',
      professionalProfile:
        'Shruti builds open-source tools for agricultural supply chain transparency. She bridges the gap between tech and the field.',
      geographicalSpread: 'Karnataka',
      interventions: 'Blockchain-based crop tracking for small farmers.',
      problem: 'Farmers lack data on where their produce goes, leading to unfair pricing.',
      systemChange: 'Transparent supply chains that empower producers.',
      systemImpact: 'Reliable traceability that allows farmers to command premium prices.',
      abundance: 'Coding skills and deep product management experience.',
      helpNeeded: 'Field testers and agricultural experts to refine use cases.',
    },
    {
      name: 'Tanisha Tewari',
      email: 'tanisha_t@example.com',
      password: defaultPassword,
      values: '#Kindness #Protection #Compassion',
      professionalProfile:
        'Tanisha manages a rescue shelter for stray animals in suburban Delhi. She focuses on medical rehabilitation and adoption.',
      geographicalSpread: 'Delhi NCR',
      interventions: 'Street-side first aid kits for animals.',
      problem: 'High mortality rates for injured strays due to lack of immediate care.',
      systemChange: 'Integrating animal welfare into neighborhood community systems.',
      systemImpact: 'Successful adoption of over 200 animals in the last two years.',
      abundance: 'Veterinary connections and safe temporary housing.',
      helpNeeded: 'Volunteers for foster care and fund-raising campaigns.',
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
