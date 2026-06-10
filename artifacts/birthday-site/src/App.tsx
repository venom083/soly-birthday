import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Lock, Heart, Flower, Moon, Gift, Volume2, VolumeX, Download, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const PASSWORD = "hmada love soly";
const START_DATE = new Date(2025, 6, 24);

// ── Game constants ──────────────────────────────────────────
const CW = 680;
const CH = 380;
const CHAR_R = 28;
const CANDY_R = 13;
const SPD = 3.2;
const GAME_SECS = 60;
const WIN_PTS = 50;
const CANDY_EVERY_MS = 2800;

function rrect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

interface Candy { id: number; x: number; y: number; }
interface Char { x: number; y: number; score: number; }
interface GData {
  k: Char; w: Char;
  candies: Candy[];
  timer: number;
  running: boolean;
  lastSec: number;
  lastCandy: number;
  candyId: number;
}

// ── Root component ──────────────────────────────────────────
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === PASSWORD) {
      setIsAuthenticated(true);
      setError(false);
    } else {
      setError(true);
      setTimeout(() => setError(false), 500);
    }
  };

  useEffect(() => {
    if (isAuthenticated && audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
  }, [isAuthenticated]);

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-rose-50 to-pink-100 p-4 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-rose-300 via-transparent to-transparent" />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full z-10">
          <Card className="border-rose-100 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="pt-6 pb-8 px-8 text-center space-y-6">
              <div className="mx-auto w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mb-4">
                <Lock className="w-8 h-8 text-rose-500" />
              </div>
              <h1 className="text-3xl font-bold text-rose-950">إشراقة قمر جديدة</h1>
              <p className="text-rose-700">أدخلي كلمة السر لتفتحي هديتكِ</p>
              <form onSubmit={handleLogin} className="space-y-4">
                <motion.div animate={error ? { x: [-10, 10, -10, 10, 0] } : {}} transition={{ duration: 0.4 }}>
                  <Input
                    type="password"
                    placeholder="كلمة السر..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="text-center text-lg border-rose-200 focus-visible:ring-rose-400"
                    data-testid="input-password"
                  />
                </motion.div>
                {error && <p className="text-sm text-red-500">كلمة السر غير صحيحة حاولي مرة أخرى 💔</p>}
                <Button type="submit" className="w-full bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white border-0" data-testid="button-submit-login">
                  دخول
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-rose-50/30 text-rose-950 relative selection:bg-rose-200 selection:text-rose-900">
      <audio ref={audioRef} src="/assets/nsheed.mp3" loop />
      <div className="fixed top-4 right-4 z-50">
        <Button variant="outline" size="icon" onClick={toggleMute} className="rounded-full bg-white/50 backdrop-blur border-rose-200 text-rose-600 hover:bg-rose-100" data-testid="button-mute">
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </Button>
      </div>
      <main className="max-w-4xl mx-auto px-4 py-12 space-y-32">
        <WelcomeSection onNavigate={scrollTo} />
        <CalendarSection />
        <MemoriesSection />
        <CountdownSection />
        <GameSection />
      </main>
    </div>
  );
}

