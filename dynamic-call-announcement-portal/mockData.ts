
import { Category, CallType, FieldType, CallAnnouncement } from './types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-research-grant',
    name: 'A.1 Research Grant',
    type: CallType.FACULTY,
    description: 'Grants for academic research projects and experimental development.',
    fields: [
      { id: 'funding_agency', name: 'funding_agency', label: 'Funding Agency', type: FieldType.TEXT, required: true },
      { id: 'about', name: 'about', label: 'About', type: FieldType.TEXTAREA, required: true },
      { id: 'areas', name: 'areas', label: 'Area(s)', type: FieldType.SELECT, required: true, options: ['Healthcare', 'Medical Device', 'Diagnostic System', 'Other'] },
      { id: 'pi_age', name: 'pi_age', label: 'Age Limit', type: FieldType.SELECT, required: false, options: ['Below 35 years', 'Below 40 years', 'Below 45 years', 'Below 50 years', 'Below 60 years', 'No age limit', 'Other'] },
      { id: 'pi_qualification', name: 'pi_qualification', label: 'Qualification', type: FieldType.SELECT, required: true, options: ['PhD', 'PhD + Post Doc', 'Masters Degree', 'Bachelors Degree', 'Any Graduate', 'Other'] },
      { id: 'pi_category', name: 'pi_category', label: 'Applicant Category', type: FieldType.SELECT, required: false, options: ['General', 'SC', 'ST', 'OBC', 'EWS', 'PwD', 'All Categories', 'Other'] },
      { id: 'pi_other', name: 'pi_other', label: 'Other Eligibility', type: FieldType.TEXT, required: false },
      { id: 'doc_performa', name: 'doc_performa', label: 'Performa', type: FieldType.TEXT, required: false },
      { id: 'doc_biodata', name: 'doc_biodata', label: 'PI Biodata', type: FieldType.TEXT, required: false },
      { id: 'doc_undertaking', name: 'doc_undertaking', label: 'Undertaking', type: FieldType.TEXT, required: false },
      { id: 'doc_other', name: 'doc_other', label: 'Other Documents', type: FieldType.TEXT, required: false },
      { id: 'attachment', name: 'attachment', label: 'Attach Document (PDF)', type: FieldType.FILE, required: true, acceptedFileTypes: ['.pdf'] },
      { id: 'last_date', name: 'last_date', label: 'Last Date of Application', type: FieldType.DATE, required: true },
      { id: 'links', name: 'links', label: 'Link(s)', type: FieldType.TEXT, required: false },
      { id: 'note', name: 'note', label: 'Note', type: FieldType.TEXTAREA, required: false }
    ]
  },
  {
    id: 'cat-event-grant',
    name: 'A.2 Event Grant',
    type: CallType.FACULTY,
    description: 'Grants for organizing seminars, conferences, workshops, training programs, FDP, schools, etc.',
    fields: [
      { id: 'funding_agency', name: 'funding_agency', label: 'Funding Agency', type: FieldType.TEXT, required: true },
      { id: 'event_type', name: 'event_type', label: 'Event Type', type: FieldType.SELECT, required: true, options: ['Seminar', 'Conference', 'Workshop', 'Training Program', 'FDP', 'School', 'Other'] },
      { id: 'about', name: 'about', label: 'About', type: FieldType.TEXTAREA, required: true },
      { id: 'areas', name: 'areas', label: 'Area(s)/Theme(s)', type: FieldType.SELECT, required: true, options: ['Healthcare', 'Medical Device', 'Diagnostic System', 'Other'] },
      { id: 'organizer_eligibility', name: 'organizer_eligibility', label: 'Organizer Eligibility', type: FieldType.TEXTAREA, required: true },
      { id: 'funding_amount', name: 'funding_amount', label: 'Funding Amount', type: FieldType.SELECT, required: false, options: ['Up to ₹1 Lakh', 'Up to ₹5 Lakhs', 'Up to ₹10 Lakhs', 'Up to ₹25 Lakhs', 'Up to ₹50 Lakhs', 'Above ₹50 Lakhs', 'Other'] },
      { id: 'event_duration', name: 'event_duration', label: 'Event Duration', type: FieldType.SELECT, required: false, options: ['1 Day', '2-3 Days', '4-5 Days', '1 Week', '2 Weeks', '1 Month', 'Other'] },
      { id: 'doc_proposal', name: 'doc_proposal', label: 'Proposal Format', type: FieldType.TEXT, required: false },
      { id: 'doc_budget', name: 'doc_budget', label: 'Budget Template', type: FieldType.TEXT, required: false },
      { id: 'doc_other', name: 'doc_other', label: 'Other Documents', type: FieldType.TEXT, required: false },
      { id: 'attachment', name: 'attachment', label: 'Attach Document (PDF)', type: FieldType.FILE, required: true, acceptedFileTypes: ['.pdf'] },
      { id: 'last_date', name: 'last_date', label: 'Last Date of Application', type: FieldType.DATE, required: true },
      { id: 'links', name: 'links', label: 'Link(s)', type: FieldType.TEXT, required: false },
      { id: 'note', name: 'note', label: 'Note', type: FieldType.TEXTAREA, required: false }
    ]
  },
  {
    id: 'cat-fellowship-associateship',
    name: 'A.3 Fellowship / Associateship',
    type: CallType.FACULTY,
    description: 'Fellowship and associateship opportunities for faculty members.',
    fields: [
      { id: 'funding_agency', name: 'funding_agency', label: 'Funding Agency/Institution', type: FieldType.TEXT, required: true },
      { id: 'fellowship_type', name: 'fellowship_type', label: 'Type', type: FieldType.SELECT, required: true, options: ['Fellowship', 'Associateship', 'Visiting Position', 'Other'] },
      { id: 'about', name: 'about', label: 'About', type: FieldType.TEXTAREA, required: true },
      { id: 'areas', name: 'areas', label: 'Area(s)/Specialization', type: FieldType.SELECT, required: true, options: ['Healthcare', 'Medical Device', 'Diagnostic System', 'Other'] },
      { id: 'eligibility_qualification', name: 'eligibility_qualification', label: 'Eligibility - Qualification', type: FieldType.SELECT, required: true, options: ['PhD', 'Masters', 'Bachelors', 'Post Doctorate', 'Any Degree', 'Other'] },
      { id: 'eligibility_experience', name: 'eligibility_experience', label: 'Eligibility - Experience', type: FieldType.SELECT, required: false, options: ['No experience required', '1-3 years', '3-5 years', '5-10 years', '10+ years', 'Other'] },
      { id: 'eligibility_age', name: 'eligibility_age', label: 'Eligibility - Age Limit', type: FieldType.SELECT, required: false, options: ['Below 30 years', 'Below 35 years', 'Below 40 years', 'Below 45 years', 'No age limit', 'Other'] },
      { id: 'fellowship_duration', name: 'fellowship_duration', label: 'Duration', type: FieldType.SELECT, required: false, options: ['3 Months', '6 Months', '1 Year', '2 Years', '3 Years', '5 Years', 'Other'] },
      { id: 'stipend', name: 'stipend', label: 'Stipend/Salary', type: FieldType.SELECT, required: false, options: ['Up to ₹25K/month', '₹25K-50K/month', '₹50K-1L/month', 'Above ₹1L/month', 'As per norms', 'Other'] },
      { id: 'doc_cv', name: 'doc_cv', label: 'CV/Resume', type: FieldType.TEXT, required: false },
      { id: 'doc_proposal', name: 'doc_proposal', label: 'Research Proposal', type: FieldType.TEXT, required: false },
      { id: 'doc_other', name: 'doc_other', label: 'Other Documents', type: FieldType.TEXT, required: false },
      { id: 'attachment', name: 'attachment', label: 'Attach Document (PDF)', type: FieldType.FILE, required: true, acceptedFileTypes: ['.pdf'] },
      { id: 'last_date', name: 'last_date', label: 'Last Date of Application', type: FieldType.DATE, required: true },
      { id: 'links', name: 'links', label: 'Link(s)', type: FieldType.TEXT, required: false },
      { id: 'note', name: 'note', label: 'Note', type: FieldType.TEXTAREA, required: false }
    ]
  },
  {
    id: 'cat-student-internship',
    name: 'B.1 Internship Opportunity',
    type: CallType.STUDENT,
    description: 'Internship opportunities for undergraduate and graduate students.',
    fields: [
      { id: 'organization', name: 'organization', label: 'Organization/Company', type: FieldType.TEXT, required: true },
      { id: 'about', name: 'about', label: 'About', type: FieldType.TEXTAREA, required: true },
      { id: 'areas', name: 'areas', label: 'Area(s)/Domain', type: FieldType.SELECT, required: true, options: ['Healthcare', 'Medical Device', 'Diagnostic System', 'Other'] },
      { id: 'eligibility_program', name: 'eligibility_program', label: 'Eligibility - Program/Degree', type: FieldType.SELECT, required: true, options: ['B.Tech/B.E.', 'B.Sc.', 'M.Tech/M.E.', 'M.Sc.', 'Integrated M.Sc.', 'MBA', 'BCA/MCA', 'Any Degree', 'Other'] },
      { id: 'eligibility_year', name: 'eligibility_year', label: 'Eligibility - Year of Study', type: FieldType.SELECT, required: false, options: ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Final Year', 'Any Year', 'Other'] },
      { id: 'eligibility_skills', name: 'eligibility_skills', label: 'Eligibility - Required Skills', type: FieldType.TEXTAREA, required: false },
      { id: 'duration', name: 'duration', label: 'Duration', type: FieldType.SELECT, required: true, options: ['2 Weeks', '1 Month', '6 Weeks', '2 Months', '3 Months', '6 Months', 'Other'] },
      { id: 'stipend', name: 'stipend', label: 'Stipend', type: FieldType.SELECT, required: false, options: ['Unpaid', 'Up to ₹5K/month', '₹5K-10K/month', '₹10K-20K/month', '₹20K-30K/month', 'Above ₹30K/month', 'Other'] },
      { id: 'location', name: 'location', label: 'Location/Mode', type: FieldType.SELECT, required: false, options: ['Remote/Work from Home', 'On-site', 'Hybrid', 'Other'] },
      { id: 'doc_resume', name: 'doc_resume', label: 'Resume', type: FieldType.TEXT, required: false },
      { id: 'doc_other', name: 'doc_other', label: 'Other Documents', type: FieldType.TEXT, required: false },
      { id: 'attachment', name: 'attachment', label: 'Attach Document (PDF)', type: FieldType.FILE, required: true, acceptedFileTypes: ['.pdf'] },
      { id: 'last_date', name: 'last_date', label: 'Last Date of Application', type: FieldType.DATE, required: true },
      { id: 'links', name: 'links', label: 'Link(s)', type: FieldType.TEXT, required: false },
      { id: 'note', name: 'note', label: 'Note', type: FieldType.TEXTAREA, required: false }
    ]
  },
  {
    id: 'cat-student-fellowship',
    name: 'B.2 Fellowship Opportunity',
    type: CallType.STUDENT,
    description: 'Fellowship opportunities for students pursuing research and advanced studies.',
    fields: [
      { id: 'funding_agency', name: 'funding_agency', label: 'Funding Agency/Institution', type: FieldType.TEXT, required: true },
      { id: 'about', name: 'about', label: 'About', type: FieldType.TEXTAREA, required: true },
      { id: 'areas', name: 'areas', label: 'Area(s)/Research Field', type: FieldType.SELECT, required: true, options: ['Healthcare', 'Medical Device', 'Diagnostic System', 'Other'] },
      { id: 'eligibility_program', name: 'eligibility_program', label: 'Eligibility - Program/Degree Level', type: FieldType.SELECT, required: true, options: ['PhD', 'M.Tech/M.E.', 'M.Sc.', 'Integrated PhD', 'Post Doctorate', 'Masters', 'Other'] },
      { id: 'eligibility_qualification', name: 'eligibility_qualification', label: 'Eligibility - Academic Qualification', type: FieldType.SELECT, required: true, options: ['First Class', 'Above 60%', 'Above 70%', 'Above 80%', 'GATE/NET Qualified', 'Any Percentage', 'Other'] },
      { id: 'eligibility_age', name: 'eligibility_age', label: 'Eligibility - Age Limit', type: FieldType.SELECT, required: false, options: ['Below 25 years', 'Below 28 years', 'Below 30 years', 'Below 35 years', 'No age limit', 'Other'] },
      { id: 'fellowship_duration', name: 'fellowship_duration', label: 'Duration', type: FieldType.SELECT, required: false, options: ['1 Year', '2 Years', '3 Years', '4 Years', '5 Years', 'Till PhD completion', 'Other'] },
      { id: 'stipend', name: 'stipend', label: 'Stipend/Financial Support', type: FieldType.SELECT, required: false, options: ['₹25K-30K/month', '₹31K-35K/month', '₹35K-40K/month', 'Above ₹40K/month', 'As per norms', 'Other'] },
      { id: 'doc_proposal', name: 'doc_proposal', label: 'Research Proposal', type: FieldType.TEXT, required: false },
      { id: 'doc_transcripts', name: 'doc_transcripts', label: 'Academic Transcripts', type: FieldType.TEXT, required: false },
      { id: 'doc_other', name: 'doc_other', label: 'Other Documents', type: FieldType.TEXT, required: false },
      { id: 'attachment', name: 'attachment', label: 'Attach Document (PDF)', type: FieldType.FILE, required: true, acceptedFileTypes: ['.pdf'] },
      { id: 'last_date', name: 'last_date', label: 'Last Date of Application', type: FieldType.DATE, required: true },
      { id: 'links', name: 'links', label: 'Link(s)', type: FieldType.TEXT, required: false },
      { id: 'note', name: 'note', label: 'Note', type: FieldType.TEXTAREA, required: false }
    ]
  },
  {
    id: 'cat-student-training',
    name: 'B.3 Training Opportunity',
    type: CallType.STUDENT,
    description: 'Training programs, workshops, and skill development opportunities for students.',
    fields: [
      { id: 'organization', name: 'organization', label: 'Organizing Institution/Company', type: FieldType.TEXT, required: true },
      { id: 'training_type', name: 'training_type', label: 'Training Type', type: FieldType.SELECT, required: true, options: ['Workshop', 'Bootcamp', 'Certification Program', 'Skill Development', 'Online Course', 'Other'] },
      { id: 'about', name: 'about', label: 'About', type: FieldType.TEXTAREA, required: true },
      { id: 'areas', name: 'areas', label: 'Area(s)/Topics Covered', type: FieldType.SELECT, required: true, options: ['Healthcare', 'Medical Device', 'Diagnostic System', 'Other'] },
      { id: 'eligibility_program', name: 'eligibility_program', label: 'Eligibility - Program/Background', type: FieldType.SELECT, required: true, options: ['Engineering Students', 'Science Students', 'Commerce Students', 'Arts Students', 'Any Stream', 'Professionals', 'Other'] },
      { id: 'eligibility_prerequisites', name: 'eligibility_prerequisites', label: 'Eligibility - Prerequisites/Skills', type: FieldType.TEXTAREA, required: false },
      { id: 'duration', name: 'duration', label: 'Duration', type: FieldType.SELECT, required: true, options: ['1 Day', '2-3 Days', '1 Week', '2 Weeks', '1 Month', '2-3 Months', 'Other'] },
      { id: 'mode', name: 'mode', label: 'Mode (Online/Offline/Hybrid)', type: FieldType.SELECT, required: false, options: ['Online', 'Offline', 'Hybrid'] },
      { id: 'location', name: 'location', label: 'Location (if applicable)', type: FieldType.TEXT, required: false },
      { id: 'fee', name: 'fee', label: 'Fee/Cost', type: FieldType.SELECT, required: false, options: ['Free', 'Up to ₹500', '₹500-₹1000', '₹1000-₹5000', 'Above ₹5000', 'Other'] },
      { id: 'certification', name: 'certification', label: 'Certification Details', type: FieldType.TEXT, required: false },
      { id: 'attachment', name: 'attachment', label: 'Attach Document (PDF)', type: FieldType.FILE, required: true, acceptedFileTypes: ['.pdf'] },
      { id: 'last_date', name: 'last_date', label: 'Last Date of Registration', type: FieldType.DATE, required: true },
      { id: 'links', name: 'links', label: 'Link(s)', type: FieldType.TEXT, required: true },
      { id: 'note', name: 'note', label: 'Note', type: FieldType.TEXTAREA, required: false }
    ]
  }
];

