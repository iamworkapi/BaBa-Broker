import { useState, useRef, useCallback } from 'react';
import { api } from '../../services/api';
import { Loader, EmptyState } from '../ui';

function parseCSV(text) {
  const lines = text.split('\n').filter((l) => l.trim());
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
  return lines.slice(1).map((line, idx) => {
    const values = line.split(',').map((v) => v.trim().replace(/^"|"$/g, ''));
    const row = { _id: `row-${idx}`, _sourceRow: idx + 2 };
    headers.forEach((h, i) => { row[h] = values[i] || ''; });
    return row;
  });
}

function parseExcelJSON(text) {
  try {
    const data = JSON.parse(text);
    if (Array.isArray(data) && data.length > 0) {
      const headers = Object.keys(data[0]);
      return data.map((row, idx) => ({ ...row, _id: `row-${idx}`, _sourceRow: idx + 1 }));
    }
    return [];
  } catch { return []; }
}

export default function AdminExcelView() {
  const fileRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [parsedData, setParsedData] = useState([]);
  const [fileName, setFileName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 20;

  const handleFile = useCallback(async (file) => {
    if (!file) return;
    setFileName(file.name);
    setUploading(true);
    setStatus({ type: '', msg: '' });

    try {
      let rows = [];
      if (file.name.endsWith('.json')) {
        const text = await file.text();
        rows = parseExcelJSON(text);
      } else if (file.name.endsWith('.csv')) {
        const text = await file.text();
        rows = parseCSV(text);
      } else if (file.name.match(/\.(xlsx?)$/)) {
        const form = new FormData();
        form.append('file', file);
        const res = await api('/api/excel/upload', { method: 'POST', body: form });
        rows = res.data || res.rows || [];
      } else {
        setStatus({ type: 'error', msg: 'Unsupported format. Use CSV, JSON, or XLSX.' });
        setUploading(false);
        return;
      }

      if (rows.length === 0) {
        setStatus({ type: 'error', msg: 'File parsed but no data rows found.' });
      } else {
        setParsedData(rows);
        setStatus({ type: 'success', msg: `✓ ${rows.length} rows loaded from "${file.name}"` });
      }
    } catch (err) {
      setStatus({ type: 'error', msg: err.message || 'Upload failed. Check server connection.' });
    } finally {
      setUploading(false);
    }
  }, []);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const filtered = parsedData.filter((row) =>
    Object.values(row).some((v) => String(v).toLowerCase().includes(search.toLowerCase()))
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageData = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const columns = parsedData.length > 0 ? Object.keys(parsedData[0]).filter((k) => k !== '_id' && k !== '_sourceRow') : [];

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      <div>
        <h1 className="text-xl font-black text-slate-900 tracking-tight">Excel / CSV Upload</h1>
        <p className="text-xs text-slate-500 mt-1">Upload XLSX, CSV, or JSON files. Data previews below and can be pushed to the database.</p>
      </div>

      {/* Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => fileRef.current?.click()}
        className={`relative border-2 border-dashed rounded-3xl p-10 text-center cursor-pointer transition-all duration-300 ${
          dragging ? 'border-[#ea580c] bg-orange-50 scale-[1.005]' : 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-slate-100'
        }`}
      >
        <input ref={fileRef} type="file" accept=".csv,.json,.xlsx,.xls" onChange={(e) => handleFile(e.target.files?.[0])} className="hidden" />
        <div className="space-y-2">
          <div className="mx-auto h-14 w-14 rounded-2xl bg-orange-50 text-[#ea580c] flex items-center justify-center text-3xl shadow-sm">
            <i className="ri-file-upload-line" />
          </div>
          <p className="text-sm font-bold text-slate-700">
            {dragging ? 'Drop file here…' : fileName ? `Loaded: ${fileName}` : 'Drop a file here, or click to browse'}
          </p>
          <p className="text-[11px] text-slate-400 font-medium">Supports CSV, JSON, XLSX — Max 10 MB</p>
        </div>
      </div>

      {uploading && (
        <div className="flex items-center justify-center gap-3 py-8">
          <Loader size={24} color="#ea580c" />
          <span className="text-sm text-slate-500 font-semibold animate-pulse">Processing file…</span>
        </div>
      )}

      {status.msg && (
        <div className={`rounded-2xl p-4 text-sm font-semibold flex items-center gap-2 ${
          status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          <i className={`${status.type === 'success' ? 'ri-checkbox-circle-line' : 'ri-error-warning-line'} text-lg`} />
          {status.msg}
        </div>
      )}

      {parsedData.length > 0 && (
        <>
          {/* Search */}
          <div className="relative">
            <i className="ri-search-line absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              placeholder="Search across all columns…"
              className="w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-[#ea580c] focus:ring-2 focus:ring-[#ea580c]/10 transition"
            />
          </div>

          {/* Summary bar */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Showing <span className="text-slate-900">{filtered.length}</span> of <span className="text-slate-900">{parsedData.length}</span> rows
            </span>
            <button
              onClick={async () => {
                try {
                  setUploading(true);
                  await api('/api/excel/push', {
                    method: 'POST',
                    body: JSON.stringify({ data: parsedData, model: 'flat-listing' }),
                    headers: { 'Content-Type': 'application/json' },
                  });
                  setStatus({ type: 'success', msg: '✓ Data pushed to database successfully!' });
                } catch (err) {
                  setStatus({ type: 'error', msg: err.message });
                } finally {
                  setUploading(false);
                }
              }}
              disabled={uploading}
              className="px-5 py-2.5 rounded-2xl bg-[#ea580c] text-white text-xs font-bold shadow-lg hover:shadow-xl transition disabled:opacity-50 cursor-pointer flex items-center gap-2"
            >
              <i className="ri-database-2-line" />
              Push to Database
            </button>
          </div>

          {/* Table */}
          <div className="rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-4 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-wider w-12">#</th>
                    {columns.map((col) => (
                      <th key={col} className="px-4 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-wider whitespace-nowrap">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pageData.map((row, idx) => (
                    <tr key={row._id} className={`border-b border-slate-100 last:border-0 hover:bg-orange-50/50 transition ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'}`}>
                      <td className="px-4 py-3 text-[11px] font-bold text-slate-400">{row._sourceRow}</td>
                      {columns.map((col) => (
                        <td key={col} className="px-4 py-3 text-xs text-slate-700 font-medium max-w-[200px] truncate" title={String(row[col] || '')}>
                          {String(row[col] || '—')}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filtered.length === 0 && <EmptyState icon="ri-search-line" title="No matching rows" description="Try a different search term" />}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0} className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-30 cursor-pointer transition">
                <i className="ri-arrow-left-s-line text-base" />
              </button>
              <span className="text-xs font-semibold text-slate-600">
                Page {page + 1} of {totalPages}
              </span>
              <button onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1} className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-30 cursor-pointer transition">
                <i className="ri-arrow-right-s-line text-base" />
              </button>
            </div>
          )}
        </>
      )}

      {parsedData.length === 0 && !uploading && (
        <EmptyState icon="ri-file-excel-2-line" title="No file loaded" description="Upload a CSV, JSON, or XLSX file to preview and manage data." />
      )}
    </div>
  );
}