// ── Welcome ─────────────────────────────────────────────────
function WelcomeSection({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 0.2 }}
      className="min-h-[80vh] flex flex-col items-center justify-center text-center space-y-12"
    >
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.5 }}>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-l from-rose-400 via-pink-500 to-purple-500 bg-clip-text text-transparent leading-relaxed py-4">
            أأهديكِ زهرًا وأنتِ العبير،<br /> الذي كان بكِ كم وقتي يطيب
          </h1>
        </motion.div>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1 }} className="text-xl md:text-2xl text-rose-700/80 max-w-2xl mx-auto leading-loose">
          إلى من أضاءت حياتي بنورها، وجعلت كل أيامي عيداً
        </motion.p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1.5 }} className="flex flex-wrap gap-4 justify-center">
        <Button onClick={() => onNavigate("calendar")} className="bg-white text-rose-600 hover:bg-rose-50 border border-rose-200 shadow-sm text-lg py-6 px-8 rounded-full" data-testid="nav-calendar">هدايا أيامكِ</Button>
        <Button onClick={() => onNavigate("memories")} className="bg-white text-rose-600 hover:bg-rose-50 border border-rose-200 shadow-sm text-lg py-6 px-8 rounded-full" data-testid="nav-memories">ذكريات عيد ميلادكِ السابق</Button>
        <Button onClick={() => onNavigate("countdown")} className="bg-white text-rose-600 hover:bg-rose-50 border border-rose-200 shadow-sm text-lg py-6 px-8 rounded-full" data-testid="nav-countdown">العد التنازلي لميلادكِ</Button>
        <Button onClick={() => onNavigate("game")} className="bg-gradient-to-r from-green-400 to-emerald-500 text-white border-0 shadow-sm text-lg py-6 px-8 rounded-full hover:from-green-500 hover:to-emerald-600" data-testid="nav-game">🍉 لعبة كستر والبطيخة</Button>
      </motion.div>
    </motion.section>
  );
}

