import { useState, useRef, useEffect } from "react";

const CHECKOUT_URL = "https://transformacionen21dias.lemonsqueezy.com/checkout/buy/9cf67221-f1f7-4a07-a892-4b391521c676";
const ACCESS_KEY = "RETO21POWER";
const STORAGE_KEY = "reto21_access";

function checkAccess() {
  const params = new URLSearchParams(window.location.search);
  const urlKey = params.get("access");
  if (urlKey === ACCESS_KEY) {
    try { window.localStorage.setItem(STORAGE_KEY, "true"); } catch(e) {}
    window.history.replaceState({}, "", window.location.pathname);
    return true;
  }
  try { if (window.localStorage.getItem(STORAGE_KEY) === "true") return true; } catch(e) {}
  return false;
}

const ALL_MEALS = [
  // Día 1
  [{ meal:"Desayuno", desc:"Avena con banana, canela y semillas de chía", cal:320, protein:12 },
   { meal:"Almuerzo", desc:"Pechuga grillada con ensalada verde y arroz integral", cal:480, protein:38 },
   { meal:"Merienda", desc:"Yogur natural con frutos secos y miel", cal:180, protein:8 },
   { meal:"Cena", desc:"Sopa de verduras con pollo desmenuzado", cal:350, protein:28 }],
  // Día 2
  [{ meal:"Desayuno", desc:"Huevos revueltos con tostada integral y aguacate", cal:380, protein:18 },
   { meal:"Almuerzo", desc:"Ensalada de atún con quinoa y vegetales mixtos", cal:450, protein:32 },
   { meal:"Merienda", desc:"Manzana con mantequilla de maní natural", cal:200, protein:6 },
   { meal:"Cena", desc:"Pescado al horno con brócoli al vapor y limón", cal:380, protein:34 }],
  // Día 3
  [{ meal:"Desayuno", desc:"Smoothie verde: espinaca, banana, proteína y almendra", cal:300, protein:22 },
   { meal:"Almuerzo", desc:"Bowl de pollo teriyaki con arroz integral y edamame", cal:520, protein:36 },
   { meal:"Merienda", desc:"Hummus con palitos de zanahoria y pepino", cal:160, protein:6 },
   { meal:"Cena", desc:"Wrap integral de pavo con lechuga, tomate y mostaza", cal:340, protein:26 }],
  // Día 4
  [{ meal:"Desayuno", desc:"Panqueques de avena con frutos rojos y miel", cal:340, protein:14 },
   { meal:"Almuerzo", desc:"Pollo al curry suave con arroz basmati y espinaca", cal:510, protein:35 },
   { meal:"Merienda", desc:"Puñado de almendras y una banana", cal:220, protein:7 },
   { meal:"Cena", desc:"Ensalada César con pollo grillado y parmesano", cal:360, protein:30 }],
  // Día 5
  [{ meal:"Desayuno", desc:"Tostada integral con ricotta, tomate y albahaca", cal:290, protein:14 },
   { meal:"Almuerzo", desc:"Salmón a la plancha con puré de batata y espárragos", cal:490, protein:36 },
   { meal:"Merienda", desc:"Yogur griego con granola casera", cal:200, protein:12 },
   { meal:"Cena", desc:"Tortilla de vegetales con ensalada fresca", cal:330, protein:22 }],
  // Día 6
  [{ meal:"Desayuno", desc:"Bowl de açaí con banana, granola y coco rallado", cal:350, protein:8 },
   { meal:"Almuerzo", desc:"Pasta integral con salsa de tomate casera y albóndigas de pavo", cal:520, protein:32 },
   { meal:"Merienda", desc:"Batido de proteína con leche de almendra y cacao", cal:180, protein:20 },
   { meal:"Cena", desc:"Pechuga de pollo con vegetales salteados al wok", cal:370, protein:34 }],
  // Día 7
  [{ meal:"Desayuno", desc:"Omelette de claras con espinaca, champiñones y queso", cal:280, protein:24 },
   { meal:"Almuerzo", desc:"Hamburguesa casera de carne magra con ensalada", cal:480, protein:36 },
   { meal:"Merienda", desc:"Rodajas de pepino con queso cottage y semillas", cal:150, protein:12 },
   { meal:"Cena", desc:"Crema de calabaza con pollo desmenuzado y tostadas", cal:340, protein:24 }],
  // Día 8
  [{ meal:"Desayuno", desc:"Porridge de avena con manzana rallada y canela", cal:310, protein:10 },
   { meal:"Almuerzo", desc:"Bowl de arroz con camarones, aguacate y salsa soya", cal:500, protein:30 },
   { meal:"Merienda", desc:"Tostada de arroz con mantequilla de almendra", cal:190, protein:6 },
   { meal:"Cena", desc:"Filete de merluza con puré de coliflor y limón", cal:350, protein:32 }],
  // Día 9
  [{ meal:"Desayuno", desc:"Yogur griego con semillas de chía, kiwi y miel", cal:300, protein:16 },
   { meal:"Almuerzo", desc:"Pollo al horno con batata asada y brócoli", cal:490, protein:38 },
   { meal:"Merienda", desc:"Mix de frutos secos y pasas", cal:210, protein:6 },
   { meal:"Cena", desc:"Ensalada tibia de lentejas con vegetales asados", cal:360, protein:18 }],
  // Día 10
  [{ meal:"Desayuno", desc:"Tostadas francesas integrales con canela y banana", cal:340, protein:12 },
   { meal:"Almuerzo", desc:"Tacos de pollo con guacamole, lechuga y tomate", cal:470, protein:32 },
   { meal:"Merienda", desc:"Apio con mantequilla de maní", cal:170, protein:6 },
   { meal:"Cena", desc:"Sopa de pollo con fideos integrales y verduras", cal:330, protein:26 }],
  // Día 11
  [{ meal:"Desayuno", desc:"Smoothie bowl de mango, banana y proteína", cal:330, protein:20 },
   { meal:"Almuerzo", desc:"Ensalada mediterránea con garbanzos, pepino y feta", cal:440, protein:18 },
   { meal:"Merienda", desc:"Huevo duro con sal y pimienta", cal:140, protein:12 },
   { meal:"Cena", desc:"Pechuga de pavo con quinoa y vegetales al vapor", cal:380, protein:36 }],
  // Día 12
  [{ meal:"Desayuno", desc:"Avena overnight con leche de coco y frutos rojos", cal:310, protein:10 },
   { meal:"Almuerzo", desc:"Milanesa de pollo al horno con ensalada rusa light", cal:490, protein:34 },
   { meal:"Merienda", desc:"Banana con canela y un puñado de nueces", cal:200, protein:4 },
   { meal:"Cena", desc:"Revuelto de tofu con vegetales y salsa soya", cal:320, protein:22 }],
  // Día 13
  [{ meal:"Desayuno", desc:"Huevos pochados sobre tostada integral con espinaca", cal:340, protein:20 },
   { meal:"Almuerzo", desc:"Bowl de salmón con arroz, pepino, zanahoria y sésamo", cal:510, protein:34 },
   { meal:"Merienda", desc:"Gelatina sin azúcar con frutas", cal:80, protein:4 },
   { meal:"Cena", desc:"Pollo a la plancha con puré de zapallo y ensalada", cal:390, protein:34 }],
  // Día 14
  [{ meal:"Desayuno", desc:"Granola casera con yogur natural y durazno", cal:320, protein:14 },
   { meal:"Almuerzo", desc:"Wrap integral de atún con vegetales frescos y mostaza", cal:430, protein:30 },
   { meal:"Merienda", desc:"Bastones de zanahoria con guacamole", cal:180, protein:4 },
   { meal:"Cena", desc:"Estofado de carne magra con papa y zanahoria", cal:410, protein:32 }],
  // Día 15
  [{ meal:"Desayuno", desc:"Tortilla de banana y avena con frutos rojos", cal:300, protein:12 },
   { meal:"Almuerzo", desc:"Pollo grillado con tabulé de quinoa y pepino", cal:460, protein:36 },
   { meal:"Merienda", desc:"Cottage cheese con piña en trozos", cal:160, protein:14 },
   { meal:"Cena", desc:"Sopa crema de brócoli con pollo y tostadas integrales", cal:350, protein:26 }],
  // Día 16
  [{ meal:"Desayuno", desc:"Pan integral con palta, huevo y semillas de sésamo", cal:370, protein:16 },
   { meal:"Almuerzo", desc:"Arroz con pollo, choclo y arvejas", cal:500, protein:34 },
   { meal:"Merienda", desc:"Smoothie de banana, avena y mantequilla de maní", cal:240, protein:10 },
   { meal:"Cena", desc:"Filete de tilapia con ensalada de rúcula y tomate", cal:330, protein:32 }],
  // Día 17
  [{ meal:"Desayuno", desc:"Waffles integrales con yogur griego y banana", cal:350, protein:16 },
   { meal:"Almuerzo", desc:"Ensalada de pollo con mango, aguacate y nueces", cal:480, protein:32 },
   { meal:"Merienda", desc:"Barrita de proteína casera", cal:180, protein:14 },
   { meal:"Cena", desc:"Omelette de vegetales con ensalada verde", cal:300, protein:22 }],
  // Día 18
  [{ meal:"Desayuno", desc:"Bol de quinoa con huevo, espinaca y palta", cal:380, protein:20 },
   { meal:"Almuerzo", desc:"Cerdo magro a la plancha con puré de batata y brócoli", cal:510, protein:36 },
   { meal:"Merienda", desc:"Manzana al horno con canela y nueces", cal:170, protein:4 },
   { meal:"Cena", desc:"Sopa de lentejas con zanahoria y espinaca", cal:340, protein:18 }],
  // Día 19
  [{ meal:"Desayuno", desc:"Tostada integral con salmón ahumado y queso crema light", cal:340, protein:22 },
   { meal:"Almuerzo", desc:"Pollo al limón con arroz integral y vegetales salteados", cal:490, protein:36 },
   { meal:"Merienda", desc:"Yogur natural con semillas de calabaza", cal:170, protein:12 },
   { meal:"Cena", desc:"Ensalada caprese con mozzarella fresca y albahaca", cal:310, protein:18 }],
  // Día 20
  [{ meal:"Desayuno", desc:"Smoothie tropical: mango, piña, espinaca y proteína", cal:310, protein:22 },
   { meal:"Almuerzo", desc:"Bowl de carne magra con arroz, frijoles y pico de gallo", cal:520, protein:38 },
   { meal:"Merienda", desc:"Rodajas de pera con queso cottage", cal:160, protein:10 },
   { meal:"Cena", desc:"Pollo al horno con papas y romero", cal:400, protein:34 }],
  // Día 21
  [{ meal:"Desayuno", desc:"Brunch saludable: huevos, palta, tomate y tostada integral", cal:400, protein:22 },
   { meal:"Almuerzo", desc:"Paella de mariscos con arroz integral y vegetales", cal:530, protein:34 },
   { meal:"Merienda", desc:"Batido de celebración: banana, cacao, proteína y almendra", cal:220, protein:18 },
   { meal:"Cena", desc:"Salmón glaseado con miel y mostaza, espárragos y quinoa", cal:460, protein:36 }],
];

