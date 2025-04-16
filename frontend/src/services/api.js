import { supabase } from './supabase';

const api = {
    async getTemperatureData() {
        const { data, error } = await supabase
            .from('temperature_data')
            .select('*');
        
        if (error) throw error;
        return data;
    },

    async getReports() {
        const { data, error } = await supabase
            .from('reports')
            .select('*');
        
        if (error) throw error;
        return data;
    },

    async submitReport(reportData) {
        const { data, error } = await supabase
            .from('reports')
            .insert([{
                lat: reportData.lat,
                lng: reportData.lng,
                feedback: reportData.feedback,
                timestamp: new Date()
            }]);
        
        if (error) throw error;
        return data;
    }
};

export default api;