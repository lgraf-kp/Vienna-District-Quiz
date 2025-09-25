
import { useState, useEffect } from 'react';
import './App.css';

// List of Vienna's 23 districts
const districts = [
  '1. Bezirk: Innere Stadt, Wien',
  '2. Bezirk: Leopoldstadt, Wien',
  '3. Bezirk: Landstraße, Wien',
  '4. Bezirk: Wieden, Wien',
  '5. Bezirk: Margareten, Wien',
  '6. Bezirk: Mariahilf, Wien',
  '7. Bezirk: Neubau, Wien',
  '8. Bezirk: Josefstadt, Wien',
  '9. Bezirk: Alsergrund, Wien',
  '10. Bezirk: Favoriten, Wien',
  '11. Bezirk: Simmering, Wien',
  '12. Bezirk: Meidling, Wien',
  '13. Bezirk: Hietzing, Wien',
  '14. Bezirk: Penzing, Wien',
  '15. Bezirk: Rudolfsheim-Fünfhaus, Wien',
  '16. Bezirk: Ottakring, Wien',
  '17. Bezirk: Hernals, Wien',
  '18. Bezirk: Währing, Wien',
  '19. Bezirk: Döbling, Wien',
  '20. Bezirk: Brigittenau, Wien',
  '21. Bezirk: Floridsdorf, Wien',
  '22. Bezirk: Donaustadt, Wien',
  '23. Bezirk: Liesing, Wien',
];

// Import the data
import rawData from './selected_data_0.json';

type GameObject = {
  shown_by?: { id: string };
  place_data?: string[];
  iiif_manifest?: string;
};


function getValidObjects(arr: any[]): GameObject[] {
  return Array.isArray(arr)
    ? arr.filter(
        (obj) => obj && obj.shown_by && obj.shown_by.id && obj.place_data && obj.place_data.length > 0
      )
    : [];
}

function App() {
  const [gameObj, setGameObj] = useState<GameObject | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [guessesLeft, setGuessesLeft] = useState(5);
  const [message, setMessage] = useState('');
  const [gameOver, setGameOver] = useState(false);

  // Pick a random valid object on mount or reset
  const pickRandomObject = async () => {
    // Some bundlers may wrap JSON import as { default: [...] }
    let arr: any[] = [];
    if (Array.isArray(rawData)) {
      arr = rawData;
    } else if (rawData && typeof rawData === 'object' && 'default' in rawData && Array.isArray((rawData as any).default)) {
      arr = (rawData as any).default;
    }
    const validObjects = getValidObjects(arr);
    if (validObjects.length === 0) {
      setGameObj(null);
      setMessage('No valid data found.');
      setGameOver(true);
      return;
    }
    const random = validObjects[Math.floor(Math.random() * validObjects.length)];
    console.log(random.iiif_manifest);
    setGameObj(random);
    setGuessesLeft(5);
    setMessage('');
    setGameOver(false);
    setSelectedDistrict('');
  };

  useEffect(() => {
    pickRandomObject();
    // eslint-disable-next-line
  }, []);

  const handleGuess = () => {
    if (!gameObj || !gameObj.place_data) return;
    if (!selectedDistrict) {
      setMessage('Bitte wähle einen Bezirk!');
      return;
    }
    if (selectedDistrict === gameObj.place_data[0]) {
      setMessage('Richtig! 🎉');
      setGameOver(true);
    } else {
      if (guessesLeft - 1 === 0) {
        setMessage(`Leider verloren! Die richtige Antwort war: ${gameObj.place_data[0]}`);
        setGameOver(true);
      } else {
        setGuessesLeft(guessesLeft - 1);
        setMessage('Falsch geraten! Versuche es erneut.');
      }
    }
  };

  return (
    <div className="p-2 flex flex-wrap justify-center w-full max-w-screen">
      <div className="bg-white dark:bg-black rounded-lg shadow-lg p-2 max-w-4xl w-full">
        {gameObj && gameObj.shown_by && (
          <div>
          <img
            src={gameObj.shown_by.id}
            alt="Objekt"
            className="mx-auto mb-4 rounded-lg object-contain border"
          />
          </div>
        )}
        <div className="mb-4">
          <label className="block mb-2 font-medium">Bezirk wählen:</label>
          <select
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            disabled={gameOver}
          >
            <option value="">-- Bezirk auswählen --</option>
            {districts.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
        </div>
        <button
          className="w-full bg-blue-600 py-2 rounded hover:bg-blue-700 transition mb-2 disabled:opacity-50"
          onClick={handleGuess}
          disabled={gameOver}
        >
          Raten
        </button>
        <div className="text-center mb-2 text-gray-700">Verbleibende Versuche: {guessesLeft}</div>
        {message && <div className="text-center font-semibold text-lg mt-2">{message}</div>}
        {gameOver && (
          <button
            className="w-full mt-4 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
            onClick={pickRandomObject}
          >
            Neues Spiel
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
