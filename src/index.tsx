import { useState } from 'react';

interface RekordboxProps {
  onClose: () => void;
}

interface Track {
  id: string;
  title: string;
  artist: string;
  bpm: number;
  key: string;
  duration: string;
  genre: string;
}

interface Deck {
  id: 'A' | 'B';
  track: Track | null;
  playing: boolean;
  bpm: number;
  position: number;
}

const mockTracks: Track[] = [
  { id: '1', title: 'Midnight City', artist: 'M83', bpm: 105, key: '4A', duration: '4:03', genre: 'Synthwave' },
  { id: '2', title: 'Strobe', artist: 'deadmau5', bpm: 128, key: '6B', duration: '10:37', genre: 'Progressive House' },
  { id: '3', title: 'One More Time', artist: 'Daft Punk', bpm: 122, key: '8B', duration: '5:20', genre: 'French House' },
  { id: '4', title: 'Levels', artist: 'Avicii', bpm: 126, key: '10B', duration: '5:38', genre: 'EDM' },
  { id: '5', title: 'Scary Monsters', artist: 'Skrillex', bpm: 140, key: '2A', duration: '5:02', genre: 'Dubstep' },
];

const Rekordbox: React.FC<RekordboxProps> = ({ onClose: _onClose }) => {
  const [tracks] = useState(mockTracks);
  const [deckA, setDeckA] = useState<Deck>({ id: 'A', track: mockTracks[0], playing: true, bpm: 105, position: 45 });
  const [deckB, setDeckB] = useState<Deck>({ id: 'B', track: mockTracks[1], playing: false, bpm: 128, position: 0 });
  const [crossfader, setCrossfader] = useState(50);

  const DeckView: React.FC<{ deck: Deck; setDeck: (d: Deck) => void }> = ({ deck, setDeck }) => (
    <div className="flex-1 bg-[#1a1a1a] p-4 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <div className={`text-2xl font-bold ${deck.id === 'A' ? 'text-orange-500' : 'text-cyan-500'}`}>
          Deck {deck.id}
        </div>
        <div className="text-sm text-white/50">{deck.track?.key}</div>
      </div>

      {deck.track ? (
        <>
          <div className="mb-4">
            <div className="text-lg font-semibold truncate">{deck.track.title}</div>
            <div className="text-sm text-white/60">{deck.track.artist}</div>
          </div>

          {/* Waveform */}
          <div className="h-20 bg-[#252525] rounded mb-4 relative overflow-hidden">
            <div className="absolute inset-0 flex items-center">
              {Array.from({ length: 100 }, (_, i) => (
                <div
                  key={i}
                  className={`w-1 mx-px ${deck.id === 'A' ? 'bg-orange-500' : 'bg-cyan-500'}`}
                  style={{ height: `${30 + Math.random() * 40}%`, opacity: i < deck.position ? 0.3 : 1 }}
                />
              ))}
            </div>
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-white"
              style={{ left: `${deck.position}%` }}
            />
          </div>

          <div className="flex items-center justify-between mb-4">
            <span className="font-mono text-lg">{deck.bpm.toFixed(1)} BPM</span>
            <span className="font-mono text-white/50">{deck.track.duration}</span>
          </div>

          <div className="flex items-center justify-center gap-4">
            <button className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center">
              ⏮
            </button>
            <button
              onClick={() => setDeck({ ...deck, playing: !deck.playing })}
              className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl
                ${deck.playing ? 'bg-green-600' : 'bg-white/20 hover:bg-white/30'}
              `}
            >
              {deck.playing ? '⏸' : '▶'}
            </button>
            <button className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center">
              ⏭
            </button>
          </div>

          {/* Tempo */}
          <div className="mt-4">
            <div className="text-xs text-white/50 mb-1">Tempo</div>
            <input
              type="range"
              min={deck.track.bpm * 0.8}
              max={deck.track.bpm * 1.2}
              step={0.1}
              value={deck.bpm}
              onChange={e => setDeck({ ...deck, bpm: +e.target.value })}
              className="w-full"
            />
          </div>
        </>
      ) : (
        <div className="h-48 flex items-center justify-center text-white/40">
          Drop a track here
        </div>
      )}
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-[#121212] text-white">
      {/* Header */}
      <div className="h-10 bg-[#1a1a1a] flex items-center justify-between px-4 border-b border-black">
        <span className="font-bold text-xl">
          <span className="text-white">rekord</span>
          <span className="text-[#00c8ff]">box</span>
        </span>
        <div className="flex items-center gap-4 text-sm text-white/60">
          <span>EXPORT</span>
          <span>PERFORMANCE</span>
          <span className="text-white">LIGHTING</span>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Library */}
        <div className="w-80 bg-[#1a1a1a] border-r border-black flex flex-col">
          <div className="p-2 border-b border-black">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-3 py-1.5 bg-[#252525] rounded text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>
          <div className="flex-1 overflow-auto">
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-[#252525]">
                <tr className="text-left text-white/50">
                  <th className="p-2">Title</th>
                  <th className="p-2">BPM</th>
                  <th className="p-2">Key</th>
                </tr>
              </thead>
              <tbody>
                {tracks.map(track => (
                  <tr
                    key={track.id}
                    className="hover:bg-white/10 cursor-pointer border-b border-black/30"
                    onDoubleClick={() => {
                      if (!deckA.playing || deckA.position > 90) {
                        setDeckA({ ...deckA, track, bpm: track.bpm, position: 0 });
                      } else {
                        setDeckB({ ...deckB, track, bpm: track.bpm, position: 0 });
                      }
                    }}
                  >
                    <td className="p-2">
                      <div className="truncate">{track.title}</div>
                      <div className="text-white/50 truncate">{track.artist}</div>
                    </td>
                    <td className="p-2 text-center">{track.bpm}</td>
                    <td className="p-2 text-center">{track.key}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Decks */}
        <div className="flex-1 p-4 flex gap-4">
          <DeckView deck={deckA} setDeck={setDeckA} />
          <DeckView deck={deckB} setDeck={setDeckB} />
        </div>
      </div>

      {/* Mixer */}
      <div className="h-24 bg-[#1a1a1a] border-t border-black p-4">
        <div className="flex items-center justify-center gap-8">
          <div className="text-center">
            <div className="text-xs text-orange-500 mb-1">Deck A</div>
            <input type="range" className="w-24" defaultValue={80} />
          </div>

          <div className="text-center">
            <div className="text-xs text-white/50 mb-1">Crossfader</div>
            <input
              type="range"
              min={0}
              max={100}
              value={crossfader}
              onChange={e => setCrossfader(+e.target.value)}
              className="w-48"
            />
          </div>

          <div className="text-center">
            <div className="text-xs text-cyan-500 mb-1">Deck B</div>
            <input type="range" className="w-24" defaultValue={80} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rekordbox;
