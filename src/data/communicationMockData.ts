export interface GrammarLesson {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  topics: string[];
  examples: { correct: string; incorrect: string; explanation: string }[];
  exercises: { question: string; options: string[]; correctAnswer: number }[];
}

export interface SpeakingActivity {
  id: string;
  title: string;
  description: string;
  type: 'pronunciation' | 'conversation' | 'storytelling' | 'debate';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  prompts: string[];
  tips: string[];
  duration: number; // in minutes
}

export interface TypingLesson {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  text: string;
  targetWPM: number;
  targetAccuracy: number;
}

export const grammarLessons: GrammarLesson[] = [
  {
    id: 'g1',
    title: 'Present Tense Basics',
    description: 'Learn the fundamentals of present tense usage in English',
    difficulty: 'beginner',
    topics: ['Simple Present', 'Present Continuous', 'Subject-Verb Agreement'],
    examples: [
      { correct: 'She walks to school every day.', incorrect: 'She walk to school every day.', explanation: 'Third person singular requires -s ending' },
      { correct: 'They are playing football now.', incorrect: 'They playing football now.', explanation: 'Present continuous needs "be" verb + -ing' },
      { correct: 'The children play in the park.', incorrect: 'The children plays in the park.', explanation: 'Plural subjects take base form of verb' }
    ],
    exercises: [
      { question: 'She ___ to work every day.', options: ['go', 'goes', 'going', 'gone'], correctAnswer: 1 },
      { question: 'They ___ watching TV right now.', options: ['is', 'was', 'are', 'be'], correctAnswer: 2 },
      { question: 'My brother ___ very tall.', options: ['are', 'is', 'be', 'am'], correctAnswer: 1 }
    ]
  },
  {
    id: 'g2',
    title: 'Past Tense Mastery',
    description: 'Master regular and irregular past tense verbs',
    difficulty: 'beginner',
    topics: ['Simple Past', 'Past Continuous', 'Irregular Verbs'],
    examples: [
      { correct: 'I went to the market yesterday.', incorrect: 'I goed to the market yesterday.', explanation: '"Go" is irregular - past tense is "went"' },
      { correct: 'She was reading when I called.', incorrect: 'She reading when I called.', explanation: 'Past continuous needs "was/were" + -ing' },
      { correct: 'They played cricket last Sunday.', incorrect: 'They play cricket last Sunday.', explanation: 'Past events need past tense verbs' }
    ],
    exercises: [
      { question: 'Yesterday, I ___ my homework.', options: ['do', 'did', 'done', 'doing'], correctAnswer: 1 },
      { question: 'She ___ sleeping when the phone rang.', options: ['is', 'was', 'were', 'be'], correctAnswer: 1 },
      { question: 'We ___ to the zoo last week.', options: ['go', 'goes', 'went', 'gone'], correctAnswer: 2 }
    ]
  },
  {
    id: 'g3',
    title: 'Future Tense',
    description: 'Express future actions and plans correctly',
    difficulty: 'intermediate',
    topics: ['Simple Future', 'Going to', 'Future Continuous'],
    examples: [
      { correct: 'I will help you tomorrow.', incorrect: 'I will helped you tomorrow.', explanation: 'After "will", use base form of verb' },
      { correct: 'She is going to study medicine.', incorrect: 'She going to study medicine.', explanation: '"Going to" needs "be" verb before it' },
      { correct: 'They will be waiting for us.', incorrect: 'They will waiting for us.', explanation: 'Future continuous needs "will be" + -ing' }
    ],
    exercises: [
      { question: 'I ___ visit my grandmother next week.', options: ['will', 'was', 'am', 'have'], correctAnswer: 0 },
      { question: 'She is ___ to become a doctor.', options: ['go', 'goes', 'going', 'gone'], correctAnswer: 2 },
      { question: 'At 8 PM, they ___ be having dinner.', options: ['was', 'will', 'are', 'is'], correctAnswer: 1 }
    ]
  },
  {
    id: 'g4',
    title: 'Articles (A, An, The)',
    description: 'Learn when to use definite and indefinite articles',
    difficulty: 'beginner',
    topics: ['Indefinite Articles', 'Definite Articles', 'Zero Article'],
    examples: [
      { correct: 'I saw an elephant at the zoo.', incorrect: 'I saw a elephant at the zoo.', explanation: 'Use "an" before vowel sounds' },
      { correct: 'The sun rises in the east.', incorrect: 'Sun rises in east.', explanation: 'Unique things need "the"' },
      { correct: 'She is a teacher.', incorrect: 'She is teacher.', explanation: 'Professions need an article' }
    ],
    exercises: [
      { question: 'I want to buy ___ umbrella.', options: ['a', 'an', 'the', 'no article'], correctAnswer: 1 },
      { question: '___ moon is beautiful tonight.', options: ['A', 'An', 'The', 'No article'], correctAnswer: 2 },
      { question: 'He is ___ honest person.', options: ['a', 'an', 'the', 'no article'], correctAnswer: 1 }
    ]
  },
  {
    id: 'g5',
    title: 'Prepositions of Place & Time',
    description: 'Use prepositions correctly to describe locations and time',
    difficulty: 'intermediate',
    topics: ['In/On/At for Place', 'In/On/At for Time', 'Common Mistakes'],
    examples: [
      { correct: 'The meeting is on Monday.', incorrect: 'The meeting is in Monday.', explanation: 'Days use "on"' },
      { correct: 'She lives in Hyderabad.', incorrect: 'She lives at Hyderabad.', explanation: 'Cities and countries use "in"' },
      { correct: 'I wake up at 6 AM.', incorrect: 'I wake up on 6 AM.', explanation: 'Specific times use "at"' }
    ],
    exercises: [
      { question: 'The book is ___ the table.', options: ['in', 'on', 'at', 'by'], correctAnswer: 1 },
      { question: 'We have class ___ 10 AM.', options: ['in', 'on', 'at', 'by'], correctAnswer: 2 },
      { question: 'She was born ___ 2010.', options: ['in', 'on', 'at', 'by'], correctAnswer: 0 }
    ]
  },
  {
    id: 'g6',
    title: 'Conjunctions & Connectors',
    description: 'Connect ideas smoothly using conjunctions',
    difficulty: 'advanced',
    topics: ['Coordinating Conjunctions', 'Subordinating Conjunctions', 'Transition Words'],
    examples: [
      { correct: 'I wanted to play, but it was raining.', incorrect: 'I wanted to play, it was raining.', explanation: 'Use "but" to show contrast' },
      { correct: 'Although she was tired, she finished her work.', incorrect: 'Although she was tired but she finished her work.', explanation: 'Don\'t use "although" and "but" together' },
      { correct: 'He studied hard; therefore, he passed.', incorrect: 'He studied hard, therefore, he passed.', explanation: 'Use semicolon before "therefore"' }
    ],
    exercises: [
      { question: 'I like tea ___ coffee.', options: ['and', 'but', 'or', 'so'], correctAnswer: 0 },
      { question: 'She was sick, ___ she went to school.', options: ['and', 'but', 'or', 'so'], correctAnswer: 1 },
      { question: '___ it was late, we continued working.', options: ['Although', 'Because', 'So', 'And'], correctAnswer: 0 }
    ]
  }
];

