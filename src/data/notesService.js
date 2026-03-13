export const NOTES_SOURCES = {
  ADDA247: 'Adda247',
  UNACADEMY: 'Unacademy',
  GOOGLE: 'Google Search',
};

// Comprehensive Chapter-Wise Syllabus Data
const syllabusData = {
  'SSC CGL / CHSL': [
    {
      subject: 'Mathematics',
      chapters: [
        { id: 'math-1', title: 'Number System', notesCount: 5, topics: ['LCM & HCF', 'Divisibility', 'Reminders'] },
        { id: 'math-2', title: 'Percentage', notesCount: 8, topics: ['Basic to Pro', 'Fraction Table'] },
        { id: 'math-3', title: 'Profit & Loss', notesCount: 12, topics: ['Discount', 'Marked Price'] },
        { id: 'math-4', title: 'Algebra', notesCount: 15, topics: ['Quadratic Equations', 'Identities'] },
        { id: 'math-5', title: 'Trigonometry', notesCount: 10, topics: ['Ratios', 'Heights & Distances'] }
      ]
    },
    {
      subject: 'General Awareness',
      chapters: [
        { id: 'ga-1', title: 'Indian Constitution', notesCount: 20, topics: ['Articles', 'Schedules', 'Amendments'] },
        { id: 'ga-2', title: 'Modern History', notesCount: 25, topics: ['Freedom Struggle', 'Gandhian Era'] },
        { id: 'ga-3', title: 'Indian Economy', notesCount: 15, topics: ['Five Year Plans', 'Banking Terms'] }
      ]
    },
    {
      subject: 'Reasoning',
      chapters: [
        { id: 're-1', title: 'Syllogism', notesCount: 10, topics: ['Only a few', 'Possibility Cases'] },
        { id: 're-2', title: 'Coding-Decoding', notesCount: 7, topics: ['Letter Shifting', 'Number Coding'] }
      ]
    }
  ],
  'Railway RRB NTPC': [
    {
      subject: 'General Science',
      chapters: [
        { id: 'gs-1', title: 'Physics (Units & Motion)', notesCount: 12, topics: ['Speed, Velocity', 'Newton\'s Laws'] },
        { id: 'gs-2', title: 'Biology (Cell & Human Body)', notesCount: 18, topics: ['Vitamins', 'Diseases'] },
        { id: 'gs-3', title: 'Chemistry (Chemical Reactions)', notesCount: 10, topics: ['Periodic Table', 'Acids & Bases'] }
      ]
    },
    {
      subject: 'Maths Special',
      chapters: [
        { id: 'rm-1', title: 'Time & Work', notesCount: 15, topics: ['Efficiency', 'Pipes & Cisterns'] },
        { id: 'rm-2', title: 'Compound Interest', notesCount: 9, topics: ['Tree Method', 'Ratio Method'] }
      ]
    }
  ],
  'State Police Exams': [
    {
      subject: 'Law & Constitution',
      chapters: [
        { id: 'pol-1', title: 'IPC & CrPC Basics', notesCount: 30, topics: ['Section 302', 'Section 307', 'Police Rights'] },
        { id: 'pol-2', title: 'Fundamental Rights', notesCount: 20, topics: ['Article 21', 'Writs'] }
      ]
    },
    {
      subject: 'Regional GK',
      chapters: [
        { id: 'reg-1', title: 'State Geography', notesCount: 12, topics: ['Rivers', 'Forests', 'Districts'] },
        { id: 'reg-2', title: 'Regional Festivals', notesCount: 8, topics: ['Folk Dance', 'Cultural Heritage'] }
      ]
    }
  ]
};

// Simulated Chapter Detail Generator (fetches from multiple sources)
export const fetchChapterNotes = async (chapterId, source = 'All') => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const sources = [NOTES_SOURCES.ADDA247, NOTES_SOURCES.UNACADEMY, NOTES_SOURCES.GOOGLE];
  
  return [
    {
      id: `${chapterId}-s1`,
      title: 'Premium Chapter Summary',
      source: NOTES_SOURCES.ADDA247,
      date: 'Latest 2026',
      format: 'PDF',
      size: '2.4 MB'
    },
    {
      id: `${chapterId}-s2`,
      title: 'Short Tricks & Handwritten Notes',
      source: NOTES_SOURCES.UNACADEMY,
      date: 'Updated yesterday',
      format: 'PDF',
      size: '5.1 MB'
    },
    {
      id: `${chapterId}-s3`,
      title: 'Syllabus Based Detailed PDF',
      source: NOTES_SOURCES.GOOGLE,
      date: '2026 Edition',
      format: 'PDF',
      size: '3.8 MB'
    }
  ].filter(note => source === 'All' || note.source === source);
};

export const getLibraryStructure = (targetExam) => {
  return syllabusData[targetExam] || syllabusData['SSC CGL / CHSL'];
};

export const fetchNotes = async (query = '', source = 'All', type = 'notes', targetExam = 'SSC CGL / CHSL') => {
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Basic search functionality for the flat list view
  const library = getLibraryStructure(targetExam);
  let results = [];
  
  library.forEach(subj => {
    subj.chapters.forEach(chap => {
      results.push({
        id: chap.id,
        title: `${subj.subject}: ${chap.title}`,
        source: NOTES_SOURCES.GOOGLE, // Default for search
        date: '2026',
        format: 'PDF',
        size: `${chap.notesCount} Files`
      });
    });
  });

  if (query) {
    const lowQuery = query.toLowerCase();
    results = results.filter(item => item.title.toLowerCase().includes(lowQuery));
  }

  return results;
};
