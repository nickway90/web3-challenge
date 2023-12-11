import eth from './eth.png'
import './App.css';
import DonateButton from './components/DonateButton.tsx'
import DonationData from './components/DonationData.tsx'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={eth} className="App-logo" alt="logo" />
        <DonateButton />
        <DonationData />
      </header>
    </div>
  );
}

export default App;
