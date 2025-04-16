import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import './ReportForm.css';

const ReportForm = () => {
  const [formData, setFormData] = useState({
    temperature: '',
    description: '',
    surface_type: 'concrete',
    location: null
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Get current location
      const position = await getCurrentPosition();
      
      const { error } = await supabase
        .from('heat_reports')
        .insert([{
          temperature: parseFloat(formData.temperature),
          description: formData.description,
          surface_type: formData.surface_type,
          location: `POINT(${position.coords.longitude} ${position.coords.latitude})`
        }]);

      if (error) throw error;
      
      setMessage('Report submitted successfully!');
      setFormData({
        temperature: '',
        description: '',
        surface_type: 'concrete',
        location: null
      });
    } catch (error) {
      setMessage('Error submitting report: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentPosition = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  };

  return (
    <div className="report-form">
      <h2>Submit Heat Report</h2>
      {message && <div className="message">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Temperature (°C)</label>
          <input
            type="number"
            step="0.1"
            required
            value={formData.temperature}
            onChange={(e) => setFormData({...formData, temperature: e.target.value})}
          />
        </div>

        <div className="form-group">
          <label>Surface Type</label>
          <select
            value={formData.surface_type}
            onChange={(e) => setFormData({...formData, surface_type: e.target.value})}
          >
            <option value="concrete">Concrete</option>
            <option value="asphalt">Asphalt</option>
            <option value="grass">Grass</option>
            <option value="soil">Soil</option>
            <option value="water">Water Body</option>
          </select>
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder="Describe the location and conditions..."
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Report'}
        </button>
      </form>
    </div>
  );
};

export default ReportForm;