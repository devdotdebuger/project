import { supabase } from './supabase';

export const db = {
    // Temperature data operations
    async getTemperatureData() {
        const { data, error } = await supabase
            .from('temperature_data')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data;
    },

    async addTemperaturePoint(point) {
        const { data, error } = await supabase
            .from('temperature_data')
            .insert([{
                lat: point.lat,
                lng: point.lng,
                temperature: point.temperature,
                land_use: point.landUse
            }]);
        if (error) throw error;
        return data;
    },

    // Reports operations
    async getReports() {
        const { data, error } = await supabase
            .from('reports')
            .select('*')
            .order('timestamp', { ascending: false });
        if (error) throw error;
        return data;
    },

    async submitReport(report) {
        const { data, error } = await supabase
            .from('reports')
            .insert([{
                lat: report.lat,
                lng: report.lng,
                feedback: report.feedback
            }]);
        if (error) throw error;
        return data;
    },

    // Clusters operations
    async getClusters() {
        const { data, error } = await supabase
            .from('clusters')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data;
    },

    async updateClusters(clusters) {
        const { data, error } = await supabase
            .from('clusters')
            .insert(clusters);
        if (error) throw error;
        return data;
    },

    // Real-time subscriptions
    subscribeToTemperatureUpdates(callback) {
        return supabase
            .channel('temperature_updates')
            .on('postgres_changes', 
                { event: '*', schema: 'public', table: 'temperature_data' },
                callback
            )
            .subscribe();
    },

    subscribeToReports(callback) {
        return supabase
            .channel('report_updates')
            .on('postgres_changes', 
                { event: '*', schema: 'public', table: 'reports' },
                callback
            )
            .subscribe();
    }
};