import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { BottomNav, FloatingActionButton, Header, Toast } from '../components';
import { SearchPage } from '../components/SearchPage';
import { useStore } from '../store';
import { DashboardPage, ObjectsPage, CalendarPage, FinancesPage, SettingsPage, WarehousePage } from '../features';
import { ObjectFormPage } from '../features/objects/ObjectFormPage';
import { TransactionFormPage } from '../features/finances/TransactionFormPage';
import { EventFormPage } from '../features/calendar/EventFormPage';
import { MaterialFormPage } from '../features/warehouse/MaterialFormPage';
import { TelegramSettingsPage, WarehouseSettingsPage, ProfileSettingsPage, ServiceCatalogPage, MaterialCatalogPage, FinanceCategoriesPage, EventTypesPage, ExportDataPage, BackupPage, DangerZonePage } from '../features/settings';
import { ObjectDetailModal } from '../features/objects/ObjectDetailModal';

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export function MainLayout() {
  const { activeTab, setIsFabOpen, setActiveTab, setIsModalOpen, selectedObjectId, setSelectedObjectId, formPage, setFormPage } = useStore();
  const [showSearch, setShowSearch] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '' });

  const showObjectDetail = selectedObjectId !== null;

  useEffect(() => {
    const anyOverlayOpen = showSearch || formPage !== null || showObjectDetail;
    setIsModalOpen(anyOverlayOpen);
  }, [showSearch, formPage, showObjectDetail, setIsModalOpen]);

  const showToast = (message: string) => setToast({ visible: true, message });
  const hideToast = () => setToast({ visible: false, message: '' });

  const handleFabAction = (action: string) => {
    setIsFabOpen(false);
    switch (action) {
      case 'object':
        setFormPage({ type: 'addObject' });
        break;
      case 'event':
        setFormPage({ type: 'addEvent' });
        break;
      case 'transaction':
        setFormPage({ type: 'addTransaction' });
        break;
    }
  };

  const handleTransactionSaved = () => {
    showToast('Транзакция сохранена');
    setActiveTab('finances');
  };

  const handleEventSaved = () => {
    showToast('Событие создано');
    setActiveTab('calendar');
  };

  const handleObjectSaved = () => {
    showToast('Объект создан');
    setActiveTab('objects');
  };

  const handleMaterialSaved = () => {
    showToast('Материал сохранён');
    setActiveTab('warehouse');
  };

  const renderPage = () => {
    switch (activeTab) {
      case 'home': return <DashboardPage />;
      case 'objects': return <ObjectsPage />;
      case 'calendar': return <CalendarPage />;
      case 'finances': return <FinancesPage />;
      case 'warehouse': return <WarehousePage />;
      case 'settings': return <SettingsPage />;
      default: return <DashboardPage />;
    }
  };

  const PAGE_TITLES: Record<string, string> = {
    home: 'Главная',
    objects: 'Объекты',
    calendar: 'Календарь',
    finances: 'Финансы',
    warehouse: 'Склад',
    settings: 'Настройки',
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        pageTitle={PAGE_TITLES[activeTab]}
        onSearchClick={() => setShowSearch(true)}
      />
      <main className="pt-2 pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2 }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>
      <FloatingActionButton onAction={handleFabAction} />
      <BottomNav />

      <Toast message={toast.message} isVisible={toast.visible} onClose={hideToast} />

      <SearchPage isOpen={showSearch} onClose={() => setShowSearch(false)} />

      {showObjectDetail && (
        <ObjectDetailModal
          isOpen={showObjectDetail}
          onClose={() => setSelectedObjectId(null)}
          object={useStore.getState().objects.find(o => o.id === selectedObjectId) || null}
        />
      )}

      <AnimatePresence>
        {formPage && (
          <>
            {formPage.type === 'addObject' && (
              <ObjectFormPage key="addObject" onBack={() => setFormPage(null)} onSaved={handleObjectSaved} />
            )}
            {formPage.type === 'editObject' && (
              <ObjectFormPage key="editObject" editObject={formPage.object} onBack={() => setFormPage(null)} onSaved={() => showToast('Объект обновлён')} />
            )}
            {formPage.type === 'addTransaction' && (
              <TransactionFormPage key="addTransaction" defaultType={formPage.defaultType} onBack={() => setFormPage(null)} onSaved={handleTransactionSaved} />
            )}
            {formPage.type === 'editTransaction' && (
              <TransactionFormPage key="editTransaction" editTransaction={formPage.transaction} onBack={() => setFormPage(null)} onSaved={() => showToast('Транзакция обновлена')} />
            )}
            {formPage.type === 'addEvent' && (
              <EventFormPage key="addEvent" selectedDate={formPage.selectedDate} preselectedObjectId={formPage.preselectedObjectId} onBack={() => setFormPage(null)} onSaved={handleEventSaved} />
            )}
            {formPage.type === 'editEvent' && (
              <EventFormPage key="editEvent" editEvent={formPage.event} onBack={() => setFormPage(null)} onSaved={() => showToast('Событие обновлено')} />
            )}
            {formPage.type === 'addMaterial' && (
              <MaterialFormPage key="addMaterial" onBack={() => setFormPage(null)} onSaved={handleMaterialSaved} />
            )}
            {formPage.type === 'editMaterial' && (
              <MaterialFormPage key="editMaterial" editMaterial={formPage.material} onBack={() => setFormPage(null)} onSaved={() => showToast('Материал обновлён')} />
            )}
            {formPage.type === 'telegram' && (
              <TelegramSettingsPage key="telegram" onBack={() => setFormPage(null)} />
            )}
            {formPage.type === 'warehouse' && (
              <WarehouseSettingsPage key="warehouse" onBack={() => setFormPage(null)} />
            )}
            {formPage.type === 'profile' && (
              <ProfileSettingsPage key="profile" onBack={() => setFormPage(null)} onSaved={() => showToast('Профиль сохранён')} />
            )}
            {formPage.type === 'serviceCatalog' && (
              <ServiceCatalogPage key="serviceCatalog" onBack={() => setFormPage(null)} onShowToast={showToast} />
            )}
            {formPage.type === 'materialCatalog' && (
              <MaterialCatalogPage key="materialCatalog" onBack={() => setFormPage(null)} onShowToast={showToast} />
            )}
            {formPage.type === 'financeCategories' && (
              <FinanceCategoriesPage key="financeCategories" onBack={() => setFormPage(null)} onShowToast={showToast} />
            )}
            {formPage.type === 'eventTypes' && (
              <EventTypesPage key="eventTypes" onBack={() => setFormPage(null)} onShowToast={showToast} />
            )}
            {formPage.type === 'export' && (
              <ExportDataPage key="export" onBack={() => setFormPage(null)} onShowToast={showToast} />
            )}
            {formPage.type === 'backup' && (
              <BackupPage key="backup" onBack={() => setFormPage(null)} onShowToast={showToast} />
            )}
            {formPage.type === 'danger' && (
              <DangerZonePage key="danger" onBack={() => setFormPage(null)} onShowToast={showToast} />
            )}
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
