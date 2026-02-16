import { LevelConfig, MapNode, Question } from "./types";

export const MAX_ENERGY = 3;
export const POINTS_PER_QUESTION = 100;
export const QUESTIONS_TO_WIN_LEVEL = 5;

export const DYNASTY_DATA = {
  umayyah1: {
    title: "KEKHALIFAHAN UMAYYAH I",
    subtitle: "Pusat Kejayaan Timur (Damaskus)",
    history: "Didirikan oleh Muawiyah bin Abu Sufyan pada tahun 661 M setelah berakhirnya era Khulafaur Rasyidin. Dinasti ini mengubah sistem pemerintahan menjadi monarki (turun-temurun) dan memindahkan ibu kota ke Damaskus, Suriah.",
    keyFacts: [
      "Administrasi: Pembentukan sistem Diwan (departemen) untuk mengelola negara secara profesional.",
      "Arsitektur: Pembangunan Masjid Agung Damaskus (Umayyad Mosque) yang megah.",
      "Ekonomi: Penggunaan mata uang Dinar Emas dan Dirham Perak resmi Islam pertama kali.",
      "Ekspansi: Wilayah mencapai Afrika Utara dan India Barat."
    ],
    leader: "Muawiyah bin Abu Sufyan",
    objective: "Amankan jalur administrasi di Damaskus dan pelajari sistem Diwan."
  },
  umayyah2: {
    title: "KEKHALIFAHAN UMAYYAH II",
    subtitle: "Cahaya di Barat (Andalusia)",
    history: "Setelah kejatuhan Umayyah di Damaskus, Abdurrahman Ad-Dakhil ('Sang Rajawali Quraisy') melarikan diri ke Spanyol dan mendirikan kekhalifahan baru di Cordoba pada 756 M. Era ini dikenal sebagai puncak intelektual Islam di Eropa.",
    keyFacts: [
      "Sains: Cordoba menjadi pusat astronomi, kedokteran, dan matematika dunia.",
      "Toleransi: Masa 'La Convivencia' di mana Muslim, Kristen, dan Yahudi hidup berdampingan.",
      "Infrastruktur: Memiliki 70 perpustakaan dan lampu jalan saat Eropa masih dalam kegelapan.",
      "Pendidikan: Universitas Cordoba menarik pelajar dari seluruh dunia."
    ],
    leader: "Abdurrahman Ad-Dakhil",
    objective: "Eksplorasi perpustakaan Cordoba dan kumpulkan data sains astronomi."
  }
};

export const LEVELS: LevelConfig[] = [
  {
    id: 1,
    title: "Bangkitnya Bani Umayyah",
    description: "Jelajahi Damaskus dan Cordoba. Pelajari masa keemasan ilmu pengetahuan dan ekspansi Islam.",
    era: "661 M - 1031 M",
    location: "Damaskus & Andalusia",
    themeColor: "from-u-damascus to-u-cordoba",
  },
  {
    id: 2,
    title: "Era Abbasiyah",
    description: "Menuju Baghdad, Kota 1001 Malam.",
    era: "750 M - 1258 M",
    location: "Baghdad",
    themeColor: "from-blue-700 to-purple-900",
    requiredLevelId: 1,
  }
];

