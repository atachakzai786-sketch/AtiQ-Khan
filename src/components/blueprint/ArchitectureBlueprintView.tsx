import { useState } from 'react';
import {
  Layers,
  Database,
  Server,
  FolderTree,
  FileCode2,
  Copy,
  Check,
  CheckCircle2,
  Sparkles,
  Smartphone,
  Cpu,
  Radio,
  Share2,
} from 'lucide-react';

export function ArchitectureBlueprintView() {
  const [activeTab, setActiveTab] = useState<'stack' | 'database' | 'api' | 'structure' | 'wireframes'>('stack');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  return (
    <div className="min-h-full pb-32 px-4 pt-5 select-none text-[#F5F5F5] space-y-6 max-w-5xl mx-auto" id="architecture-blueprint-view">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1F1F1F] pb-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#FF6B35] uppercase tracking-wider mb-1">
            <Layers className="w-4 h-4" />
            <span>Senior PM & Lead Full-Stack Architect Blueprint</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#F5F5F5]">
            Music Streaming Platform Specification
          </h1>
        </div>

        <span className="text-xs font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-3 py-1 rounded-full self-start sm:self-auto flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Production-Ready Architecture
        </span>
      </div>

      {/* Blueprint Navigation Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none" id="blueprint-tabs-bar">
        {[
          { id: 'stack' as const, label: '1. Tech Stack & PRD', icon: Cpu },
          { id: 'database' as const, label: '2. Database Schemas', icon: Database },
          { id: 'api' as const, label: '3. API Endpoints', icon: Server },
          { id: 'structure' as const, label: '4. Folder Structure', icon: FolderTree },
          { id: 'wireframes' as const, label: '5. UI Wireframes', icon: Smartphone },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`blueprint-tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition active:scale-95 flex-shrink-0 ${
                isActive
                  ? 'bg-[#FF6B35] text-white shadow-lg shadow-[#FF6B35]/25'
                  : 'bg-[#0F0F0F] hover:bg-[#161616] text-[#A0A0A0] hover:text-[#F5F5F5] border border-[#1F1F1F]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: TECH STACK & PRD */}
      {activeTab === 'stack' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-5 rounded-2xl bg-[#0F0F0F] border border-[#1F1F1F] space-y-4">
            <h2 className="text-lg font-bold text-[#F5F5F5] flex items-center gap-2">
              <Cpu className="w-5 h-5 text-[#FF6B35]" />
              <span>1. Tech Stack Decision Matrix & Architectural Rationale</span>
            </h2>

            {/* Matrix Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Frontend Card */}
              <div className="p-4 rounded-xl bg-[#080808] border border-[#1F1F1F] space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-[#FF804D]">Frontend: Flutter vs React Native</h3>
                  <span className="text-[10px] font-mono font-bold bg-[#FF6B35]/15 text-[#FF6B35] px-2 py-0.5 rounded border border-[#FF6B35]/30">
                    Recommended: Flutter
                  </span>
                </div>
                <p className="text-xs text-[#A0A0A0] leading-relaxed">
                  <strong>Why Flutter wins for Audio Apps:</strong> Flutter compiles directly to ARM AOT machine code (Impeller GPU backend), guaranteeing 120fps fluid album art shaders, waveform scrubbers, and zero bridge overhead. Low-latency native audio platform channels (via `just_audio` + C++ audio engine) ensure gapless transitions, audio crossfade, and background OS lockscreen controls without GC pauses.
                </p>
                <div className="text-[11px] text-[#737373] space-y-1 bg-[#141414] p-2.5 rounded-lg border border-[#1F1F1F]">
                  <div>• <strong className="text-[#A0A0A0]">Flutter:</strong> Direct Skia/Impeller canvas rendering, unified 120fps UI, native C/C++ audio plugins.</div>
                  <div>• <strong className="text-[#A0A0A0]">React Native Alternative:</strong> Preferred if enterprise leverages a shared web/mobile TypeScript codebase. Requires JSI (JavaScript Interface) or TurboModules for low-latency audio DSP.</div>
                </div>
              </div>

              {/* Backend Card */}
              <div className="p-4 rounded-xl bg-[#080808] border border-[#1F1F1F] space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-[#FF804D]">Backend: Node.js (NestJS) vs Python (FastAPI)</h3>
                  <span className="text-[10px] font-mono font-bold bg-[#FF6B35]/15 text-[#FF6B35] px-2 py-0.5 rounded border border-[#FF6B35]/30">
                    Recommended: Hybrid Microservices
                  </span>
                </div>
                <p className="text-xs text-[#A0A0A0] leading-relaxed">
                  <strong className="text-[#F5F5F5]">Core API & WebSocket Rooms:</strong> Node.js (NestJS/TypeScript) with event-driven architecture handles high-concurrency client streams, JWT auth, and WebSocket broadcasting for Live Listening Rooms.
                  <br />
                  <strong className="text-[#F5F5F5]">Recommendation & Audio Intelligence:</strong> Python (FastAPI) microservice runs PyTorch/Scikit-learn for collaborative filtering, audio cosine similarity, and personalized vector search.
                </p>
              </div>
            </div>

            {/* Storage & HLS Audio Transcoding Pipeline */}
            <div className="p-4 rounded-xl bg-[#080808] border border-[#1F1F1F] space-y-3">
              <h3 className="font-bold text-sm text-amber-300 flex items-center gap-2">
                <Radio className="w-4 h-4 text-[#FF6B35]" />
                <span className="text-[#F5F5F5]">Audio Ingestion, Adaptive Bitrate (HLS/DASH) & CDN Pipeline</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-[#141414] rounded-xl border border-[#1F1F1F]">
                  <div className="font-bold text-[#F5F5F5] mb-1">1. Master Ingest</div>
                  <p className="text-[#737373] text-[11px]">FLAC/WAV 24-bit 192kHz uploaded directly to encrypted Amazon S3 bucket via presigned S3 URLs.</p>
                </div>
                <div className="p-3 bg-[#141414] rounded-xl border border-[#1F1F1F]">
                  <div className="font-bold text-[#F5F5F5] mb-1">2. Transcoding Worker</div>
                  <p className="text-[#737373] text-[11px]">FFmpeg / AWS MediaConvert slices audio into 6s `.ts`/`.m4s` chunks: 96k, 160k, 320k AAC, and Lossless ALAC with master `.m3u8` playlist.</p>
                </div>
                <div className="p-3 bg-[#141414] rounded-xl border border-[#1F1F1F]">
                  <div className="font-bold text-[#F5F5F5] mb-1">3. CloudFront Edge</div>
                  <p className="text-[#737373] text-[11px]">Amazon CloudFront edge points cache audio chunks globally with byte-range requests for instant zero-buffering start.</p>
                </div>
                <div className="p-3 bg-[#141414] rounded-xl border border-[#1F1F1F]">
                  <div className="font-bold text-[#F5F5F5] mb-1">4. Offline Encryption</div>
                  <p className="text-[#737373] text-[11px]">Downloaded chunks encrypted on-device with AES-256 GCM using keys stored securely in iOS Keychain / Android KeyStore.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DATABASE SCHEMAS */}
      {activeTab === 'database' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-5 rounded-2xl bg-[#0F0F0F] border border-[#1F1F1F] space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#F5F5F5] flex items-center gap-2">
                <Database className="w-5 h-5 text-[#FF6B35]" />
                <span>2. Complete Relational (PostgreSQL) & Document (MongoDB) Schemas</span>
              </h2>
              <button
                onClick={() => copyToClipboard(SQL_SCHEMA_DDL, 'sql')}
                className="flex items-center gap-1.5 text-xs bg-[#141414] hover:bg-[#1C1C1C] px-3 py-1.5 rounded-lg text-[#A0A0A0] hover:text-[#F5F5F5] border border-[#1F1F1F] font-semibold transition"
              >
                {copiedKey === 'sql' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'sql' ? 'Copied DDL!' : 'Copy SQL'}</span>
              </button>
            </div>

            {/* PostgreSQL DDL Code Block */}
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-[#FF804D] uppercase tracking-wider">
                PostgreSQL Core Schema (DDL)
              </span>
              <pre className="p-4 bg-[#080808] rounded-xl border border-[#1F1F1F] text-xs font-mono text-[#A0A0A0] overflow-x-auto leading-relaxed max-h-96">
                <code>{SQL_SCHEMA_DDL}</code>
              </pre>
            </div>

            {/* MongoDB Metadata & Lyrics Schema */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                  MongoDB Document Collection: `track_metadata` (Lyrics & Vectors)
                </span>
                <button
                  onClick={() => copyToClipboard(MONGO_JSON_SCHEMA, 'mongo')}
                  className="flex items-center gap-1.5 text-xs bg-[#141414] hover:bg-[#1C1C1C] px-3 py-1.5 rounded-lg text-[#A0A0A0] hover:text-[#F5F5F5] border border-[#1F1F1F] font-semibold transition"
                >
                  {copiedKey === 'mongo' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'mongo' ? 'Copied JSON!' : 'Copy JSON'}</span>
                </button>
              </div>
              <pre className="p-4 bg-[#080808] rounded-xl border border-[#1F1F1F] text-xs font-mono text-emerald-300/90 overflow-x-auto leading-relaxed">
                <code>{MONGO_JSON_SCHEMA}</code>
              </pre>
            </div>

            {/* Redis Key Caching Architecture */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-mono font-bold text-[#FF804D] uppercase tracking-wider">
                Redis Key Structure & TTL Matrix
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-[#080808] rounded-xl border border-[#1F1F1F]">
                  <code className="text-[#FF6B35] font-bold block mb-1">user:session:&#123;token&#125;</code>
                  <p className="text-[#737373] text-[11px]">JWT revocation whitelist & user role state. TTL: 7 days.</p>
                </div>
                <div className="p-3 bg-[#080808] rounded-xl border border-[#1F1F1F]">
                  <code className="text-[#FF6B35] font-bold block mb-1">cache:track:&#123;id&#125;</code>
                  <p className="text-[#737373] text-[11px]">Hydrated track JSON with signed CloudFront URL. TTL: 1 hour.</p>
                </div>
                <div className="p-3 bg-[#080808] rounded-xl border border-[#1F1F1F]">
                  <code className="text-[#FF6B35] font-bold block mb-1">room:&#123;id&#125;:state</code>
                  <p className="text-[#737373] text-[11px]">Live listening room current track, timestamp, and participant IDs.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: API ENDPOINTS */}
      {activeTab === 'api' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-5 rounded-2xl bg-[#0F0F0F] border border-[#1F1F1F] space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#F5F5F5] flex items-center gap-2">
                <Server className="w-5 h-5 text-[#FF6B35]" />
                <span>3. Recommended REST & WebSocket API Specification</span>
              </h2>
              <button
                onClick={() => copyToClipboard(API_ENDPOINTS_SPEC, 'api')}
                className="flex items-center gap-1.5 text-xs bg-[#141414] hover:bg-[#1C1C1C] px-3 py-1.5 rounded-lg text-[#A0A0A0] hover:text-[#F5F5F5] border border-[#1F1F1F] font-semibold transition"
              >
                {copiedKey === 'api' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'api' ? 'Copied Specs!' : 'Copy Specs'}</span>
              </button>
            </div>

            <pre className="p-4 bg-[#080808] rounded-xl border border-[#1F1F1F] text-xs font-mono text-[#A0A0A0] overflow-x-auto leading-relaxed max-h-[500px]">
              <code>{API_ENDPOINTS_SPEC}</code>
            </pre>
          </div>
        </div>
      )}

      {/* TAB 4: FOLDER STRUCTURE */}
      {activeTab === 'structure' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-5 rounded-2xl bg-[#0F0F0F] border border-[#1F1F1F] space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#F5F5F5] flex items-center gap-2">
                <FolderTree className="w-5 h-5 text-[#FF6B35]" />
                <span>4. Production Monorepo Project Folder Structure</span>
              </h2>
              <button
                onClick={() => copyToClipboard(PROJECT_FOLDER_TREE, 'tree')}
                className="flex items-center gap-1.5 text-xs bg-[#141414] hover:bg-[#1C1C1C] px-3 py-1.5 rounded-lg text-[#A0A0A0] hover:text-[#F5F5F5] border border-[#1F1F1F] font-semibold transition"
              >
                {copiedKey === 'tree' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'tree' ? 'Copied Tree!' : 'Copy Tree'}</span>
              </button>
            </div>

            <pre className="p-4 bg-[#080808] rounded-xl border border-[#1F1F1F] text-xs font-mono text-cyan-300/90 overflow-x-auto leading-relaxed max-h-[500px]">
              <code>{PROJECT_FOLDER_TREE}</code>
            </pre>
          </div>
        </div>
      )}

      {/* TAB 5: UI WIREFRAMES */}
      {activeTab === 'wireframes' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-5 rounded-2xl bg-[#0F0F0F] border border-[#1F1F1F] space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#F5F5F5] flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-[#FF6B35]" />
                <span>5. Step-by-Step UI Wireframe Concepts & Interaction Specifications</span>
              </h2>
            </div>

            <div className="space-y-6">
              {/* Screen 1: Home View */}
              <div className="p-4 bg-[#080808] rounded-xl border border-[#1F1F1F] space-y-2">
                <h3 className="text-sm font-bold text-[#FF804D]">Screen 1: Home Feed & Personalized Dashboard</h3>
                <pre className="p-3 bg-[#000000] rounded-lg text-xs font-mono text-[#737373] overflow-x-auto">
{`+-------------------------------------------------------------+
| [Aura Logo]  "Good evening, Alex"               [Hi-Fi 192k]|
+-------------------------------------------------------------+
| QUICK PLAY 6-PACK GRID:                                     |
| [Daily Discover] [Liked Songs]     [Top Charts Global]      |
| [Chill & Unwind] [Energy Booster]  [Late Night Vibes]       |
+-------------------------------------------------------------+
| DAILY & DYNAMIC MIXES (Horizontal Carousel):                |
| +-------------------+  +-------------------+                |
| | [Cover Art]       |  | [Cover Art]       |                |
| | Daily Discover    |  | Chill & Unwind    |                |
| | Updated Daily     |  | Ambient & Lo-Fi   |                |
| +-------------------+  +-------------------+                |
+-------------------------------------------------------------+
| TOP CHARTS & MOOD PLAYLISTS (Horizontal Carousel):          |
| +-------------------+  +-------------------+                |
| | Focus & Study     |  | Late Night Vibes  |                |
| +-------------------+  +-------------------+                |
+-------------------------------------------------------------+
| RECENTLY PLAYED TRACKS (Chronological Horizontal Scroll)    |
| [Track 1] [Track 2] [Track 3] [Track 4]                     |
+-------------------------------------------------------------+
| [MINI PLAYER DOCKED]: [Art] Midnight Reverie - Luna [▶] [⏭] |
+-------------------------------------------------------------+
| [BOTTOM NAV]:  [Home*]    [Explore]    [Library]   [Settings]|
+-------------------------------------------------------------+`}
                </pre>
              </div>

              {/* Screen 2: Now Playing Screen */}
              <div className="p-4 bg-[#080808] rounded-xl border border-[#1F1F1F] space-y-2">
                <h3 className="text-sm font-bold text-[#FF804D]">Screen 2: Now Playing (High-Res Audio Player UI)</h3>
                <pre className="p-3 bg-[#000000] rounded-lg text-xs font-mono text-[#737373] overflow-x-auto">
{`+-------------------------------------------------------------+
| [v Collapse]       Playing from Library         [Radio Live]|
+-------------------------------------------------------------+
|                                                             |
|                    +------------------+                     |
|                    |                  |                     |
|                    |   ALBUM ARTWORK  | [HI-RES 24-BIT/192K]|
|                    |  (Dynamic Glow)  |                     |
|                    |                  |                     |
|                    +------------------+                     |
|                                                             |
|  Midnight Reverie                       [+ Add to Playlist] |
|  Luna Solaris                           [❤️ Liked Quick-Btn]|
|                                                             |
|  INTERACTIVE WAVEFORM PROGRESS BAR:                         |
|  ||||||||||||||||||||||||||||||||||||||||||||||||||||||||| |
|  01:24                                               -02:14 |
|                                                             |
|  [Shuffle]    [⏮ Prev]    [( ▶ / ⏸ )]    [⏭ Next]    [Repeat]|
|                                                             |
|  [Speaker: AirPods Pro 2]                 [Mic: Live Lyrics]|
+-------------------------------------------------------------+`}
                </pre>
              </div>

              {/* Screen 3: Synced Lyrics View */}
              <div className="p-4 bg-[#080808] rounded-xl border border-[#1F1F1F] space-y-2">
                <h3 className="text-sm font-bold text-[#FF804D]">Screen 3: Real-Time Synced Lyrics Engine</h3>
                <p className="text-xs text-[#737373]">Auto-scrolling view centered on active timestamp with click-to-seek.</p>
                <pre className="p-3 bg-[#000000] rounded-lg text-xs font-mono text-[#737373] overflow-x-auto">
{`+-------------------------------------------------------------+
| [v Close]            Midnight Reverie               [Share] |
+-------------------------------------------------------------+
|                                                             |
|          Streetlights bleeding through the silver mist      |
|                                                             |
|          Shadows dancing on the city bridge                 |
|                                                             |
|   >>>  ELECTRIC PULSES COURSING THROUGH THE FLOOR  <<<      |
|        (Glows Amber/Orange, Scaled 1.1x, Active Playing Line)|
|                                                             |
|          I don't wanna close my eyes no more...             |
|                                                             |
|          Lost in the rhythm, adrift in the sound...         |
|                                                             |
+-------------------------------------------------------------+
| [Hint: Tap any lyric line to jump audio directly to time]   |
+-------------------------------------------------------------+`}
                </pre>
              </div>

              {/* Screen 4: Explore & Search */}
              <div className="p-4 bg-[#080808] rounded-xl border border-[#1F1F1F] space-y-2">
                <h3 className="text-sm font-bold text-[#FF804D]">Screen 4: Explore & Search with Voice Search</h3>
                <pre className="p-3 bg-[#000000] rounded-lg text-xs font-mono text-[#737373] overflow-x-auto">
{`+-------------------------------------------------------------+
| Explore & Search                                            |
| [🔍 Search songs, artists, genres...     ] [🎤 Voice Search]|
+-------------------------------------------------------------+
| MOOD TAGS:  [Chill] [Workout] [Deep Work] [Night Drive] ... |
+-------------------------------------------------------------+
| BROWSE ALL GENRES (2x4 Vibrant Gradient Cards):             |
| +-----------------------+   +-----------------------+       |
| | Hip-Hop & Rap         |   | Electronic & EDM      |       |
| +-----------------------+   +-----------------------+       |
| | Lo-Fi & Ambient       |   | Neo-Soul & R&B        |       |
| +-----------------------+   +-----------------------+       |
+-------------------------------------------------------------+`}
                </pre>
              </div>

              {/* Screen 5: Settings & Equalizer */}
              <div className="p-4 bg-[#080808] rounded-xl border border-[#1F1F1F] space-y-2">
                <h3 className="text-sm font-bold text-[#FF804D]">Screen 5: Settings, Hi-Fi Quality & 5-Band Equalizer</h3>
                <pre className="p-3 bg-[#000000] rounded-lg text-xs font-mono text-[#737373] overflow-x-auto">
{`+-------------------------------------------------------------+
| Profile & Settings                                          |
| [User: Alex Mercer] [HI-FI PRO] [Master FLAC & Atmos Active]|
+-------------------------------------------------------------+
| 5-BAND DSP EQUALIZER:                                       |
| Presets: [Flat] [Bass Boost*] [Electronic] [Acoustic] [EQ]  |
|  +6dB      +4dB       0dB       +2dB      +4dB              |
|   |         |          |          |         |               |
|  60Hz     230Hz      910Hz      3.6kHz    14kHz             |
+-------------------------------------------------------------+
| SMART AUDIO ENGINE:                                         |
| Audio Crossfade: [ 1s =====O======== 12s ] (5 seconds)      |
| Dynamic Volume Normalization: [ TOGGLE ON (EBU R128) ]      |
| Gapless Playback:             [ TOGGLE ON ]                 |
+-------------------------------------------------------------+
| STREAMING QUALITY:                                          |
| ( ) Normal (96kbps)   ( ) High (160kbps)   (•) Hi-Res FLAC  |
+-------------------------------------------------------------+
| OFFLINE MODE:                                               |
| Offline Only Switch: [ OFF ]                                |
| AES-256 Storage: 1.4 GB / 64 GB               [Clear Cache] |
+-------------------------------------------------------------+`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Full DDL Specifications
const SQL_SCHEMA_DDL = `-- ============================================================================
-- PRODUCTION POSTGRESQL SCHEMA FOR HIGH-PERFORMANCE MUSIC STREAMING PLATFORM
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. USERS & SUBSCRIPTION TIERS
CREATE TYPE subscription_tier AS ENUM ('free', 'premium', 'hi_fi_lossless', 'family');
CREATE TYPE audio_quality AS ENUM ('normal_96k', 'high_160k', 'very_high_320k', 'lossless_flac_192k');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    tier subscription_tier DEFAULT 'free',
    preferred_streaming_quality audio_quality DEFAULT 'very_high_320k',
    crossfade_duration_sec INT DEFAULT 3 CHECK (crossfade_duration_sec BETWEEN 0 AND 12),
    volume_normalization BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. ARTISTS
CREATE TABLE artists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    bio TEXT,
    avatar_url TEXT NOT NULL,
    banner_url TEXT,
    monthly_listeners BIGINT DEFAULT 0,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX idx_artists_name ON artists(name);

-- 3. ALBUMS
CREATE TABLE albums (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
    cover_art_url TEXT NOT NULL,
    release_date DATE NOT NULL,
    record_label VARCHAR(150),
    total_tracks INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX idx_albums_artist ON albums(artist_id);

-- 4. TRACKS & AUDIO ENCODINGS
CREATE TABLE tracks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
    album_id UUID NOT NULL REFERENCES albums(id) ON DELETE CASCADE,
    duration_seconds INT NOT NULL,
    track_number INT NOT NULL,
    isrc_code VARCHAR(20) UNIQUE,
    hls_master_url TEXT NOT NULL,         -- https://cdn.aura.audio/tracks/{id}/master.m3u8
    audio_s3_key TEXT NOT NULL,           -- s3://audio-vault/masters/{id}.flac
    bpm INT,
    key_signature VARCHAR(10),
    dominant_hex_color VARCHAR(7) DEFAULT '#8b5cf6',
    plays_count BIGINT DEFAULT 0,
    hi_res_lossless_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX idx_tracks_artist ON tracks(artist_id);
CREATE INDEX idx_tracks_album ON tracks(album_id);
CREATE INDEX idx_tracks_plays ON tracks(plays_count DESC);

-- 5. PLAYLISTS
CREATE TYPE playlist_category AS ENUM ('daily_dynamic', 'genre_mood', 'user_custom', 'system_utility');

CREATE TABLE playlists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    cover_art_url TEXT,
    category playlist_category DEFAULT 'user_custom',
    owner_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    is_public BOOLEAN DEFAULT TRUE,
    is_collaborative BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. PLAYLIST TRACKS (MANY-TO-MANY WITH ORDERING)
CREATE TABLE playlist_tracks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    playlist_id UUID NOT NULL REFERENCES playlists(id) ON DELETE CASCADE,
    track_id UUID NOT NULL REFERENCES tracks(id) ON DELETE CASCADE,
    position INT NOT NULL,
    added_by_user_id UUID REFERENCES users(id),
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (playlist_id, position),
    UNIQUE (playlist_id, track_id)
);
CREATE INDEX idx_playlist_tracks_playlist ON playlist_tracks(playlist_id, position);

-- 7. USER LIKED TRACKS (FAVORITES)
CREATE TABLE user_track_likes (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    track_id UUID NOT NULL REFERENCES tracks(id) ON DELETE CASCADE,
    liked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (user_id, track_id)
);
CREATE INDEX idx_likes_user ON user_track_likes(user_id, liked_at DESC);

-- 8. LISTENING HISTORY & REAL-TIME ANALYTICS
CREATE TABLE listening_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    track_id UUID NOT NULL REFERENCES tracks(id) ON DELETE CASCADE,
    played_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    duration_listened_sec INT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    device_type VARCHAR(50)
);
CREATE INDEX idx_history_user_time ON listening_history(user_id, played_at DESC);`;

const MONGO_JSON_SCHEMA = `{
  "_id": "64f9b8c01d4a8e2b8c9d1001",
  "trackId": "d3b07384-d113-404d-b657-b08e7542d999",
  "waveform": [
    0.15, 0.25, 0.40, 0.60, 0.75, 0.82, 0.68, 0.55, 0.72, 0.90,
    0.85, 0.70, 0.45, 0.60, 0.88, 0.95, 0.80, 0.65, 0.50, 0.78
  ],
  "syncedLyrics": [
    { "timeMs": 0, "text": "[Instrumental Intro — Atmospheric synth pads]" },
    { "timeMs": 6200, "text": "Streetlights bleeding through the silver mist" },
    { "timeMs": 13400, "text": "Shadows dancing on the city bridge" },
    { "timeMs": 20100, "text": "Fading echoes of the yesterday we left behind" },
    { "timeMs": 28500, "text": "Take my hand and watch the midnight glow collide" }
  ],
  "colorPalette": {
    "dominant": "#8b5cf6",
    "accent": "#c084fc",
    "background": "#09090b",
    "lightVibrant": "#d8b4fe"
  },
  "acousticFeatures": {
    "danceability": 0.74,
    "energy": 0.82,
    "valence": 0.65,
    "acousticness": 0.12,
    "instrumentalness": 0.28,
    "speechiness": 0.04,
    "vectorEmbedding": [0.042, -0.198, 0.441, 0.812, -0.055, 0.319]
  }
}`;

const API_ENDPOINTS_SPEC = `# AURA MUSIC REST & WEBSOCKET API SPECIFICATION (v1)

## Authentication & Profiles
POST   /api/v1/auth/register               # Body: { email, password, displayName } -> 201 { token, user }
POST   /api/v1/auth/login                  # Body: { email, password } -> 200 { token, user }
GET    /api/v1/users/me                    # Header: Bearer <JWT> -> 200 User Profile & Tier
PATCH  /api/v1/users/me/audio-settings     # Body: { quality, crossfadeSec, volumeNorm, eqBands }

## Tracks & Audio Streaming
GET    /api/v1/tracks/{id}                 # 200 Track metadata, duration, album art, dominantColor
GET    /api/v1/tracks/{id}/stream.m3u8     # 200 Returns signed HLS Master Playlist manifest
GET    /api/v1/tracks/{id}/lyrics          # 200 Returns synchronized line-by-line timestamped lyrics
POST   /api/v1/tracks/{id}/like            # 200 Quick toggle favorite status
POST   /api/v1/tracks/{id}/log-play        # 201 Logs listening history event for recommendation ML

## Playlists Catalog
GET    /api/v1/playlists/daily-mixes       # 200 Returns Daily Discover, Chill & Unwind, Energy Booster
GET    /api/v1/playlists/genre-mood        # 200 Top Charts, Focus & Study, Late Night Vibes
GET    /api/v1/playlists/me                # 200 User utility playlists (Liked, Downloaded, Custom)
POST   /api/v1/playlists                   # 201 Creates user playlist { title, description, isPublic }
POST   /api/v1/playlists/{id}/tracks       # 201 Adds track { trackId, position }
DELETE /api/v1/playlists/{id}/tracks/{tId} # 200 Removes track from playlist

## Search & Recommendations
GET    /api/v1/search                      # Query params: ?q=synthwave&genre=electronic&mood=chill
GET    /api/v1/search/voice-query          # Voice STT processor -> matches best matching intent
GET    /api/v1/recommendations/radio       # Seed track/artist -> cosine similarity playlist queue

## Offline DRM & License
POST   /api/v1/drm/offline-license         # Exchanges track token for encrypted AES-256 local key

## Real-Time Social Listening Rooms (WebSocket: /ws/listening-room)
CLIENT -> SERVER:
  - "room:join"     { roomId, userId, clientTime }
  - "playback:sync" { roomId, trackId, currentTimeMs, isPlaying, hostTimestamp }
  - "reaction:send" { roomId, emoji: "🔥" | "❤️" | "🎶" }
  - "chat:message"  { roomId, text: "Loving this synth drop!" }
SERVER -> CLIENT:
  - "room:state"    { currentTrack, currentTimeMs, hostId, activeListeners: [...] }
  - "reaction:broadcast" { emoji, senderName, xCoordinate }`;

const PROJECT_FOLDER_TREE = `aura-music-monorepo/
├── apps/
│   ├── mobile/                    # Flutter or React Native client
│   │   ├── lib/ (or src/)
│   │   │   ├── audio_engine/      # Native C++/JSI Audio Service, HLS cache, Crossfade DSP
│   │   │   ├── blocs_or_stores/   # State management (Playback, Auth, Library, Rooms)
│   │   │   ├── screens/
│   │   │   │   ├── home/          # Personalized feed, daily discover, charts
│   │   │   │   ├── explore/       # Voice search, genre grid, mood filters
│   │   │   │   ├── library/       # Liked songs, offline downloads, playlists
│   │   │   │   ├── player/        # Fullscreen now playing, waveform, synced lyrics
│   │   │   │   └── settings/      # 5-band EQ, streaming quality, cache manager
│   │   │   ├── widgets_or_components/
│   │   │   │   ├── mini_player/
│   │   │   │   ├── waveform_scrubber/
│   │   │   │   └── output_switcher/
│   │   │   └── main.dart (or App.tsx)
│   │   ├── ios/
│   │   └── android/
│   │
│   ├── api-gateway/               # Node.js (NestJS) API Gateway & WebSocket Server
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   ├── auth/          # JWT, Refresh Tokens, OAuth2
│   │   │   │   ├── tracks/        # S3 presigned URLs, HLS manifest generators
│   │   │   │   ├── playlists/     # PostgreSQL relational CRUD
│   │   │   │   └── rooms/         # WebSockets / Socket.IO Live Room Sync Engine
│   │   │   └── main.ts
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   └── ml-recommendation-service/ # Python (FastAPI) RecSys Microservice
│       ├── models/                # PyTorch Two-Tower Vector Embedding Models
│       ├── services/
│       │   ├── collaborative_filter.py
│       │   └── sonic_vector_search.py
│       ├── main.py
│       └── requirements.txt
│
├── services/
│   └── audio-transcoder-worker/   # FFmpeg worker for HLS chunking & AES DRM packaging
│       ├── transcode.sh
│       └── worker.ts
│
├── infrastructure/
│   ├── terraform/                 # AWS S3, CloudFront CDN, RDS Postgres, ElastiCache Redis
│   └── k8s/                       # Kubernetes deployment manifests
└── README.md`;
