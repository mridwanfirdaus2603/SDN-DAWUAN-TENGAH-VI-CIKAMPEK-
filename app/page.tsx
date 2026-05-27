"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { 
  motion, 
  AnimatePresence 
} from "motion/react";
import { 
  School,
  GraduationCap,
  BookOpen,
  Users,
  Calendar,
  FileText,
  Brain,
  Zap,
  Activity,
  Search,
  Compass,
  Plus,
  RotateCcw,
  ArrowRight,
  CheckCircle,
  Award,
  Clock,
  Info,
  MapPin,
  Phone,
  Mail,
  Sparkles,
  Send,
  Building,
  ChevronRight,
  BookMarked,
  ShieldAlert,
  HeartHandshake,
  Sliders
} from "lucide-react";

// Structure definitions for Neural Tutor
interface NeuronNode {
  id: string;
  label: string;
  type: "origin" | "synapse" | "transmitter" | "receptor" | "inhibitor" | string;
  val: number; 
  details: string;
  color: string;
  x: number;
  y: number;
  depth?: number;
}

interface SynapseLink {
  source: string;
  target: string;
  label: string;
  strength: number; 
}

const DEFAULT_NODES: NeuronNode[] = [
  {
    id: "1",
    label: "Kurikulum Merdeka SDN Dawuan Tengah VI",
    type: "origin",
    val: 20,
    details: "Inti kurikulum pendidikan dasar nasional yang berfokus pada pengembangan nalar kritis, kebebasan belajar, dan pembentukan karakter Pancasila.",
    color: "#ec4899",
    x: 400,
    y: 300,
    depth: 0
  },
  {
    id: "2",
    label: "Projek Penguatan Profil Pelajar Pancasila (P5)",
    type: "transmitter",
    val: 15,
    details: "Pembelajaran lintas disiplin ilmu untuk mengamati dan memikirkan solusi terhadap permasalahan di lingkungan sekitar, memperkuat karakter bangsa.",
    color: "#06b6d4",
    x: 230,
    y: 190,
    depth: 1
  },
  {
    id: "3",
    label: "Literasi Digital Siswa",
    type: "synapse",
    val: 13,
    details: "Pengenalan teknologi secara positif, etis, dan produktif kepada siswa SDN Dawuan Tengah VI menggunakan platform interaktif.",
    color: "#10b981",
    x: 580,
    y: 200,
    depth: 1
  },
  {
    id: "4",
    label: "Keunggulan Karakter & Prestasi",
    type: "receptor",
    val: 14,
    details: "Hasil akhir transformasi akademik yang melahirkan siswa disiplin, percaya diri, religius, berprestasi di tingkat kecamatan hingga kabupaten.",
    color: "#eab308",
    x: 480,
    y: 460,
    depth: 1
  },
  {
    id: "5",
    label: "Integrasi Orang Tua & Masyarakat",
    type: "inhibitor",
    val: 11,
    details: "Sistem sinergi dan kontrol umpan balik antara wali murid dan dewan komite sekolah untuk memantau tumbuh kembang dan ketertiban siswa.",
    color: "#f43f5e",
    x: 240,
    y: 420,
    depth: 1
  }
];