export const LEVEL_1_MAP_NODES: MapNode[] = [
    { id: 'madinah', x: 85, y: 75, label: 'Madinah Base', type: 'COMBAT', questionId: 'f1' },
    
    { 
      id: 'pandora_damascus', x: 70, y: 55, label: 'Arsip Diwan', type: 'MATERIAL',
      materialContent: {
        title: "Reformasi Damaskus",
        body: "Damaskus dipilih Muawiyah bin Abu Sufyan sebagai pusat pemerintahan karena letaknya yang strategis. Di sini, sistem administrasi pemerintahan (Diwan) mulai dibentuk meniru sistem Bizantium, menjadikan manajemen negara lebih rapi dan efisien.",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Umayyad_Mosque_prayer_hall.jpg/640px-Umayyad_Mosque_prayer_hall.jpg",
      }
    },
    
    { id: 'damascus', x: 60, y: 40, label: 'Damaskus', type: 'COMBAT', questionId: 'f5' },
    { id: 'jerusalem', x: 65, y: 65, label: 'Yerusalem', type: 'COMBAT', questionId: 'f3' },
    
    { 
      id: 'pandora_expansion', x: 45, y: 50, label: 'Pos Maghribi', type: 'MATERIAL',
      materialContent: {
        title: "Ekspansi ke Afrika Utara",
        body: "Uqbah bin Nafi adalah jenderal yang mendirikan kota Kairouan (Tunisia) sebagai pangkalan militer. Dari sini, Islam menyebar ke seluruh Afrika Utara (Maghribi) hingga mencapai Samudra Atlantik.",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Great_Mosque_of_Kairouan_courtyard_portico.jpg/640px-Great_Mosque_of_Kairouan_courtyard_portico.jpg"
      }
    },

    { id: 'kairouan', x: 35, y: 60, label: 'Kairouan', type: 'COMBAT', questionId: 'f7' },
    { id: 'gibraltar', x: 25, y: 40, label: 'Gibraltar', type: 'COMBAT', questionId: 'f7' },
    
    { 
      id: 'pandora_cordoba', x: 20, y: 65, label: 'Sains Cordoba', type: 'MATERIAL',
      materialContent: {
        title: "Cahaya Eropa",
        body: "Saat Eropa dalam masa kegelapan (Dark Ages), Cordoba memiliki lampu jalan, 70 perpustakaan, dan universitas. Ilmu bedah, astronomi, dan matematika berkembang pesat di sini.",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Mezquita_de_C%C3%B3rdoba_desde_el_aire_%28cropped%29.jpg/640px-Mezquita_de_C%C3%B3rdoba_desde_el_aire_%28cropped%29.jpg"
      }
    },

    { id: 'cordoba', x: 10, y: 55, label: 'Cordoba', type: 'COMBAT', questionId: 'f6' },
    { id: 'granada', x: 15, y: 25, label: 'Granada', type: 'COMBAT', questionId: 'f2' }
];

export const CLASSMATES_NAMES = [
  "Ahmad (7A)", "Siti (7C)", "Budi (7B)", "Rina (7A)", "Dewi (7D)", 
  "Eko (7B)", "Fajar (7E)", "Gita (7C)", "Hadi (7A)", "Indah (7D)",
  "Joko (7B)", "Kartika (7E)", "Lukman (7C)", "Maya (7A)", "Nina (7D)",
  "Oscar (7B)", "Putri (7E)", "Qori (7C)", "Rizky (7A)", "Sarah (7D)",
  "Tio (7B)", "Utami (7E)", "Vina (7C)", "Wahyu (7A)", "Xena (7D)",
  "Yusuf (7B)", "Zahra (7E)", "Adit (7C)", "Bella (7A)", "Candra (7D)",
  "Dimas (7B)", "Elsa (7E)", "Farhan (7C)", "Galih (7A)"
];

