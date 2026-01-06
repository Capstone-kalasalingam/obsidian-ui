// Andhra Pradesh State Board Curriculum - Class 10 Chapters

export interface Chapter {
  id: string;
  number: number;
  title: string;
  description: string;
  duration: string;
  videoCount: number;
  notesCount: number;
  quizCount: number;
  isCompleted: boolean;
  progress: number;
}

export interface Subject {
  id: string;
  name: string;
  icon: string;
  color: string;
  chapters: Chapter[];
  totalChapters: number;
  completedChapters: number;
}

export const tutorialSubjects: Subject[] = [
  {
    id: "telugu",
    name: "Telugu",
    icon: "📜",
    color: "from-orange-500 to-red-500",
    totalChapters: 12,
    completedChapters: 3,
    chapters: [
      { id: "tel-1", number: 1, title: "నేను - సైనికుడిని", description: "గిడుగు రామమూర్తి రచన - దేశభక్తి కవిత", duration: "45 min", videoCount: 3, notesCount: 2, quizCount: 1, isCompleted: true, progress: 100 },
      { id: "tel-2", number: 2, title: "అమ్మ", description: "తల్లి ప్రేమ గురించి అద్భుతమైన కవిత", duration: "40 min", videoCount: 2, notesCount: 2, quizCount: 1, isCompleted: true, progress: 100 },
      { id: "tel-3", number: 3, title: "మాటల మాంత్రికుడు", description: "భాషా ప్రాముఖ్యత - సంభాషణ నైపుణ్యాలు", duration: "50 min", videoCount: 4, notesCount: 3, quizCount: 2, isCompleted: true, progress: 100 },
      { id: "tel-4", number: 4, title: "నాన్న బాట", description: "కుటుంబ బంధాలు - తండ్రి త్యాగాలు", duration: "45 min", videoCount: 3, notesCount: 2, quizCount: 1, isCompleted: false, progress: 60 },
      { id: "tel-5", number: 5, title: "వేమన శతకం", description: "వేమన పద్యాలు - నీతి బోధన", duration: "55 min", videoCount: 4, notesCount: 3, quizCount: 2, isCompleted: false, progress: 30 },
      { id: "tel-6", number: 6, title: "సుమతీ శతకం", description: "బద్దెన పద్యాలు - జీవిత విలువలు", duration: "50 min", videoCount: 3, notesCount: 2, quizCount: 2, isCompleted: false, progress: 0 },
      { id: "tel-7", number: 7, title: "పోతన భాగవతం", description: "గజేంద్ర మోక్షం - భక్తి సాహిత్యం", duration: "60 min", videoCount: 5, notesCount: 4, quizCount: 2, isCompleted: false, progress: 0 },
      { id: "tel-8", number: 8, title: "గుణాఢ్య కథలు", description: "బృహత్కథ - సాహిత్య చరిత్ర", duration: "45 min", videoCount: 3, notesCount: 2, quizCount: 1, isCompleted: false, progress: 0 },
      { id: "tel-9", number: 9, title: "వ్యాకరణం - సంధులు", description: "అచ్ సంధులు, హల్ సంధులు", duration: "55 min", videoCount: 4, notesCount: 3, quizCount: 2, isCompleted: false, progress: 0 },
      { id: "tel-10", number: 10, title: "వ్యాకరణం - సమాసాలు", description: "సమాస భేదాలు - ఉదాహరణలు", duration: "50 min", videoCount: 3, notesCount: 3, quizCount: 2, isCompleted: false, progress: 0 },
      { id: "tel-11", number: 11, title: "పత్ర రచన", description: "వ్యాపార లేఖలు, అధికారిక పత్రాలు", duration: "40 min", videoCount: 2, notesCount: 3, quizCount: 1, isCompleted: false, progress: 0 },
      { id: "tel-12", number: 12, title: "వ్యాసరచన", description: "వివిధ అంశాలపై వ్యాసాలు", duration: "45 min", videoCount: 3, notesCount: 4, quizCount: 1, isCompleted: false, progress: 0 },
    ]
  },
  {
    id: "hindi",
    name: "Hindi",
    icon: "🔤",
    color: "from-amber-500 to-orange-500",
    totalChapters: 14,
    completedChapters: 4,
    chapters: [
      { id: "hin-1", number: 1, title: "साखी", description: "कबीरदास जी की साखियाँ - जीवन का सार", duration: "45 min", videoCount: 3, notesCount: 2, quizCount: 1, isCompleted: true, progress: 100 },
      { id: "hin-2", number: 2, title: "मीरा के पद", description: "भक्ति काव्य - कृष्ण प्रेम", duration: "40 min", videoCount: 3, notesCount: 2, quizCount: 1, isCompleted: true, progress: 100 },
      { id: "hin-3", number: 3, title: "बिहारी के दोहे", description: "श्रृंगार और नीति के दोहे", duration: "50 min", videoCount: 4, notesCount: 3, quizCount: 2, isCompleted: true, progress: 100 },
      { id: "hin-4", number: 4, title: "मानुषी", description: "नारी शक्ति - समाज में स्त्री का स्थान", duration: "45 min", videoCount: 3, notesCount: 2, quizCount: 1, isCompleted: true, progress: 100 },
      { id: "hin-5", number: 5, title: "पर्वत प्रदेश में पावस", description: "प्रकृति वर्णन - सुमित्रानंदन पंत", duration: "40 min", videoCount: 3, notesCount: 2, quizCount: 1, isCompleted: false, progress: 70 },
      { id: "hin-6", number: 6, title: "तोप", description: "वीरेन डंगवाल - युद्ध और शांति", duration: "35 min", videoCount: 2, notesCount: 2, quizCount: 1, isCompleted: false, progress: 40 },
      { id: "hin-7", number: 7, title: "कर चले हम फ़िदा", description: "देशभक्ति गीत - कैफ़ी आज़मी", duration: "45 min", videoCount: 3, notesCount: 2, quizCount: 1, isCompleted: false, progress: 0 },
      { id: "hin-8", number: 8, title: "आत्मत्राण", description: "रवींद्रनाथ टैगोर - आत्मबल की प्रार्थना", duration: "40 min", videoCount: 3, notesCount: 2, quizCount: 1, isCompleted: false, progress: 0 },
      { id: "hin-9", number: 9, title: "बड़े भाई साहब", description: "प्रेमचंद - शिक्षा और अनुभव", duration: "55 min", videoCount: 4, notesCount: 3, quizCount: 2, isCompleted: false, progress: 0 },
      { id: "hin-10", number: 10, title: "डायरी का एक पन्ना", description: "सीताराम सेकसरिया - स्वतंत्रता संग्राम", duration: "50 min", videoCount: 3, notesCount: 3, quizCount: 2, isCompleted: false, progress: 0 },
      { id: "hin-11", number: 11, title: "तताँरा-वामीरो कथा", description: "अंदमान की लोक कथा", duration: "45 min", videoCount: 3, notesCount: 2, quizCount: 1, isCompleted: false, progress: 0 },
      { id: "hin-12", number: 12, title: "व्याकरण - समास", description: "समास के भेद और उदाहरण", duration: "50 min", videoCount: 4, notesCount: 3, quizCount: 2, isCompleted: false, progress: 0 },
      { id: "hin-13", number: 13, title: "व्याकरण - वाक्य भेद", description: "वाक्य रचना और प्रकार", duration: "45 min", videoCount: 3, notesCount: 3, quizCount: 2, isCompleted: false, progress: 0 },
      { id: "hin-14", number: 14, title: "पत्र लेखन", description: "औपचारिक और अनौपचारिक पत्र", duration: "40 min", videoCount: 2, notesCount: 3, quizCount: 1, isCompleted: false, progress: 0 },
    ]
  },
  {
    id: "english",
    name: "English",
    icon: "📖",
    color: "from-blue-500 to-cyan-500",
    totalChapters: 11,
    completedChapters: 2,
    chapters: [
      { id: "eng-1", number: 1, title: "A Letter to God", description: "G.L. Fuentes - Faith and innocence of a farmer", duration: "50 min", videoCount: 4, notesCount: 3, quizCount: 2, isCompleted: true, progress: 100 },
      { id: "eng-2", number: 2, title: "Nelson Mandela: Long Walk to Freedom", description: "Autobiography excerpt - Struggle for freedom", duration: "55 min", videoCount: 4, notesCount: 3, quizCount: 2, isCompleted: true, progress: 100 },
      { id: "eng-3", number: 3, title: "Two Stories About Flying", description: "Fear and courage in the sky", duration: "45 min", videoCount: 3, notesCount: 2, quizCount: 1, isCompleted: false, progress: 50 },
      { id: "eng-4", number: 4, title: "From the Diary of Anne Frank", description: "A young girl's perspective during WWII", duration: "50 min", videoCount: 4, notesCount: 3, quizCount: 2, isCompleted: false, progress: 20 },
      { id: "eng-5", number: 5, title: "The Hundred Dresses - I", description: "Wanda Petronski - Story of belonging", duration: "45 min", videoCount: 3, notesCount: 2, quizCount: 1, isCompleted: false, progress: 0 },
      { id: "eng-6", number: 6, title: "The Hundred Dresses - II", description: "Conclusion - Lessons in empathy", duration: "45 min", videoCount: 3, notesCount: 2, quizCount: 1, isCompleted: false, progress: 0 },
      { id: "eng-7", number: 7, title: "Glimpses of India", description: "Culture and diversity of India", duration: "55 min", videoCount: 4, notesCount: 3, quizCount: 2, isCompleted: false, progress: 0 },
      { id: "eng-8", number: 8, title: "Mijbil the Otter", description: "Gavin Maxwell - Bond with wildlife", duration: "50 min", videoCount: 3, notesCount: 2, quizCount: 2, isCompleted: false, progress: 0 },
      { id: "eng-9", number: 9, title: "Madam Rides the Bus", description: "Valliammai's first bus journey", duration: "45 min", videoCount: 3, notesCount: 2, quizCount: 1, isCompleted: false, progress: 0 },
      { id: "eng-10", number: 10, title: "Grammar - Tenses", description: "Present, Past, Future - All forms", duration: "60 min", videoCount: 5, notesCount: 4, quizCount: 3, isCompleted: false, progress: 0 },
      { id: "eng-11", number: 11, title: "Writing Skills", description: "Essays, Letters, and Reports", duration: "50 min", videoCount: 3, notesCount: 4, quizCount: 2, isCompleted: false, progress: 0 },
    ]
  },
  {
    id: "maths-a",
    name: "Maths A",
    icon: "➕",
    color: "from-indigo-500 to-purple-500",
    totalChapters: 10,
    completedChapters: 3,
    chapters: [
      { id: "ma-1", number: 1, title: "Real Numbers", description: "Euclid's division lemma, HCF, LCM, Irrational numbers", duration: "60 min", videoCount: 5, notesCount: 4, quizCount: 3, isCompleted: true, progress: 100 },
      { id: "ma-2", number: 2, title: "Sets", description: "Types of sets, Venn diagrams, Operations on sets", duration: "55 min", videoCount: 4, notesCount: 3, quizCount: 2, isCompleted: true, progress: 100 },
      { id: "ma-3", number: 3, title: "Polynomials", description: "Zeroes, Division algorithm, Cubic polynomials", duration: "50 min", videoCount: 4, notesCount: 3, quizCount: 2, isCompleted: true, progress: 100 },
      { id: "ma-4", number: 4, title: "Pair of Linear Equations", description: "Graphical and algebraic methods", duration: "65 min", videoCount: 5, notesCount: 4, quizCount: 3, isCompleted: false, progress: 75 },
      { id: "ma-5", number: 5, title: "Quadratic Equations", description: "Roots, Discriminant, Nature of roots", duration: "60 min", videoCount: 5, notesCount: 4, quizCount: 3, isCompleted: false, progress: 40 },
      { id: "ma-6", number: 6, title: "Progressions", description: "AP, GP - nth term and sum formulas", duration: "55 min", videoCount: 4, notesCount: 3, quizCount: 2, isCompleted: false, progress: 0 },
      { id: "ma-7", number: 7, title: "Coordinate Geometry", description: "Distance, Section formula, Area of triangle", duration: "50 min", videoCount: 4, notesCount: 3, quizCount: 2, isCompleted: false, progress: 0 },
      { id: "ma-8", number: 8, title: "Similar Triangles", description: "Criteria, BPT, Pythagoras theorem", duration: "55 min", videoCount: 4, notesCount: 3, quizCount: 2, isCompleted: false, progress: 0 },
      { id: "ma-9", number: 9, title: "Tangent to a Circle", description: "Properties of tangents, Length of tangent", duration: "45 min", videoCount: 3, notesCount: 2, quizCount: 2, isCompleted: false, progress: 0 },
      { id: "ma-10", number: 10, title: "Mensuration", description: "Surface areas and volumes of solids", duration: "60 min", videoCount: 5, notesCount: 4, quizCount: 3, isCompleted: false, progress: 0 },
    ]
  },
  {
    id: "maths-b",
    name: "Maths B",
    icon: "📐",
    color: "from-violet-500 to-fuchsia-500",
    totalChapters: 8,
    completedChapters: 2,
    chapters: [
      { id: "mb-1", number: 1, title: "Trigonometry", description: "Ratios, Identities, Standard angles", duration: "65 min", videoCount: 5, notesCount: 4, quizCount: 3, isCompleted: true, progress: 100 },
      { id: "mb-2", number: 2, title: "Applications of Trigonometry", description: "Heights and Distances, Angle of elevation/depression", duration: "55 min", videoCount: 4, notesCount: 3, quizCount: 2, isCompleted: true, progress: 100 },
      { id: "mb-3", number: 3, title: "Statistics", description: "Mean, Median, Mode for grouped data", duration: "60 min", videoCount: 5, notesCount: 4, quizCount: 3, isCompleted: false, progress: 65 },
      { id: "mb-4", number: 4, title: "Probability", description: "Classical probability, Complementary events", duration: "50 min", videoCount: 4, notesCount: 3, quizCount: 2, isCompleted: false, progress: 30 },
      { id: "mb-5", number: 5, title: "Mathematical Modelling", description: "Real-life problem solving using maths", duration: "45 min", videoCount: 3, notesCount: 2, quizCount: 1, isCompleted: false, progress: 0 },
      { id: "mb-6", number: 6, title: "Constructions", description: "Division of line segment, Similar triangles", duration: "50 min", videoCount: 4, notesCount: 3, quizCount: 2, isCompleted: false, progress: 0 },
      { id: "mb-7", number: 7, title: "Matrices", description: "Introduction, Types, Basic operations", duration: "55 min", videoCount: 4, notesCount: 3, quizCount: 2, isCompleted: false, progress: 0 },
      { id: "mb-8", number: 8, title: "Graphs", description: "Linear graphs, Quadratic graphs, Applications", duration: "50 min", videoCount: 4, notesCount: 3, quizCount: 2, isCompleted: false, progress: 0 },
    ]
  },
  {
    id: "physics",
    name: "Physics",
    icon: "⚛️",
    color: "from-emerald-500 to-teal-500",
    totalChapters: 12,
    completedChapters: 4,
    chapters: [
      { id: "phy-1", number: 1, title: "Heat", description: "Temperature, Expansion, Specific heat, Calorimetry", duration: "60 min", videoCount: 5, notesCount: 4, quizCount: 3, isCompleted: true, progress: 100 },
      { id: "phy-2", number: 2, title: "Chemical Equations and Reactions", description: "Types of reactions, Balancing equations", duration: "55 min", videoCount: 4, notesCount: 3, quizCount: 2, isCompleted: true, progress: 100 },
      { id: "phy-3", number: 3, title: "Acids, Bases and Salts", description: "pH scale, Indicators, Neutralization", duration: "60 min", videoCount: 5, notesCount: 4, quizCount: 3, isCompleted: true, progress: 100 },
      { id: "phy-4", number: 4, title: "Refraction of Light", description: "Laws of refraction, Lenses, Lens formula", duration: "65 min", videoCount: 5, notesCount: 4, quizCount: 3, isCompleted: true, progress: 100 },
      { id: "phy-5", number: 5, title: "Human Eye and Colourful World", description: "Eye defects, Scattering, Dispersion", duration: "55 min", videoCount: 4, notesCount: 3, quizCount: 2, isCompleted: false, progress: 80 },
      { id: "phy-6", number: 6, title: "Structure of Atom", description: "Atomic models, Electronic configuration", duration: "60 min", videoCount: 5, notesCount: 4, quizCount: 3, isCompleted: false, progress: 50 },
      { id: "phy-7", number: 7, title: "Classification of Elements", description: "Periodic table, Trends, Modern periodic law", duration: "55 min", videoCount: 4, notesCount: 3, quizCount: 2, isCompleted: false, progress: 0 },
      { id: "phy-8", number: 8, title: "Electric Current", description: "Ohm's law, Resistance, Circuits", duration: "65 min", videoCount: 5, notesCount: 4, quizCount: 3, isCompleted: false, progress: 0 },
      { id: "phy-9", number: 9, title: "Electromagnetism", description: "Magnetic effects, Motors, Generators", duration: "60 min", videoCount: 5, notesCount: 4, quizCount: 3, isCompleted: false, progress: 0 },
      { id: "phy-10", number: 10, title: "Metallurgy", description: "Extraction of metals, Corrosion, Alloys", duration: "55 min", videoCount: 4, notesCount: 3, quizCount: 2, isCompleted: false, progress: 0 },
      { id: "phy-11", number: 11, title: "Carbon and its Compounds", description: "Organic chemistry basics, Hydrocarbons", duration: "60 min", videoCount: 5, notesCount: 4, quizCount: 3, isCompleted: false, progress: 0 },
      { id: "phy-12", number: 12, title: "Sustainable Management", description: "Natural resources, Conservation", duration: "45 min", videoCount: 3, notesCount: 2, quizCount: 2, isCompleted: false, progress: 0 },
    ]
  },
  {
    id: "biology",
    name: "Biology",
    icon: "🧬",
    color: "from-green-500 to-lime-500",
    totalChapters: 10,
    completedChapters: 3,
    chapters: [
      { id: "bio-1", number: 1, title: "Nutrition", description: "Autotrophic and Heterotrophic nutrition, Digestion", duration: "55 min", videoCount: 4, notesCount: 3, quizCount: 2, isCompleted: true, progress: 100 },
      { id: "bio-2", number: 2, title: "Respiration", description: "Aerobic, Anaerobic respiration, Respiratory organs", duration: "50 min", videoCount: 4, notesCount: 3, quizCount: 2, isCompleted: true, progress: 100 },
      { id: "bio-3", number: 3, title: "Transportation", description: "Blood circulation, Heart structure, Transpiration", duration: "60 min", videoCount: 5, notesCount: 4, quizCount: 3, isCompleted: true, progress: 100 },
      { id: "bio-4", number: 4, title: "Excretion", description: "Excretory system, Kidneys, Dialysis", duration: "50 min", videoCount: 4, notesCount: 3, quizCount: 2, isCompleted: false, progress: 70 },
      { id: "bio-5", number: 5, title: "Control and Coordination", description: "Nervous system, Hormones, Reflexes", duration: "65 min", videoCount: 5, notesCount: 4, quizCount: 3, isCompleted: false, progress: 35 },
      { id: "bio-6", number: 6, title: "Reproduction", description: "Asexual, Sexual reproduction, Human reproductive system", duration: "60 min", videoCount: 5, notesCount: 4, quizCount: 3, isCompleted: false, progress: 0 },
      { id: "bio-7", number: 7, title: "Heredity", description: "Mendel's laws, Genes, Chromosomes", duration: "55 min", videoCount: 4, notesCount: 3, quizCount: 2, isCompleted: false, progress: 0 },
      { id: "bio-8", number: 8, title: "Evolution", description: "Origin of life, Natural selection, Human evolution", duration: "50 min", videoCount: 4, notesCount: 3, quizCount: 2, isCompleted: false, progress: 0 },
      { id: "bio-9", number: 9, title: "Our Environment", description: "Ecosystem, Food chains, Ozone layer", duration: "45 min", videoCount: 3, notesCount: 2, quizCount: 2, isCompleted: false, progress: 0 },
      { id: "bio-10", number: 10, title: "Natural Resources", description: "Conservation, Sustainability, Pollution", duration: "45 min", videoCount: 3, notesCount: 2, quizCount: 2, isCompleted: false, progress: 0 },
    ]
  },
  {
    id: "social",
    name: "Social Studies",
    icon: "🌍",
    color: "from-rose-500 to-pink-500",
    totalChapters: 14,
    completedChapters: 5,
    chapters: [
      { id: "soc-1", number: 1, title: "India - Relief Features", description: "Himalayas, Plains, Plateaus, Coastal regions", duration: "50 min", videoCount: 4, notesCount: 3, quizCount: 2, isCompleted: true, progress: 100 },
      { id: "soc-2", number: 2, title: "Climate of India", description: "Seasons, Monsoons, Climate zones", duration: "45 min", videoCount: 3, notesCount: 2, quizCount: 2, isCompleted: true, progress: 100 },
      { id: "soc-3", number: 3, title: "Water Resources", description: "Rivers, Dams, Irrigation, Conservation", duration: "50 min", videoCount: 4, notesCount: 3, quizCount: 2, isCompleted: true, progress: 100 },
      { id: "soc-4", number: 4, title: "Agriculture", description: "Types of farming, Major crops, Food security", duration: "55 min", videoCount: 4, notesCount: 3, quizCount: 2, isCompleted: true, progress: 100 },
      { id: "soc-5", number: 5, title: "Industries", description: "Types, Distribution, Industrial development", duration: "50 min", videoCount: 4, notesCount: 3, quizCount: 2, isCompleted: true, progress: 100 },
      { id: "soc-6", number: 6, title: "National Movement (1885-1919)", description: "INC formation, Moderates, Extremists", duration: "60 min", videoCount: 5, notesCount: 4, quizCount: 3, isCompleted: false, progress: 60 },
      { id: "soc-7", number: 7, title: "National Movement (1919-1947)", description: "Gandhi era, Civil disobedience, Quit India", duration: "65 min", videoCount: 5, notesCount: 4, quizCount: 3, isCompleted: false, progress: 25 },
      { id: "soc-8", number: 8, title: "Indian Constitution", description: "Making, Features, Fundamental rights", duration: "55 min", videoCount: 4, notesCount: 3, quizCount: 2, isCompleted: false, progress: 0 },
      { id: "soc-9", number: 9, title: "Democracy", description: "Electoral system, Political parties, Challenges", duration: "50 min", videoCount: 4, notesCount: 3, quizCount: 2, isCompleted: false, progress: 0 },
      { id: "soc-10", number: 10, title: "Central and State Governments", description: "Structure, Functions, Relations", duration: "55 min", videoCount: 4, notesCount: 3, quizCount: 2, isCompleted: false, progress: 0 },
      { id: "soc-11", number: 11, title: "Development", description: "Economic development, HDI, Sustainable development", duration: "45 min", videoCount: 3, notesCount: 2, quizCount: 2, isCompleted: false, progress: 0 },
      { id: "soc-12", number: 12, title: "Money and Banking", description: "Currency, Banks, Credit", duration: "50 min", videoCount: 4, notesCount: 3, quizCount: 2, isCompleted: false, progress: 0 },
      { id: "soc-13", number: 13, title: "Globalisation", description: "MNCs, Trade, Impact on India", duration: "45 min", videoCount: 3, notesCount: 2, quizCount: 2, isCompleted: false, progress: 0 },
      { id: "soc-14", number: 14, title: "Map Pointing", description: "India physical and political maps", duration: "40 min", videoCount: 2, notesCount: 3, quizCount: 2, isCompleted: false, progress: 0 },
    ]
  },
];