// ── Calendar ─────────────────────────────────────────────────
function CalendarSection() {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const today = new Date();

  const days = Array.from({ length: 8 }, (_, i) => {
    const dayDate = new Date(START_DATE);
    dayDate.setDate(START_DATE.getDate() + i);
    return { index: i, date: dayDate, isUnlocked: today >= dayDate };
  });

  const unlockedCount = days.filter(d => d.isUnlocked).length;

  return (
    <section id="calendar" className="scroll-mt-24 space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold text-rose-900">هداياكِ على مدار الأيام</h2>
        <p className="text-lg text-rose-700 max-w-2xl mx-auto">شكراً لمشاركتي أفضل لحظات حياتي، هذه هدية بسيطة أقدمها لكِ وأرجو وأدعو الله أن تكوني سكنًا لي</p>
        <div className="inline-flex items-center gap-2 bg-rose-100/50 px-4 py-2 rounded-full text-rose-700 text-sm font-medium">
          <Gift className="w-4 h-4" /> تم فتح {unlockedCount} من 8 هدايا
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {days.map((day) => (
          <motion.div key={day.index} whileHover={day.isUnlocked ? { scale: 1.05 } : {}} whileTap={day.isUnlocked ? { scale: 0.95 } : {}}>
            <Card
              className={`h-full cursor-pointer transition-all duration-300 ${day.isUnlocked ? "bg-white border-rose-200 hover:border-rose-400 hover:shadow-lg hover:shadow-rose-100 group" : "bg-gray-50 border-dashed border-gray-200 opacity-60 cursor-not-allowed"}`}
              onClick={() => day.isUnlocked && setSelectedDay(day.index)}
              data-testid={`card-gift-${day.index}`}
            >
              <CardContent className="flex flex-col items-center justify-center p-6 space-y-4 aspect-square">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${day.isUnlocked ? "bg-rose-100 text-rose-500 group-hover:bg-rose-200" : "bg-gray-200 text-gray-400"}`}>
                  {day.isUnlocked ? <Flower className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
                </div>
                <div className="text-center">
                  <h3 className={`font-bold text-lg ${day.isUnlocked ? "text-rose-900" : "text-gray-500"}`}>اليوم {day.index + 1}</h3>
                  <p className="text-sm text-gray-500">{day.date.getDate()}/{day.date.getMonth() + 1}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      <Dialog open={selectedDay !== null} onOpenChange={(open) => !open && setSelectedDay(null)}>
        <DialogContent className="max-w-4xl w-[95vw] h-[85vh] p-0 overflow-hidden bg-white/95 backdrop-blur border-rose-200 flex flex-col">
          <DialogHeader className="p-4 border-b border-rose-100 bg-white/50 absolute top-0 w-full z-10 flex flex-row items-center justify-between space-y-0">
            <DialogTitle className="text-xl text-rose-900">هدية اليوم {selectedDay !== null ? selectedDay + 1 : ''}</DialogTitle>
            <Button asChild variant="outline" size="sm" className="text-rose-600 border-rose-200 hover:bg-rose-50">
              <a href={`/pdfs/day${selectedDay !== null ? selectedDay + 1 : 1}.pdf`} download data-testid="button-download-pdf">
                <Download className="w-4 h-4 ml-2" /> تحميل الهدية
              </a>
            </Button>
          </DialogHeader>
          <div className="flex-1 mt-[73px] bg-rose-50/30">
            {selectedDay !== null && <iframe src={`/pdfs/day${selectedDay + 1}.pdf`} className="w-full h-full border-0" title={`Gift Day ${selectedDay + 1}`} />}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}

// ── Memories ─────────────────────────────────────────────────
function MemoriesSection() {
  const memories = [
    { text: "كانت تلك اللحظات من أجمل ما عشته", icon: Heart },
    { text: "ذكريات لا تُنسى في كل عيد ميلاد", icon: Flower },
    { text: "كل سنة وأنتِ أجمل وأرقى", icon: Moon },
    { text: "شكراً لكِ على كل ابتسامة", icon: Gift },
  ];
  return (
    <section id="memories" className="scroll-mt-24 space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold text-rose-900">ذكريات عيد ميلادكِ الماضي</h2>
        <p className="text-lg text-rose-700/80 italic font-serif">"الذكريات الجميلة تبقى إلى الأبد في القلب"</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-6">
        {memories.map((memory, i) => {
          const Icon = memory.icon;
          return (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.5, delay: i * 0.1 }} whileHover={{ y: -5 }} className="bg-white/60 backdrop-blur p-6 rounded-2xl border border-rose-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="bg-gradient-to-br from-rose-100 to-pink-100 p-4 rounded-full text-rose-500 shrink-0">
                <Icon className="w-6 h-6" />
              </div>
              <p className="text-lg text-rose-900 font-medium">{memory.text}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

// ── Countdown ─────────────────────────────────────────────────
function CountdownSection() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isBirthday, setIsBirthday] = useState(false);

  useEffect(() => {
    const calc = () => {
      const now = new Date();
      let target = new Date(now.getFullYear(), 6, 24);
      if (now > target && !(now.getDate() === 24 && now.getMonth() === 6)) {
        target = new Date(now.getFullYear() + 1, 6, 24);
      }
      if (now.getDate() === 24 && now.getMonth() === 6) {
        setIsBirthday(true);
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }
      const diff = target.getTime() - now.getTime();
      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      };
    };
    setTimeLeft(calc());
    const t = setInterval(() => setTimeLeft(calc()), 1000);
    return () => clearInterval(t);
  }, []);

  const units = [
    { label: "الأيام", value: timeLeft.days },
    { label: "الساعات", value: timeLeft.hours },
    { label: "الدقائق", value: timeLeft.minutes },
    { label: "الثواني", value: timeLeft.seconds },
  ];

  return (
    <section id="countdown" className="scroll-mt-24 pb-16">
      <div className="bg-gradient-to-br from-rose-400 via-pink-500 to-purple-500 rounded-3xl p-8 md:p-12 text-white text-center shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10" />
        <div className="relative z-10 space-y-10">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-5xl font-bold">العد التنازلي ليوم ميلادكِ</h2>
            <p className="text-xl text-rose-100 font-medium tracking-wide">24 يوليو 🌸</p>
          </div>
          {isBirthday ? (
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="py-12">
              <h3 className="text-5xl md:text-7xl font-bold text-yellow-300 drop-shadow-md">عيد ميلاد سعيد يا سالي! 🌙</h3>
            </motion.div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto" dir="ltr">
              {units.map((u) => (
                <div key={u.label} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                  <motion.div key={u.value} initial={{ scale: 0.8, opacity: 0.5 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15 }} className="text-4xl md:text-6xl font-bold mb-2 font-mono">
                    {u.value.toString().padStart(2, '0')}
                  </motion.div>
                  <div className="text-rose-100 text-lg md:text-xl font-medium" dir="rtl">{u.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ── Game Section ──────────────────────────────────────────────
type Phase = 'idle' | 'playing' | 'gameover';

function GameSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gRef = useRef<GData | null>(null);
  const keysRef = useRef<Set<string>>(new Set());
  const animRef = useRef<number>(0);
  const kImgRef = useRef<HTMLImageElement | null>(null);
  const wImgRef = useRef<HTMLImageElement | null>(null);

  const [phase, setPhase] = useState<Phase>('idle');
  const [winner, setWinner] = useState('');
  const [scores, setScores] = useState({ k: 0, w: 0 });
  const [timeLeft, setTimeLeft] = useState(GAME_SECS);

  useEffect(() => {
    const ki = new Image(); ki.src = '/assets/kaster.png'; kImgRef.current = ki;
    const wi = new Image(); wi.src = '/assets/watermelon.png'; wImgRef.current = wi;
    return () => { cancelAnimationFrame(animRef.current); };
  }, []);

  const endGame = useCallback((g: GData, removeListeners: () => void) => {
    g.running = false;
    removeListeners();
    const kW = g.k.score >= WIN_PTS;
    const wW = g.w.score >= WIN_PTS;
    const won = kW ? '👤 كستر' : wW ? '🍉 البطيخة' : g.k.score > g.w.score ? '👤 كستر' : g.w.score > g.k.score ? '🍉 البطيخة' : 'تعادل!';
    setWinner(won);
    setScores({ k: g.k.score, w: g.w.score });
    setPhase('gameover');
  }, []);

  const startGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    cancelAnimationFrame(animRef.current);
    keysRef.current.clear();

    const g: GData = {
      k: { x: 90, y: CH / 2, score: 0 },
      w: { x: CW - 90, y: CH / 2, score: 0 },
      candies: [],
      timer: GAME_SECS,
      running: true,
      lastSec: performance.now(),
      lastCandy: performance.now() - CANDY_EVERY_MS / 2,
      candyId: 0,
    };
    gRef.current = g;
    setPhase('playing');
    setTimeLeft(GAME_SECS);
    setScores({ k: 0, w: 0 });
    setWinner('');

    const onDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.key);
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) e.preventDefault();
    };
    const onUp = (e: KeyboardEvent) => keysRef.current.delete(e.key);
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    const removeListeners = () => { window.removeEventListener('keydown', onDown); window.removeEventListener('keyup', onUp); };

    let last = performance.now();

    const loop = (now: number) => {
      if (!g.running) return;
      const dt = Math.min(now - last, 50);
      last = now;
      const spd = SPD * (dt / 16.67);
      const keys = keysRef.current;

      // Player
      if (keys.has('ArrowUp') || keys.has('w') || keys.has('W')) g.k.y = Math.max(CHAR_R, g.k.y - spd);
      if (keys.has('ArrowDown') || keys.has('s') || keys.has('S')) g.k.y = Math.min(CH - CHAR_R, g.k.y + spd);
      if (keys.has('ArrowLeft') || keys.has('a') || keys.has('A')) g.k.x = Math.max(CHAR_R, g.k.x - spd);
      if (keys.has('ArrowRight') || keys.has('d') || keys.has('D')) g.k.x = Math.min(CW - CHAR_R, g.k.x + spd);

      // AI
      let nearest: Candy | null = null;
      let nearDist = Infinity;
      for (const c of g.candies) {
        const d = Math.hypot(c.x - g.w.x, c.y - g.w.y);
        if (d < nearDist) { nearDist = d; nearest = c; }
      }
      const distToK = Math.hypot(g.w.x - g.k.x, g.w.y - g.k.y);
      let avx = 0, avy = 0;
      if (nearest) {
        const dx = nearest.x - g.w.x, dy = nearest.y - g.w.y;
        const d = Math.hypot(dx, dy);
        if (d > 0) { avx = (dx / d) * spd; avy = (dy / d) * spd; }
      }
      if (distToK < 110) {
        const dx = g.w.x - g.k.x, dy = g.w.y - g.k.y;
        const d = Math.hypot(dx, dy);
        if (d > 0) { avx += (dx / d) * spd * 0.6; avy += (dy / d) * spd * 0.6; }
      }
      if (!nearest) { avx = (CW / 2 - g.w.x) * 0.012; avy = (CH / 2 - g.w.y) * 0.012; }
      g.w.x = Math.max(CHAR_R, Math.min(CW - CHAR_R, g.w.x + avx));
      g.w.y = Math.max(CHAR_R, Math.min(CH - CHAR_R, g.w.y + avy));

      // Candy spawn
      if (now - g.lastCandy >= CANDY_EVERY_MS) {
        g.candies.push({ id: g.candyId++, x: CANDY_R + Math.random() * (CW - CANDY_R * 2), y: CANDY_R + Math.random() * (CH - CANDY_R * 2) });
        g.lastCandy = now;
      }

      // Candy pickup
      g.candies = g.candies.filter(c => {
        if (Math.hypot(c.x - g.k.x, c.y - g.k.y) < CHAR_R + CANDY_R) { g.k.score += 10; setScores({ k: g.k.score, w: g.w.score }); return false; }
        if (Math.hypot(c.x - g.w.x, c.y - g.w.y) < CHAR_R + CANDY_R) { g.w.score += 10; setScores({ k: g.k.score, w: g.w.score }); return false; }
        return true;
      });

      // Tick
      if (now - g.lastSec >= 1000) {
        g.timer = Math.max(0, g.timer - 1);
        g.k.score += 1; g.w.score += 1;
        g.lastSec = now;
        setTimeLeft(g.timer);
        setScores({ k: g.k.score, w: g.w.score });
      }

      // Win check
      if (g.k.score >= WIN_PTS || g.w.score >= WIN_PTS || g.timer <= 0) {
        endGame(g, removeListeners); return;
      }

      // Draw
      const ctx = canvas.getContext('2d')!;
      ctx.clearRect(0, 0, CW, CH);

      // Background
      const bg = ctx.createLinearGradient(0, 0, CW, CH);
      bg.addColorStop(0, '#f9f0ff'); bg.addColorStop(1, '#fff0f5');
      ctx.fillStyle = bg; ctx.fillRect(0, 0, CW, CH);

      // Grid dots
      ctx.fillStyle = 'rgba(180,130,170,0.12)';
      for (let gx = 20; gx < CW; gx += 40) for (let gy = 20; gy < CH; gy += 40) {
        ctx.beginPath(); ctx.arc(gx, gy, 2, 0, Math.PI * 2); ctx.fill();
      }

      // Boundary
      ctx.strokeStyle = 'rgba(242,138,178,0.3)'; ctx.lineWidth = 3;
      rrect(ctx, 4, 4, CW - 8, CH - 8, 16); ctx.stroke();

      // Candies
      ctx.font = `${CANDY_R * 2}px serif`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      for (const c of g.candies) ctx.fillText('🍬', c.x, c.y);

      // Kaster shadow
      ctx.fillStyle = 'rgba(242,138,178,0.2)';
      ctx.beginPath(); ctx.ellipse(g.k.x, g.k.y + CHAR_R + 4, CHAR_R * 0.8, 6, 0, 0, Math.PI * 2); ctx.fill();

      // Watermelon shadow
      ctx.fillStyle = 'rgba(80,180,80,0.2)';
      ctx.beginPath(); ctx.ellipse(g.w.x, g.w.y + CHAR_R + 4, CHAR_R * 0.8, 6, 0, 0, Math.PI * 2); ctx.fill();

      // Draw kaster
      if (kImgRef.current?.complete && kImgRef.current.naturalWidth > 0) {
        ctx.drawImage(kImgRef.current, g.k.x - CHAR_R, g.k.y - CHAR_R, CHAR_R * 2, CHAR_R * 2);
      } else {
        ctx.fillStyle = '#f28ab2'; ctx.beginPath(); ctx.arc(g.k.x, g.k.y, CHAR_R, 0, Math.PI * 2); ctx.fill();
      }
      // Label kaster
      ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.font = 'bold 11px Cairo'; ctx.textAlign = 'center';
      rrect(ctx, g.k.x - 22, g.k.y - CHAR_R - 20, 44, 18, 6); ctx.fill();
      ctx.fillStyle = '#b25d91'; ctx.fillText('كستر', g.k.x, g.k.y - CHAR_R - 8);

      // Draw watermelon
      if (wImgRef.current?.complete && wImgRef.current.naturalWidth > 0) {
        ctx.drawImage(wImgRef.current, g.w.x - CHAR_R, g.w.y - CHAR_R, CHAR_R * 2, CHAR_R * 2);
      } else {
        ctx.fillStyle = '#4caf50'; ctx.beginPath(); ctx.arc(g.w.x, g.w.y, CHAR_R, 0, Math.PI * 2); ctx.fill();
      }
      // Label watermelon
      ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.font = 'bold 11px Cairo'; ctx.textAlign = 'center';
      rrect(ctx, g.w.x - 30, g.w.y - CHAR_R - 20, 60, 18, 6); ctx.fill();
      ctx.fillStyle = '#2d6a2d'; ctx.fillText('البطيخة', g.w.x, g.w.y - CHAR_R - 8);

      // HUD
      ctx.fillStyle = 'rgba(255,255,255,0.88)';
      rrect(ctx, 8, 8, 160, 52, 10); ctx.fill();
      ctx.fillStyle = '#b25d91'; ctx.font = 'bold 13px Cairo'; ctx.textAlign = 'right';
      ctx.fillText(`${g.k.score} :كستر`, 162, 28);
      ctx.fillStyle = '#2d7d2d';
      ctx.fillText(`${g.w.score} :البطيخة`, 162, 50);

      // Timer
      ctx.fillStyle = g.timer <= 10 ? 'rgba(255,100,100,0.9)' : 'rgba(255,255,255,0.88)';
      rrect(ctx, CW / 2 - 36, 8, 72, 36, 10); ctx.fill();
      ctx.fillStyle = g.timer <= 10 ? '#fff' : '#7c3d6e';
      ctx.font = `bold 20px Cairo`; ctx.textAlign = 'center';
      ctx.fillText(`${g.timer}`, CW / 2, 32);

      // Win target reminder
      ctx.fillStyle = 'rgba(255,255,255,0.75)';
      rrect(ctx, CW - 110, 8, 102, 24, 8); ctx.fill();
      ctx.fillStyle = '#999'; ctx.font = '11px Cairo'; ctx.textAlign = 'center';
      ctx.fillText(`هدف: ${WIN_PTS} نقطة`, CW - 59, 24);

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
  }, [endGame]);

  // Touch / on-screen dpad
  const addKey = (k: string) => keysRef.current.add(k);
  const delKey = (k: string) => keysRef.current.delete(k);

  const dpadBtn = (icon: React.ReactNode, key: string, label: string) => (
    <button
      className="w-14 h-14 bg-white/70 border-2 border-rose-200 rounded-xl flex items-center justify-center text-rose-600 shadow-sm active:bg-rose-100 select-none touch-none"
      onPointerDown={() => addKey(key)}
      onPointerUp={() => delKey(key)}
      onPointerLeave={() => delKey(key)}
      aria-label={label}
      data-testid={`dpad-${label}`}
    >
      {icon}
    </button>
  );

  return (
    <section id="game" className="scroll-mt-24 pb-24 space-y-8">
      <div className="text-center space-y-3">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold bg-gradient-to-l from-green-500 to-emerald-600 bg-clip-text text-transparent"
        >
          🍉 كستر ضد البطيخة – لعبة التحدي
        </motion.h2>
        <p className="text-rose-700 text-base max-w-xl mx-auto">
          تحكم بـ كستر باستخدام الأسهم أو WASD، واجمع 🍬 السكاكر قبل البطيخة! أول من يصل لـ {WIN_PTS} نقطة يفوز — أو أعلى نقاط بعد {GAME_SECS} ثانية!
        </p>
      </div>

      <div className="flex flex-col items-center gap-4">
        {/* Score bar (during game) */}
        {phase === 'playing' && (
          <div className="flex items-center gap-6 text-lg font-bold w-full max-w-lg">
            <div className="flex-1 text-center bg-rose-50 border border-rose-200 rounded-xl py-2 px-4">
              <span className="text-rose-700">👤 كستر</span>
              <span className="ml-2 text-2xl text-rose-900">{scores.k}</span>
            </div>
            <div className="text-rose-400 text-sm">VS</div>
            <div className="flex-1 text-center bg-green-50 border border-green-200 rounded-xl py-2 px-4">
              <span className="text-green-700">🍉 البطيخة</span>
              <span className="ml-2 text-2xl text-green-900">{scores.w}</span>
            </div>
          </div>
        )}

        {/* Canvas */}
        <div className="relative w-full max-w-[700px] overflow-x-auto">
          <canvas
            ref={canvasRef}
            width={CW}
            height={CH}
            className="rounded-2xl border-2 border-rose-200 shadow-lg w-full"
            style={{ maxHeight: '55vw', objectFit: 'contain' }}
            data-testid="game-canvas"
          />

          {/* Idle overlay */}
          {phase === 'idle' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm rounded-2xl gap-4">
              <div className="text-center space-y-2">
                <p className="text-2xl font-bold text-rose-800">🎮 جاهز للعب؟</p>
                <p className="text-rose-600 text-sm">حرك كستر واجمع السكاكر بسرعة!</p>
              </div>
              <Button onClick={startGame} className="bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xl px-10 py-6 rounded-2xl border-0 shadow-lg hover:scale-105 transition-transform" data-testid="button-start-game">
                ابدأ اللعبة!
              </Button>
            </div>
          )}

          {/* Game over overlay */}
          {phase === 'gameover' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm rounded-2xl gap-4">
              <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center space-y-3">
                <p className="text-xl text-rose-700">انتهت اللعبة!</p>
                <p className="text-3xl font-bold text-rose-900">{winner === 'تعادل!' ? '🤝 تعادل!' : `الفائز: ${winner} 🏆`}</p>
                <div className="flex gap-8 justify-center mt-2 text-lg font-bold">
                  <span className="text-rose-700">👤 كستر: {scores.k}</span>
                  <span className="text-green-700">🍉 البطيخة: {scores.w}</span>
                </div>
              </motion.div>
              <Button onClick={startGame} className="bg-gradient-to-r from-green-400 to-emerald-500 text-white text-lg px-8 py-5 rounded-2xl border-0 shadow-lg hover:scale-105 transition-transform" data-testid="button-restart-game">
                العب مجدداً!
              </Button>
            </div>
          )}
        </div>

        {/* Mobile D-pad */}
        <div className="flex flex-col items-center gap-1 mt-2 md:hidden">
          <div>{dpadBtn(<ChevronUp className="w-6 h-6" />, 'ArrowUp', 'up')}</div>
          <div className="flex gap-1">
            {dpadBtn(<ChevronLeft className="w-6 h-6" />, 'ArrowLeft', 'left')}
            {dpadBtn(<ChevronDown className="w-6 h-6" />, 'ArrowDown', 'down')}
            {dpadBtn(<ChevronRight className="w-6 h-6" />, 'ArrowRight', 'right')}
          </div>
          <p className="text-xs text-rose-400 mt-1">تحكم بكستر</p>
        </div>

        <p className="text-xs text-rose-400 hidden md:block">كيبورد: WASD أو الأسهم للتحرك</p>
      </div>
    </section>
  );
}

