import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';

const FOLLOW_UP_OPTIONS = [
  { id: 'contacted', label: 'Contacted' },
  { id: 'site_visit_scheduled', label: 'Site Visit Scheduled' },
  { id: 'negotiating', label: 'Negotiating' },
  { id: 'converted', label: 'Converted' },
  { id: 'lost', label: 'Lost' },
];

const FOLLOW_UP_LABELS = {
  unassigned: 'Not Yet Contacted',
  contacted: 'Contacted',
  site_visit_scheduled: 'Site Visit Scheduled',
  negotiating: 'Negotiating',
  converted: 'Converted',
  lost: 'Lost',
};

const FOLLOW_UP_STYLES = {
  unassigned: 'bg-slate-800 text-slate-400 border-slate-700',
  contacted: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  site_visit_scheduled: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
  negotiating: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  converted: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  lost: 'bg-red-500/15 text-red-400 border-red-500/30',
};

function LeadCard({ lead, onUpdate, updating }) {
  const [followUpStatus, setFollowUpStatus] = useState(
    lead.followUpStatus === 'unassigned' ? 'contacted' : lead.followUpStatus
  );
  const [note, setNote] = useState('');

  const submit = () => {
    onUpdate(lead._id, followUpStatus, note);
    setNote('');
  };

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/80 shadow-2xl p-5 space-y-4 backdrop-blur-xl hover:border-slate-700 transition-all">
      
      {/* Lead Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div className="min-w-0">
          <span className={`inline-block rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider border mb-1.5 ${FOLLOW_UP_STYLES[lead.followUpStatus] || FOLLOW_UP_STYLES.unassigned}`}>
            {FOLLOW_UP_LABELS[lead.followUpStatus] || 'Not Yet Contacted'}
          </span>
          <h3 className="text-sm font-black text-white truncate">{lead.propertyTitle}</h3>
          <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
            <i className="fa-solid fa-location-dot text-orange-400 text-xs shrink-0" />
            <span className="truncate">{lead.propertyLocation || 'Location not specified'}</span>
          </p>
        </div>
        <div className="text-right shrink-0 bg-slate-950 px-3 py-1.5 rounded-2xl border border-slate-800">
          <span className="block text-[9px] uppercase font-bold text-slate-500">Investment Target</span>
          <span className="text-sm font-black text-amber-400">₹{Number(lead.requestedAmount || 0).toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Investor Info Bar */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-3 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
        <div className="flex items-center gap-3">
          <span className="font-bold text-white flex items-center gap-1.5">
            <i className="fa-solid fa-user-tie text-blue-400 text-xs" /> {lead.investorName}
          </span>
          <span className="text-slate-400 font-mono flex items-center gap-1">
            <i className="fa-solid fa-phone text-emerald-400 text-[10px]" /> {lead.investorPhone}
          </span>
        </div>

        <a
          href={`https://wa.me/91${lead.investorPhone.replace(/\D/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl bg-emerald-500/10 hover:bg-emerald-500 hover:text-slate-950 border border-emerald-500/30 px-3 py-1 text-xs font-bold text-emerald-400 transition flex items-center gap-1.5 cursor-pointer"
        >
          <i className="fa-brands fa-whatsapp text-sm" /> WhatsApp Client
        </a>
      </div>

      {lead.message && (
        <p className="text-xs text-slate-400 italic border-l-2 border-orange-500/50 pl-3 py-1 leading-relaxed bg-slate-950/40 rounded-r-xl">
          "{lead.message}"
        </p>
      )}

      {/* Follow-up Controls */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3 space-y-2.5">
        <div className="flex items-center gap-2">
          <select
            value={followUpStatus}
            onChange={(e) => setFollowUpStatus(e.target.value)}
            className="flex-1 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-bold text-white outline-none focus:border-orange-500 cursor-pointer"
          >
            {FOLLOW_UP_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>{opt.label}</option>
            ))}
          </select>
          <button
            onClick={submit}
            disabled={updating}
            className="rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2 text-xs font-black uppercase tracking-wider text-slate-950 disabled:opacity-50 cursor-pointer shadow-md hover:brightness-110"
          >
            {updating ? 'Saving...' : 'Update Lead'}
          </button>
        </div>
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add follow-up notes (e.g. Site visit confirmed for Saturday)..."
          className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white placeholder:text-slate-600 outline-none focus:border-orange-500"
        />
      </div>
    </div>
  );
}

export default function AssignedLeadsPanel() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const load = async () => {
    try {
      const data = await api('/api/investment-requests/mine');
      setLeads(Array.isArray(data) ? data : []);
    } catch (err) {
      setStatus(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateLead = async (id, followUpStatus, note) => {
    setUpdatingId(id);
    try {
      const updated = await api(`/api/investment-requests/${id}/follow-up`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ followUpStatus, note }),
      });
      setLeads((list) => list.map((l) => (l._id === id ? updated : l)));
      setStatus('Lead updated successfully.');
    } catch (err) {
      setStatus(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const activeLeads = leads.filter((l) => !['converted', 'lost'].includes(l.followUpStatus));
  const closedLeads = leads.filter((l) => ['converted', 'lost'].includes(l.followUpStatus));

  return (
    <div className="space-y-6">
      {status && (
        <div className="rounded-2xl border border-orange-500/30 bg-orange-500/10 p-3.5 text-xs font-semibold text-orange-200 flex items-center justify-between shadow-sm">
          <span className="flex items-center gap-2"><i className="fa-solid fa-circle-info text-orange-400 text-xs" /> {status}</span>
          <button onClick={() => setStatus('')} className="text-slate-400 hover:text-white cursor-pointer"><i className="fa-solid fa-xmark text-xs" /></button>
        </div>
      )}

      {loading ? (
        <div className="py-24 text-center text-slate-400 space-y-3">
          <i className="fa-solid fa-circle-notch fa-spin text-3xl text-orange-500 block" />
          <p className="text-xs font-bold">Loading assigned investment leads...</p>
        </div>
      ) : leads.length === 0 ? (
        <div className="py-20 text-center text-slate-400 space-y-3 rounded-3xl border border-slate-800/80 bg-slate-900/40 p-8 max-w-xl mx-auto">
          <i className="fa-solid fa-inbox text-4xl mb-1 block text-slate-700" />
          <h3 className="text-sm font-bold text-white">No Assigned Leads Yet</h3>
          <p className="text-xs text-slate-400">Leads assigned to your account by the admin will appear here.</p>
        </div>
      ) : (
        <div className="space-y-8">
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
              <i className="fa-solid fa-[#bolt] fa-bolt text-amber-400 text-xs" />
              <span>Active Investment Leads ({activeLeads.length})</span>
            </h3>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {activeLeads.map((lead) => (
                <LeadCard key={lead._id} lead={lead} onUpdate={updateLead} updating={updatingId === lead._id} />
              ))}
            </div>
          </div>

          {closedLeads.length > 0 && (
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                <i className="fa-solid fa-check-double text-emerald-400 text-xs" />
                <span>Closed Leads ({closedLeads.length})</span>
              </h3>
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {closedLeads.map((lead) => (
                  <LeadCard key={lead._id} lead={lead} onUpdate={updateLead} updating={updatingId === lead._id} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