export const speakingActivities: SpeakingActivity[] = [
  {
    id: 's1',
    title: 'Daily Greetings Practice',
    description: 'Practice common greetings and introductions',
    type: 'pronunciation',
    difficulty: 'beginner',
    prompts: [
      'Good morning! How are you today?',
      'Hello! My name is ___. Nice to meet you!',
      'Hi there! How was your day?',
      'Good evening! I hope you had a great day.',
      'Goodbye! See you tomorrow!'
    ],
    tips: [
      'Smile while speaking - it makes your voice sound friendlier',
      'Speak slowly and clearly',
      'Make eye contact when greeting someone',
      'Practice in front of a mirror'
    ],
    duration: 5
  },
  {
    id: 's2',
    title: 'Introduce Yourself',
    description: 'Learn to introduce yourself confidently in different situations',
    type: 'conversation',
    difficulty: 'beginner',
    prompts: [
      'My name is ___ and I am ___ years old.',
      'I study in class ___. My favorite subject is ___.',
      'I live in ___. My hobbies are ___.',
      'When I grow up, I want to become a ___.',
      'My family has ___ members. They are ___.'
    ],
    tips: [
      'Start with a confident greeting',
      'Include interesting facts about yourself',
      'Practice with family members',
      'Record yourself and listen to improve'
    ],
    duration: 10
  },
  {
    id: 's3',
    title: 'Describe Your Day',
    description: 'Practice describing daily activities and routines',
    type: 'storytelling',
    difficulty: 'beginner',
    prompts: [
      'Describe what you did from morning till now.',
      'Talk about your favorite part of today.',
      'What did you eat for breakfast, lunch, and dinner?',
      'Who did you meet today and what did you talk about?',
      'What will you do before going to bed?'
    ],
    tips: [
      'Use time words like "first", "then", "after that", "finally"',
      'Include details to make it interesting',
      'Practice using past tense correctly',
      'Speak for at least 2 minutes without stopping'
    ],
    duration: 10
  },
  {
    id: 's4',
    title: 'Picture Description',
    description: 'Describe what you see in a picture in detail',
    type: 'storytelling',
    difficulty: 'intermediate',
    prompts: [
      'Describe a photo of your family.',
      'Look at a picture and describe what is happening.',
      'Describe your classroom in detail.',
      'Describe your favorite place to visit.',
      'Describe what you see outside your window.'
    ],
    tips: [
      'Start with the main subject, then move to details',
      'Use adjectives to make descriptions vivid',
      'Describe positions: left, right, center, background',
      'Talk about colors, shapes, and sizes'
    ],
    duration: 15
  },
  {
    id: 's5',
    title: 'Express Your Opinion',
    description: 'Learn to share your thoughts and opinions clearly',
    type: 'debate',
    difficulty: 'intermediate',
    prompts: [
      'Do you think homework is useful? Why or why not?',
      'What is your favorite festival and why?',
      'Should students use mobile phones in school?',
      'Is reading books better than watching movies?',
      'What makes a good friend?'
    ],
    tips: [
      'Start with "I think..." or "In my opinion..."',
      'Give reasons for your opinion',
      'Use examples to support your point',
      'Respect others\' opinions when they differ'
    ],
    duration: 15
  },
  {
    id: 's6',
    title: 'Role Play: At a Shop',
    description: 'Practice conversations you might have while shopping',
    type: 'conversation',
    difficulty: 'intermediate',
    prompts: [
      'Ask about the price of an item.',
      'Request a different size or color.',
      'Ask if there is a discount.',
      'Politely complain about a product.',
      'Thank the shopkeeper and say goodbye.'
    ],
    tips: [
      'Be polite - use "please" and "thank you"',
      'Practice with a partner taking different roles',
      'Use real-life scenarios',
      'Don\'t be afraid to make mistakes'
    ],
    duration: 20
  },
  {
    id: 's7',
    title: 'Story Retelling',
    description: 'Read a short story and retell it in your own words',
    type: 'storytelling',
    difficulty: 'advanced',
    prompts: [
      'Retell your favorite fairy tale.',
      'Describe the plot of a movie you watched.',
      'Tell a story about something funny that happened.',
      'Narrate a story about a brave person.',
      'Create and tell an original short story.'
    ],
    tips: [
      'Include beginning, middle, and end',
      'Use expressions to make it engaging',
      'Add emotions and expressions while speaking',
      'Practice with different stories regularly'
    ],
    duration: 20
  },
  {
    id: 's8',
    title: 'Debate Practice',
    description: 'Learn to argue a point and respond to counter-arguments',
    type: 'debate',
    difficulty: 'advanced',
    prompts: [
      'Online classes vs. traditional classroom learning.',
      'Are video games good or bad for students?',
      'Should school uniforms be mandatory?',
      'Is social media helpful or harmful?',
      'Should homework be banned?'
    ],
    tips: [
      'Present your argument clearly',
      'Listen to the other side carefully',
      'Use facts and examples',
      'Stay calm and respectful'
    ],
    duration: 25
  }
];

