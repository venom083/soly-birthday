import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Lock, Heart, Flower, Moon, Gift, Volume2, VolumeX, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const PASSWORD = "hmada love soly";
const START_DATE = new Date(2025, 6, 24); // July 24, 2025 (month is 0-indexed)

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
      audioRef.current.play().catch(e => console.error("Audio play failed:", e));
    }
  }, [isAuthenticated]);

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-rose-50 to-pink-100 p-4 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-rose-300 via-transparent to-transparent" />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full z-10"
        >
          <Card className="border-rose-100 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="pt-6 pb-8 px-8 text-center space-y-6">
              <div className="mx-auto w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mb-4">
                <Lock className="w-8 h-8 text-rose-500" />
              </div>
              <h1 className="text-3xl font-bold text-rose-950 font-sans">إشراقة قمر جديدة</h1>
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
                {error && <p className="text-sm text-red-500">كلمة السر غير صحيحة حاولي مرة أخرى</p>}
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white border-0"
                  data-testid="button-submit-login"
                >
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
      <audio ref={audioRef} src="/assets/nasheed2.mp3" loop />
      
      {/* Fixed controls */}
      <div className="fixed top-4 right-4 z-50">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={toggleMute}
          className="rounded-full bg-white/50 backdrop-blur border-rose-200 text-rose-600 hover:bg-rose-100"
          data-testid="button-mute"
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </Button>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-12 space-y-32">
        <WelcomeSection onNavigate={scrollToSection} />
        <CalendarSection />
        <MemoriesSection />
        <CountdownSection />
      </main>
    </div>
  );
}

function WelcomeSection({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <motion.section 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 0.2 }}
      className="min-h-[80vh] flex flex-col items-center justify-center text-center space-y-12"
    >
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-l from-rose-400 via-pink-500 to-purple-500 bg-clip-text text-transparent leading-relaxed py-4">
            أأهديكِ زهرًا وأنتِ العبير،<br/> الذي كان بكِ كم وقتي يطيب
          </h1>
        </motion.div>
        
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
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <Button 
          onClick={() => onNavigate("calendar")}
          className="bg-white text-rose-600 hover:bg-rose-50 border border-rose-200 shadow-sm text-lg py-6 px-8 rounded-full"
          data-testid="nav-calendar"
        >
          هدايا أيامكِ
        </Button>
        <Button 
          onClick={() => onNavigate("memories")}
          className="bg-white text-rose-600 hover:bg-rose-50 border border-rose-200 shadow-sm text-lg py-6 px-8 rounded-full"
          data-testid="nav-memories"
        >
          ذكريات عيد ميلادكِ السابق
        </Button>
        <Button 
          onClick={() => onNavigate("countdown")}
          className="bg-white text-rose-600 hover:bg-rose-50 border border-rose-200 shadow-sm text-lg py-6 px-8 rounded-full"
          data-testid="nav-countdown"
        >
          العد التنازلي لميلادكِ
        </Button>
      </motion.div>
    </motion.section>
  );
}