const ALL_EXERCISES = [
  // Semana 1: Baja-Media
  [{ name:"Caminata rápida", duration:"30 min", intensity:"Baja", icon:"🚶" },
   { name:"Sentadillas", duration:"3×15 reps", intensity:"Media", icon:"🦵" },
   { name:"Plancha frontal", duration:"3×30 seg", intensity:"Media", icon:"💪" },
   { name:"Estiramientos", duration:"10 min", intensity:"Baja", icon:"🧘" }],
  [{ name:"Caminata con inclinación", duration:"25 min", intensity:"Baja", icon:"🚶" },
   { name:"Zancadas estáticas", duration:"3×12 c/pierna", intensity:"Media", icon:"🦵" },
   { name:"Flexiones en rodillas", duration:"3×10 reps", intensity:"Media", icon:"💪" },
   { name:"Plancha lateral", duration:"2×20 seg/lado", intensity:"Media", icon:"🧘" }],
  [{ name:"Trote suave", duration:"20 min", intensity:"Baja", icon:"🏃" },
   { name:"Sentadilla sumo", duration:"3×15 reps", intensity:"Media", icon:"🦵" },
   { name:"Elevaciones de cadera", duration:"3×15 reps", intensity:"Baja", icon:"💪" },
   { name:"Estiramiento de piernas", duration:"10 min", intensity:"Baja", icon:"🧘" }],
  [{ name:"Caminata rápida intervalos", duration:"30 min", intensity:"Media", icon:"🚶" },
   { name:"Step ups en silla", duration:"3×12 c/pierna", intensity:"Media", icon:"🦵" },
   { name:"Plancha con toque rodilla", duration:"3×20 seg", intensity:"Media", icon:"💪" },
   { name:"Superman", duration:"3×12 reps", intensity:"Baja", icon:"🧘" }],
  [{ name:"Cardio mixto: caminar y trotar", duration:"25 min", intensity:"Media", icon:"🏃" },
   { name:"Sentadilla con pausa", duration:"3×12 reps", intensity:"Media", icon:"🦵" },
   { name:"Flexiones inclinadas", duration:"3×10 reps", intensity:"Media", icon:"💪" },
   { name:"Yoga básico", duration:"10 min", intensity:"Baja", icon:"🧘" }],
  [{ name:"Bicicleta o caminata", duration:"30 min", intensity:"Baja", icon:"🚶" },
   { name:"Peso muerto con botella", duration:"3×12 reps", intensity:"Media", icon:"🦵" },
   { name:"Abdominales bicicleta", duration:"3×15 reps", intensity:"Media", icon:"💪" },
   { name:"Estiramientos completos", duration:"12 min", intensity:"Baja", icon:"🧘" }],
  [{ name:"Descanso activo: caminata", duration:"20 min", intensity:"Baja", icon:"🚶" },
   { name:"Sentadilla pared", duration:"3×30 seg", intensity:"Media", icon:"🦵" },
   { name:"Plancha frontal", duration:"3×40 seg", intensity:"Media", icon:"💪" },
   { name:"Movilidad articular", duration:"10 min", intensity:"Baja", icon:"🧘" }],
  // Semana 2: Media-Alta
  [{ name:"Trote continuo", duration:"25 min", intensity:"Media", icon:"🏃" },
   { name:"Zancadas caminando", duration:"3×12 c/pierna", intensity:"Media", icon:"🦵" },
   { name:"Burpees modificados", duration:"3×8 reps", intensity:"Alta", icon:"⚡" },
   { name:"Plancha lateral", duration:"3×25 seg/lado", intensity:"Media", icon:"💪" }],
  [{ name:"Cardio HIIT suave", duration:"20 min", intensity:"Alta", icon:"🔥" },
   { name:"Sentadilla con salto", duration:"3×10 reps", intensity:"Alta", icon:"⚡" },
   { name:"Flexiones completas", duration:"3×10 reps", intensity:"Media", icon:"💪" },
   { name:"Mountain climbers", duration:"3×15 reps", intensity:"Alta", icon:"🏔️" }],
  [{ name:"Trote con intervalos", duration:"25 min", intensity:"Media", icon:"🏃" },
   { name:"Zancadas con salto", duration:"3×10 c/pierna", intensity:"Alta", icon:"🦵" },
   { name:"Plancha con toque hombro", duration:"3×30 seg", intensity:"Media", icon:"💪" },
   { name:"Abdominales completos", duration:"3×20 reps", intensity:"Media", icon:"🧘" }],
  [{ name:"Circuito cardio", duration:"22 min", intensity:"Alta", icon:"🔥" },
   { name:"Sentadilla búlgara", duration:"3×10 c/pierna", intensity:"Alta", icon:"🦵" },
   { name:"Burpees", duration:"3×10 reps", intensity:"Alta", icon:"⚡" },
   { name:"Plancha dinámica", duration:"3×30 seg", intensity:"Media", icon:"💪" }],
  [{ name:"Trote continuo", duration:"30 min", intensity:"Media", icon:"🏃" },
   { name:"Peso muerto una pierna", duration:"3×10 c/pierna", intensity:"Media", icon:"🦵" },
   { name:"Flexiones diamante", duration:"3×8 reps", intensity:"Alta", icon:"💪" },
   { name:"Escaladores", duration:"3×20 reps", intensity:"Alta", icon:"🏔️" }],
  [{ name:"HIIT tabata", duration:"20 min", intensity:"Alta", icon:"🔥" },
   { name:"Sentadilla goblet", duration:"3×12 reps", intensity:"Media", icon:"🦵" },
   { name:"Superman con pausa", duration:"3×12 reps", intensity:"Media", icon:"💪" },
   { name:"Jumping jacks", duration:"3×30 seg", intensity:"Media", icon:"⚡" }],
  [{ name:"Descanso activo: yoga", duration:"25 min", intensity:"Baja", icon:"🧘" },
   { name:"Sentadilla isométrica", duration:"3×40 seg", intensity:"Media", icon:"🦵" },
   { name:"Plancha frontal", duration:"3×50 seg", intensity:"Media", icon:"💪" },
   { name:"Estiramientos profundos", duration:"15 min", intensity:"Baja", icon:"🧘" }],
  // Semana 3: Alta
  [{ name:"HIIT completo", duration:"25 min", intensity:"Alta", icon:"🔥" },
   { name:"Sentadilla con salto", duration:"4×12 reps", intensity:"Alta", icon:"⚡" },
   { name:"Burpees completos", duration:"4×10 reps", intensity:"Alta", icon:"⚡" },
   { name:"Plancha con toque hombro", duration:"3×40 seg", intensity:"Alta", icon:"💪" }],
  [{ name:"Carrera intervalos", duration:"25 min", intensity:"Alta", icon:"🏃" },
   { name:"Zancadas con salto alternas", duration:"4×12 reps", intensity:"Alta", icon:"🦵" },
   { name:"Flexiones explosivas", duration:"3×10 reps", intensity:"Alta", icon:"💪" },
   { name:"Mountain climbers cruzados", duration:"3×20 reps", intensity:"Alta", icon:"🏔️" }],
  [{ name:"Circuito quema grasa", duration:"30 min", intensity:"Alta", icon:"🔥" },
   { name:"Sentadilla sumo con salto", duration:"4×12 reps", intensity:"Alta", icon:"🦵" },
   { name:"Burpees con flexión", duration:"3×10 reps", intensity:"Alta", icon:"⚡" },
   { name:"Plancha comando", duration:"3×30 seg", intensity:"Alta", icon:"💪" }],
  [{ name:"HIIT tabata avanzado", duration:"22 min", intensity:"Alta", icon:"🔥" },
   { name:"Pistol squat asistida", duration:"3×8 c/pierna", intensity:"Alta", icon:"🦵" },
   { name:"Flexiones con palmada", duration:"3×8 reps", intensity:"Alta", icon:"💪" },
   { name:"Escaladores rápidos", duration:"4×20 reps", intensity:"Alta", icon:"🏔️" }],
  [{ name:"Carrera continua", duration:"30 min", intensity:"Alta", icon:"🏃" },
   { name:"Sentadilla 1 y 1/2", duration:"4×10 reps", intensity:"Alta", icon:"🦵" },
   { name:"Burpees tuck jump", duration:"3×8 reps", intensity:"Alta", icon:"⚡" },
   { name:"Plancha con elevación pierna", duration:"3×30 seg", intensity:"Alta", icon:"💪" }],
  [{ name:"HIIT final challenge", duration:"25 min", intensity:"Alta", icon:"🔥" },
   { name:"Circuito piernas completo", duration:"4×12 reps", intensity:"Alta", icon:"🦵" },
   { name:"Flexiones variación", duration:"4×10 reps", intensity:"Alta", icon:"💪" },
   { name:"Jumping lunges", duration:"3×12 c/pierna", intensity:"Alta", icon:"⚡" }],
  [{ name:"Sesión final: todo el cuerpo", duration:"30 min", intensity:"Alta", icon:"🔥" },
   { name:"Circuito de sentadillas", duration:"4×15 reps", intensity:"Alta", icon:"🦵" },
   { name:"Circuito de flexiones", duration:"4×12 reps", intensity:"Alta", icon:"💪" },
   { name:"Estiramientos de cierre", duration:"15 min", intensity:"Baja", icon:"🧘" }],
];

