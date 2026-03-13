export const NOTES_SOURCES = {
  ADDA247: 'Adda247',
  UNACADEMY: 'Unacademy',
  GOOGLE: 'Google Search',
};

// Mock data representing recent PDF notes from these sources
const mockNotes = [
  {
    id: '1',
    title: 'Daily Current Affairs - March 2026',
    source: NOTES_SOURCES.ADDA247,
    date: '2026-03-13',
    format: 'PDF',
    size: '2.4 MB',
    url: 'https://www.adda247.com/jobs/wp-content/uploads/2026/03/current-affairs.pdf', // Example placeholder
  },
  {
    id: '2',
    title: 'SSC CGL Mathematics: Full Revision',
    source: NOTES_SOURCES.UNACADEMY,
    date: '2026-03-12',
    format: 'PDF',
    size: '5.1 MB',
    url: 'https://unacademy.com/content/ssc/materials/maths-revision.pdf',
  },
  {
    id: '3',
    title: 'Banking Awareness Capsule 2026',
    source: NOTES_SOURCES.ADDA247,
    date: '2026-03-11',
    format: 'PDF',
    size: '3.8 MB',
    url: 'https://www.bankersadda.com/wp-content/uploads/2026/03/banking-capsule.pdf',
  },
  {
    id: '4',
    title: 'Constitution of India: Article-wise Notes',
    source: NOTES_SOURCES.GOOGLE,
    date: '2026-03-10',
    format: 'PDF',
    size: '1.2 MB',
    url: 'https://www.government.in/files/constitution-notes.pdf',
  },
  {
    id: '5',
    title: 'History: Medieval India Highlights',
    source: NOTES_SOURCES.UNACADEMY,
    date: '2026-03-09',
    format: 'PDF',
    size: '4.5 MB',
    url: 'https://unacademy.com/content/history/medieval-highlights.pdf',
  },
  {
    id: '6',
    title: 'Monthly Science & Tech Review - Feb 2026',
    source: NOTES_SOURCES.ADDA247,
    date: '2026-03-05',
    format: 'PDF',
    size: '2.9 MB',
    url: 'https://www.adda247.com/jobs/wp-content/uploads/2026/02/science-tech.pdf',
  },
  {
    id: '7',
    title: 'UPSC CSE: Ethics Case Studies 2026',
    source: NOTES_SOURCES.UNACADEMY,
    date: '2026-03-13',
    format: 'PDF',
    size: '3.1 MB',
    url: 'https://unacademy.com/content/upsc/ethics-cases.pdf',
  },
  {
    id: '8',
    title: 'Railway Group D: Previous 5 Years Science',
    source: NOTES_SOURCES.GOOGLE,
    date: '2026-03-12',
    format: 'PDF',
    size: '6.4 MB',
    url: 'https://rrbexamportal.com/files/science-pyq.pdf',
  }
];

export const fetchNotes = async (query = '', source = 'All') => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  let filtered = [...mockNotes];

  if (source !== 'All') {
    filtered = filtered.filter(note => note.source === source);
  }

  if (query) {
    const lowQuery = query.toLowerCase();
    filtered = filtered.filter(note => 
      note.title.toLowerCase().includes(lowQuery) || 
      note.source.toLowerCase().includes(lowQuery)
    );
    
    // If it's a "Google" search and no results in mock, we could "simulate" finding something
    if (source === NOTES_SOURCES.GOOGLE && filtered.length === 0) {
      return [
        {
          id: `web-${Date.now()}`,
          title: `${query} Study Material (Web Search Result)`,
          source: NOTES_SOURCES.GOOGLE,
          date: new Date().toISOString().split('T')[0],
          format: 'PDF',
          size: 'Unknown',
          url: `https://www.google.com/search?q=${encodeURIComponent(query)}+filetype:pdf`,
        }
      ];
    }
  }

  return filtered;
};