function CalendarSection() {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const today = new Date();
  
  // Array of 8 days
  const days = Array.from({ length: 8 }, (_, i) => {
    const dayDate = new Date(START_DATE);
    dayDate.setDate(START_DATE.getDate() + i);
    const isUnlocked = today >= dayDate || (today.getDate() === dayDate.getDate() && today.getMonth() === dayDate.getMonth() && today.getFullYear() === dayDate.getFullYear());
    return {
      index: i,
      date: dayDate,
      isUnlocked: isUnlocked
    };
  });

  const unlockedCount = days.filter(d => d.isUnlocked).length;

  return (
    <section id="calendar" className="scroll-mt-24 space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold text-rose-900">هداياكِ على مدار الأيام</h2>
        <p className="text-lg text-rose-700 max-w-2xl mx-auto">
          شكراً لمشاركتي أفضل لحظات حياتي، هذه هدية بسيطة أقدمها لكِ وأرجو وأدعو الله أن تكوني سكنًا لي
        </p>
        <div className="inline-flex items-center gap-2 bg-rose-100/50 px-4 py-2 rounded-full text-rose-700 text-sm font-medium">
          <Gift className="w-4 h-4" />
          تم فتح {unlockedCount} من 8 هدايا
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {days.map((day) => (
          <motion.div
            key={day.index}
            whileHover={day.isUnlocked ? { scale: 1.05 } : {}}
            whileTap={day.isUnlocked ? { scale: 0.95 } : {}}
          >
            <Card 
              className={`h-full cursor-pointer transition-all duration-300 ${
                day.isUnlocked 
                  ? "bg-white border-rose-200 hover:border-rose-400 hover:shadow-lg hover:shadow-rose-100 group" 
                  : "bg-gray-50 border-dashed border-gray-200 opacity-60 cursor-not-allowed"
              }`}
              onClick={() => day.isUnlocked && setSelectedDay(day.index)}
              data-testid={`card-gift-${day.index}`}
            >
              <CardContent className="flex flex-col items-center justify-center p-6 space-y-4 aspect-square">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  day.isUnlocked ? "bg-rose-100 text-rose-500 group-hover:bg-rose-200" : "bg-gray-200 text-gray-400"
                }`}>
                  {day.isUnlocked ? <Flower className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
                </div>
                <div className="text-center">
                  <h3 className={`font-bold text-lg ${day.isUnlocked ? "text-rose-900" : "text-gray-500"}`}>
                    اليوم {day.index + 1}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {day.date.getDate()}/{day.date.getMonth() + 1}
                  </p>
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
            <div className="flex items-center gap-2">
              <Button asChild variant="outline" size="sm" className="text-rose-600 border-rose-200 hover:bg-rose-50">
                <a href={`/pdfs/day${selectedDay !== null ? selectedDay + 1 : 1}.pdf`} download data-testid="button-download-pdf">
                  <Download className="w-4 h-4 ml-2" />
                  تحميل الهدية
                </a>
              </Button>
            </div>
          </DialogHeader>
          <div className="flex-1 mt-[73px] bg-rose-50/30">
            {selectedDay !== null && (
              <iframe 
                src={`/pdfs/day${selectedDay + 1}.pdf`}
                className="w-full h-full border-0"
                title={`Gift Day ${selectedDay + 1}`}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}

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

function CountdownSection() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isBirthday, setIsBirthday] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      let target = new Date(now.getFullYear(), 6, 24); // July 24
      
      // If we passed July 24 this year, look to next year
      if (now > target && now.getDate() !== 24) {
        target = new Date(now.getFullYear() + 1, 6, 24);
      }

      const difference = target.getTime() - now.getTime();

      if (difference <= 0 || (now.getDate() === 24 && now.getMonth() === 6)) {
        setIsBirthday(true);
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const timeUnits = [
    { label: "الأيام", value: timeLeft.days },
    { label: "الساعات", value: timeLeft.hours },
    { label: "الدقائق", value: timeLeft.minutes },
    { label: "الثواني", value: timeLeft.seconds },
  ];

  return (
    <section id="countdown" className="scroll-mt-24 pb-32">
      <div className="bg-gradient-to-br from-rose-400 via-pink-500 to-purple-500 rounded-3xl p-8 md:p-12 text-white text-center shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10" />
        
        <div className="relative z-10 space-y-10">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-5xl font-bold">العد التنازلي ليوم ميلادكِ</h2>
            <p className="text-xl text-rose-100 font-medium tracking-wide">24 يوليو</p>
          </div>

          {isBirthday ? (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="py-12"
            >
              <h3 className="text-5xl md:text-7xl font-bold text-yellow-300 drop-shadow-md">
                عيد ميلاد سعيد يا سالي! 🌙
              </h3>
            </motion.div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto" dir="ltr">
              {timeUnits.map((unit, i) => (
                <div key={unit.label} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                  <motion.div 
                    key={unit.value}
                    initial={{ scale: 0.8, opacity: 0.5 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="text-4xl md:text-6xl font-bold mb-2 font-mono"
                  >
                    {unit.value.toString().padStart(2, '0')}
                  </motion.div>
                  <div className="text-rose-100 text-lg md:text-xl font-medium" dir="rtl">
                    {unit.label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
