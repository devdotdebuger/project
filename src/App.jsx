import MapComponent from './components/Map';
import ReportForm from './components/ReportForm';
import Chatbot from './components/Chatbot';
import './App.css';

function App() {
  return (
    <div className="app">
      <MapComponent />
      <div className="overlay-container">
        <ReportForm />
        <Chatbot />
      </div>
    </div>
  );
}

export default App;