export const typingLessons: TypingLesson[] = [
  {
    id: 't1',
    title: 'Home Row Keys',
    description: 'Master the home row: A S D F J K L ;',
    difficulty: 'beginner',
    text: 'asdf jkl; asdf jkl; asd jkl asdf jkl; fall sad lad ask dad flask salads add fads',
    targetWPM: 15,
    targetAccuracy: 90
  },
  {
    id: 't2',
    title: 'Top Row Practice',
    description: 'Learn the top row: Q W E R T Y U I O P',
    difficulty: 'beginner',
    text: 'qwer tyui op qwer tyui op were port trip quiet write power tower quip write rope',
    targetWPM: 15,
    targetAccuracy: 90
  },
  {
    id: 't3',
    title: 'Bottom Row Practice',
    description: 'Master the bottom row: Z X C V B N M',
    difficulty: 'beginner',
    text: 'zxcv bnm zxcv bnm zinc barn calm venom became cabin exam next Mexico bring calm zone',
    targetWPM: 15,
    targetAccuracy: 90
  },
  {
    id: 't4',
    title: 'Common Words',
    description: 'Practice typing the most common English words',
    difficulty: 'beginner',
    text: 'the and is it you that was for on are with they be at one have this from or had by not but what all were we when your can there use an each which she do how their if will up other about out many then them these so some her would make like him into time has look two more write go see number no way could people my than first water been call who oil its now find long down day did get come made may part over new sound take only little work know place year live me back give most very after thing our just name good sentence man think say great where help through much before line right too mean old any same tell boy follow came want show also around form small set put end does another well large must big even such here why ask went men read need land different home us move try kind hand picture again change off play spell air away animal house point page letter mother answer found study still learn should America world high',
    targetWPM: 25,
    targetAccuracy: 92
  },
  {
    id: 't5',
    title: 'Short Sentences',
    description: 'Type complete short sentences',
    difficulty: 'intermediate',
    text: 'The quick brown fox jumps over the lazy dog. She sells seashells by the seashore. A stitch in time saves nine. All that glitters is not gold. Practice makes perfect every single day.',
    targetWPM: 30,
    targetAccuracy: 95
  },
  {
    id: 't6',
    title: 'School Paragraph',
    description: 'Type a paragraph about school life',
    difficulty: 'intermediate',
    text: 'I love going to school every day. My school is a beautiful building with many classrooms. I have many friends there and we play together during break time. My favorite subject is science because we do interesting experiments. Our teachers are very kind and they help us learn new things. After school, I do my homework and then play with my friends.',
    targetWPM: 35,
    targetAccuracy: 95
  },
  {
    id: 't7',
    title: 'Nature Description',
    description: 'Type a descriptive paragraph about nature',
    difficulty: 'intermediate',
    text: 'The morning sun rose slowly over the misty mountains. Birds began to sing their sweet songs in the tall trees. A gentle breeze rustled through the green leaves. The river flowed peacefully through the valley. Colorful flowers bloomed everywhere, filling the air with their fragrance. It was a perfect day to enjoy the beauty of nature.',
    targetWPM: 40,
    targetAccuracy: 95
  },
  {
    id: 't8',
    title: 'Story Typing',
    description: 'Type a short story passage',
    difficulty: 'advanced',
    text: 'Once upon a time, in a small village, there lived a young boy named Raju. He was known for his honesty and kindness. One day, while walking to school, he found a bag full of gold coins on the road. Instead of keeping them, he decided to find the owner. After asking many people, he finally found an old merchant who had lost the bag. The merchant was so happy that he rewarded Raju and praised his honesty to everyone in the village.',
    targetWPM: 45,
    targetAccuracy: 96
  },
  {
    id: 't9',
    title: 'Science Facts',
    description: 'Type interesting science facts',
    difficulty: 'advanced',
    text: 'The Earth revolves around the Sun and takes approximately 365 days to complete one orbit. Light travels at a speed of about 299,792 kilometers per second. The human body contains about 206 bones and 600 muscles. Water covers about 71 percent of the Earth surface. The heart beats approximately 100,000 times per day, pumping blood throughout the entire body.',
    targetWPM: 50,
    targetAccuracy: 96
  },
  {
    id: 't10',
    title: 'Speed Challenge',
    description: 'Test your typing speed with this challenging passage',
    difficulty: 'advanced',
    text: 'In the magnificent kingdom of knowledge, where wisdom flows like a river of endless possibilities, young scholars embark on extraordinary journeys of discovery. They unlock the mysteries of mathematics, explore the wonders of science, and dive deep into the ocean of literature. Each day brings new challenges and opportunities to grow. With determination and perseverance, they transform obstacles into stepping stones toward success. Education is the key that opens every door.',
    targetWPM: 55,
    targetAccuracy: 97
  }
];

