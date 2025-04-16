import MapComponent from './components/Map';
import ReportForm from './components/ReportForm';
import Chatbot from './components/Chatbot';
import './App.css';

function App() {
  return (
    <div className="app">
      <MapComponent />
      <ReportForm />
      <Chatbot />
    </div>
  );
}

export default App;