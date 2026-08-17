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
    <div className="relative min-h-screen bg-slate-950 text-slate-100 font-['Roboto',sans-serif] font-normal selection:bg-orange-500 selection:text-white text-xs leading-relaxed overflow-x-hidden">
      {/* Background Ambient Glow Accents */}
      <div className="pointer-events-none fixed -top-40 -left-40 h-96 w-96 rounded-full bg-orange-500/10 blur-[120px] z-0"></div>
      <div className="pointer-events-none fixed top-1/2 -right-40 h-96 w-96 rounded-full bg-amber-500/10 blur-[120px] z-0"></div>
      {/* Floating Animated Toast Notification Toaster */}
      {toast && (
        <div
          className={`fixed top-16 right-4 sm:right-6 z-50 flex items-center gap-3.5 rounded-2xl border ${
            toast.type === 'error'
              ? 'border-red-500/50 bg-slate-950/95 shadow-2xl shadow-red-500/25'
              : toast.type === 'warning'
              ? 'border-amber-500/50 bg-slate-950/95 shadow-2xl shadow-amber-500/25'
              : 'border-emerald-500/50 bg-slate-950/95 shadow-2xl shadow-emerald-500/25'
          } p-4 backdrop-blur-xl animate-bounce max-w-md w-[calc(100vw-2rem)] sm:w-auto`}
        >
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl font-bold shadow-lg ${
              toast.type === 'error'
                ? 'bg-gradient-to-tr from-red-600 to-amber-500 text-white'
                : toast.type === 'warning'
                ? 'bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950'
                : 'bg-gradient-to-tr from-amber-400 to-emerald-400 text-slate-950'
            }`}
          >
            {toast.type === 'error' ? '⚠️' : toast.type === 'warning' ? '🔔' : '✨'}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5 uppercase tracking-wider">
              {toast.title || (toast.type === 'error' ? 'Validation Error' : toast.type === 'warning' ? 'Attention' : 'Success')}
            </h4>
            <p className="text-xs text-slate-200 font-normal mt-0.5 leading-snug">
              {toast.message}
            </p>
          </div>
          <button
            onClick={() => setToast(null)}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors shrink-0 cursor-pointer"
          >
            <i className="ri-close-line text-lg"></i>
          </button>
        </div>
      )}

      {/* Top Navbar Header */}
      <AdminHeader auth={auth} />

      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-55px)]">
        {/* Compact Admin Navigation Sidebar */}
        <AdminSidebar view={view} />

        {/* Main Content Area */}
        <main className="flex-1 p-4 lg:p-6 space-y-5">
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
      </div>

      {/* Saving Progress Modal Overlay */}
      {isSaving && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/85 backdrop-blur-md p-6 animate-fadeIn">
          <div className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4 text-center">
            <div className="relative inline-flex items-center justify-center">
              <div className="h-16 w-16 rounded-full border-4 border-slate-800 border-t-orange-500 animate-spin"></div>
              <span className="absolute text-xs font-semibold text-white">{savingProgress}%</span>
            </div>
            <div>
              <h3 className="text-sm font-medium text-white">Publishing Investment Project...</h3>
              <p className="text-xs text-slate-400 mt-1">Uploading media assets & processing database parameters</p>
            </div>

            <div className="space-y-1 pt-2">
              <div className="flex justify-between text-[10px] text-slate-400 font-normal">
                <span>Publishing Status</span>
                <span className="text-orange-400 font-medium">{savingProgress}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-950 border border-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-300 rounded-full"
                  style={{ width: `${savingProgress}%` }}
                ></div>
              </div>
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