export const FALLBACK_QUESTIONS: Question[] = [
  {
    id: "f1",
    text: "Siapakah pendiri Dinasti Bani Umayyah yang memindahkan ibu kota ke Damaskus?",
    options: ["Ali bin Abi Thalib", "Muawiyah bin Abu Sufyan", "Umar bin Abdul Aziz", "Harun Ar-Rasyid"],
    correctIndex: 1,
    explanation: "Muawiyah bin Abu Sufyan adalah pendiri Dinasti Bani Umayyah I dan memindahkan pusat pemerintahan dari Madinah ke Damaskus untuk strategi politik dan militer.",
    topic: "Tokoh",
    difficulty: "Easy"
  },
  {
    id: "f2",
    text: "Ilmuwan muslim dari Andalusia yang dikenal sebagai 'Bapak Bedah Modern' dan menulis kitab Al-Tasrif adalah...",
    options: ["Ibnu Sina", "Al-Khawarizmi", "Al-Zahrawi (Abulcasis)", "Ibnu Rushd"],
    correctIndex: 2,
    explanation: "Al-Zahrawi adalah ahli bedah terhebat di masa itu. Ia menciptakan berbagai alat bedah yang desainnya masih digunakan hingga kedokteran modern saat ini.",
    topic: "Ilmu Pengetahuan",
    difficulty: "Medium"
  },
  {
    id: "f3",
    text: "Masjid yang dibangun di Yerusalem pada masa Abdul Malik bin Marwan dengan kubah emas yang ikonik adalah...",
    options: ["Masjid Nabawi", "Dome of the Rock (Qubbat as-Sakhrah)", "Masjid Al-Aqsa", "Masjid Agung Damaskus"],
    correctIndex: 1,
    explanation: "Dome of the Rock dibangun oleh Abdul Malik bin Marwan sebagai simbol kemegahan Islam di Yerusalem.",
    topic: "Arsitektur",
    difficulty: "Medium"
  },
  {
    id: "f4",
    text: "Siapakah ilmuwan muslim yang dikenal sebagai 'Bapak Kimia Modern' yang hidup pada masa awal peradaban Islam?",
    options: ["Jabir bin Hayyan", "Al-Khawarizmi", "Ibnu Sina", "Al-Farabi"],
    correctIndex: 0,
    explanation: "Jabir bin Hayyan (Geber) meletakkan dasar-dasar kimia modern, menemukan teknik distilasi dan kristalisasi yang masih relevan hingga kini.",
    topic: "Ilmu Pengetahuan",
    difficulty: "Medium"
  },
  {
    id: "f5",
    text: "Pada masa pemerintahan siapa mata uang Dinar (emas) dan Dirham (perak) resmi ditetapkan sebagai alat tukar Islam?",
    options: ["Yazid bin Muawiyah", "Abdul Malik bin Marwan", "Walid bin Abdul Malik", "Umar bin Abdul Aziz"],
    correctIndex: 1,
    explanation: "Abdul Malik bin Marwan melakukan reformasi ekonomi dengan mencetak mata uang sendiri bertuliskan Arab, melepaskan ketergantungan pada mata uang Romawi dan Persia.",
    topic: "Ekonomi & Sejarah",
    difficulty: "Hard"
  },
  {
    id: "f6",
    text: "Kota manakah yang menjadi pusat ilmu pengetahuan dan peradaban Islam di Eropa pada masa Bani Umayyah II?",
    options: ["Paris", "London", "Cordoba", "Roma"],
    correctIndex: 2,
    explanation: "Cordoba di Andalusia (Spanyol) menjadi pusat cahaya Eropa saat itu, memiliki lampu jalan dan perpustakaan besar saat kota Eropa lain masih dalam masa kegelapan.",
    topic: "Sejarah",
    difficulty: "Easy"
  },
  {
    id: "f7",
    text: "Tariq bin Ziyad dikenal sebagai pahlawan yang memimpin pasukan Islam masuk ke wilayah Andalusia melalui...",
    options: ["Laut Merah", "Selat Gibraltar", "Pegunungan Alpen", "Sungai Nil"],
    correctIndex: 1,
    explanation: "Tariq bin Ziyad menyeberangi selat yang kini dinamai menurut namanya (Jabal Tariq atau Gibraltar) pada tahun 711 M, membuka era Islam di Spanyol.",
    topic: "Tokoh & Geografi",
    difficulty: "Medium"
  },
  {
    id: "f8",
    text: "Sikap toleransi beragama sangat dijunjung tinggi di Andalusia, dikenal dengan istilah...",
    options: ["La Convivencia", "Reconquista", "Inkuisisi", "Renaisans"],
    correctIndex: 0,
    explanation: "La Convivencia (Hidup Berdampingan) adalah masa di mana Muslim, Kristen, dan Yahudi hidup damai dan produktif bersama di bawah pemerintahan Umayyah di Spanyol.",
    topic: "Sosial Budaya",
    difficulty: "Hard"
  }
];