const DEFAULT_LINKS: SynapseLink[] = [
  { source: "1", target: "2", label: "Implementasi Pendidikan Karakter", strength: 0.95 },
  { source: "1", target: "3", label: "Pengembangan Keterampilan Abad 21", strength: 0.78 },
  { source: "1", target: "4", label: "Umpan Balik Kesiapan Lulusan", strength: 0.85 },
  { source: "1", target: "5", label: "Sinergi Komunitas Sekolah", strength: 0.62 }
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<"beranda" | "profil" | "fasilitas" | "ppdb" | "tutor">("beranda");

  // API States for custom Neural System Gemini Mindmap
  const [tutorTopic, setTutorTopic] = useState("");
  const [nodes, setNodes] = useState<NeuronNode[]>(DEFAULT_NODES);
  const [links, setLinks] = useState<SynapseLink[]>(DEFAULT_LINKS);
  const [overview, setOverview] = useState(
    "Selamat datang di Sistem Mind Mapping 'Neural Gemini'. Di sini, siswa SDN Dawuan Tengah VI dapat memasukkan materi pelajaran apa saja (misalnya Tata Surya, Struktur Tumbuhan, Pahlawan Nasional) untuk digambarkan langsung ke dalam bentuk peta konsep saraf interaktif bertenaga AI Gemini!"
  );
  const [loading, setLoading] = useState(false);
  const [expandingNodeId, setExpandingNodeId] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>("1");
  const [error, setError] = useState<string | null>(null);
  const [pulseCount, setPulseCount] = useState(0);
  const [tutorInspectorTab, setTutorInspectorTab] = useState<"detail" | "bantuan">("detail");

  // Panning/Zooming states for the AI Neural SVG Visualizer
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const SVG_WIDTH = 800;
  const SVG_HEIGHT = 600;

  // Selected concept for Neural block
  const selectedNode = useMemo(() => {
    return nodes.find((n) => n.id === selectedNodeId) || nodes[0];
  }, [nodes, selectedNodeId]);

  // PPDB (Penerimaan Peserta Didik Baru) Form States
  const [formData, setFormData] = useState({
    namaLengkap: "",
    nikSiswa: "",
    tempatLahir: "",
    tanggalLahir: "",
    jenisKelamin: "Laki-laki",
    namaAyah: "",
    namaIbu: "",
    noTelepon: "",
    alamatTinggal: "",
    pilihanKelas: "Kelas 1",
    persyaratanPernyataan: false,
  });
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationId, setRegistrationId] = useState("");
  const [isSubmittingPPDB, setIsSubmittingPPDB] = useState(false);

  // Announcement State
  const [currentAnnouncementIndex, setCurrentAnnouncementIndex] = useState(0);
  const announcements = [
    { title: "🎉 PPDB Online TA 2026/2027 Dibuka", desc: "Penerimaan peserta didik baru SDN Dawuan Tengah VI secara online resmi dibuka. Silakan mengisi formulir di tab PPDB.", date: "25 Mei 2026" },
    { title: "🏆 Juara II Pramuka Kwarran Cikampek", desc: "Selamat kepada tim Pramuka SDN Dawuan Tengah VI atas kemenangan gemilang di Lomba Ketangkasan Penggalang.", date: "18 Mei 2026" },
    { title: "📚 Penyediaan Buku Kurikulum Merdeka Baru", desc: "Perpustakaan Pintar sekolah telah mendistribusikan buku paket Kurikulum Merdeka terbaru untuk seluruh jenjang kelas 1-6.", date: "10 Mei 2026" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentAnnouncementIndex((prev) => (prev + 1) % announcements.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [announcements.length]);

  // Teachers Database of SDN Dawuan Tengah VI
  const teachers = [
    { name: "Siti Masitoh, S.Pd.SD", role: "Kepala Sekolah", code: "NIP. 197405102005012003", avatar: "👩‍🏫" },
    { name: "Budi Santoso, S.Pd.", role: "Pramuka & PJOK", code: "NIP. 198211042009021005", avatar: "👨‍🏫" },
    { name: "Siti Aminah, M.Pd.", role: "Wali Kelas VI", code: "NIP. 198503122010012012", avatar: "👩‍🏫" },
    { name: "Sri Wahyuni, S.Pd.SD", role: "Wali Kelas V", code: "NIP. 198808242015032004", avatar: "👩‍🏫" },
    { name: "Deni Ramdani, S.Pd.", role: "Wali Kelas IV", code: "NIP. 199105152020121008", avatar: "👨‍🏫" },
    { name: "Aisyah Putri, S.Hum.", role: "Wali Kelas III & Operator", code: "NIP. 199409192022212002", avatar: "👩‍🏫" }
  ];

  // Facilities Database
  const facilities = [
    { name: "Ruang Kelas Digital", desc: "Dilengkapi proyektor interaktif, kipas angin berperekat sirkulasi maksimal, dan tata ruang ramah anak.", icon: "🏫" },
    { name: "Perpustakaan Pintar", desc: "Koleksi ribuan buku fisik pelajaran, ensiklopedia anak, cerita rakyat, serta akses tablet digital.", icon: "📚" },
    { name: "Laboratorium TI", desc: "Komputer multimedia terhubung internet untuk melatih kecakapan digital siswa sejak usia dini.", icon: "💻" },
    { name: "Mushola Al-Kautsar", desc: "Sarana pembinaan kerohanian, shalat dhuha berjamaah, dan kegiatan belajar mengaji (TPQ) sore hari.", icon: "🕌" },
    { name: "Lapangan Olahraga Hijau", desc: "Sarana bermain sepak bola, voli, basket, bulutangkis, serta area upacara bendera yang rindang.", icon: "⚽" },
    { name: "Kebun Pembelajaran Hidroponik", desc: "Area Green School untuk mengenalkan pertanian modern ramah lingkungan kepada siswa generasi masa kini.", icon: "🌱" }
  ];

  // API Call: Model Generator
  const generateTutorMindmap = async (targetTopic: string) => {
    if (!targetTopic.trim()) return;
    setLoading(true);
    setError(null);
    setSelectedNodeId(null);

    try {
      const response = await fetch("/api/neural", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "generate", topic: targetTopic }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Gagal membangun peta konsep pelajaran.");
      }

      const rawNodes: any[] = data.nodes || [];
      const rawLinks: any[] = data.links || [];

      if (rawNodes.length === 0) {
        throw new Error("Gagal memperoleh data simpul dari AI Tutor.");
      }

      const originIndex = rawNodes.findIndex((n) => n.type === "origin") >= 0 
        ? rawNodes.findIndex((n) => n.type === "origin") 
        : 0;

      const processedNodes: NeuronNode[] = rawNodes.map((n, i) => {
        if (i === originIndex) {
          return {
            ...n,
            type: "origin",
            depth: 0,
            x: SVG_WIDTH / 2,
            y: SVG_HEIGHT / 2,
          };
        } else {
          const count = rawNodes.length - 1 || 1;
          const adjustedIndex = i > originIndex ? i - 1 : i;
          const angle = (2 * Math.PI * adjustedIndex) / count;
          const radius = 175 + (i % 2 === 0 ? 25 : -25);
          return {
            ...n,
            depth: 1,
            x: Math.round(SVG_WIDTH / 2 + radius * Math.cos(angle)),
            y: Math.round(SVG_HEIGHT / 2 + radius * Math.sin(angle)),
          };
        }
      });

      setNodes(processedNodes);
      setLinks(rawLinks);
      setOverview(data.overview || `Berhasil meringkas serta memetakan konsep pelajaran "${targetTopic}".`);
      const rootNode = processedNodes.find(n => n.type === "origin") || processedNodes[0];
      setSelectedNodeId(rootNode.id);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Terjadi kesalahan internal ketika menghubungi asisten AI.");
    } finally {
      setLoading(false);
    }
  };

  // Node branch API
  const expandTutorNode = async (targetNode: NeuronNode) => {
    if (expandingNodeId) return;
    setExpandingNodeId(targetNode.id);
    setError(null);

    try {
      const existingIds = nodes.map(n => n.id);
      const response = await fetch("/api/neural", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "expand",
          nodeId: targetNode.id,
          nodeLabel: targetNode.label,
          topic: tutorTopic || "Pengetahuan Sekolah Dasar",
          existingNodeIds: existingIds,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Gagal mengembangkan materi pelajaran.");
      }

      const freshNodes: any[] = data.nodes || [];
      const freshLinks: any[] = data.links || [];

      // Geometric projection
      const px = targetNode.x;
      const py = targetNode.y;
      const dx = px - 400;
      const dy = py - 300;
      let baseAngle = Math.atan2(dy, dx);
      if (Math.abs(dx) < 5 && Math.abs(dy) < 5) {
        baseAngle = Math.random() * 2 * Math.PI;
      }

      const angleOffsets = [-0.6, 0, 0.6];
      const distance = 130;

      const structuredNodes: NeuronNode[] = freshNodes.map((node, i) => {
        const offset = angleOffsets[i % angleOffsets.length];
        const finalAngle = baseAngle + offset;
        return {
          ...node,
          depth: (targetNode.depth || 1) + 1,
          x: Math.round(px + distance * Math.cos(finalAngle)),
          y: Math.round(py + distance * Math.sin(finalAngle)),
        };
      });

      // Clamp coordinates inside viewport safety margin
      const boundedNodes = structuredNodes.map(node => {
        const border = 45;
        let nx = node.x;
        let ny = node.y;
        if (nx < border) nx = border;
        if (nx > SVG_WIDTH - border) nx = SVG_WIDTH - border;
        if (ny < border) ny = border;
        if (ny > SVG_HEIGHT - border) ny = SVG_HEIGHT - border;
        return { ...node, x: nx, y: ny };
      });

      setNodes((prev) => [...prev, ...boundedNodes]);
      setLinks((prev) => [...prev, ...freshLinks]);
      setSelectedNodeId(boundedNodes[0].id);
      setPulseCount(prev => prev + 1);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Gagal menghubungi modul kognitif asisten.");
    } finally {
      setExpandingNodeId(null);
    }
  };

  // Drag grid handlings for canvas
  const handleSVGMouseDown = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    const target = e.target as SVGElement;
    if (target.id === "canvas-grid" || target.id === "canvas-root" || target.tagName === "svg") {
      setIsDragging(true);
      dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
    }
  };

  const handleSVGMouseMove = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y
    });
  };

  // Fire PPDB submission
  const handlePPDBSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.persyaratanPernyataan) {
      alert("Mohon setujui ketentuan keabsahan berkas.");
      return;
    }
    setIsSubmittingPPDB(true);
    setTimeout(() => {
      const code = `PPDB-2026-${Math.floor(100000 + Math.random() * 900000)}`;
      setRegistrationId(code);
      setRegistrationSuccess(true);
      setIsSubmittingPPDB(false);
    }, 1500);
  };

  const handleResetPPDB = () => {
    setFormData({
      namaLengkap: "",
      nikSiswa: "",
      tempatLahir: "",
      tanggalLahir: "",
      jenisKelamin: "Laki-laki",
      namaAyah: "",
      namaIbu: "",
      noTelepon: "",
      alamatTinggal: "",
      pilihanKelas: "Kelas 1",
      persyaratanPernyataan: false,
    });
    setRegistrationSuccess(false);
    setRegistrationId("");
  };

  // Node Type Indonesian Translator
  const getNodeTypeBahasa = (type: string) => {
    switch (String(type).toLowerCase()) {
      case "origin":
        return { label: "Topik Utama", color: "bg-pink-500", text: "text-pink-400" };
      case "synapse":
        return { label: "Konsep Penjelas", color: "bg-cyan-500", text: "text-cyan-400" };
      case "transmitter":
        return { label: "Faktor Penggerak", color: "bg-emerald-500", text: "text-emerald-400" };
      case "receptor":
        return { label: "Dampak / Hasil", color: "bg-yellow-500", text: "text-yellow-400" };
      case "inhibitor":
        return { label: "Batas / Kontrol", color: "bg-rose-500", text: "text-rose-400" };
      default:
        return { label: "Kaitan Belajar", color: "bg-slate-500", text: "text-slate-400" };
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans select-none antialiased selection:bg-red-600/30 selection:text-red-100">
      
      {/* Background Neon Highlights */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-cyan-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header & Identity Brand */}
      <div className="bg-neutral-950/90 border-b border-neutral-900 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-inner relative group">
              <span className="absolute inset-0 bg-red-600/20 blur-md rounded-2xl scale-75 group-hover:scale-105 transition-transform" />
              <School className="w-6.5 h-6.5 text-red-500 relative z-10" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
                <h1 className="text-lg font-black tracking-tight text-white leading-none">
                  SDN DAWUAN TENGAH VI
                </h1>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed mt-0.5 font-mono">
                Pendidikan Unggul, Berkarakter & Ramah Digital • Cikampek, Karawang
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-neutral-900/60 border border-neutral-850 px-3.5 py-1.5 rounded-xl text-neutral-400 text-xs">
            <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
            <span className="truncate max-w-[280px]">Bumi Mutiara Indah I, Dawuan Tengah, Cikampek, Karawang</span>
          </div>
        </div>

        {/* Global School News Ticker Banner */}
        <div className="bg-red-950/20 border-t border-b border-red-500/10 px-4 md:px-8 py-2">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-10">
            <div className="flex items-center gap-2 shrink-0">
              <span className="bg-red-600 text-neutral-100 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded font-mono shadow-md shadow-red-950">
                PENGUMUMAN WALI
              </span>
              <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
            </div>
            <div className="flex-1 overflow-hidden relative h-5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentAnnouncementIndex}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 flex items-center gap-2 text-xs truncate"
                >
                  <strong className="text-white bg-neutral-900/80 px-2 py-0.5 rounded border border-neutral-850 text-[10px]">
                    {announcements[currentAnnouncementIndex].date}
                  </strong>
                  <span className="font-medium text-neutral-200">
                    {announcements[currentAnnouncementIndex].title}:
                  </span>
                  <span className="text-neutral-400 truncate">
                    {announcements[currentAnnouncementIndex].desc}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Main Tab controller */}
        <div className="bg-neutral-950 border-b border-neutral-900">
          <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-start gap-1 overflow-x-auto scrollbar-none py-1.5">
            {[
              { id: "beranda", label: "Beranda Utama", icon: School },
              { id: "profil", label: "Profil Sekolah & Guru", icon: GraduationCap },
              { id: "fasilitas", label: "Sarana & Prasarana", icon: BookOpen },
              { id: "ppdb", label: "PPDB Online (Pendaftaran)", icon: FileText },
              { id: "tutor", label: "Neural Gemini (Asisten Belajar AI)", icon: Brain },
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4.5 py-2.5 rounded-xl font-sans text-xs font-bold shrink-0 transition-all cursor-pointer ${
                    isSelected 
                      ? "bg-red-600/90 text-white shadow-lg shadow-red-950 border-t border-red-500/30" 
                      : "text-neutral-400 hover:text-white hover:bg-neutral-900/80"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isSelected ? "text-white" : "text-neutral-400"}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Container Wrapper */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 overflow-hidden flex flex-col">
        
        <AnimatePresence mode="wait">
          
          {/* TAB 1: BERANDA / HOME */}
          {activeTab === "beranda" && (
            <motion.div
              key="beranda"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
              id="view-beranda"
            >
              {/* Responsive Hero Segment */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-neutral-900/30 border border-neutral-850 p-6 md:p-10 rounded-3xl relative overflow-hidden shadow-lg">
                <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
                
                <div className="lg:col-span-7 space-y-6">
                  <div className="inline-flex items-center gap-2.5 px-3 py-1 bg-red-950/45 border border-red-550/20 text-red-400 rounded-xl text-[11px] font-mono uppercase tracking-wider font-extrabold">
                    <Award className="w-3.5 h-3.5 animate-pulse" />
                    Terakreditasi A • NPSN: 20217983
                  </div>
                  
                  <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight font-sans">
                    Mewujudkan Insan <span className="text-red-500">Cerdas</span>, Berkarakter & Peduli Lingkungan.
                  </h2>
                  <p className="text-sm md:text-base text-neutral-300 leading-relaxed max-w-2xl font-sans">
                    Selamat datang di Portal Resmi SDN Dawuan Tengah VI Karawang. Kami berkomitmen untuk merekatkan tradisi akademik yang kokoh dengan integrasi kognitif modern, menciptakan gerbang belajar ramah anak bagi calon penerus bangsa.
                  </p>

                  {/* Operational stats card */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 shrink-0">
                    <div className="bg-neutral-900/90 border border-neutral-850 p-3.5 rounded-2xl text-left">
                      <span className="block text-[10px] uppercase tracking-wider text-neutral-500 font-mono font-bold">Peserta Didik</span>
                      <strong className="text-xl font-bold text-white font-sans mt-1 block">420+ Siswa</strong>
                    </div>
                    <div className="bg-neutral-900/90 border border-neutral-850 p-3.5 rounded-2xl text-left">
                      <span className="block text-[10px] uppercase tracking-wider text-neutral-500 font-mono font-bold">Sertifikasi Guru</span>
                      <strong className="text-xl font-bold text-white font-sans mt-1 block">95% S1/S2</strong>
                    </div>
                    <div className="bg-neutral-900/90 border border-neutral-850 p-3.5 rounded-2xl text-left">
                      <span className="block text-[10px] uppercase tracking-wider text-neutral-500 font-mono font-bold">Rasio Guru & Siswa</span>
                      <strong className="text-xl font-bold text-white font-sans mt-1 block">1 : 24</strong>
                    </div>
                    <div className="bg-neutral-900/90 border border-neutral-850 p-3.5 rounded-2xl text-left">
                      <span className="block text-[10px] uppercase tracking-wider text-neutral-500 font-mono font-bold">Fasilitas Digital</span>
                      <strong className="text-xl font-bold text-white font-sans mt-1 block">Lengkap</strong>
                    </div>
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row gap-3.5">
                    <button
                      onClick={() => setActiveTab("ppdb")}
                      className="px-6 py-3 bg-red-600 hover:bg-red-500 hover:shadow-red-950 text-white rounded-xl text-xs font-black uppercase tracking-wider font-sans flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg duration-150"
                    >
                      <span>PPDB Online TA 2026/2027</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setActiveTab("tutor")}
                      className="px-6 py-3 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-white rounded-xl text-xs font-black uppercase tracking-wider font-sans flex items-center justify-center gap-2 transition-all cursor-pointer duration-150"
                    >
                      <Brain className="w-4 h-4 text-cyan-400" />
                      <span>E-Learning & Tutor AI</span>
                    </button>
                  </div>
                </div>

                {/* Right side: School Identity Card & Fast Actions */}
                <div className="lg:col-span-5 bg-neutral-900 border border-neutral-800 p-6 rounded-2xl space-y-6 relative flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-red-500 uppercase font-mono">
                      <Clock className="w-4 h-4 text-red-500" />
                      <span>Agenda Terdekat Sekolah</span>
                    </div>
                    <h3 className="text-white text-base font-bold font-sans">Program Bulan Juni 2026</h3>
                    <p className="text-neutral-400 text-xs">Aktivitas dan kalender kegiatan penting sekolah yang berlangsung akhir semester ini.</p>
                  </div>

                  <div className="space-y-3.5 font-mono text-[11px] text-neutral-400">
                    <div className="flex items-start gap-3 p-3 bg-neutral-950/70 border border-neutral-850 rounded-xl">
                      <Calendar className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                      <div>
                        <strong className="text-white block font-sans">08 - 12 Juni 2026</strong>
                        <span>Penilaian Akhir Tahun (PAT) Semester Genap</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-neutral-950/70 border border-neutral-850 rounded-xl">
                      <Award className="w-4 h-4 text-yellow-400 mt-0.5 shrink-0" />
                      <div>
                        <strong className="text-white block font-sans">20 Juni 2026</strong>
                        <span>Pembagian Rapor Hasil Belajar PAT TA 2025/2026</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-neutral-950/70 border border-neutral-850 rounded-xl">
                      <Users className="w-4 h-4 text-pink-400 mt-0.5 shrink-0" />
                      <div>
                        <strong className="text-white block font-sans">22 Juni - 10 Juli 2026</strong>
                        <span>Libur Akhir Tahun Ajaran Sekolah</span>
                      </div>
                    </div>
                  </div>

                  {/* Core school message */}
                  <div className="p-3.5 bg-red-950/10 border border-red-500/15 rounded-xl flex gap-2.5 items-start">
                    <Info className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <p className="text-[11px] font-sans text-red-300 leading-normal">
                      Pelayanan PPDB Online & Tatap Muka tetap beroperasi di sekretariat bendahara sekolah setiap hari Senin s/d Sabtu pukul 08:00 - 13:00 WIB.
                    </p>
                  </div>
                </div>
              </div>

              {/* Visi Misi and Core Values Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-neutral-900/30 border border-neutral-850 p-6 rounded-2xl space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-black">
                    V
                  </div>
                  <h3 className="text-white font-bold text-lg font-sans">Visi Utama</h3>
                  <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                    Terwujudnya insan pendidikan yang cerdas, berkarakter mulia, inovatif, berdaya saing global, serta berwawasan lingkungan menuju kelestarian bersama.
                  </p>
                </div>

                <div className="bg-neutral-900/30 border border-neutral-850 p-6 rounded-2xl space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-black">
                    M
                  </div>
                  <h3 className="text-white font-bold text-lg font-sans">Misi Sekolah</h3>
                  <ul className="text-xs text-neutral-300 space-y-2 font-sans list-disc pl-4 leading-relaxed">
                    <li>Menyelenggarakan pembelajaran berkualitas terstruktur, santun, ramah, dan menyenangkan berbasis kecakapan kompetensi mendalam.</li>
                    <li>Membentuk pribadi berbudi pekerti luhur melandaskan nilai Pancasila dan ketakwaan kerohanian sesuai syariat agama masing-masing.</li>
                    <li>Mengembangkan kelestarian penataan sirkulasi ekologi sekolah (Green School) melalui pengurangan polusi dan daur ulang edukatif.</li>
                  </ul>
                </div>

                <div className="bg-neutral-900/30 border border-neutral-850 p-6 rounded-2xl space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400 font-black">
                    N
                  </div>
                  <h3 className="text-white font-bold text-lg font-sans">Nilai Karakter</h3>
                  <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                    <div className="p-2 bg-neutral-900/80 border border-neutral-850 rounded-xl text-white flex items-center gap-1.5 leading-none">
                      <CheckCircle className="w-3.5 h-3.5 text-red-500" />
                      <span>Disiplin Tinggi</span>
                    </div>
                    <div className="p-2 bg-neutral-900/80 border border-neutral-850 rounded-xl text-white flex items-center gap-1.5 leading-none">
                      <CheckCircle className="w-3.5 h-3.5 text-red-500" />
                      <span>Kreatif Mandiri</span>
                    </div>
                    <div className="p-2 bg-neutral-950 border border-neutral-900 rounded-xl text-white flex items-center gap-1.5 leading-none">
                      <CheckCircle className="w-3.5 h-3.5 text-red-500" />
                      <span>Gotong Royong</span>
                    </div>
                    <div className="p-2 bg-neutral-950 border border-neutral-900 rounded-xl text-white flex items-center gap-1.5 leading-none">
                      <CheckCircle className="w-3.5 h-3.5 text-red-500" />
                      <span>Sopan Santun</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-normal">
                    Nilai-nilai ini ditekankan setiap pagi sebelum prosesi kelas dimulai melalui pembacaan Asmaul Husna/Doa Bersama, menyanyikan lagu Indonesia Raya, dan operasi bersih sukarela semut.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: PROFIL SEKOLAH & GURU */}
          {activeTab === "profil" && (
            <motion.div
              key="profil"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
              id="view-profil"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left block - Principal Greeting */}
                <div className="lg:col-span-4 bg-neutral-900/40 border border-neutral-850 p-6 rounded-2xl space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-[150px] h-[150px] bg-red-650/5 rounded-full blur-2xl" />
                  
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-24 h-24 rounded-full bg-neutral-800 border-2 border-red-500 flex items-center justify-center text-4xl shadow-lg relative">
                      👩‍🏫
                      <div className="absolute -bottom-1.5 bg-red-600 text-white font-mono text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                        KEPALA SEKOLAH
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <h3 className="text-white font-black text-sm font-sans">Siti Masitoh, S.Pd.SD</h3>
                      <p className="text-[11px] text-neutral-500 font-mono">NIP. 197405102005012003</p>
                    </div>
                  </div>

                  <div className="space-y-3.5 border-t border-neutral-850 pt-5 text-xs text-neutral-300 leading-relaxed font-sans">
                    <p className="italic">
                      "Assalamu'alaikum Warahmatullahi Wabarakatuh,"
                    </p>
                    <p>
                      Salam sejahtera bagi keluarga besar SDN Dawuan Tengah VI Karawang serta para pengunjung portal sekalian. Kami bersyukur atas terbitnya layanan platform digital informasi interaktif ini.
                    </p>
                    <p>
                      Era perkembangan teknologi menghendaki tata guna kurikulum sekolah yang responsif. Melalui percampuran antara penguatan pembinaan akhlak budi pekerti serta stimulasi adaptasi digital siswa (seperti sistem asisten kognitif Neural Gemini), kami siap melangkah mendampingi masa tumbuh kembang anak-anak kita dengan metode asyik, kreatif, dan humanis.
                    </p>
                    <p className="italic">
                      "Wassalamu'alaikum Warahmatullahi Wabarakatuh."
                    </p>
                  </div>
                </div>

                {/* Right block - List of Teachers and Staff */}
                <div className="lg:col-span-8 space-y-6">
                  <div className="space-y-1.5 text-left">
                    <h3 className="text-lg font-bold text-white font-sans flex items-center gap-2">
                      <Users className="w-5 h-5 text-red-500" />
                      Dewan Guru & Tenaga Kependidikan
                    </h3>
                    <p className="text-xs text-neutral-400">
                      Seluruh dewan pendidik SDN Dawuan Tengah VI telah tersertifikasi fungsional dan berdedikasi tinggi mewujudkan pembelajaran inklusif.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {teachers.map((teacher, idx) => (
                      <div key={idx} className="bg-neutral-900/20 border border-neutral-850 p-4.5 rounded-xl space-y-3.5 hover:border-neutral-750 transition-all group">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 bg-neutral-900 border border-neutral-800 rounded-xl flex items-center justify-center text-2xl group-hover:bg-neutral-850 transition-colors">
                            {teacher.avatar}
                          </div>
                          <div className="space-y-0.5 truncate">
                            <h4 className="text-xs font-bold text-white group-hover:text-red-400 transition-colors truncate">
                              {teacher.name}
                            </h4>
                            <p className="text-[10px] text-neutral-400">{teacher.role}</p>
                          </div>
                        </div>
                        <div className="pt-2 border-t border-neutral-850/60 flex items-center justify-between text-[9px] font-mono text-neutral-500">
                          <span>Status Kepegawaian</span>
                          <span className="text-white">{teacher.code.split(".")[0]} APN</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Core school values detail */}
                  <div className="bg-neutral-900/30 border border-neutral-850 p-5 rounded-2xl flex flex-col md:flex-row gap-4 items-start">
                    <span className="p-3 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-xl shrink-0">
                      <GraduationCap className="w-5 h-5" />
                    </span>
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-white font-sans">Filosofi Pendidikan Ki Hajar Dewantara</h4>
                      <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                        Kami menjunjung tinggi semboyan <span className="text-neutral-200">Ing Ngarsa Sung Tulada</span> (di depan memberi contoh), <span className="text-neutral-200">Ing Madya Mangun Karsa</span> (di tengah membangun semangat), dan <span className="text-neutral-200">Tut Wuri Handayani</span> (di belakang memberikan dorongan kekuatan akademis maupun non-akademis).
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* TAB 3: SARANA & PRASANARA */}
          {activeTab === "fasilitas" && (
            <motion.div
              key="fasilitas"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
              id="view-fasilitas"
            >
              <div className="space-y-1.5 text-left max-w-2xl">
                <h3 className="text-lg font-bold text-white font-sans flex items-center gap-2">
                  <Building className="w-5 h-5 text-red-500" />
                  Prasarana dan Fasilitas Penunjang SDN Dawuan Tengah VI
                </h3>
                <p className="text-xs text-neutral-400">
                  Lingkungan sekolah dirancang sebagai wahana yang bersih, aman, rindang (Eco-friendly) guna memicu konsentrasi tinggi bagi siswa dalam berekspresi.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {facilities.map((fac, idx) => (
                  <div key={idx} className="bg-neutral-900/30 border border-neutral-850 p-5.5 rounded-2xl space-y-4 hover:border-neutral-750 transition-all group">
                    <div className="w-12 h-12 bg-neutral-950 border border-neutral-800 rounded-xl flex items-center justify-center text-2xl shadow-inner group-hover:scale-105 transition-transform">
                      {fac.icon}
                    </div>
                    <div className="space-y-1.5">
                      <h4 className="text-xs font-black text-white group-hover:text-red-400 transition-colors font-sans">
                        {fac.name}
                      </h4>
                      <p className="text-[11.5px] text-neutral-400 leading-relaxed font-sans">
                        {fac.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Green school banner */}
              <div className="bg-neutral-900/30 border border-neutral-800 p-6 rounded-2xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-8 space-y-2">
                  <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 rounded text-[10px] font-mono">
                    GERAKAN RAMAH LINGKUNGAN
                  </div>
                  <h4 className="text-white font-bold text-base font-sans leading-tight">Implementasi Green School & Zero-Waste Plastic</h4>
                  <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                    Siswa SDN Dawuan Tengah VI dibiasakan memilah sampah organik dan non-organik di tempat pemilah terdekat, merawat tanaman hias di sepanjang selasar ruang kelas, serta membawa tumbler minum guna meredam laju plastik sekali pakai di sekolah.
                  </p>
                </div>
                <div className="lg:col-span-4 flex items-center justify-center font-bold text-sm bg-neutral-950 border border-neutral-850 p-4 rounded-xl text-center text-emerald-400">
                  ⭐⭐⭐
                  <span className="text-xs text-neutral-400 font-mono block mt-1">Gelar Adiwiyata Tingkat Kwarran</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 4: PPDB ONLINE FORM */}
          {activeTab === "ppdb" && (
            <motion.div
              key="ppdb"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="max-w-3xl mx-auto space-y-6"
              id="view-ppdb"
            >
              <div className="space-y-1.5 text-center">
                <h3 className="text-lg font-bold text-white font-sans flex items-center justify-center gap-2">
                  <FileText className="w-5 h-5 text-red-500" />
                  Formulir Pendaftaran Siswa Baru (PPDB Online)
                </h3>
                <p className="text-xs text-neutral-400 max-w-xl mx-auto leading-relaxed">
                  Silakan isi formulir secara lengkap di bawah ini menggunakan data Kartu Keluarga dan Akte Lahir anak guna verifikasi kecocokan sistem Dapodik.
                </p>
              </div>

              {!registrationSuccess ? (
                <form onSubmit={handlePPDBSubmit} className="bg-neutral-900/45 border border-neutral-850 p-6 md:p-8 rounded-2xl shadow-xl space-y-6">
                  
                  {/* Form fields groups */}
                  <div className="space-y-4">
                    <h4 className="text-[11px] font-semibold text-neutral-400 uppercase tracking-widest font-mono border-b border-neutral-850 pb-2">
                      A. Data Diri Calon Siswa (Anak)
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] text-neutral-300 font-mono block font-bold">Nama Lengkap Siswa</label>
                        <input
                          type="text"
                          required
                          value={formData.namaLengkap}
                          onChange={(e) => setFormData({...formData, namaLengkap: e.target.value})}
                          placeholder="Nama sesuai akte lahir"
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-600 focus:border-red-500 outline-none transition-all"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-neutral-300 font-mono block font-bold">NIK Calon Siswa (16 Digit)</label>
                        <input
                          type="text"
                          required
                          maxLength={16}
                          value={formData.nikSiswa}
                          onChange={(e) => setFormData({...formData, nikSiswa: e.target.value})}
                          placeholder="Contoh: 321503XXXXXXXXXX"
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-600 focus:border-red-500 outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] text-neutral-300 font-mono block font-bold">Tempat Lahir</label>
                        <input
                          type="text"
                          required
                          value={formData.tempatLahir}
                          onChange={(e) => setFormData({...formData, tempatLahir: e.target.value})}
                          placeholder="Contoh: Karawang"
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-600 focus:border-red-500 outline-none transition-all"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-neutral-300 font-mono block font-bold">Tanggal Lahir</label>
                        <input
                          type="date"
                          required
                          value={formData.tanggalLahir}
                          onChange={(e) => setFormData({...formData, tanggalLahir: e.target.value})}
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-600 focus:border-red-500 outline-none transition-all"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-neutral-300 font-mono block font-bold">Jenis Kelamin</label>
                        <select
                          value={formData.jenisKelamin}
                          onChange={(e) => setFormData({...formData, jenisKelamin: e.target.value})}
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-red-500 outline-none transition-all"
                        >
                          <option>Laki-laki</option>
                          <option>Perempuan</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-2">
                    <h4 className="text-[11px] font-semibold text-neutral-400 uppercase tracking-widest font-mono border-b border-neutral-850 pb-2">
                      B. Data Orang Tua / Wali
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] text-neutral-300 font-mono block font-bold">Nama Lengkap Ayah Kandung</label>
                        <input
                          type="text"
                          required
                          value={formData.namaAyah}
                          onChange={(e) => setFormData({...formData, namaAyah: e.target.value})}
                          placeholder="Nama lengkap tanpa gelar"
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-600 focus:border-red-500 outline-none transition-all"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-neutral-300 font-mono block font-bold">Nama Lengkap Ibu Kandung</label>
                        <input
                          type="text"
                          required
                          value={formData.namaIbu}
                          onChange={(e) => setFormData({...formData, namaIbu: e.target.value})}
                          placeholder="Nama lengkap sesuai KK"
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-600 focus:border-red-500 outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1 md:col-span-1">
                        <label className="text-[10px] text-neutral-300 font-mono block font-bold">Pilihan Kelas Masuk</label>
                        <select
                          value={formData.pilihanKelas}
                          onChange={(e) => setFormData({...formData, pilihanKelas: e.target.value})}
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-red-500 outline-none transition-all"
                        >
                          <option>Kelas 1</option>
                          <option>Mutasi Masuk Kelas 2</option>
                          <option>Mutasi Masuk Kelas 3</option>
                          <option>Mutasi Masuk Kelas 4</option>
                          <option>Mutasi Masuk Kelas 5</option>
                        </select>
                      </div>

                      <div className="space-y-1 md:col-span-2">
                        <label className="text-[10px] text-neutral-300 font-mono block font-bold">Nomor Handphone Terhubung WhatsApp</label>
                        <input
                          type="text"
                          required
                          value={formData.noTelepon}
                          onChange={(e) => setFormData({...formData, noTelepon: e.target.value})}
                          placeholder="Contoh: 08129876543"
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-600 focus:border-red-500 outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-neutral-300 font-mono block font-bold">Alamat Rumah Tempat Tinggal Saat Ini</label>
                      <textarea
                        required
                        rows={3}
                        value={formData.alamatTinggal}
                        onChange={(e) => setFormData({...formData, alamatTinggal: e.target.value})}
                        placeholder="Tulis alamat rukun tetangga, perumahan, jajaran blok, kelurahan/desa secara lengkap"
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-600 focus:border-red-500 outline-none transition-all resize-none"
                      />
                    </div>
                  </div>

                  {/* Conditions & validations */}
                  <div className="p-4 bg-neutral-950/60 border border-neutral-850 rounded-xl space-y-3.5">
                    <label className="flex items-start gap-3 select-none cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.persyaratanPernyataan}
                        onChange={(e) => setFormData({...formData, persyaratanPernyataan: e.target.checked})}
                        className="mt-0.5 rounded border-neutral-800 bg-neutral-950 text-red-650 h-4 w-4"
                      />
                      <span className="text-[11px] text-neutral-400 font-sans leading-relaxed">
                        Saya bertanggung jawab atas kebenaran seluruh dokumen pendaftaran fisik yang saya lampirkan kelak pada waktu verifikasi berkas di SDN Dawuan Tengah VI. Ketidaksesuaian data dapat menyebabkan hak administrasi anak saya dicabut secara sepihak.
                      </span>
                    </label>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmittingPPDB || !formData.persyaratanPernyataan}
                      className="w-full py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none duration-150"
                    >
                      {isSubmittingPPDB ? (
                        <>
                          <Activity className="w-3.5 h-3.5 animate-spin" />
                          <span>Memasukkan Data Ke Server Dapodik...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Kirim Pendaftaran Online</span>
                        </>
                      )}
                    </button>
                  </div>

                </form>
              ) : (
                <div className="bg-neutral-900/40 border border-neutral-800 p-8 rounded-2xl text-center space-y-6 shadow-xl max-w-xl mx-auto">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-white font-black text-lg font-sans">Pendaftaran Formulir Berhasil!</h3>
                    <p className="text-xs text-neutral-400 font-sans leading-relaxed">
                      Selamat, data pendaftaran calon siswa atas nama <strong className="text-white">{formData.namaLengkap}</strong> telah terdata di basis pendaftar jalur akademik SDN Dawuan Tengah VI Cikampek Karawang.
                    </p>
                  </div>

                  {/* Booking Receipt code */}
                  <div className="p-4.5 bg-neutral-950 border border-neutral-850 rounded-xl space-y-2.5">
                    <span className="text-[10px] text-neutral-500 font-mono uppercase tracking-wider block font-bold">KODE STATUS PPDB SISWA</span>
                    <strong className="text-xl text-emerald-400 tracking-wider font-mono select-all block">{registrationId}</strong>
                    <span className="text-[9px] text-neutral-500 block leading-normal italic font-sans">
                      *Cetak atau simpan kode bukti ini untuk dibawa ketika melakukan penyerahan dokumen fisik asli di kantor tata usaha sekolah.
                    </span>
                  </div>

                  <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => {
                        window.print();
                      }}
                      className="flex-1 py-2.5 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 rounded-xl text-xs font-bold text-white transition-all cursor-pointer shadow"
                    >
                      Cetak Bukti Seleksi
                    </button>
                    <button
                      onClick={handleResetPPDB}
                      className="flex-1 py-2.5 bg-red-650 hover:bg-red-550 border border-red-600/30 rounded-xl text-xs font-bold text-neutral-100 transition-all cursor-pointer"
                    >
                      Daftar Anak Lainnya
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 5: AI TUTOR - NEURAL SYSTEM GEMINI */}
          {activeTab === "tutor" && (
            <motion.div
              key="tutor"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 xl:grid-cols-12 gap-6 overflow-hidden min-h-[500px]"
              id="view-tutor"
            >
              
              {/* Mindmap Controller Side (4 Cols) */}
              <div className="xl:col-span-4 space-y-6 flex flex-col justify-between">
                <div className="space-y-6">
                  
                  {/* Subject Input Block */}
                  <div className="space-y-3.5">
                    <label className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest font-mono flex items-center gap-1.5 leading-none">
                      <Sliders className="w-3.5 h-3.5 text-purple-400" />
                      Mulai Pelajaran Baru
                    </label>
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        generateTutorMindmap(tutorTopic);
                      }} 
                      className="space-y-2.5"
                    >
                      <div className="relative">
                        <input
                          type="text"
                          value={tutorTopic}
                          onChange={(e) => setTutorTopic(e.target.value)}
                          placeholder="Contoh: Ekosistem Hutan Hujan..."
                          disabled={loading}
                          className="w-full bg-neutral-900 border border-neutral-800 focus:border-cyan-500 rounded-xl py-3 pl-11 pr-4 text-xs text-white placeholder-neutral-500 outline-none transition-all"
                        />
                        <Search className="w-4 h-4 text-neutral-500 absolute left-4.5 top-3.5" />
                      </div>
                      
                      <button
                        type="submit"
                        disabled={loading || !tutorTopic.trim()}
                        className="w-full py-2.5 rounded-xl text-xs font-semibold tracking-wide uppercase font-sans shadow-lg transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-red-650 to-pink-650 hover:from-red-550 hover:to-pink-550 text-white disabled:opacity-50 disabled:pointer-events-none cursor-pointer duration-150"
                      >
                        {loading ? (
                          <>
                            <Activity className="w-4 h-4 animate-spin text-white" />
                            <span>Menghubungi Saraf Gemini AI...</span>
                          </>
                        ) : (
                          <>
                            <Brain className="w-4 h-4 text-white" />
                            <span>Mulai Memetakan Pikiran</span>
                          </>
                        )}
                      </button>
                    </form>
                  </div>

                  {/* Indonesian Subjects Core presets */}
                  <div className="space-y-3">
                    <h3 className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest font-mono flex items-center gap-1.5 leading-none">
                      <Compass className="w-3.5 h-3.5 text-pink-400" />
                      Subjek Belajar Terlaris SD
                    </h3>
                    
                    <div className="grid grid-cols-1 gap-2.5">
                      {[
                        { title: "Sistem Pencernaan Manusia", desc: "Bagaimana tubuh mencerna karbohidrat, protein, dan nutrisi makanan.", icon: "🍔" },
                        { title: "Siklus Rotasi Tata Surya", desc: "Menguji rotasi orbit 8 planet serta gravitasi hukum Kepler.", icon: "🌌" },
                        { title: "Proklamasi Kemerdekaan RI", desc: "Mempelajari peristiwa Rengasdengklok hingga pembacaan teks 1945.", icon: "🇮🇩" }
                      ].map((preset, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setTutorTopic(preset.title);
                            generateTutorMindmap(preset.title);
                          }}
                          disabled={loading}
                          className="p-3 bg-neutral-900/30 hover:bg-neutral-900/80 border border-neutral-850 hover:border-neutral-750 rounded-xl text-left transition-all flex items-start gap-3 cursor-pointer duration-150"
                        >
                          <span className="text-lg mt-0.5 shrink-0">{preset.icon}</span>
                          <div className="space-y-0.5 truncate">
                            <h4 className="text-xs font-bold text-white truncate">{preset.title}</h4>
                            <p className="text-[10px] text-neutral-400 leading-normal truncate">{preset.desc}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {error && (
                    <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-300 text-[11px] rounded-xl flex items-start gap-2">
                      <Zap className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">Interupsi Sistem Saraf</span>
                        <p className="text-[10px] mt-0.5 leading-normal">{error}</p>
                      </div>
                    </div>
                  )}

                </div>

                {/* Cognitive Summary Bottom Box */}
                <div className="p-4 bg-neutral-900/30 border border-neutral-900 rounded-xl space-y-2">
                  <span className="text-[9px] uppercase tracking-wider text-pink-400 font-mono font-bold block">Uraian Ringkas AI</span>
                  <p className="text-[11px] leading-relaxed text-neutral-300 max-h-[120px] overflow-y-auto select-text">
                    {overview}
                  </p>
                </div>

              </div>

              {/* Mindmap Vector Area (5 Cols) */}
              <div className="xl:col-span-5 bg-neutral-950 border border-neutral-900 rounded-2xl relative flex flex-col justify-between overflow-hidden min-h-[400px]">
                
                {/* SVG Visualizer HUD controls */}
                <div className="absolute top-3 left-3 z-20 flex gap-1 p-1 bg-neutral-900/90 border border-neutral-850 rounded-lg">
                  <button
                    onClick={() => setZoom(prev => Math.min(prev + 0.1, 2))}
                    className="w-7 h-7 text-xs rounded hover:bg-neutral-800 font-bold transition-colors cursor-pointer"
                  >
                    +
                  </button>
                  <button
                    onClick={() => setZoom(prev => Math.max(prev - 0.1, 0.5))}
                    className="w-7 h-7 text-xs rounded hover:bg-neutral-800 font-bold transition-colors cursor-pointer"
                  >
                    -
                  </button>
                  <button
                    onClick={() => { setPan({x:0, y:0}); setZoom(1); }}
                    className="px-2 text-[10px] font-mono hover:bg-neutral-800 rounded transition-colors cursor-pointer"
                  >
                    Reset
                  </button>
                </div>

                <div className="absolute top-3 right-3 z-20 text-[9px] bg-neutral-900/90 border border-neutral-850 px-2.5 py-1 rounded text-neutral-400 font-mono">
                  Geser Grid • Klik Simpul Saraf
                </div>

                <div className="flex-1 w-full relative">
                  {loading && (
                    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-neutral-950/85 backdrop-blur-sm">
                      <div className="relative flex items-center justify-center w-20 h-20 animate-pulse">
                        <div className="absolute inset-0 rounded-full border-2 border-red-500/20 border-t-red-500 animate-spin" />
                        <Brain className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-xs text-white font-bold tracking-wider mt-3">Gemini Menyusun Pikiran...</span>
                    </div>
                  )}

                  <svg
                    id="canvas-root"
                    onMouseDown={handleSVGMouseDown}
                    onMouseMove={handleSVGMouseMove}
                    onMouseUp={() => setIsDragging(false)}
                    onMouseLeave={() => setIsDragging(false)}
                    className="w-full h-full cursor-grab active:cursor-grabbing"
                    viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <defs>
                      <pattern id="canvas-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#222" strokeWidth="0.5" />
                      </pattern>
                      <filter id="glow-light">
                        <feGaussianBlur stdDeviation="5" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                    </defs>

                    {/* Infinite Grid layer */}
                    <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
                      <rect width="2000" height="1500" x="-600" y="-450" fill="url(#canvas-grid)" />
                    </g>

                    {/* SVG Connections Overlay Link Draw */}
                    <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
                      {links.map((link, idx) => {
                        const s = nodes.find(n => n.id === link.source);
                        const t = nodes.find(n => n.id === link.target);
                        if (!s || !t) return null;

                        return (
                          <g key={`l-${idx}`}>
                            <line x1={s.x} y1={s.y} x2={t.x} y2={t.y} stroke={s.color} strokeWidth={2 + link.strength * 3} strokeOpacity="0.2" filter="url(#glow-light)" />
                            <line x1={s.x} y1={s.y} x2={t.x} y2={t.y} stroke="#3a3a3a" strokeWidth="1" />
                            {/* Pulse ball traversing */}
                            <circle cx={t.x} cy={t.y} r="2" fill="url(#pulse-color)" className="hidden" />
                          </g>
                        );
                      })}
                    </g>

                    {/* SVG Draggable Node Elements */}
                    <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
                      {nodes.map((node) => {
                        const isSelected = node.id === selectedNodeId;
                        const size = node.type === "origin" ? 24 : Math.max(16, node.val * 1.05);

                        return (
                          <g
                            key={node.id}
                            onClick={() => setSelectedNodeId(node.id)}
                            transform={`translate(${node.x}, ${node.y})`}
                            className="group cursor-pointer select-none"
                          >
                            <circle cx="0" cy="0" r={size + 12} fill="transparent" />
                            {isSelected && (
                              <circle cx="0" cy="0" r={size + 6} fill="none" stroke={node.color} strokeWidth="1.5" className="animate-ping" style={{ animationDuration: "1.5s" }} />
                            )}
                            <circle cx="0" cy="0" r={size} fill="#0d0d0d" stroke={node.color} strokeWidth={isSelected ? 3.5 : 1.5} className="group-hover:fill-neutral-900 transition-colors" />
                            <circle cx="0" cy="0" r={size * 0.4} fill={node.color} filter="url(#glow-light)" />
                            <text y={size + 18} textAnchor="middle" fill={isSelected ? "#fff" : "#999"} className="text-[10px] font-bold group-hover:fill-white font-sans transition-colors drop-shadow">
                              {node.label}
                            </text>
                          </g>
                        );
                      })}
                    </g>
                  </svg>
                </div>

                <div className="p-3 bg-neutral-900/90 border-t border-neutral-850 flex items-center justify-between text-[11px] font-mono px-4">
                  <div className="flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                    <span>Impuls Sistem Saraf: <strong>{pulseCount}</strong> Fired</span>
                  </div>
                  <button
                    onClick={() => setPulseCount(prev => prev + 1)}
                    className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-750 text-white border border-neutral-700 text-[10px] rounded cursor-pointer leading-tight transition-all"
                  >
                    Kirim Stimulus Saraf
                  </button>
                </div>

              </div>

              {/* Inspector Panel Side (3 Cols) */}
              <div className="xl:col-span-3 space-y-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex border-b border-neutral-900 p-0.5 bg-neutral-950 rounded-lg">
                    <button
                      onClick={() => setTutorInspectorTab("detail")}
                      className={`flex-1 py-1.5 px-2.5 rounded text-[10px] font-mono font-bold transition-all cursor-pointer ${
                        tutorInspectorTab === "detail" 
                          ? "bg-neutral-900 border border-neutral-850 text-white shadow-sm"
                          : "text-neutral-500 hover:text-white"
                      }`}
                    >
                      Ringkasan
                    </button>
                    <button
                      onClick={() => setTutorInspectorTab("bantuan")}
                      className={`flex-1 py-1.5 px-2.5 rounded text-[10px] font-mono font-bold transition-all cursor-pointer ${
                        tutorInspectorTab === "bantuan"
                          ? "bg-neutral-900 border border-neutral-850 text-white shadow-sm"
                          : "text-neutral-500 hover:text-white"
                      }`}
                    >
                      Bantuan
                    </button>
                  </div>

                  <AnimatePresence mode="wait">
                    {tutorInspectorTab === "detail" && (
                      <motion.div
                        key="detail"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-4 text-xs"
                      >
                        {selectedNode ? (
                          (() => {
                            const meta = getNodeTypeBahasa(selectedNode.type);
                            return (
                              <div className="space-y-4">
                                <div className="p-4 bg-neutral-900/60 border border-neutral-850 rounded-xl space-y-3 relative group">
                                  <div className="absolute top-3 right-3 text-[9px] font-mono text-neutral-500 bg-neutral-950 px-1.5 py-0.5 rounded border border-neutral-900">
                                    ID: {selectedNode.id}
                                  </div>

                                  <div className="space-y-1 mt-1">
                                    <span className={`text-[9px] font-mono uppercase tracking-widest font-black ${meta.text}`}>
                                      {meta.label}
                                    </span>
                                    <h4 className="text-white text-sm font-sans font-bold leading-tight">
                                      {selectedNode.label}
                                    </h4>
                                  </div>

                                  <p className="text-[11.5px] text-neutral-300 leading-relaxed font-sans select-text">
                                    {selectedNode.details}
                                  </p>

                                  <div className="pt-3 border-t border-neutral-850/60 grid grid-cols-2 gap-3 font-mono text-[9px] text-neutral-500">
                                    <div>
                                      <span>Bobot Saraf</span>
                                      <strong className="text-white block mt-0.5">{selectedNode.val} val</strong>
                                    </div>
                                    <div>
                                      <span>Kedalaman</span>
                                      <strong className="text-white block mt-0.5">Level {selectedNode.depth || 1}</strong>
                                    </div>
                                  </div>
                                </div>

                                <button
                                  onClick={() => expandTutorNode(selectedNode)}
                                  disabled={!!expandingNodeId}
                                  className="w-full bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 hover:border-neutral-750 p-3 rounded-xl transition-all cursor-pointer flex items-center justify-between group"
                                >
                                  <div className="flex items-center gap-3">
                                    <span className="p-2 bg-pink-500/10 border border-pink-500/20 text-pink-400 rounded-lg group-hover:scale-105 transition-transform shrink-0">
                                      <Plus className="w-3.5 h-3.5 text-pink-400" />
                                    </span>
                                    <div className="text-left space-y-0.5">
                                      <span className="text-[11px] font-semibold text-white group-hover:text-pink-400 transition-colors">
                                        Ranting Axonal Baru
                                      </span>
                                      <p className="text-[9px] text-neutral-400">Mintalah AI kembangkan cabang</p>
                                    </div>
                                  </div>
                                  <span className="text-[10px] text-pink-400 font-mono group-hover:translate-x-1 transition-transform">
                                    {expandingNodeId === selectedNode.id ? "GROWING..." : "PROYEKSI"} →
                                  </span>
                                </button>
                              </div>
                            );
                          })()
                        ) : (
                          <div className="p-6 border border-neutral-900 rounded-xl text-center text-neutral-500 leading-relaxed">
                            Pilihlah salah satu lingkaran konsep saraf di layar tengah untuk memilah detail bahasan secara mendalam.
                          </div>
                        )}
                      </motion.div>
                    )}

                    {tutorInspectorTab === "bantuan" && (
                      <motion.div
                        key="bantuan"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="p-4 bg-neutral-900/40 border border-neutral-850 rounded-xl space-y-3 text-xs leading-relaxed"
                      >
                        <h4 className="font-bold text-white flex items-center gap-1.5 font-sans">
                          <BookMarked className="w-4 h-4 text-pink-500" />
                          Petunjuk Bermain Belajar
                        </h4>
                        <ol className="list-decimal pl-4 space-y-2 text-neutral-400 text-[11px] font-sans">
                          <li>Ketik topik materi sekolah apa saja pada kolom pencarian sebelah kiri.</li>
                          <li>Tunggu sesaat selama Gemini menyusun jaring-jaring saraf kognitif penting.</li>
                          <li>Kamu dapat memperbesar atau memperkecil letak sirkulasi menggunakan kursor scroll atau tombol plus-minus yang disediakan di pojok kiri atas viewport.</li>
                          <li>Tekan tombol <strong className="text-white">Ranting Axonal Baru</strong> untuk menguraikan subtopik bahasan lebih detail secara tidak terbatas!</li>
                        </ol>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="pt-6 border-t border-neutral-900 space-y-1 text-center font-mono text-[9px] text-neutral-500">
                  <span>Pendidikan Inovasi SDN Dawuan Tengah VI</span>
                  <span className="block italic">Powered by Gemini-3.5-Flash</span>
                </div>

              </div>

            </motion.div>
          )}

        </AnimatePresence>

      </main>

      {/* Main Footer Brand Section */}
      <footer className="border-t border-neutral-900 bg-neutral-950 py-8 px-6 mt-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-xs text-neutral-400">
          
          <div className="space-y-3.5">
            <div className="flex items-center gap-2">
              <School className="w-5 h-5 text-red-500" />
              <strong className="text-white font-sans text-sm tracking-tight uppercase">SDN DAWUAN TENGAH VI</strong>
            </div>
            <p className="leading-relaxed font-sans">
              Sekolah dasar unggulan di perumahan BMI Dawuan Tengah yang memprioritaskan kepribadian luhur siswa, disiplin dini, inovasi digital yang santun, serta kelestarian sirkulasi lingkungan sehat.
            </p>
          </div>

          <div className="space-y-3">
            <strong className="text-white font-sans text-sm block">Kontak Sekretariat</strong>
            <ul className="space-y-2 font-mono text-[11px]">
              <li className="flex items-center gap-2.5">
                <Phone className="w-3.5 h-3.5 text-red-500" />
                <span>+62 (0264) 8375927</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-3.5 h-3.5 text-red-500" />
                <span>sdndawuantengahvi@sch.id</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Info className="w-3.5 h-3.5 text-red-500" />
                <span>NPSN: 20217983 • Akreditasi A</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <strong className="text-white font-sans text-sm block">Tautan Cepat Akademik</strong>
            <div className="grid grid-cols-2 gap-2 font-sans font-semibold text-neutral-300">
              <button onClick={() => { setActiveTab("beranda"); }} className="hover:text-red-500 text-left transition-colors cursor-pointer">Beranda Utama</button>
              <button onClick={() => { setActiveTab("profil"); }} className="hover:text-red-500 text-left transition-colors cursor-pointer">Profil Guru</button>
              <button onClick={() => { setActiveTab("fasilitas"); }} className="hover:text-red-500 text-left transition-colors cursor-pointer">Sarana Lab</button>
              <button onClick={() => { setActiveTab("ppdb"); }} className="hover:text-red-500 text-left transition-colors cursor-pointer">PPDB Dapodik</button>
              <button onClick={() => { setActiveTab("tutor"); }} className="hover:text-red-500 text-left transition-colors cursor-pointer col-span-2">Modul Neural Gemini</button>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-neutral-900/60 text-center font-mono text-[11px] text-neutral-500">
          <p>© 2026 SDN Dawuan Tengah VI Karawang • Hak Cipta Dilindungi Undang-Undang.</p>
        </div>
      </footer>

      {/* Inject custom SVG styling to ensure proper animations for our mind map */}
      <style jsx global>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -100;
          }
        }
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        ::-webkit-scrollbar-track {
          background: #090909;
        }
        ::-webkit-scrollbar-thumb {
          background: #222;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #333;
        }
      `}</style>
    </div>
  );
}