const DAYS_DATA = Array.from({ length: 21 }, (_, i) => {
  const day = i + 1;
  const week = Math.ceil(day / 7);
  const meals = ALL_MEALS[i];
  return {
    day, week, meals,
    exercises: ALL_EXERCISES[i],
    totalCal: meals.reduce((s, m) => s + m.cal, 0),
    totalProtein: meals.reduce((s, m) => s + m.protein, 0),
  };
});

const accent = "#10b981";
const accentGlow = "rgba(16,185,129,0.25)";
const surface = "rgba(255,255,255,0.04)";
const border = "rgba(255,255,255,0.07)";
const muted = "rgba(255,255,255,0.4)";
const bg = "#06060a";
const mono = "'JetBrains Mono', monospace";
const sans = "'Sora', sans-serif";

const Card = ({ children, style = {}, glow = false }) => (
  <div style={{
    background: surface, border: `1px solid ${border}`, borderRadius: 16, padding: 16,
    ...(glow ? { boxShadow: `0 0 40px ${accentGlow}, inset 0 1px 0 rgba(255,255,255,0.06)` } : {}),
    ...style,
  }}>{children}</div>
);

const Badge = ({ children, color = accent }) => (
  <span style={{
    fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 6,
    background: `${color}22`, color, fontFamily: mono, letterSpacing: "0.5px",
  }}>{children}</span>
);

