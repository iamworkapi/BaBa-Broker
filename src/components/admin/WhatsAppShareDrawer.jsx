import React from 'react';

export default function WhatsAppShareDrawer({
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
  contacts,
  executeWhatsAppShare,
}) {
  if (!shareTargetProject) return null;

  const handleSelectContactForShare = (contactId) => {
    setSelectedContactId(contactId);
    if (!contactId) return;
    const found = contacts.find((c) => c._id === contactId);
    if (found) {
      setShareClientName(found.name || '');
      setShareClientPhone(found.phone || '');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/80 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl p-5 text-slate-100 font-normal">
        <button
          onClick={() => setShareTargetProject(null)}
          className="absolute right-3.5 top-3.5 grid h-8 w-8 place-items-center rounded-full bg-slate-800 text-slate-400 hover:bg-orange-500 hover:text-white transition-all"
        >
          <i className="fa-solid fa-xmark text-sm"></i>
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <i className="fa-brands fa-whatsapp text-xl"></i>
          </div>
          <div>
            <h3 className="text-base font-medium text-white">Share Project via WhatsApp</h3>
            <p className="text-xs text-slate-400 font-normal">Send personalized proposal to an individual client</p>
          </div>
        </div>

        {/* Target Project Summary */}
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 mb-4">
          <span className="text-[10px] font-medium uppercase tracking-wider text-orange-400 flex items-center gap-1">
            <i className="fa-solid fa-building text-[10px]"></i> Selected Project
          </span>
          <h4 className="font-medium text-white text-xs mt-0.5">{shareTargetProject.title}</h4>
          <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5 font-normal">
            <i className="fa-solid fa-location-dot text-orange-500 text-[10px]"></i> {shareTargetProject.location}
          </p>
        </div>

        <div className="space-y-3 font-normal">
          {/* Select Saved Contact */}
          <label className="block text-xs font-medium text-slate-300">
            Choose Saved Contact (Optional)
            <select
              value={selectedContactId}
              onChange={(e) => handleSelectContactForShare(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white outline-none font-normal"
            >
              <option value="">-- Choose from saved leads --</option>
              {contacts.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name} ({c.phone})
                </option>
              ))}
            </select>
          </label>

          {/* Client Name & WhatsApp Phone */}
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-xs font-medium text-slate-300">
              Client Name
              <input
                value={shareClientName}
                onChange={(e) => setShareClientName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white outline-none focus:border-emerald-500 font-normal"
              />
            </label>

            <label className="block text-xs font-medium text-slate-300">
              WhatsApp Number *
              <input
                required
                value={shareClientPhone}
                onChange={(e) => setShareClientPhone(e.target.value)}
                placeholder="e.g. 9876543210"
                className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white outline-none focus:border-emerald-500 font-normal"
              />
            </label>
          </div>

          {/* Custom Personal Note */}
          <label className="block text-xs font-medium text-slate-300">
            Add Custom Personal Note (Optional)
            <textarea
              value={shareCustomNote}
              onChange={(e) => setShareCustomNote(e.target.value)}
              placeholder="e.g. Hi Rahul, based on our conversation about 3BHK investment..."
              rows="2.5"
              className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white outline-none focus:border-emerald-500 font-normal"
            />
          </label>

          {/* Submit Share */}
          <button
            onClick={executeWhatsAppShare}
            className="w-full rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 py-3 text-xs font-medium uppercase tracking-wider text-white shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 hover:from-emerald-500 hover:to-emerald-400 transition-all cursor-pointer"
          >
            <i className="fa-brands fa-whatsapp text-base"></i>
            Send Proposal to Client on WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
