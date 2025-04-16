import { supabase } from '../../frontend/src/services/supabase';

const reportsService = {
    async getReports() {
        const { data, error } = await supabase
            .from('reports')
            .select('*')
            .order('timestamp', { ascending: false });
        
        if (error) throw error;
        return data;
    },

    async createReport(reportData) {
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

export default reportsService;