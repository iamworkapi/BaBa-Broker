import React from 'react';
import { useAdminDashboard, emptyProperty } from '../hooks/useAdminDashboard';
import AdminHeader from '../components/admin/AdminHeader';
import AdminSidebar from '../components/admin/AdminSidebar';
import StaffManagementView from '../components/admin/StaffManagementView';
import FlatListingsAuditView from '../components/admin/FlatListingsAuditView';
import InvestmentRequestsView from '../components/admin/InvestmentRequestsView';
import WhatsAppShareDrawer from '../components/admin/WhatsAppShareDrawer';
import ProjectWorkspaceModal from '../components/admin/ProjectWorkspaceModal';
import AdminOverview from '../components/admin/AdminOverview';

export default function AdminDashboard({ view: routeView }) {
  const dash = useAdminDashboard(routeView);

  const {
    view,
    auth,
    contacts,
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    filterType,
    setFilterType,
    showProjectModal,
    setShowProjectModal,
    activeFormTab,
    setActiveFormTab,
    propertyForm,
    setPropertyForm,
    editingId,
    setEditingId,
    newInvestorName,
    setNewInvestorName,
    newInvestorShare,
    setNewInvestorShare,
    newInvestorAmount,
    setNewInvestorAmount,
    newInvestorDate,
    setNewInvestorDate,
    isSaving,
    savingProgress,
    shareTargetProject,
    setShareTargetProject,
    shareClientName,
    setShareClientName,
    shareClientPhone,
    setShareClientPhone,
    shareCustomNote,
    setShareCustomNote,
    selectedContactId,
    setSelectedContactId,
    toast,
    setToast,
    triggerToast,
    loading,
    closeModal,
    openCreateFeaturedModal,
    openCreateProjectModal,
    changeProperty,
    handleCoverImageChange,
    handleGalleryPhotosChange,
    handleVideoFileChange,
    addInvestor,
    removeInvestor,
    saveProperty,
    startEdit,
    deleteProperty,
    toggleFeaturedStatus,
    openWhatsAppShare,
    executeWhatsAppShare,
    filteredProperties,
    metrics,
    formatINR,
  } = dash;

  const isContacts = view === 'contacts' || view === 'add-investor';

  return (
    <div className="h-screen w-screen bg-[#070e1c] p-2 sm:p-3.5 md:p-4 font-['Inter',sans-serif] text-slate-800 antialiased flex flex-col justify-center overflow-hidden">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-3 rounded-2xl border ${
            toast.type === 'error'
              ? 'border-red-200 bg-white text-red-700 shadow-xl shadow-red-500/10'
              : toast.type === 'warning'
              ? 'border-amber-200 bg-white text-amber-800 shadow-xl shadow-amber-500/10'
              : 'border-emerald-200 bg-white text-emerald-800 shadow-xl shadow-emerald-500/10'
          } p-4 max-w-md w-[calc(100vw-2rem)] sm:w-auto transition-all`}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600 text-lg">
            {toast.type === 'error' ? '⚠️' : toast.type === 'warning' ? '🔔' : '✨'}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium">
              {toast.title || (toast.type === 'error' ? 'Validation Notice' : toast.type === 'warning' ? 'Attention' : 'Success')}
            </h4>
            <p className="text-xs text-slate-500 mt-0.5 font-normal">
              {toast.message}
            </p>
          </div>
          <button
            onClick={() => setToast(null)}
            className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
          >
            <i className="ri-close-line text-lg"></i>
          </button>
        </div>
      )}

      {/* Master Curved Card Container (Fixed Viewport with Rounded Border Radius Frame) */}
      <div className="w-full h-full rounded-[28px] sm:rounded-[36px] md:rounded-[40px] shadow-2xl shadow-slate-950/70 overflow-hidden bg-white flex flex-col lg:flex-row border border-slate-800/30">
        {/* Left Solid Orange Sidebar with Signature Curved Active Tab */}
        <AdminSidebar view={view} />

        {/* Right Canvas Column (Header, Scrollable Main, and Fixed Bottom Footer) */}
        <div className="flex-1 h-full flex flex-col min-w-0 overflow-hidden bg-white">
          {/* Top Sticky Navigation Bar Header */}
          <AdminHeader auth={auth} />

          {/* Scrollable Main Dashboard Workspace */}
          <main className="flex-1 p-5 sm:p-7 lg:p-9 space-y-7 overflow-y-auto bg-white">
            {view === 'staff' ? (
              <StaffManagementView />
            ) : view === 'flats' ? (
              <FlatListingsAuditView />
            ) : view === 'investment-requests' ? (
              <InvestmentRequestsView />
            ) : showProjectModal ? (
              <ProjectWorkspaceModal
                view={view}
                editingId={editingId}
                closeModal={closeModal}
                saveProperty={saveProperty}
                activeFormTab={activeFormTab}
                setActiveFormTab={setActiveFormTab}
                propertyForm={propertyForm}
                setPropertyForm={setPropertyForm}
                changeProperty={changeProperty}
                handleCoverImageChange={handleCoverImageChange}
                handleGalleryPhotosChange={handleGalleryPhotosChange}
                handleVideoFileChange={handleVideoFileChange}
                triggerToast={triggerToast}
                newInvestorName={newInvestorName}
                setNewInvestorName={setNewInvestorName}
                newInvestorShare={newInvestorShare}
                setNewInvestorShare={setNewInvestorShare}
                newInvestorAmount={newInvestorAmount}
                setNewInvestorAmount={setNewInvestorAmount}
                newInvestorDate={newInvestorDate}
                setNewInvestorDate={setNewInvestorDate}
                addInvestor={addInvestor}
                removeInvestor={removeInvestor}
                formatINR={formatINR}
                setShowProjectModal={setShowProjectModal}
              />
            ) : (
              <AdminOverview
                isContacts={isContacts}
                view={view}
                metrics={metrics}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
                filterType={filterType}
                setFilterType={setFilterType}
                loading={loading}
                filteredProperties={filteredProperties}
                startEdit={startEdit}
                deleteProperty={deleteProperty}
                toggleFeaturedStatus={toggleFeaturedStatus}
                openWhatsAppShare={openWhatsAppShare}
                openCreateFeaturedModal={openCreateFeaturedModal}
                openCreateProjectModal={openCreateProjectModal}
                setShowProjectModal={setShowProjectModal}
                setActiveFormTab={setActiveFormTab}
                setEditingId={setEditingId}
                setPropertyForm={setPropertyForm}
                emptyProperty={emptyProperty}
                formatINR={formatINR}
              />
            )}
          </main>

          {/* Fixed Bottom Footer Inside Master Card */}
          <footer className="px-6 py-2.5 bg-white border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 shrink-0 select-none">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              <span>Baba Broker Executive Portal · v2.4</span>
            </div>
            <div className="flex items-center gap-4 text-slate-400">
              <span className="hidden sm:inline">Direct Support: <a href="mailto:support@bababroker.com" className="text-[#ea580c] hover:underline font-medium">support@bababroker.com</a></span>
              <span>© {new Date().getFullYear()} Baba Broker. All rights reserved.</span>
            </div>
          </footer>
        </div>
      </div>

      {/* Saving Progress Modal Overlay */}
      {isSaving && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/40 backdrop-blur-sm p-6 animate-fadeIn">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl space-y-4 text-center border border-slate-100">
            <div className="relative inline-flex items-center justify-center">
              <div className="h-16 w-16 rounded-full border-4 border-orange-100 border-t-[#ea580c] animate-spin"></div>
              <span className="absolute text-sm font-medium text-slate-700">{savingProgress}%</span>
            </div>
            <div>
              <h3 className="text-base font-medium text-slate-800">Publishing Project...</h3>
              <p className="text-xs text-slate-500 mt-1 font-normal">Syncing parameters and media assets</p>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-[#ea580c] transition-all duration-300 rounded-full"
                style={{ width: `${savingProgress}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp Share Drawer */}
      <WhatsAppShareDrawer
        shareTargetProject={shareTargetProject}
        setShareTargetProject={setShareTargetProject}
        shareClientName={shareClientName}
        setShareClientName={setShareClientName}
        shareClientPhone={shareClientPhone}
        setShareClientPhone={setShareClientPhone}
        shareCustomNote={shareCustomNote}
        setShareCustomNote={setShareCustomNote}
        selectedContactId={selectedContactId}
        setSelectedContactId={setSelectedContactId}
        contacts={contacts}
        executeWhatsAppShare={executeWhatsAppShare}
      />
    </div>
  );
}
