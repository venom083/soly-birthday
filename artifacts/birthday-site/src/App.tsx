import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Lock, Heart, Flower, Moon, Gift, Volume2, VolumeX, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// ═══════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════
const PASSWORD = "hmada love soly";
const START_DATE = new Date(2025, 6, 24); // July 24, 2025
const GIFT_DAYS = 8;

// Game constants
const CANVAS_W = 680;
const CANVAS_H = 380;
const CHAR_RADIUS = 28;
const CANDY_RADIUS = 13;
const MOVE_SPEED = 3.2;
const GAME_TIME = 60;
const WIN_POINTS = 50;
const SPAWN_INTERVAL = 2800;

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════
interface Candy {
  id: number;
  x: number;
  y: number;
}

interface Character {
  x: number;
  y: number;
  score: number;
}

interface GameState {
  player: Character;
  ai: Character;
  candies: Candy[];
  timer: number;
  isRunning: boolean;
  lastSecondTime: number;
  lastSpawnTime: number;
  nextCandyId: number;
}

type GamePhase = "idle" | "playing" | "gameover";

// ═══════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
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

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

function distance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.hypot(x2 - x1, y2 - y1);
}

// ═══════════════════════════════════════════════════════════
// MAIN APP COMPONENT
// ═══════════════════════════════════════════════════════════

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === PASSWORD) {
      setIsAuthenticated(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
      setTimeout(() => setPasswordError(false), 500);
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

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (!isAuthenticated) {
    return <LoginScreen onSubmit={handleLogin} password={password} setPassword={setPassword} error={passwordError} />;
  }

  return (
    <div className="min-h-screen bg-rose-50/30 text-rose-950 relative selection:bg-rose-200 selection:text-rose-900">
      <audio ref={audioRef} src="/assets/nsheed.mp3" loop />
      
      {/* Mute Button */}
      <div className="fixed top-4 right-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleMute}
          className="rounded-full bg-white/50 backdrop-blur border-rose-200 text-rose-600 hover:bg-rose-100"
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </Button>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12 space-y-32">
        <WelcomeSection onNavigate={scrollToSection} />
        <GiftsSection />
        <MemoriesSection />
        <CountdownSection />
        <GameSection />
      </main>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// LOGIN SCREEN
// ═══════════════════════════════════════════════════════════

interface LoginScreenProps {
  onSubmit: (e: React.FormEvent) => void;
  password: string;
  setPassword: (p: string) => void;
  error: boolean;
}

function LoginScreen({ onSubmit, password, setPassword, error }: LoginScreenProps) {
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
            
            <form onSubmit={onSubmit} className="space-y-4">
              <motion.div animate={error ? { x: [-10, 10, -10, 10, 0] } : {}} transition={{ duration: 0.4 }}>
                <Input
                  type="password"
                  placeholder="كلمة السر..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="text-center text-lg border-rose-200 focus-visible:ring-rose-400"
                />
              </motion.div>
              {error && <p className="text-sm text-red-500">كلمة السر غير صحيحة حاولي مرة أخرى 💔</p>}
              <Button type="submit" className="w-full bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white border-0">
                دخول
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// WELCOME SECTION
// ═══════════════════════════════════════════════════════════

function WelcomeSection({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 0.2 }}
      className="min-h-[80vh] flex flex-col items-center justify-center text-center space-y-12"
    >
      <div className="space-y-6">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-4xl md:text-6xl font-bold bg-gradient-to-l from-rose-400 via-pink-500 to-purple-500 bg-clip-text text-transparent leading-relaxed py-4"
        >
          أأهديكِ زهرًا وأنتِ العبير، <br /> الذي كان بكِ كم وقتي يطيب
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="text-xl md:text-2xl text-rose-700/80 max-w-2xl mx-auto leading-loose"
        >
          إلى من أضاءت حياتي بنورها، وجعلت كل أيامي عيداً
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="flex flex-wrap gap-4 justify-center"
      >
        <NavButton label="هدايا أيامكِ" onClick={() => onNavigate("gifts")} />
        <NavButton label="ذكريات عيد ميلادكِ السابق" onClick={() => onNavigate("memories")} />
        <NavButton label="العد التنازلي لميلادكِ" onClick={() => onNavigate("countdown")} />
        <NavButton label="🍉 لعبة كستر والبطيخة" onClick={() => onNavigate("game")} isPrimary />
      </motion.div>
    </motion.section>
  );
}

function NavButton({ label, onClick, isPrimary }: { label: string; onClick: () => void; isPrimary?: boolean }) {
  return (
    <Button
      onClick={onClick}
      className={isPrimary ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white border-0 shadow-sm text-lg py-6 px-8 rounded-full hover:from-green-500 hover:to-emerald-600" : "bg-white text-rose-600 hover:bg-rose-50 border border-rose-200 shadow-sm text-lg py-6 px-8 rounded-full"}
    >
      {label}
    </Button>
  );
}

// ═══════════════════════════════════════════════════════════
// GIFTS SECTION
// ═══════════════════════════════════════════════════════════

function GiftsSection() {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const today = new Date();

  const days = Array.from({ length: GIFT_DAYS }, (_, i) => {
    const d = new Date(START_DATE);
    d.setDate(START_DATE.getDate() + i);
    return {
      index: i,
      date: d,
      isUnlocked: today >= d,
    };
  });

  const unlockedCount = days.filter((d) => d.isUnlocked).length;

  return (
    <section id="gifts" className="scroll-mt-24 space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold text-rose-900">هداياكِ على مدار الأيام</h2>
        <p className="text-lg text-rose-700 max-w-2xl mx-auto">شكراً لمشاركتي أفضل لحظات حياتي، هذه هدية بسيطة أقدمها لكِ</p>
        <div className="inline-flex items-center gap-2 bg-rose-100/50 px-4 py-2 rounded-full text-rose-700 text-sm font-medium">
          <Gift className="w-4 h-4" /> تم فتح {unlockedCount} من {GIFT_DAYS} هدايا
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {days.map((day) => (
          <motion.div key={day.index} whileHover={day.isUnlocked ? { scale: 1.05 } : {}} whileTap={day.isUnlocked ? { scale: 0.95 } : {}}>
            <Card
              className={`h-full cursor-pointer transition-all duration-300 ${day.isUnlocked ? "bg-white border-rose-200 hover:border-rose-400 hover:shadow-lg hover:shadow-rose-100" : "bg-gray-50 border-dashed border-gray-200 opacity-60 cursor-not-allowed"}`}
              onClick={() => day.isUnlocked && setSelectedDay(day.index)}
            >
              <CardContent className="flex flex-col items-center justify-center p-6 space-y-4 aspect-square">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${day.isUnlocked ? "bg-rose-100 text-rose-500" : "bg-gray-200 text-gray-400"}`}>
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
            <DialogTitle className="text-xl text-rose-900">هدية اليوم {selectedDay !== null ? selectedDay + 1 : ""}</DialogTitle>
            <Button asChild variant="outline" size="sm" className="text-rose-600 border-rose-200 hover:bg-rose-50">
              <a href={`/pdfs/day${selectedDay !== null ? selectedDay + 1 : 1}.pdf`} download>
                <Download className="w-4 h-4 ml-2" /> تحميل
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

// ═══════════════════════════════════════════════════════════
// MEMORIES SECTION
// ═══════════════════════════════════════════════════════════

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
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white/60 backdrop-blur p-6 rounded-2xl border border-rose-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow"
            >
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

// ═══════════════════════════════════════════════════════════
// COUNTDOWN SECTION
// ═══════════════════════════════════════════════════════════

function CountdownSection() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isBirthday, setIsBirthday] = useState(false);

  useEffect(() => {
    const calculateCountdown = () => {
      const now = new Date();
      let target = new Date(now.getFullYear(), 6, 24); // July 24

      // If we've passed the date this year, target next year
      if (now > target && !(now.getDate() === 24 && now.getMonth() === 6)) {
        target = new Date(now.getFullYear() + 1, 6, 24);
      }

      // Check if today is the birthday
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

    setTimeLeft(calculateCountdown());
    const interval = setInterval(() => setTimeLeft(calculateCountdown()), 1000);
    return () => clearInterval(interval);
  }, []);

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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
              <CountdownUnit label="الأيام" value={timeLeft.days} />
              <CountdownUnit label="الساعات" value={timeLeft.hours} />
              <CountdownUnit label="الدقائق" value={timeLeft.minutes} />
              <CountdownUnit label="الثواني" value={timeLeft.seconds} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function CountdownUnit({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
      <motion.div key={value} initial={{ scale: 0.8, opacity: 0.5 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15 }} className="text-4xl md:text-6xl font-bold mb-2 font-mono">
        {value.toString().padStart(2, "0")}
      </motion.div>
      <div className="text-rose-100 text-lg md:text-xl font-medium">{label}</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// GAME SECTION
// ═══════════════════════════════════════════════════════════

function GameSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameStateRef = useRef<GameState | null>(null);
  const keysRef = useRef<Set<string>>(new Set());
  const animationIdRef = useRef<number>(0);
  const playerImageRef = useRef<HTMLImageElement | null>(null);
  const aiImageRef = useRef<HTMLImageElement | null>(null);

  const [phase, setPhase] = useState<GamePhase>("idle");
  const [winner, setWinner] = useState("");
  const [scores, setScores] = useState({ player: 0, ai: 0 });
  const [timeLeft, setTimeLeft] = useState(GAME_TIME);

  // Load images
  useEffect(() => {
    const playerImg = new Image();
    playerImg.src = "/assets/kaster.png";
    playerImageRef.current = playerImg;

    const aiImg = new Image();
    aiImg.src = "/assets/watermelon.png";
    aiImageRef.current = aiImg;

    return () => {
      cancelAnimationFrame(animationIdRef.current);
    };
  }, []);

  // Draw functions
  const drawGame = useCallback((ctx: CanvasRenderingContext2D, game: GameState) => {
    // Background
    const bg = ctx.createLinearGradient(0, 0, CANVAS_W, CANVAS_H);
    bg.addColorStop(0, "#f9f0ff");
    bg.addColorStop(1, "#fff0f5");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // Grid
    ctx.fillStyle = "rgba(180,130,170,0.12)";
    for (let x = 20; x < CANVAS_W; x += 40) {
      for (let y = 20; y < CANVAS_H; y += 40) {
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Boundary
    ctx.strokeStyle = "rgba(242,138,178,0.3)";
    ctx.lineWidth = 3;
    drawRoundedRect(ctx, 4, 4, CANVAS_W - 8, CANVAS_H - 8, 16);
    ctx.stroke();

    // Candies
    ctx.font = `${CANDY_RADIUS * 2}px serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (const candy of game.candies) {
      ctx.fillText("🍬", candy.x, candy.y);
    }

    // Shadows
    ctx.fillStyle = "rgba(242,138,178,0.2)";
    ctx.beginPath();
    ctx.ellipse(game.player.x, game.player.y + CHAR_RADIUS + 4, CHAR_RADIUS * 0.8, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "rgba(80,180,80,0.2)";
    ctx.beginPath();
    ctx.ellipse(game.ai.x, game.ai.y + CHAR_RADIUS + 4, CHAR_RADIUS * 0.8, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Player
    if (playerImageRef.current?.complete && playerImageRef.current.naturalWidth > 0) {
      ctx.drawImage(playerImageRef.current, game.player.x - CHAR_RADIUS, game.player.y - CHAR_RADIUS, CHAR_RADIUS * 2, CHAR_RADIUS * 2);
    } else {
      ctx.fillStyle = "#f28ab2";
      ctx.beginPath();
      ctx.arc(game.player.x, game.player.y, CHAR_RADIUS, 0, Math.PI * 2);
      ctx.fill();
    }

    // Player label
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.font = "bold 11px Cairo";
    ctx.textAlign = "center";
    drawRoundedRect(ctx, game.player.x - 22, game.player.y - CHAR_RADIUS - 20, 44, 18, 6);
    ctx.fill();
    ctx.fillStyle = "#b25d91";
    ctx.fillText("كستر", game.player.x, game.player.y - CHAR_RADIUS - 8);

    // AI
    if (aiImageRef.current?.complete && aiImageRef.current.naturalWidth > 0) {
      ctx.drawImage(aiImageRef.current, game.ai.x - CHAR_RADIUS, game.ai.y - CHAR_RADIUS, CHAR_RADIUS * 2, CHAR_RADIUS * 2);
    } else {
      ctx.fillStyle = "#4caf50";
      ctx.beginPath();
      ctx.arc(game.ai.x, game.ai.y, CHAR_RADIUS, 0, Math.PI * 2);
      ctx.fill();
    }

    // AI label
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.font = "bold 11px Cairo";
    ctx.textAlign = "center";
    drawRoundedRect(ctx, game.ai.x - 30, game.ai.y - CHAR_RADIUS - 20, 60, 18, 6);
    ctx.fill();
    ctx.fillStyle = "#2d6a2d";
    ctx.fillText("البطيخة", game.ai.x, game.ai.y - CHAR_RADIUS - 8);

    // HUD - Scores
    ctx.fillStyle = "rgba(255,255,255,0.88)";
    drawRoundedRect(ctx, 8, 8, 160, 52, 10);
    ctx.fill();
    ctx.fillStyle = "#b25d91";
    ctx.font = "bold 13px Cairo";
    ctx.textAlign = "right";
    ctx.fillText(`${game.player.score} :كستر`, 162, 28);
    ctx.fillStyle = "#2d7d2d";
    ctx.fillText(`${game.ai.score} :البطيخة`, 162, 50);

    // Timer
    ctx.fillStyle = game.timer <= 10 ? "rgba(255,100,100,0.9)" : "rgba(255,255,255,0.88)";
    drawRoundedRect(ctx, CANVAS_W / 2 - 36, 8, 72, 36, 10);
    ctx.fill();
    ctx.fillStyle = game.timer <= 10 ? "#fff" : "#7c3d6e";
    ctx.font = "bold 20px Cairo";
    ctx.textAlign = "center";
    ctx.fillText(`${game.timer}`, CANVAS_W / 2, 32);

    // Win target reminder
    ctx.fillStyle = "rgba(255,255,255,0.75)";
    drawRoundedRect(ctx, CANVAS_W - 110, 8, 102, 24, 8);
    ctx.fill();
    ctx.fillStyle = "#999";
    ctx.font = "11px Cairo";
    ctx.textAlign = "center";
    ctx.fillText(`هدف: ${WIN_POINTS} نقطة`, CANVAS_W - 59, 24);
  }, []);

  const endGame = useCallback((game: GameState) => {
    game.isRunning = false;

    const playerWon = game.player.score >= WIN_POINTS;
    const aiWon = game.ai.score >= WIN_POINTS;

    let result = "";
    if (playerWon) result = "👤 كستر";
    else if (aiWon) result = "🍉 البطيخة";
    else if (game.player.score > game.ai.score) result = "👤 كستر";
    else if (game.ai.score > game.player.score) result = "🍉 البطيخة";
    else result = "تعادل!";

    setWinner(result);
    setScores({ player: game.player.score, ai: game.ai.score });
    setPhase("gameover");
  }, []);

  const startGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    cancelAnimationFrame(animationIdRef.current);
    keysRef.current.clear();

    const game: GameState = {
      player: { x: 90, y: CANVAS_H / 2, score: 0 },
      ai: { x: CANVAS_W - 90, y: CANVAS_H / 2, score: 0 },
      candies: [],
      timer: GAME_TIME,
      isRunning: true,
      lastSecondTime: performance.now(),
      lastSpawnTime: performance.now() - SPAWN_INTERVAL / 2,
      nextCandyId: 0,
    };

    gameStateRef.current = game;
    setPhase("playing");
    setTimeLeft(GAME_TIME);
    setScores({ player: 0, ai: 0 });
    setWinner("");

    const onKeyDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.key);
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.key);
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let lastTime = performance.now();

    const gameLoop = (now: number) => {
      if (!game.isRunning) {
        window.removeEventListener("keydown", onKeyDown);
        window.removeEventListener("keyup", onKeyUp);
        return;
      }

      const dt = Math.min(now - lastTime, 50) / 16.67;
      lastTime = now;
      const speed = MOVE_SPEED * dt;

      // Player movement
      const keys = keysRef.current;
      if (keys.has("ArrowUp") || keys.has("w") || keys.has("W")) {
        game.player.y = clamp(game.player.y - speed, CHAR_RADIUS, CANVAS_H - CHAR_RADIUS);
      }
      if (keys.has("ArrowDown") || keys.has("s") || keys.has("S")) {
        game.player.y = clamp(game.player.y + speed, CHAR_RADIUS, CANVAS_H - CHAR_RADIUS);
      }
      if (keys.has("ArrowLeft") || keys.has("a") || keys.has("A")) {
        game.player.x = clamp(game.player.x - speed, CHAR_RADIUS, CANVAS_W - CHAR_RADIUS);
      }
      if (keys.has("ArrowRight") || keys.has("d") || keys.has("D")) {
        game.player.x = clamp(game.player.x + speed, CHAR_RADIUS, CANVAS_W - CHAR_RADIUS);
      }

      // AI logic
      let nearestCandy: Candy | null = null;
      let nearestDist = Infinity;

      for (const candy of game.candies) {
        const d = distance(candy.x, candy.y, game.ai.x, game.ai.y);
        if (d < nearestDist) {
          nearestDist = d;
          nearestCandy = candy;
        }
      }

      let aiVx = 0;
      let aiVy = 0;

      if (nearestCandy) {
        const dx = nearestCandy.x - game.ai.x;
        const dy = nearestCandy.y - game.ai.y;
        const d = distance(nearestCandy.x, nearestCandy.y, game.ai.x, game.ai.y);
        if (d > 0) {
          aiVx = (dx / d) * speed;
          aiVy = (dy / d) * speed;
        }
      }

      const distToPlayer = distance(game.player.x, game.player.y, game.ai.x, game.ai.y);
      if (distToPlayer < 110) {
        const dx = game.ai.x - game.player.x;
        const dy = game.ai.y - game.player.y;
        const d = distance(game.ai.x, game.ai.y, game.player.x, game.player.y);
        if (d > 0) {
          aiVx += (dx / d) * speed * 0.6;
          aiVy += (dy / d) * speed * 0.6;
        }
      }

      if (!nearestCandy) {
        aiVx = (CANVAS_W / 2 - game.ai.x) * 0.012;
        aiVy = (CANVAS_H / 2 - game.ai.y) * 0.012;
      }

      game.ai.x = clamp(game.ai.x + aiVx, CHAR_RADIUS, CANVAS_W - CHAR_RADIUS);
      game.ai.y = clamp(game.ai.y + aiVy, CHAR_RADIUS, CANVAS_H - CHAR_RADIUS);

      // Spawn candy
      if (now - game.lastSpawnTime >= SPAWN_INTERVAL) {
        game.candies.push({
          id: game.nextCandyId++,
          x: CANDY_RADIUS + Math.random() * (CANVAS_W - CANDY_RADIUS * 2),
          y: CANDY_RADIUS + Math.random() * (CANVAS_H - CANDY_RADIUS * 2),
        });
        game.lastSpawnTime = now;
      }

      // Collect candies
      game.candies = game.candies.filter((candy) => {
        const playerDist = distance(candy.x, candy.y, game.player.x, game.player.y);
        const aiDist = distance(candy.x, candy.y, game.ai.x, game.ai.y);

        if (playerDist < CHAR_RADIUS + CANDY_RADIUS) {
          game.player.score += 10;
          setScores({ player: game.player.score, ai: game.ai.score });
          return false;
        }

        if (aiDist < CHAR_RADIUS + CANDY_RADIUS) {
          game.ai.score += 10;
          setScores({ player: game.player.score, ai: game.ai.score });
          return false;
        }

        return true;
      });

      // Timer tick
      if (now - game.lastSecondTime >= 1000) {
        game.timer--;
        game.player.score += 1;
        game.ai.score += 1;
        game.lastSecondTime = now;
        setTimeLeft(game.timer);
        setScores({ player: game.player.score, ai: game.ai.score });
      }

      // Check win condition
      if (game.player.score >= WIN_POINTS || game.ai.score >= WIN_POINTS || game.timer <= 0) {
        endGame(game);
        return;
      }

      // Draw
      drawGame(ctx, game);

      animationIdRef.current = requestAnimationFrame(gameLoop);
    };

    animationIdRef.current = requestAnimationFrame(gameLoop);
  }, [drawGame, endGame]);

  const addKey = (key: string) => keysRef.current.add(key);
  const removeKey = (key: string) => keysRef.current.delete(key);

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
          تحكم بـ كستر باستخدام الأسهم أو WASD، واجمع 🍬 السكاكر قبل البطيخة! أول من يصل لـ {WIN_POINTS} نقطة يفوز
        </p>
      </div>

      <div className="flex flex-col items-center gap-4">
        {/* Score display */}
        {phase === "playing" && (
          <div className="flex items-center gap-6 text-lg font-bold w-full max-w-lg">
            <div className="flex-1 text-center bg-rose-50 border border-rose-200 rounded-xl py-2 px-4">
              <span className="text-rose-700">👤 كستر</span>
              <span className="ml-2 text-2xl text-rose-900">{scores.player}</span>
            </div>
            <div className="text-rose-400 text-sm">VS</div>
            <div className="flex-1 text-center bg-green-50 border border-green-200 rounded-xl py-2 px-4">
              <span className="text-green-700">🍉 البطيخة</span>
              <span className="ml-2 text-2xl text-green-900">{scores.ai}</span>
            </div>
          </div>
        )}

        {/* Game canvas */}
        <div className="relative w-full max-w-[700px] overflow-x-auto">
          <canvas
            ref={canvasRef}
            width={CANVAS_W}
            height={CANVAS_H}
            className="rounded-2xl border-2 border-rose-200 shadow-lg w-full"
            style={{ maxHeight: "55vw", objectFit: "contain" }}
          />

          {/* Idle state */}
          {phase === "idle" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm rounded-2xl gap-4">
              <p className="text-lg font-semibold text-rose-900">اضغطي للبدء</p>
              <Button onClick={startGame} className="bg-gradient-to-r from-green-400 to-emerald-500 text-white">
                ابدأي اللعبة
              </Button>
            </div>
          )}

          {/* Gameover state */}
          {phase === "gameover" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm rounded-2xl gap-4">
              <div className="text-center space-y-2">
                <p className="text-sm text-rose-600 font-medium">النتيجة النهائية</p>
                <p className="text-4xl font-bold text-rose-900 mb-4">{winner}</p>
                <div className="space-y-2 text-sm">
                  <p className="text-rose-700">👤 كستر: {scores.player}</p>
                  <p className="text-green-700">🍉 البطيخة: {scores.ai}</p>
                </div>
              </div>
              <Button onClick={startGame} className="bg-gradient-to-r from-rose-400 to-pink-500 text-white">
                لعبة جديدة
              </Button>
            </div>
          )}
        </div>

        {/* Controls info */}
        <div className="text-center space-y-2">
          <p className="text-sm text-rose-700 font-medium">التحكم على الكمبيوتر:</p>
          <p className="text-xs text-rose-600">الأسهم أو WASD للحركة</p>
        </div>
      </div>
    </section>
  );
}
