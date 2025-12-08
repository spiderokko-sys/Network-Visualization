
export const MOCK_CUSTOMERS = [
    {
        id: 1,
        name: 'Alice M.',
        status: 'L1',
        tags: ['Regular', 'Coffee'],
        visits: 12,
        last_seen: '2h ago',
        memberSince: 'Oct 2023',
        isFavorite: true,
        emails: [{ id: 'e1', value: 'alice.m@gigmind.net', isPrimary: true }],
        phones: [{ id: 'p1', value: '416-555-0192', isPrimary: true }, { id: 'p2', value: '647-555-0000', isPrimary: false }],
        history: [
            { id: 101, date: 'Nov 20, 2025', service: 'Catering Consult', notes: 'Booked for office party. Loves pastries.' },
            { id: 102, date: 'Oct 15, 2025', service: 'Coffee Order', notes: 'Large takeaway. Mentioned she works at the tech hub.' }
        ],
        upcoming: [],
        finance: [
            { id: 'f1', type: 'payment', amount: 45.50, date: 'Nov 20, 2025', status: 'completed', description: 'Catering Deposit' },
            { id: 'f2', type: 'invoice', amount: 120.00, date: 'Nov 18, 2025', status: 'pending', description: 'Office Lunch Event' }
        ],
        notes: [
            { id: 1, text: 'Alice prefers oat milk. Birthday is in Dec.', date: 'Nov 10, 2025', attachment: null }
        ],
        documents: [
            { id: 1, name: 'Catering_Contract_v1.pdf', date: 'Nov 20, 2025', size: '2.4MB' }
        ],
        reminders: [
            { id: 1, text: 'Call to confirm headcount', date: 'Nov 25, 2025', done: false }
        ]
    },
    {
        id: 2,
        name: 'Bob D.',
        status: 'L1',
        tags: ['Big Spender'],
        visits: 5,
        last_seen: '1d ago',
        memberSince: 'Jan 2024',
        isFavorite: false,
        emails: [{ id: 'e1', value: 'bob.builder@gigmind.net', isPrimary: true }],
        phones: [{ id: 'p1', value: '647-555-9921', isPrimary: true }],
        history: [
            { id: 201, date: 'Nov 18, 2025', service: 'Private Event', notes: 'Birthday booking. Very particular about seating.' }
        ],
        upcoming: [
            { id: 202, date: 'Nov 28, 2025', time: '10:00 AM', service: 'Follow-up' }
        ],
        finance: [],
        notes: [],
        documents: [],
        reminders: []
    },
    { id: 3, name: 'Charlie', status: 'L1', tags: [], visits: 1, last_seen: 'Just now', memberSince: 'Nov 2025', isFavorite: false, emails: [{ id: 'e1', value: 'charlie@gigmind.net', isPrimary: true }], phones: [], history: [], upcoming: [], finance: [], notes: [], documents: [], reminders: [] },
    { id: 4, name: 'Sarah J.', status: 'L1', tags: ['Vegan'], visits: 8, last_seen: '3d ago', memberSince: 'Mar 2024', isFavorite: true, emails: [{ id: 'e1', value: 'sarah.j@gigmind.net', isPrimary: true }], phones: [{ id: 'p1', value: '416-555-3322', isPrimary: true }], history: [], upcoming: [], finance: [], notes: [], documents: [], reminders: [] },
    { id: 5, name: 'Davina K.', status: 'L1', tags: ['Student'], visits: 22, last_seen: '4h ago', memberSince: 'Sep 2023', isFavorite: false, emails: [{ id: 'e1', value: 'davina@gigmind.net', isPrimary: true }], phones: [], history: [], upcoming: [], finance: [], notes: [], documents: [], reminders: [] },
];