export interface VocabularyWord {
  id: string;
  word: string;
  meaning: string;
  pronunciation: string;
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'adverb' | 'preposition' | 'conjunction';
  example: string;
  synonym: string[];
  antonym: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
}

export interface VocabularyCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  words: VocabularyWord[];
}

export const vocabularyCategories: VocabularyCategory[] = [
  {
    id: 'vc1',
    name: 'Daily Life',
    icon: '🏠',
    description: 'Words used in everyday conversations',
    words: [
      {
        id: 'v1',
        word: 'Abundant',
        meaning: 'Existing or available in large quantities; plentiful',
        pronunciation: '/əˈbʌndənt/',
        partOfSpeech: 'adjective',
        example: 'The garden has an abundant supply of vegetables.',
        synonym: ['plentiful', 'ample', 'rich'],
        antonym: ['scarce', 'rare', 'lacking'],
        difficulty: 'intermediate',
        category: 'Daily Life'
      },
      {
        id: 'v2',
        word: 'Accomplish',
        meaning: 'To achieve or complete successfully',
        pronunciation: '/əˈkʌmplɪʃ/',
        partOfSpeech: 'verb',
        example: 'She worked hard to accomplish her goals.',
        synonym: ['achieve', 'complete', 'fulfill'],
        antonym: ['fail', 'neglect'],
        difficulty: 'intermediate',
        category: 'Daily Life'
      },
      {
        id: 'v3',
        word: 'Beautiful',
        meaning: 'Pleasing to the senses or mind',
        pronunciation: '/ˈbjuːtɪfl/',
        partOfSpeech: 'adjective',
        example: 'The sunset was beautiful today.',
        synonym: ['pretty', 'lovely', 'gorgeous'],
        antonym: ['ugly', 'unattractive'],
        difficulty: 'beginner',
        category: 'Daily Life'
      },
      {
        id: 'v4',
        word: 'Delicious',
        meaning: 'Highly pleasant to taste',
        pronunciation: '/dɪˈlɪʃəs/',
        partOfSpeech: 'adjective',
        example: 'My mother made a delicious cake.',
        synonym: ['tasty', 'yummy', 'flavorful'],
        antonym: ['tasteless', 'bland'],
        difficulty: 'beginner',
        category: 'Daily Life'
      },
      {
        id: 'v5',
        word: 'Enthusiastic',
        meaning: 'Having or showing intense excitement',
        pronunciation: '/ɪnˌθjuːziˈæstɪk/',
        partOfSpeech: 'adjective',
        example: 'The students were enthusiastic about the field trip.',
        synonym: ['excited', 'eager', 'passionate'],
        antonym: ['indifferent', 'apathetic'],
        difficulty: 'advanced',
        category: 'Daily Life'
      }
    ]
  },
  {
    id: 'vc2',
    name: 'School & Education',
    icon: '📚',
    description: 'Academic and classroom vocabulary',
    words: [
      {
        id: 'v6',
        word: 'Curriculum',
        meaning: 'The subjects in a course of study',
        pronunciation: '/kəˈrɪkjʊləm/',
        partOfSpeech: 'noun',
        example: 'The school updated its curriculum this year.',
        synonym: ['syllabus', 'program', 'course'],
        antonym: [],
        difficulty: 'advanced',
        category: 'School & Education'
      },
      {
        id: 'v7',
        word: 'Diligent',
        meaning: 'Showing care and effort in work',
        pronunciation: '/ˈdɪlɪdʒənt/',
        partOfSpeech: 'adjective',
        example: 'She is a diligent student who always completes her homework.',
        synonym: ['hardworking', 'industrious', 'assiduous'],
        antonym: ['lazy', 'careless'],
        difficulty: 'intermediate',
        category: 'School & Education'
      },
      {
        id: 'v8',
        word: 'Examine',
        meaning: 'To inspect or investigate closely',
        pronunciation: '/ɪɡˈzæmɪn/',
        partOfSpeech: 'verb',
        example: 'The teacher will examine our projects tomorrow.',
        synonym: ['inspect', 'study', 'analyze'],
        antonym: ['ignore', 'overlook'],
        difficulty: 'beginner',
        category: 'School & Education'
      },
      {
        id: 'v9',
        word: 'Knowledge',
        meaning: 'Facts, information, and skills acquired through experience or education',
        pronunciation: '/ˈnɒlɪdʒ/',
        partOfSpeech: 'noun',
        example: 'Reading books increases our knowledge.',
        synonym: ['understanding', 'wisdom', 'learning'],
        antonym: ['ignorance'],
        difficulty: 'beginner',
        category: 'School & Education'
      },
      {
        id: 'v10',
        word: 'Participate',
        meaning: 'To take part in an activity',
        pronunciation: '/pɑːˈtɪsɪpeɪt/',
        partOfSpeech: 'verb',
        example: 'All students should participate in class discussions.',
        synonym: ['join', 'engage', 'contribute'],
        antonym: ['abstain', 'withdraw'],
        difficulty: 'intermediate',
        category: 'School & Education'
      }
    ]
  },
  {
    id: 'vc3',
    name: 'Emotions & Feelings',
    icon: '💭',
    description: 'Words to express emotions',
    words: [
      {
        id: 'v11',
        word: 'Anxious',
        meaning: 'Feeling worried or nervous',
        pronunciation: '/ˈæŋkʃəs/',
        partOfSpeech: 'adjective',
        example: 'I felt anxious before the exam.',
        synonym: ['worried', 'nervous', 'uneasy'],
        antonym: ['calm', 'relaxed'],
        difficulty: 'intermediate',
        category: 'Emotions & Feelings'
      },
      {
        id: 'v12',
        word: 'Grateful',
        meaning: 'Feeling thankful',
        pronunciation: '/ˈɡreɪtfl/',
        partOfSpeech: 'adjective',
        example: 'I am grateful for your help.',
        synonym: ['thankful', 'appreciative'],
        antonym: ['ungrateful'],
        difficulty: 'beginner',
        category: 'Emotions & Feelings'
      },
      {
        id: 'v13',
        word: 'Frustrated',
        meaning: 'Feeling upset because of inability to change a situation',
        pronunciation: '/frʌˈstreɪtɪd/',
        partOfSpeech: 'adjective',
        example: 'He felt frustrated when he could not solve the problem.',
        synonym: ['annoyed', 'disappointed', 'discouraged'],
        antonym: ['satisfied', 'content'],
        difficulty: 'intermediate',
        category: 'Emotions & Feelings'
      },
      {
        id: 'v14',
        word: 'Confident',
        meaning: 'Feeling sure about oneself',
        pronunciation: '/ˈkɒnfɪdənt/',
        partOfSpeech: 'adjective',
        example: 'She spoke with a confident voice.',
        synonym: ['self-assured', 'bold', 'certain'],
        antonym: ['insecure', 'doubtful'],
        difficulty: 'intermediate',
        category: 'Emotions & Feelings'
      },
      {
        id: 'v15',
        word: 'Curious',
        meaning: 'Eager to know or learn something',
        pronunciation: '/ˈkjʊəriəs/',
        partOfSpeech: 'adjective',
        example: 'Children are naturally curious about the world.',
        synonym: ['inquisitive', 'interested', 'eager'],
        antonym: ['indifferent', 'uninterested'],
        difficulty: 'beginner',
        category: 'Emotions & Feelings'
      }
    ]
  },
  {
    id: 'vc4',
    name: 'Nature & Environment',
    icon: '🌳',
    description: 'Words related to nature',
    words: [
      {
        id: 'v16',
        word: 'Atmosphere',
        meaning: 'The layer of gases surrounding Earth',
        pronunciation: '/ˈætməsfɪə/',
        partOfSpeech: 'noun',
        example: 'The atmosphere protects us from harmful radiation.',
        synonym: ['air', 'sky', 'environment'],
        antonym: [],
        difficulty: 'intermediate',
        category: 'Nature & Environment'
      },
      {
        id: 'v17',
        word: 'Conservation',
        meaning: 'Protection of natural resources',
        pronunciation: '/ˌkɒnsəˈveɪʃn/',
        partOfSpeech: 'noun',
        example: 'Wildlife conservation is important for our planet.',
        synonym: ['preservation', 'protection', 'maintenance'],
        antonym: ['destruction', 'waste'],
        difficulty: 'advanced',
        category: 'Nature & Environment'
      },
      {
        id: 'v18',
        word: 'Ecosystem',
        meaning: 'A biological community of interacting organisms',
        pronunciation: '/ˈiːkəʊsɪstəm/',
        partOfSpeech: 'noun',
        example: 'The forest ecosystem includes plants, animals, and insects.',
        synonym: ['habitat', 'environment'],
        antonym: [],
        difficulty: 'advanced',
        category: 'Nature & Environment'
      },
      {
        id: 'v19',
        word: 'Pollution',
        meaning: 'Contamination of the natural environment',
        pronunciation: '/pəˈluːʃn/',
        partOfSpeech: 'noun',
        example: 'Air pollution is a major problem in cities.',
        synonym: ['contamination', 'impurity'],
        antonym: ['purification', 'cleanliness'],
        difficulty: 'beginner',
        category: 'Nature & Environment'
      },
      {
        id: 'v20',
        word: 'Sustainable',
        meaning: 'Able to be maintained at a certain rate or level',
        pronunciation: '/səˈsteɪnəbl/',
        partOfSpeech: 'adjective',
        example: 'We need sustainable energy sources for the future.',
        synonym: ['renewable', 'maintainable', 'viable'],
        antonym: ['unsustainable', 'harmful'],
        difficulty: 'advanced',
        category: 'Nature & Environment'
      }
    ]
  },
  {
    id: 'vc5',
    name: 'Actions & Verbs',
    icon: '⚡',
    description: 'Common action words',
    words: [
      {
        id: 'v21',
        word: 'Analyze',
        meaning: 'To examine in detail',
        pronunciation: '/ˈænəlaɪz/',
        partOfSpeech: 'verb',
        example: 'Scientists analyze data to find patterns.',
        synonym: ['examine', 'study', 'investigate'],
        antonym: ['ignore', 'overlook'],
        difficulty: 'intermediate',
        category: 'Actions & Verbs'
      },
      {
        id: 'v22',
        word: 'Collaborate',
        meaning: 'To work together with others',
        pronunciation: '/kəˈlæbəreɪt/',
        partOfSpeech: 'verb',
        example: 'Students collaborate on group projects.',
        synonym: ['cooperate', 'team up', 'work together'],
        antonym: ['compete', 'oppose'],
        difficulty: 'intermediate',
        category: 'Actions & Verbs'
      },
      {
        id: 'v23',
        word: 'Demonstrate',
        meaning: 'To show clearly',
        pronunciation: '/ˈdemənstreɪt/',
        partOfSpeech: 'verb',
        example: 'The teacher will demonstrate the experiment.',
        synonym: ['show', 'display', 'illustrate'],
        antonym: ['hide', 'conceal'],
        difficulty: 'intermediate',
        category: 'Actions & Verbs'
      },
      {
        id: 'v24',
        word: 'Encourage',
        meaning: 'To give support or confidence',
        pronunciation: '/ɪnˈkʌrɪdʒ/',
        partOfSpeech: 'verb',
        example: 'Parents encourage their children to do their best.',
        synonym: ['motivate', 'inspire', 'support'],
        antonym: ['discourage', 'dissuade'],
        difficulty: 'beginner',
        category: 'Actions & Verbs'
      },
      {
        id: 'v25',
        word: 'Investigate',
        meaning: 'To carry out research or study',
        pronunciation: '/ɪnˈvestɪɡeɪt/',
        partOfSpeech: 'verb',
        example: 'The police will investigate the crime.',
        synonym: ['examine', 'research', 'explore'],
        antonym: ['ignore', 'neglect'],
        difficulty: 'intermediate',
        category: 'Actions & Verbs'
      }
    ]
  }
];

export interface UserProgress {
  lessonId: string;
  completed: boolean;
  score: number;
  bestWPM?: number;
  bestAccuracy?: number;
  attempts: number;
}

export const mockUserProgress: UserProgress[] = [
  { lessonId: 'g1', completed: true, score: 85, attempts: 2 },
  { lessonId: 'g2', completed: true, score: 90, attempts: 1 },
  { lessonId: 's1', completed: true, score: 80, attempts: 3 },
  { lessonId: 't1', completed: true, score: 95, bestWPM: 18, bestAccuracy: 92, attempts: 4 },
  { lessonId: 't2', completed: true, score: 88, bestWPM: 16, bestAccuracy: 94, attempts: 3 },
];
