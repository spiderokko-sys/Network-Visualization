import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import BusinessLayout from './layouts/BusinessLayout';

// Pages
import { ChatsModule } from './pages/ChatsPage';
import { ChannelsModule } from './pages/ChannelsPage';
import { NetworkCircles } from './pages/CirclesPage';
import { IntentsPage } from './pages/IntentsPage';
import { CallsModule } from './pages/CallsPage';
import { WalletScreen } from './pages/WalletPage';
import { EventsScreen } from './pages/EventsPage';
import { ContactsScreen } from './pages/ContactsPage';
import { ProfileScreen } from './pages/ProfilePage';
import { SettingsScreen } from './pages/SettingsPage';

// Calls Pages
import { NewMeetingPage } from './pages/calls/NewMeetingPage';
import { JoinMeetingPage } from './pages/calls/JoinMeetingPage';
import { ManageFavoritesPage } from './pages/calls/ManageFavoritesPage';

// Business Pages
import { BusinessOverviewPage } from './pages/business/BusinessOverviewPage';
import { BusinessIntentsPage } from './pages/business/BusinessIntentsPage';
import { IntentDetailsPage } from './pages/business/IntentDetailsPage';
import { BusinessCalendarPage } from './pages/business/BusinessCalendarPage';
import { EventDetailsPage } from './pages/business/EventDetailsPage';
import { BusinessContactsPage } from './pages/business/BusinessContactsPage';
import { BusinessCirclesPage } from './pages/business/BusinessCirclesPage';
import { BusinessMarketingPage } from './pages/business/BusinessMarketingPage';

// Data
import { MOCK_CUSTOMERS } from './data/mockData';

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<MainLayout />}>
					<Route index element={<Navigate to="/business" replace />} />

					{/* Business Section with Nested Routes */}
					<Route path="business" element={<BusinessLayout />}>
						<Route index element={<BusinessOverviewPage />} />
						<Route path="intents" element={<BusinessIntentsPage />} />
						<Route path="intents/:intentId" element={<IntentDetailsPage />} />
						<Route path="calendar" element={<BusinessCalendarPage />} />
						<Route path="calendar/:eventId" element={<EventDetailsPage />} />
						<Route path="contacts" element={<BusinessContactsPage />} />
						<Route path="circles" element={<BusinessCirclesPage />} />
						<Route path="marketing" element={<BusinessMarketingPage />} />
					</Route>

					{/* Other Routes */}
					<Route path="chats" element={<ChatsModule />} />
					<Route path="channels" element={<ChannelsModule />} />
					<Route path="circles" element={<NetworkCircles />} />
					<Route path="intents" element={<IntentsPage />} />

					{/* Calls Section with Nested Routes */}
					<Route path="calls">
						<Route index element={<CallsModule customers={MOCK_CUSTOMERS} />} />
						<Route path="new-meeting" element={<NewMeetingPage />} />
						<Route path="join" element={<JoinMeetingPage />} />
						<Route path="favorites" element={<ManageFavoritesPage />} />
					</Route>

					<Route path="wallet" element={<WalletScreen />} />
					<Route path="events" element={<EventsScreen />} />
					<Route path="contacts" element={<ContactsScreen contacts={MOCK_CUSTOMERS} />} />
					<Route path="profile" element={<ProfileScreen />} />
					<Route path="settings" element={<SettingsScreen />} />
					<Route path="*" element={<Navigate to="/business" replace />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}