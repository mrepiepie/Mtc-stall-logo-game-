const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lkoajwvzzmtsyrbgdlan.supabase.co';
const supabaseKey = 'sb_publishable_de0Kc11BqEsGYyIhuKaNWw_djfnh6jC';
const supabase = createClient(supabaseUrl, supabaseKey);

const companies = [
  'apple', 'google', 'microsoft', 'amazon', 'netflix', 'spotify', 'tesla', 'meta', 'nike', 'adidas',
  'mcdonalds', 'starbucks', 'kfc', 'burgerking', 'wendys', 'coca-cola', 'pepsi', 'redbull', 'monsterenergy',
  'sony', 'nintendo', 'xbox', 'playstation', 'samsung', 'lg', 'intel', 'nvidia', 'amd', 'cisco', 'ibm',
  'toyota', 'ford', 'honda', 'chevrolet', 'bmw', 'mercedes-benz', 'audi', 'porsche', 'ferrari', 'lamborghini',
  'uber', 'lyft', 'airbnb', 'tiktok', 'instagram', 'snapchat', 'pinterest', 'twitter', 'linkedin', 'reddit',
  'visa', 'mastercard', 'paypal', 'stripe', 'fedex', 'ups', 'dhl', 'boeing', 'airbus', 'spacex'
];

async function seed() {
  const rows = companies.map(company => ({
    answer: company.replace(/-/g, ' '),
    image_url: `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://${company}.com&size=256`,
    difficulty: 'medium'
  }));

  const { data, error } = await supabase.from('questions').insert(rows);

  if (error) {
    console.error('Error seeding data:', error);
  } else {
    console.log('Successfully seeded 60 questions into the database!');
  }
}

seed();