export default function App() {
  const [hasAccess, setHasAccess] = useState(false);
  const [screen, setScreen] = useState("landing");
  const [selectedDay, setSelectedDay] = useState(1);
  const [completedDays, setCompletedDays] = useState({});
  const [weights, setWeights] = useState({});
  const [initialWeight, setInitialWeight] = useState("");
  const [goalWeight, setGoalWeight] = useState("");
  const [tab, setTab] = useState("food");
  const dayScrollRef = useRef(null);

  useEffect(() => {
    const access = checkAccess();
    setHasAccess(access);
    if (access) {
      try {
        const saved = window.localStorage.getItem("reto21_progress");
        if (saved) {
          const data = JSON.parse(saved);
          if (data.completedDays) setCompletedDays(data.completedDays);
          if (data.weights) setWeights(data.weights);
          if (data.initialWeight) setInitialWeight(data.initialWeight);
          if (data.goalWeight) setGoalWeight(data.goalWeight);
          if (data.initialWeight) setScreen("app");
          else setScreen("onboarding");
        } else { setScreen("onboarding"); }
      } catch(e) { setScreen("onboarding"); }
    }
  }, []);

  useEffect(() => {
    if (hasAccess) {
      try { window.localStorage.setItem("reto21_progress", JSON.stringify({ completedDays, weights, initialWeight, goalWeight })); } catch(e) {}
    }
  }, [completedDays, weights, initialWeight, goalWeight, hasAccess]);

  const currentData = DAYS_DATA[selectedDay - 1];
  const completedCount = Object.keys(completedDays).length;
  const progress = Math.round((completedCount / 21) * 100);
  const toggleDay = (d) => setCompletedDays((prev) => { const next = { ...prev }; next[d] ? delete next[d] : (next[d] = true); return next; });
  const fonts = <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />;

  if (screen === "landing") {
    return (
      <div style={{ fontFamily: sans, background: bg, minHeight: "100vh", color: "#fff" }}>
        {fonts}
        <div style={{ maxWidth: 420, margin: "0 auto", padding: "0 20px" }}>
          <div style={{ position: "relative", paddingTop: 50, textAlign: "center" }}>
            <div style={{ position: "absolute", top: -60, left: "50%", transform: "translateX(-50%)", width: 300, height: 300, background: `radial-gradient(circle, ${accentGlow} 0%, transparent 70%)`, filter: "blur(80px)", pointerEvents: "none" }} />
            <Badge>PROGRAMA INTENSIVO</Badge>
            <h1 style={{ fontSize: "clamp(44px, 11vw, 60px)", fontWeight: 800, lineHeight: 0.95, margin: "20px 0 12px", letterSpacing: "-3px", background: `linear-gradient(135deg, #fff 20%, ${accent} 80%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>RETO<br />21 DÍAS</h1>
            <p style={{ color: muted, fontSize: 15, maxWidth: 300, margin: "0 auto 36px", lineHeight: 1.55, fontWeight: 300 }}>Transformá tu cuerpo con un plan diario de alimentación y ejercicio progresivo.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 28 }}>
            {[{ n: "21", l: "Días" }, { n: "84", l: "Comidas" }, { n: "84", l: "Ejercicios" }].map((s) => (
              <Card key={s.l} style={{ textAlign: "center", padding: "14px 8px" }}>
                <div style={{ fontSize: 26, fontWeight: 800, color: accent, fontFamily: mono }}>{s.n}</div>
                <div style={{ fontSize: 10, color: muted, textTransform: "uppercase", letterSpacing: "1.5px", fontWeight: 600, marginTop: 2 }}>{s.l}</div>
              </Card>))}
          </div>
          <div style={{ marginBottom: 36 }}>
            {[{ icon: "🍽️", t: "Plan de alimentación diario", d: "4 comidas únicas cada día con macros y calorías" }, { icon: "💪", t: "Rutina progresiva de 3 semanas", d: "De principiante a avanzado, sin equipo" }, { icon: "📊", t: "Tracking de progreso", d: "Registrá tu peso y mirá tu evolución visual" }].map((f) => (
              <Card key={f.t} style={{ display: "flex", gap: 14, marginBottom: 8, alignItems: "flex-start" }}>
                <span style={{ fontSize: 22, flexShrink: 0, marginTop: 2 }}>{f.icon}</span>
                <div><div style={{ fontWeight: 600, fontSize: 14, marginBottom: 3 }}>{f.t}</div><div style={{ fontSize: 13, color: muted, lineHeight: 1.4 }}>{f.d}</div></div>
              </Card>))}
          </div>
          <Card style={{ marginBottom: 24, padding: "16px 20px" }}>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.5, fontStyle: "italic", marginBottom: 8 }}>"En 21 días bajé 4.5 kg siguiendo el plan al pie de la letra. Las comidas son fáciles de preparar."</div>
            <div style={{ fontSize: 12, color: accent, fontWeight: 600 }}>— María G., 32 años</div>
          </Card>
          <Card glow style={{ textAlign: "center", marginBottom: 12, padding: 24 }}>
            <div style={{ fontSize: 12, color: muted, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 8 }}>Acceso completo — Pago único</div>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 4, marginBottom: 4 }}>
              <span style={{ fontSize: 40, fontWeight: 800, fontFamily: mono, color: "#fff" }}>$9</span>
              <span style={{ fontSize: 22, fontWeight: 800, fontFamily: mono, color: "#fff" }}>.99</span>
              <span style={{ fontSize: 14, color: muted, marginLeft: 4 }}>USD</span>
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginBottom: 16, textDecoration: "line-through" }}>Valor regular $29.99</div>
            <a href={CHECKOUT_URL} className="lemonsqueezy-button" style={{ display: "block", width: "100%", padding: "16px", fontSize: 15, fontWeight: 700, color: "#fff", background: `linear-gradient(135deg, ${accent}, #059669)`, border: "none", borderRadius: 12, cursor: "pointer", fontFamily: sans, boxShadow: `0 8px 32px ${accentGlow}`, textDecoration: "none", textAlign: "center" }}>Quiero transformarme →</a>
          </Card>
          <p style={{ textAlign: "center", fontSize: 12, color: "rgba(255,255,255,0.25)", paddingBottom: 20 }}>Pago único · Acceso inmediato · Sin suscripción</p>
          <div style={{ display: "flex", justifyContent: "center", gap: 20, paddingBottom: 30 }}>
            {["🔒 Pago seguro", "🌍 135+ países", "⚡ Acceso inmediato"].map((b) => (<span key={b} style={{ fontSize: 11, color: muted, fontWeight: 500 }}>{b}</span>))}
          </div>
          <div style={{ paddingBottom: 40 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14, textAlign: "center" }}>¿Qué incluye?</h3>
            {[{ num: "84", text: "Comidas únicas planificadas con calorías y proteínas" }, { num: "84", text: "Ejercicios progresivos de 3 niveles" }, { num: "21", text: "Días de contenido diferente cada uno" }, { num: "∞", text: "Acceso de por vida al programa" }].map((item) => (
              <div key={item.text} style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 10, padding: "0 10px" }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: accent, fontFamily: mono, minWidth: 36, textAlign: "center" }}>{item.num}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>{item.text}</div>
              </div>))}
          </div>
          <div style={{ paddingBottom: 50 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14, textAlign: "center" }}>Preguntas frecuentes</h3>
            {[{ q: "¿Necesito equipo de gimnasio?", a: "No. Todos los ejercicios son con peso corporal, podés hacerlos en casa." }, { q: "¿Las comidas son difíciles de preparar?", a: "No. Son recetas simples con ingredientes que encontrás en cualquier supermercado." }, { q: "¿Puedo acceder desde mi celular?", a: "Sí. La webapp funciona perfecto en celular, tablet y computadora." }, { q: "¿Es un pago único o suscripción?", a: "Pago único de $9.99. Pagás una vez y tenés acceso de por vida." }].map((faq) => (
              <Card key={faq.q} style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4, color: "rgba(255,255,255,0.85)" }}>{faq.q}</div>
                <div style={{ fontSize: 12, color: muted, lineHeight: 1.4 }}>{faq.a}</div>
              </Card>))}
          </div>
        </div>
      </div>
    );
  }

  if (!hasAccess && screen !== "landing") {
    return (
      <div style={{ fontFamily: sans, background: bg, minHeight: "100vh", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {fonts}
        <div style={{ textAlign: "center", padding: "40px 20px", maxWidth: 360 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
          <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-1px", marginBottom: 8 }}>Contenido bloqueado</h2>
          <p style={{ color: muted, fontSize: 14, marginBottom: 24, lineHeight: 1.5 }}>Necesitás comprar el programa para acceder al contenido.</p>
          <a href={CHECKOUT_URL} className="lemonsqueezy-button" style={{ display: "block", width: "100%", padding: "16px", fontSize: 15, fontWeight: 700, color: "#fff", background: `linear-gradient(135deg, ${accent}, #059669)`, border: "none", borderRadius: 12, cursor: "pointer", fontFamily: sans, boxShadow: `0 8px 32px ${accentGlow}`, textDecoration: "none", textAlign: "center", marginBottom: 12 }}>Comprar por $9.99 →</a>
          <button onClick={() => setScreen("landing")} style={{ background: "none", border: "none", color: muted, fontSize: 13, cursor: "pointer", fontFamily: sans, textDecoration: "underline" }}>Volver</button>
        </div>
      </div>);
  }

  if (screen === "onboarding") {
    return (
      <div style={{ fontFamily: sans, background: bg, minHeight: "100vh", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {fonts}
        <div style={{ width: "100%", maxWidth: 360, padding: "40px 20px" }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🎉</div>
            <h2 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-1px", margin: "0 0 6px" }}>¡Bienvenido al Reto!</h2>
            <p style={{ color: muted, fontSize: 14, margin: 0 }}>Definí tu meta para los próximos 21 días</p>
          </div>
          {[{ label: "Peso actual (kg)", val: initialWeight, set: setInitialWeight, ph: "85" }, { label: "Peso meta (kg)", val: goalWeight, set: setGoalWeight, ph: "78" }].map((f) => (
            <div key={f.label} style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: muted, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 8 }}>{f.label}</label>
              <input type="number" value={f.val} onChange={(e) => f.set(e.target.value)} placeholder={f.ph} style={{ width: "100%", padding: 14, borderRadius: 12, border: `1px solid rgba(16,185,129,0.25)`, background: surface, color: "#fff", fontSize: 18, fontFamily: mono, outline: "none", boxSizing: "border-box" }} />
            </div>))}
          <button onClick={() => { if (initialWeight) { setWeights({ 0: parseFloat(initialWeight) }); setScreen("app"); }}} disabled={!initialWeight} style={{ width: "100%", padding: 16, fontSize: 15, fontWeight: 700, color: "#fff", background: initialWeight ? `linear-gradient(135deg, ${accent}, #059669)` : "rgba(255,255,255,0.08)", border: "none", borderRadius: 12, cursor: initialWeight ? "pointer" : "default", fontFamily: sans, marginTop: 12, boxShadow: initialWeight ? `0 8px 24px ${accentGlow}` : "none" }}>Comenzar el Reto →</button>
        </div>
      </div>);
  }

  return (
    <div style={{ fontFamily: sans, background: bg, minHeight: "100vh", color: "#fff", maxWidth: 430, margin: "0 auto" }}>
      {fonts}
      <div style={{ padding: "18px 20px 14px", background: `linear-gradient(180deg, rgba(16,185,129,0.08) 0%, transparent 100%)` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: accent, textTransform: "uppercase", letterSpacing: "2px", fontFamily: mono, marginBottom: 2 }}>Semana {currentData.week}/3</div>
            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px" }}>Día {selectedDay}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 24, fontWeight: 800, fontFamily: mono, color: progress >= 100 ? "#fbbf24" : accent }}>{progress}%</div>
            <div style={{ fontSize: 10, color: muted, fontWeight: 500 }}>completado</div>
          </div>
        </div>
        <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${progress}%`, background: `linear-gradient(90deg, ${accent}, #34d399)`, borderRadius: 2, transition: "width 0.6s cubic-bezier(0.22, 1, 0.36, 1)" }} />
        </div>
      </div>
      <div ref={dayScrollRef} style={{ padding: "10px 20px", overflowX: "auto", display: "flex", gap: 5, scrollbarWidth: "none" }}>
        {DAYS_DATA.map((d) => {
          const sel = selectedDay === d.day; const done = completedDays[d.day];
          return (<button key={d.day} onClick={() => setSelectedDay(d.day)} style={{ flexShrink: 0, width: 36, height: 36, borderRadius: 10, border: sel ? `2px solid ${accent}` : `1px solid ${border}`, background: done ? `linear-gradient(135deg, ${accent}, #059669)` : sel ? `${accent}18` : surface, color: done ? "#fff" : sel ? accent : muted, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: mono, display: "flex", alignItems: "center", justifyContent: "center" }}>{done ? "✓" : d.day}</button>);
        })}
      </div>
      <div style={{ display: "flex", padding: "6px 20px", gap: 6 }}>
        {[{ id: "food", label: "🍽️ Comidas" }, { id: "exercise", label: "💪 Ejercicio" }, { id: "progress", label: "📊 Progreso" }].map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, padding: "9px 4px", borderRadius: 10, border: "none", background: tab === t.id ? `${accent}15` : "transparent", color: tab === t.id ? accent : muted, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: sans, borderBottom: tab === t.id ? `2px solid ${accent}` : "2px solid transparent" }}>{t.label}</button>
        ))}
      </div>
      <div style={{ padding: "14px 20px 110px" }}>
        {tab === "food" && (<>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>Plan del día</h3>
            <div style={{ display: "flex", gap: 6 }}><Badge>{currentData.totalCal} kcal</Badge><Badge color="#3b82f6">{currentData.totalProtein}g prot</Badge></div>
          </div>
          {currentData.meals.map((m, i) => (
            <Card key={i} style={{ marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: accent, textTransform: "uppercase", letterSpacing: "1px" }}>{m.meal}</span>
                <span style={{ fontSize: 11, fontFamily: mono, color: muted }}>{m.cal} kcal · {m.protein}g</span>
              </div>
              <div style={{ fontSize: 14, color: "rgba(255,255,255,0.8)", lineHeight: 1.45 }}>{m.desc}</div>
            </Card>))}
        </>)}
        {tab === "exercise" && (<>
          <div style={{ marginBottom: 14 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 3px" }}>Rutina del día</h3>
            <p style={{ fontSize: 12, color: muted, margin: 0 }}>Semana {currentData.week}: {["Base & Fundamentos", "Intensidad Media", "Máximo Rendimiento"][currentData.week - 1]}</p>
          </div>
          {currentData.exercises.map((ex, i) => (
            <Card key={i} style={{ marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <span style={{ fontSize: 20 }}>{ex.icon}</span>
                <div><div style={{ fontSize: 14, fontWeight: 600, marginBottom: 3 }}>{ex.name}</div><div style={{ fontSize: 12, color: muted, fontFamily: mono }}>{ex.duration}</div></div>
              </div>
              <Badge color={ex.intensity === "Baja" ? "#34d399" : ex.intensity === "Media" ? "#fbbf24" : "#ef4444"}>{ex.intensity}</Badge>
            </Card>))}
        </>)}
        {tab === "progress" && (<>
          <Card glow style={{ textAlign: "center", padding: 20, marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: muted, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 12 }}>Tu transformación</div>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "baseline", gap: 16 }}>
              <div><div style={{ fontSize: 30, fontWeight: 800, fontFamily: mono }}>{weights[0] || "—"}</div><div style={{ fontSize: 10, color: muted, marginTop: 2 }}>Inicio kg</div></div>
              <div style={{ fontSize: 18, color: "rgba(255,255,255,0.15)" }}>→</div>
              <div><div style={{ fontSize: 30, fontWeight: 800, fontFamily: mono, color: accent }}>{goalWeight || "—"}</div><div style={{ fontSize: 10, color: muted, marginTop: 2 }}>Meta kg</div></div>
            </div>
            {weights[0] && goalWeight && (<div style={{ marginTop: 12, fontSize: 12, color: muted, background: surface, padding: "6px 12px", borderRadius: 8, display: "inline-block" }}>Objetivo: <strong style={{ color: accent }}>{(weights[0] - parseFloat(goalWeight)).toFixed(1)} kg</strong> en 21 días</div>)}
          </Card>
          <h3 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 10px" }}>Registro de peso</h3>
          {[{ d: 1, label: "📍 Día 1 — Inicio" }, { d: 7, label: "📅 Día 7 — Semana 1" }, { d: 14, label: "📅 Día 14 — Semana 2" }, { d: 21, label: "🏆 Día 21 — Final" }].map((w) => (
            <Card key={w.d} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 500 }}>{w.label}</span>
              <input type="number" placeholder="kg" value={weights[w.d] || ""} onChange={(e) => setWeights((p) => ({ ...p, [w.d]: e.target.value }))} style={{ width: 65, padding: "7px 8px", borderRadius: 8, border: `1px solid rgba(16,185,129,0.2)`, background: surface, color: "#fff", fontSize: 13, fontFamily: mono, textAlign: "center", outline: "none" }} />
            </Card>))}
          <Card style={{ textAlign: "center", marginTop: 16, padding: 24 }}>
            <div style={{ fontSize: 11, color: muted, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 10 }}>Días completados</div>
            <div style={{ fontSize: 44, fontWeight: 800, fontFamily: mono, lineHeight: 1, background: completedCount === 21 ? "linear-gradient(135deg, #fbbf24, #f59e0b)" : `linear-gradient(135deg, ${accent}, #34d399)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{completedCount}/21</div>
            {completedCount === 21 && <div style={{ marginTop: 8, fontSize: 14, fontWeight: 600, color: "#fbbf24" }}>¡Reto completado!</div>}
          </Card>
        </>)}
      </div>
      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430, padding: "14px 20px 20px", background: `linear-gradient(180deg, transparent, ${bg} 40%)` }}>
        <button onClick={() => toggleDay(selectedDay)} style={{ width: "100%", padding: 15, borderRadius: 12, border: "none", background: completedDays[selectedDay] ? "rgba(239,68,68,0.12)" : `linear-gradient(135deg, ${accent}, #059669)`, color: completedDays[selectedDay] ? "#ef4444" : "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: sans, boxShadow: completedDays[selectedDay] ? "none" : `0 6px 24px ${accentGlow}` }}>
          {completedDays[selectedDay] ? "✕ Desmarcar día" : `✓ Completar Día ${selectedDay}`}
        </button>
      </div>
    </div>
  );
}
