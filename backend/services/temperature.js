import { supabase } from '../../frontend/src/services/supabase';

const temperatureService = {
    async getTemperatureData() {
        const { data, error } = await supabase
            .from('temperature_data')
            .select('*');
        
        if (error) throw error;
        return data;
    },

    async updateTemperatureData(newData) {
        const { data, error } = await supabase
            .from('temperature_data')
            .insert([{
                lat: newData.lat,
                lng: newData.lng,
                temperature: newData.temperature,
                land_use: newData.landUse
            }]);
        
        if (error) throw error;
        return data;
    }
};

export default temperatureService;