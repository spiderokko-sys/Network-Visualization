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
import { ViewAllIntentsPage } from './pages/ViewAllIntentsPage';

// Calls Pages
import { NewMeetingPage } from './pages/calls/NewMeetingPage';
import { JoinMeetingPage } from './pages/calls/JoinMeetingPage';
import { ManageFavoritesPage } from './pages/calls/ManageFavoritesPage';

// Business Pages
import { BusinessOverviewPage } from './pages/business/BusinessOverviewPage';
import { BusinessIntentsPage } from './pages/business/BusinessIntentsPage';
import { IntentDetailsPage } from './pages/business/IntentDetailsPage';
import { CreateIntentPage } from './pages/business/CreateIntentPage';
import { ModifyIntentPage } from './pages/business/ModifyIntentPage';
import { BusinessCalendarPage } from './pages/business/BusinessCalendarPage';
import { EventDetailsPage } from './pages/business/EventDetailsPage';
import { BusinessContactsPage } from './pages/business/BusinessContactsPage';
import { ContactDetailsPage } from './pages/business/ContactDetailsPage';
import { CreateContactPage } from './pages/business/CreateContactPage';
import { EditContactPage } from './pages/business/EditContactPage';
import { BusinessCirclesPage } from './pages/business/BusinessCirclesPage';
import { CircleDetailsPage } from './pages/business/CircleDetailsPage';
import { BusinessMarketingPage } from './pages/business/BusinessMarketingPage';
import { BusinessSettingsPage } from './pages/business/BusinessSettingsPage';

// Business Settings Pages
import { GeneralSettingsPage as BusinessGeneralSettingsPage } from './pages/business/settings/GeneralSettingsPage';
import { LocationsSettingsPage } from './pages/business/settings/LocationsSettingsPage';
import { BrandingSettingsPage } from './pages/business/settings/BrandingSettingsPage';
import { NotificationsSettingsPage as BusinessNotificationsSettingsPage } from './pages/business/settings/NotificationsSettingsPage';
import { SecuritySettingsPage } from './pages/business/settings/SecuritySettingsPage';

// Data
import { MOCK_CUSTOMERS } from './data/mockData';

// Settings Pages
import { GeneralSettingsPage } from './pages/settings/GeneralSettingsPage';
import { NotificationsSettingsPage } from './pages/settings/NotificationsSettingsPage';
import { PrivacySettingsPage } from './pages/settings/PrivacySettingsPage';
import { AppearanceSettingsPage } from './pages/settings/AppearanceSettingsPage';

import { useTranslation } from 'react-i18next';

export default function App() {
	const { t, i18n } = useTranslation();
	console.log('Current language:', i18n.language);
	console.log('Welcome message:', t('welcome'));

	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<MainLayout />}>
					<Route index element={<Navigate to="/business" replace />} />

					{/* Business Section with Nested Routes */}
					<Route path="business" element={<BusinessLayout />}>
						<Route index element={<BusinessOverviewPage />} />
						<Route path="intents" element={<BusinessIntentsPage />} />
						<Route path="intents/new" element={<CreateIntentPage />} />
						<Route path="intents/:intentId" element={<IntentDetailsPage />} />
						<Route path="intents/:intentId/edit" element={<ModifyIntentPage />} />
						<Route path="calendar" element={<BusinessCalendarPage />} />
						<Route path="calendar/:eventId" element={<EventDetailsPage />} />
						<Route path="contacts" element={<BusinessContactsPage />} />
						<Route path="contacts/:contactId" element={<ContactDetailsPage />} />
						<Route path="contacts/new" element={<CreateContactPage />} />
						<Route path="contacts/:contactId/edit" element={<EditContactPage />} />
						<Route path="circles" element={<BusinessCirclesPage />} />
						<Route path="circles/:circleId" element={<CircleDetailsPage />} />
						<Route path="marketing" element={<BusinessMarketingPage />} />
						<Route path="settings">
							<Route index element={<BusinessSettingsPage />} />
							<Route path="general" element={<BusinessGeneralSettingsPage />} />
							<Route path="locations" element={<LocationsSettingsPage />} />
							<Route path="branding" element={<BrandingSettingsPage />} />
							<Route path="notifications" element={<BusinessNotificationsSettingsPage />} />
							<Route path="security" element={<SecuritySettingsPage />} />
						</Route>
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
					<Route path="profile/intents" element={<ViewAllIntentsPage />} />

					<Route path="settings" element={<SettingsScreen />}>
						<Route index element={<Navigate to="general" replace />} />
						<Route path="general" element={<GeneralSettingsPage />} />
						<Route path="notifications" element={<NotificationsSettingsPage />} />
						<Route path="privacy" element={<PrivacySettingsPage />} />
						<Route path="appearance" element={<AppearanceSettingsPage />} />
					</Route>

					<Route path="*" element={<Navigate to="/business" replace />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}
