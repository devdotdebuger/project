import { supabase } from './supabase';

// Subscribe to real-time changes
const subscription = supabase
  .channel('temperature_updates')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'temperature_data' },
    payload => {
      console.log('Change received!', payload);
    }
  )
  .subscribe();

// Test insert
async function testLiveInsert() {
  const { data, error } = await supabase
    .from('temperature_data')
    .insert([
      { lat: 40.7128, lng: -74.0060, temperature: 25 }
    ]);
  
  console.log('Insert result:', data || error);
}

testLiveInsert();