export const INITIAL_CALLS: CallAnnouncement[] = [
  {
    id: 'call-001',
    categoryId: 'cat-research-grant',
    title: 'SERB Core Research Grant - Advanced Materials',
    createdAt: new Date().toISOString(),
    status: 'Published',
    data: {
      funding_agency: 'Science and Engineering Research Board (SERB)',
      about: 'Support for fundamental research in advanced materials and nanotechnology',
      areas: 'Healthcare',
      pi_qualification: 'PhD with at least 3 years of research experience',
      pi_age: 'Below 45 years',
      last_date: '2025-03-15',
      links: 'https://serb.gov.in',
      note: 'Rolling call - applications accepted throughout the year'
    }
  },
  {
    id: 'call-002',
    categoryId: 'cat-event-grant',
    title: 'ICSSR Conference Support - Social Sciences',
    createdAt: new Date().toISOString(),
    status: 'Published',
    data: {
      funding_agency: 'Indian Council of Social Science Research (ICSSR)',
      event_type: 'Conference',
      about: 'Financial support for organizing national/international conferences in social sciences',
      areas: 'Medical Device',
      organizer_eligibility: 'Faculty members from recognized universities/institutions',
      funding_amount: 'Up to ₹5,00,000 for national, ₹10,00,000 for international',
      last_date: '2025-02-28',
      note: 'Apply at least 6 months before the proposed event date'
    }
  },
  {
    id: 'call-003',
    categoryId: 'cat-student-internship',
    title: 'Summer Research Internship - IISER Pune',
    createdAt: new Date().toISOString(),
    status: 'Published',
    data: {
      organization: 'Indian Institute of Science Education and Research, Pune',
      about: 'Summer research internship program for undergraduate students in science',
      areas: 'Diagnostic System',
      eligibility_program: 'B.Sc./B.Tech./Integrated M.Sc. students',
      eligibility_year: '2nd or 3rd year',
      duration: '8 weeks (May-July 2025)',
      stipend: '₹10,000 per month + accommodation',
      last_date: '2025-01-31',
      links: 'https://iiserpune.ac.in/summer-internship'
    }
  }
];
