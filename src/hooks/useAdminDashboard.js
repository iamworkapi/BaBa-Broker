import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { getAuth } from '../lib/auth';

export const emptyProperty = (isFeaturedDefault = true) => ({
  status: 'running',
  propertyType: 'residential',
  bhk: '2bhk',
  investmentModel: 'co_investment',
  title: '',
  location: '',
  price: '',
  tag: '',
  description: '',
  image: '',
  images: [],
  videoUrl: '',
  // Scenario 1: Fractional Co-Investment
  totalValuation: '',
  fundedPercentage: 0,
  investorsCount: 0,
  minInvestment: '',
  expectedRoi: '',
  // Scenario 2: Buy, Renovate & Flip
  purchasePrice: '',
  renovationCost: '',
  expectedSalePrice: '',
  holdingPeriodMonths: '',
  // PDF Brochure & Residential Flat Specs
  pdfUrl: '',
  constructionYear: '',
  sizeSqft: '',
  floor: '',
  lift: 'YES',
  parking: 'CAR + BIKE',
  isFeatured: isFeaturedDefault,
  estimatedNetProfit: '',
  // Plot & Land Specs
  plotAreaSqft: '',
  plotAreaSqm: '',
  perSqftPrice: '',
  facing: '',
  gatedSociety: 'YES',
  boundaryWall: 'YES',
  roadWidthFeet: '',
  openSides: '',
  overlooking: '',
  possession: '',
  transactionType: '',
  ownership: '',
  highlights: '',
  amenities: '',
  // Commercial Specs
  builtUpArea: '',
  carpetArea: '',
  perSqydPrice: '',
  configuration: '',
  washrooms: '',
  propertyAge: '',
  investorsList: [],
});

export const emptyContact = { name: '', phone: '', email: '', notes: '' };

const SAMPLE_PROPERTIES = [
  {
    _id: 'sample-1',
    title: 'Skyline Heights Co-Investment Pool',
    location: 'Sector 62, Noida',
    propertyType: 'residential',
    bhk: '3bhk',
    investmentModel: 'co_investment',
    status: 'running',
    totalValuation: 8500000,
    price: '₹ 34,00,000',
    fundedPercentage: 60,
    expectedRoi: 14.5,
    minInvestment: 500000,
    image: '/assets/hero-bg.png',
    description: 'High-yield fractional real estate co-investment in prime residential hub.',
    isFeatured: true,
    investorsList: [
      { name: 'Rahul Sharma', sharePercentage: 30, amount: '₹25.5L', date: '12 Jan 2026' },
      { name: 'Amit Verma', sharePercentage: 30, amount: '₹25.5L', date: '04 Feb 2026' }
    ]
  },
  {
    _id: 'sample-2',
    title: 'Cyber Towers Commercial Plaza',
    location: 'Golf Course Road, Gurgaon',
    propertyType: 'commercial',
    bhk: 'commercial_shop',
    investmentModel: 'co_investment',
    status: 'running',
    totalValuation: 12000000,
    price: '₹ 72,00,000',
    fundedPercentage: 40,
    expectedRoi: 16.2,
    minInvestment: 1000000,
    image: '/assets/hero-bg.png',
    description: 'Grade-A commercial office space with long-term corporate lease returns.',
    isFeatured: true,
    investorsList: [
      { name: 'Priya Patel', sharePercentage: 40, amount: '₹48L', date: '20 Jan 2026' }
    ]
  },
  {
    _id: 'sample-3',
    title: 'Green Valley Villa Flip',
    location: 'Chhatarpur, New Delhi',
    propertyType: 'residential',
    bhk: '4bhk',
    investmentModel: 'renovate_flip',
    status: 'upcoming',
    totalValuation: 25000000,
    price: '₹ 2,50,00,000',
    purchasePrice: 18000000,
    renovationCost: 3000000,
    expectedSalePrice: 25000000,
    holdingPeriodMonths: 8,
    estimatedNetProfit: '+₹40.0 Lakhs Net Profit',
    image: '/assets/hero-bg.png',
    description: 'Luxury villa buy, renovate & flip opportunity with high projected ROI.',
    isFeatured: false,
    investorsList: []
  }
];

export function useAdminDashboard(routeView) {
  const view = routeView || 'overview';
  const navigate = useNavigate();
  const auth = getAuth();

  const [properties, setProperties] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [shareCount, setShareCount] = useState(0);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');

  // Page Editor State
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showAddInvestorModal, setShowAddInvestorModal] = useState(false);
  const [activeFormTab, setActiveFormTab] = useState('financial');

  const [propertyForm, setPropertyForm] = useState(emptyProperty());
  const [contactForm, setContactForm] = useState(emptyContact);
  const [editingId, setEditingId] = useState(null);

  // Co-Investors Draft State
  const [newInvestorName, setNewInvestorName] = useState('');
  const [newInvestorShare, setNewInvestorShare] = useState('');
  const [newInvestorAmount, setNewInvestorAmount] = useState('');
  const [newInvestorDate, setNewInvestorDate] = useState('');

  // Saving Loader Progress State
  const [isSaving, setIsSaving] = useState(false);
  const [savingProgress, setSavingProgress] = useState(0);

  // WhatsApp Share Drawer State
  const [shareTargetProject, setShareTargetProject] = useState(null);
  const [shareClientName, setShareClientName] = useState('');
  const [shareClientPhone, setShareClientPhone] = useState('');
  const [shareCustomNote, setShareCustomNote] = useState('');
  const [selectedContactId, setSelectedContactId] = useState('');

  const [toast, setToast] = useState(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  const triggerToast = (message, type = 'error', title = null) => {
    setToast({ message, type, title });
  };

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4500);
    return () => clearTimeout(timer);
  }, [toast]);

  const load = async () => {
    try {
      const listingData = await api('/api/properties').catch(() => null);
      const contactData = await api('/api/contacts').catch(() => []);
      const shares = await api('/api/shares').catch(() => 0);

      if (Array.isArray(listingData) && listingData.length > 0) {
        setProperties(listingData);
      } else if (import.meta.env.DEV) {
        setProperties(SAMPLE_PROPERTIES);
      }
      setContacts(Array.isArray(contactData) ? contactData : []);
      setShareCount(typeof shares === 'number' ? shares : 0);
    } catch (error) {
      console.warn('Backend load error fallback:', error.message);
      if (import.meta.env.DEV) {
        setProperties(SAMPLE_PROPERTIES);
      }
      if (/sign in/i.test(error.message)) navigate('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!auth || !auth.token) {
      navigate('/admin/login');
      return;
    }
    load();
  }, []);

  useEffect(() => {
    if (view === 'create-project') {
      setShowProjectModal(true);
      setEditingId(null);
      setPropertyForm(emptyProperty(false));
      setActiveFormTab('financial');
    } else {
      setShowProjectModal(false);
      setEditingId(null);
      setPropertyForm(emptyProperty(view === 'featured'));
      setActiveFormTab(view === 'featured' ? 'basic' : 'financial');
    }
  }, [view]);

  const closeModal = () => {
    setShowProjectModal(false);
    setEditingId(null);
    setPropertyForm(emptyProperty(view === 'featured'));
    if (view === 'create-project') {
      navigate('/admin/projects');
    }
  };

  const formatINR = (val) => {
    const num = Number(val);
    if (isNaN(num) || num <= 0) return '';
    return '₹ ' + num.toLocaleString('en-IN');
  };

  const changeProperty = (e) => {
    const { name, value } = e.target;
    setPropertyForm((prev) => {
      const updated = { ...prev, [name]: value };

      if (name === 'totalValuation' || name === 'fundedPercentage') {
        const totalVal = Number(name === 'totalValuation' ? value : prev.totalValuation) || 0;
        const fundedPct = Number(name === 'fundedPercentage' ? value : prev.fundedPercentage) || 0;
        const fundedAmt = Math.round((totalVal * fundedPct) / 100);
        const remainingVal = Math.max(0, totalVal - fundedAmt);
        if (totalVal > 0) {
          updated.price = formatINR(remainingVal);
        }
      }

      if (name === 'price') {
        const digits = value.replace(/\D/g, '');
        if (digits && (!prev.totalValuation || prev.totalValuation === 0)) {
          updated.totalValuation = Number(digits);
        }
      }

      if (name === 'fundedPercentage') {
        const pct = Math.min(100, Math.max(0, Number(value) || 0));
        updated.fundedPercentage = pct;
      }

      if (name === 'purchasePrice' || name === 'renovationCost' || name === 'expectedSalePrice') {
        const pPrice = Number(name === 'purchasePrice' ? value : prev.purchasePrice) || 0;
        const rCost = Number(name === 'renovationCost' ? value : prev.renovationCost) || 0;
        const sPrice = Number(name === 'expectedSalePrice' ? value : prev.expectedSalePrice) || 0;
        const netProfit = sPrice - (pPrice + rCost);
        if (sPrice > 0) {
          const lakhs = (netProfit / 100000).toFixed(1);
          updated.estimatedNetProfit = `${netProfit >= 0 ? '+' : ''}₹${lakhs} Lakhs Net Profit`;
        }
      }

      return updated;
    });
  };

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
    });

  // MongoDB caps a single document at 16MB, and uploaded media is stored as base64
  // directly on the property document, so every upload must stay well under that.
  const MAX_IMAGE_FILE_BYTES = 3 * 1024 * 1024; // 3MB per photo
  const MAX_VIDEO_FILE_BYTES = 5 * 1024 * 1024; // 5MB for an uploaded video file
  const MAX_TOTAL_MEDIA_BYTES = 12 * 1024 * 1024; // combined budget across cover + gallery + video + pdf

  const estimateBase64Bytes = (str) => (str ? Math.ceil((str.length * 3) / 4) : 0);

  const currentMediaBytes = (form) =>
    estimateBase64Bytes(form.image) +
    (form.images || []).reduce((sum, img) => sum + estimateBase64Bytes(img), 0) +
    estimateBase64Bytes(form.videoUrl) +
    estimateBase64Bytes(form.pdfUrl);

  const handleCoverImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_IMAGE_FILE_BYTES) {
      triggerToast(`"${file.name}" is too large (max 3MB per photo). Please compress or choose a smaller image.`, 'error', 'Photo Too Large');
      e.target.value = '';
      return;
    }
    try {
      const b64 = await fileToBase64(file);
      if (currentMediaBytes(propertyForm) - estimateBase64Bytes(propertyForm.image) + estimateBase64Bytes(b64) > MAX_TOTAL_MEDIA_BYTES) {
        triggerToast('Total media size (photos + video + PDF) is too large. Remove some gallery photos or the video before adding this cover photo.', 'error', 'Media Limit Reached');
        e.target.value = '';
        return;
      }
      setPropertyForm((prev) => ({ ...prev, image: b64 }));
    } catch (err) {
      console.error('Image convert error:', err);
    }
  };

  const handleGalleryPhotosChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const oversized = files.filter((f) => f.size > MAX_IMAGE_FILE_BYTES);
    if (oversized.length > 0) {
      triggerToast(`${oversized.length} photo(s) exceed the 3MB limit and were skipped: ${oversized.map((f) => f.name).join(', ')}`, 'error', 'Some Photos Too Large');
    }
    const validFiles = files.filter((f) => f.size <= MAX_IMAGE_FILE_BYTES);
    if (!validFiles.length) {
      e.target.value = '';
      return;
    }

    try {
      const base64List = await Promise.all(validFiles.map((f) => fileToBase64(f)));
      const addedBytes = base64List.reduce((sum, img) => sum + estimateBase64Bytes(img), 0);
      if (currentMediaBytes(propertyForm) + addedBytes > MAX_TOTAL_MEDIA_BYTES) {
        triggerToast('Adding these photos would exceed the total media size limit. Remove some existing photos/video first, or add fewer at a time.', 'error', 'Media Limit Reached');
        e.target.value = '';
        return;
      }
      setPropertyForm((prev) => ({
        ...prev,
        images: [...(prev.images || []), ...base64List],
      }));
    } catch (err) {
      setStatus('Failed to upload gallery images.');
    }
    e.target.value = '';
  };

  const handleVideoFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_VIDEO_FILE_BYTES) {
      triggerToast('Uploaded video files must be under 5MB. For larger videos, paste a YouTube link in the field below instead.', 'error', 'Video Too Large');
      e.target.value = '';
      return;
    }
    try {
      const b64 = await fileToBase64(file);
      if (currentMediaBytes(propertyForm) - estimateBase64Bytes(propertyForm.videoUrl) + estimateBase64Bytes(b64) > MAX_TOTAL_MEDIA_BYTES) {
        triggerToast('Total media size (photos + video + PDF) is too large. Remove some gallery photos before adding this video.', 'error', 'Media Limit Reached');
        e.target.value = '';
        return;
      }
      setPropertyForm((prev) => ({ ...prev, videoUrl: b64 }));
    } catch (err) {
      console.error('Video convert error:', err);
    }
  };

  const addInvestor = () => {
    if (!newInvestorName.trim()) {
      triggerToast('Please enter Investor Name.', 'error', 'Missing Name');
      return;
    }
    const shareNum = Number(newInvestorShare) || 0;
    const currentList = propertyForm.investorsList || [];
    const currentTotalShare = currentList.reduce((sum, item) => sum + (Number(item.sharePercentage) || 0), 0);

    if (currentTotalShare + shareNum > 100) {
      triggerToast(`Cannot add ${shareNum}%. Total allocated equity would exceed 100% (Already allocated: ${currentTotalShare}%).`, 'error', 'Equity Overflow');
      return;
    }

    const todayStr = newInvestorDate || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const newEntry = {
      name: newInvestorName.trim(),
      sharePercentage: shareNum,
      amount: newInvestorAmount.trim() || `₹${Math.round(((Number(propertyForm.totalValuation) || 0) * shareNum) / 100 / 100000)}L`,
      date: todayStr,
    };

    const updatedList = [...currentList, newEntry];
    const updatedFundedPct = updatedList.reduce((sum, item) => sum + (Number(item.sharePercentage) || 0), 0);
    const totalVal = Number(propertyForm.totalValuation) || 0;
    const fundedAmt = Math.round((totalVal * updatedFundedPct) / 100);
    const remainingVal = Math.max(0, totalVal - fundedAmt);

    setPropertyForm((prev) => ({
      ...prev,
      investorsList: updatedList,
      fundedPercentage: updatedFundedPct,
      investorsCount: updatedList.length,
      price: totalVal > 0 ? formatINR(remainingVal) : prev.price,
    }));

    setNewInvestorName('');
    setNewInvestorShare('');
    setNewInvestorAmount('');
    setNewInvestorDate('');
    triggerToast(`🎉 ${newEntry.name} added to investors list!`, 'success', 'Investor Added');
  };

  const removeInvestor = (index) => {
    const currentList = propertyForm.investorsList || [];
    const updatedList = currentList.filter((_, i) => i !== index);
    const updatedFundedPct = updatedList.reduce((sum, item) => sum + (Number(item.sharePercentage) || 0), 0);
    const totalVal = Number(propertyForm.totalValuation) || 0;
    const fundedAmt = Math.round((totalVal * updatedFundedPct) / 100);
    const remainingVal = Math.max(0, totalVal - fundedAmt);

    setPropertyForm((prev) => ({
      ...prev,
      investorsList: updatedList,
      fundedPercentage: updatedFundedPct,
      investorsCount: updatedList.length,
      price: totalVal > 0 ? formatINR(remainingVal) : prev.price,
    }));
  };

  const saveProperty = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    let effectivePrice = (propertyForm.price || '').trim();
    if (!effectivePrice && Number(propertyForm.totalValuation) > 0) {
      effectivePrice = formatINR(propertyForm.totalValuation);
    } else if (!effectivePrice && Number(propertyForm.minInvestment) > 0) {
      effectivePrice = formatINR(propertyForm.minInvestment);
    }

    if (!propertyForm.title.trim()) {
      triggerToast('Please enter a Project Title.', 'error', 'Project Title Required');
      setActiveFormTab('financial');
      return;
    }

    if (!propertyForm.location.trim()) {
      triggerToast('Please enter a Location for this property (e.g. Noida, Sector 62).', 'error', 'Location Required');
      setActiveFormTab('financial');
      return;
    }

    if (!effectivePrice) {
      triggerToast('Please enter a Display Price or Total Valuation for this property.', 'error', 'Price Required');
      setActiveFormTab('financial');
      return;
    }

    if (view === 'featured') {
      if (!propertyForm.image && (!propertyForm.images || propertyForm.images.length === 0)) {
        triggerToast('Please upload at least one photo — it is shown as the card image on the live website.', 'error', 'Photo Required');
        setActiveFormTab('media');
        return;
      }
    }

    const coverBytes = estimateBase64Bytes(propertyForm.image);
    const galleryBytes = (propertyForm.images || []).reduce((sum, img) => sum + estimateBase64Bytes(img), 0);
    const videoBytes = estimateBase64Bytes(propertyForm.videoUrl);
    const pdfBytes = estimateBase64Bytes(propertyForm.pdfUrl);
    const totalMediaBytes = coverBytes + galleryBytes + videoBytes + pdfBytes;

    if (totalMediaBytes > MAX_TOTAL_MEDIA_BYTES) {
      const toMB = (b) => (b / (1024 * 1024)).toFixed(1);
      const culprits = [];
      if (coverBytes > 1024 * 1024) culprits.push(`Cover photo (${toMB(coverBytes)}MB)`);
      if (galleryBytes > 1024 * 1024) culprits.push(`Gallery photos (${toMB(galleryBytes)}MB total)`);
      if (videoBytes > 1024 * 1024) culprits.push(`Video (${toMB(videoBytes)}MB) — remove it and paste a YouTube link instead`);
      if (pdfBytes > 1024 * 1024) culprits.push(`PDF brochure (${toMB(pdfBytes)}MB)`);
      triggerToast(
        `Total media is ${toMB(totalMediaBytes)}MB, over the ${toMB(MAX_TOTAL_MEDIA_BYTES)}MB limit. Remove or shrink: ${culprits.join('; ')}.`,
        'error',
        'Media Too Large to Save'
      );
      setActiveFormTab('media');
      return;
    }

    setIsSaving(true);
    setSavingProgress(15);

    const progressInterval = setInterval(() => {
      setSavingProgress((prev) => (prev < 90 ? prev + 25 : prev));
    }, 180);

    try {
      const payload = {
        ...propertyForm,
        price: effectivePrice,
        isFeatured: view === 'featured' ? true : Boolean(propertyForm.isFeatured),
        totalValuation: Number(propertyForm.totalValuation) || 0,
        fundedPercentage: Number(propertyForm.fundedPercentage) || 0,
        investorsCount: (propertyForm.investorsList || []).length,
        minInvestment: Number(propertyForm.minInvestment) || 0,
        expectedRoi: Number(propertyForm.expectedRoi) || 0,
        purchasePrice: Number(propertyForm.purchasePrice) || 0,
        renovationCost: Number(propertyForm.renovationCost) || 0,
        expectedSalePrice: Number(propertyForm.expectedSalePrice) || 0,
        holdingPeriodMonths: Number(propertyForm.holdingPeriodMonths) || 0,
        investorsList: Array.isArray(propertyForm.investorsList) ? propertyForm.investorsList : [],
      };

      if (editingId) {
        const updated = await api(`/api/properties/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        clearInterval(progressInterval);
        setSavingProgress(100);
        setTimeout(() => {
          setProperties((list) => list.map((item) => (item._id === editingId ? updated : item)));
          triggerToast(view === 'featured' ? '⭐ Featured Project updated live!' : '✨ Project updated successfully!', 'success', 'Project Saved');
          setStatus(view === 'featured' ? '⭐ Featured Project updated live!' : '✨ Project updated successfully!');
          setIsSaving(false);
          setSavingProgress(0);
          setShowProjectModal(false);
          setPropertyForm(emptyProperty());
          setEditingId(null);

          if (view === 'create-project') {
            navigate('/admin/projects');
          } else {
            setTimeout(() => {
              document.getElementById('project-cards-grid')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }
        }, 300);
      } else {
        const created = await api('/api/properties', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        clearInterval(progressInterval);
        setSavingProgress(100);
        setTimeout(() => {
          setProperties((list) => [created, ...list]);
          triggerToast(view === 'featured' ? '⭐ Featured Hot Sale Product published live!' : '🚀 Investment Project published live!', 'success', 'Project Published');
          setStatus(view === 'featured' ? '⭐ Featured Hot Sale Product published live!' : '🚀 Investment Project published live!');
          setIsSaving(false);
          setSavingProgress(0);
          setShowProjectModal(false);
          setPropertyForm(emptyProperty());

          if (view === 'create-project') {
            navigate('/admin/projects');
          } else {
            setTimeout(() => {
              document.getElementById('project-cards-grid')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }
        }, 300);
      }
    } catch (err) {
      clearInterval(progressInterval);
      setIsSaving(false);
      setSavingProgress(0);
      triggerToast(err.message || 'Error saving property', 'error', 'Save Failed');
    }
  };

  const startEdit = (p) => {
    setEditingId(p._id);
    const invList = Array.isArray(p.investorsList) ? p.investorsList : [];
    const calcFundedPct = invList.reduce((sum, item) => sum + (Number(item.sharePercentage) || 0), 0);
    const totalVal = Number(p.totalValuation) || 0;

    setPropertyForm({
      status: p.status || 'running',
      propertyType: p.propertyType || 'residential',
      bhk: p.bhk || '2bhk',
      investmentModel: p.investmentModel || 'co_investment',
      title: p.title || '',
      location: p.location || '',
      price: p.price || '',
      tag: p.tag || '',
      description: p.description || '',
      image: p.image || '',
      minInvestment: p.minInvestment || '',
      expectedRoi: p.expectedRoi || '',
      purchasePrice: p.purchasePrice || '',
      renovationCost: p.renovationCost || '',
      expectedSalePrice: p.expectedSalePrice || '',
      holdingPeriodMonths: p.holdingPeriodMonths || '',
      totalValuation: totalVal,
      isFeatured: p.isFeatured === true,
      fundedPercentage: p.fundedPercentage !== undefined ? p.fundedPercentage : calcFundedPct,
      investorsCount: invList.length,
      images: p.images || (p.image ? [p.image] : []),
      pdfUrl: p.pdfUrl || '',
      constructionYear: p.constructionYear || '',
      sizeSqft: p.sizeSqft || '',
      floor: p.floor || '',
      lift: p.lift || 'YES',
      parking: p.parking || 'CAR + BIKE',
      estimatedNetProfit: p.estimatedNetProfit || '',
      plotAreaSqft: p.plotAreaSqft || '',
      plotAreaSqm: p.plotAreaSqm || '',
      perSqftPrice: p.perSqftPrice || '',
      facing: p.facing || '',
      gatedSociety: p.gatedSociety || 'YES',
      boundaryWall: p.boundaryWall || 'YES',
      roadWidthFeet: p.roadWidthFeet || '',
      openSides: p.openSides || '',
      overlooking: p.overlooking || '',
      possession: p.possession || '',
      transactionType: p.transactionType || '',
      ownership: p.ownership || '',
      highlights: p.highlights || '',
      amenities: p.amenities || '',
      builtUpArea: p.builtUpArea || '',
      carpetArea: p.carpetArea || '',
      perSqydPrice: p.perSqydPrice || '',
      configuration: p.configuration || '',
      washrooms: p.washrooms || '',
      propertyAge: p.propertyAge || '',
      investorsList: invList,
    });
    setActiveFormTab(view === 'featured' ? 'basic' : 'financial');
    setShowProjectModal(true);
  };

  const deleteProperty = async (id) => {
    if (!window.confirm('Are you sure you want to delete this property?')) return;
    try {
      await api(`/api/properties/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('API delete error, deleting locally:', err.message);
    }
    setProperties((list) => list.filter((item) => item._id !== id));
    triggerToast('Property deleted successfully.', 'warning', 'Item Deleted');
  };

  const toggleFeaturedStatus = async (p) => {
    const nextFeatured = !(p.isFeatured === true);
    try {
      await api(`/api/properties/${p._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...p, isFeatured: nextFeatured }),
      });
    } catch (err) {
      console.warn('API error toggling featured:', err.message);
    }
    setProperties((list) =>
      list.map((item) => (item._id === p._id ? { ...item, isFeatured: nextFeatured } : item))
    );
    triggerToast(
      nextFeatured
        ? '⭐ Property published live to Website Featured section!'
        : 'Removed property from Featured section.',
      nextFeatured ? 'success' : 'warning',
      nextFeatured ? 'Featured Live' : 'Unpublished'
    );
  };

  const openWhatsAppShare = (project) => {
    setShareTargetProject(project);
    setShareClientName('');
    setShareClientPhone('');
    setShareCustomNote('');
    setSelectedContactId('');
  };

  const executeWhatsAppShare = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!shareTargetProject) return;

    const phoneToUse = shareClientPhone.trim();
    if (!phoneToUse || phoneToUse.length < 10) {
      triggerToast('Please enter a valid 10-digit mobile phone number.', 'error', 'Phone Number Required');
      return;
    }

    try {
      await api('/api/shares', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phoneToUse,
          clientName: shareClientName.trim() || 'Valued Customer',
          propertyTitle: shareTargetProject.title,
          notes: shareCustomNote.trim(),
        }),
      });
      setShareCount((c) => c + 1);
    } catch (err) {
      console.warn('Share log recording notice:', err.message);
    }

    const cleanPhone = phoneToUse.replace(/\D/g, '');
    const fullPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    const textMsg = encodeURIComponent(
      `Hello ${shareClientName.trim() || 'Valued Customer'}!\n\nHere are the details of our premium investment deal:\n📌 *${shareTargetProject.title}*\n📍 Location: ${shareTargetProject.location}\n💰 Valuation / Price: ${shareTargetProject.price || 'Contact for Price'}\n📈 Target ROI: +${shareTargetProject.expectedRoi || 15}% Annual Return\n${shareCustomNote.trim() ? `\nNote: ${shareCustomNote.trim()}\n` : ''}\nContact Baba Broker Team today for booking & site visit!`
    );

    window.open(`https://wa.me/${fullPhone}?text=${textMsg}`, '_blank');
    triggerToast(`🚀 Opening WhatsApp to share "${shareTargetProject.title}" with +${cleanPhone}!`, 'success', 'WhatsApp Launched');
    setShareTargetProject(null);
  };

  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      if (view === 'featured' && p.isFeatured !== true) return false;
      const matchesSearch =
        !searchQuery.trim() ||
        (p.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.location || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
      const matchesType = filterType === 'all' || p.propertyType === filterType;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [properties, view, searchQuery, filterStatus, filterType]);

  const metrics = useMemo(() => {
    const totalCount = properties.length;
    const runningCount = properties.filter((p) => p.status === 'running').length;
    const upcomingCount = properties.filter((p) => p.status === 'upcoming').length;
    const deliveredCount = properties.filter((p) => p.status === 'delivered').length;
    const featuredCount = properties.filter((p) => p.isFeatured === true).length;

    const coInvestmentCount = properties.filter((p) => p.investmentModel === 'co_investment').length;
    const renovateFlipCount = properties.filter((p) => p.investmentModel === 'renovate_flip').length;

    const totalValuationSum = properties.reduce(
      (sum, p) => sum + (Number(p.totalValuation) || (Number(String(p.price || '').replace(/[^\d.]/g, '')) || 0)),
      0
    );

    const totalFundedCapital = properties.reduce((sum, p) => {
      const val = Number(p.totalValuation) || (Number(String(p.price || '').replace(/[^\d.]/g, '')) || 0);
      const pct = Number(p.fundedPercentage) || 0;
      return sum + (val * pct) / 100;
    }, 0);

    const totalInvestorsCount = properties.reduce((sum, p) => {
      const listLen = Array.isArray(p.investorsList) ? p.investorsList.length : 0;
      const count = Number(p.investorsCount) || 0;
      return sum + (listLen > 0 ? listLen : count);
    }, 0);

    const roiProps = properties.filter((p) => Number(p.expectedRoi) > 0);
    const avgRoi = roiProps.length > 0
      ? (roiProps.reduce((sum, p) => sum + Number(p.expectedRoi), 0) / roiProps.length).toFixed(1)
      : '14.5';

    const totalLeadsCount = contacts.length;
    const totalSharesCount = shareCount;

    const residentialValuation = properties
      .filter((p) => p.propertyType === 'residential')
      .reduce((sum, p) => sum + (Number(p.totalValuation) || 0), 0);
    const commercialValuation = properties
      .filter((p) => p.propertyType === 'commercial')
      .reduce((sum, p) => sum + (Number(p.totalValuation) || 0), 0);
    const plotValuation = properties
      .filter((p) => p.propertyType === 'plot')
      .reduce((sum, p) => sum + (Number(p.totalValuation) || 0), 0);

    const maxValuation = Math.max(
      residentialValuation,
      commercialValuation,
      plotValuation,
      1
    );

    return {
      totalCount,
      runningCount,
      upcomingCount,
      deliveredCount,
      featuredCount,
      coInvestmentCount,
      renovateFlipCount,
      totalValuationSum,
      totalFundedCapital,
      totalInvestorsCount,
      avgRoi,
      totalLeadsCount,
      totalSharesCount,
      residentialValuation,
      commercialValuation,
      plotValuation,
      maxValuation,
    };
  }, [properties, contacts, shareCount]);

  const openCreateFeaturedModal = () => {
    setEditingId(null);
    setPropertyForm(emptyProperty(true));
    setActiveFormTab('basic');
    setShowProjectModal(true);
  };

  const openCreateProjectModal = () => {
    setEditingId(null);
    setPropertyForm(emptyProperty(false));
    setActiveFormTab('financial');
    setShowProjectModal(true);
  };

  return {
    view,
    navigate,
    auth,
    properties,
    contacts,
    shareCount,
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    filterType,
    setFilterType,
    showProjectModal,
    setShowProjectModal,
    showAddInvestorModal,
    setShowAddInvestorModal,
    activeFormTab,
    setActiveFormTab,
    propertyForm,
    setPropertyForm,
    contactForm,
    setContactForm,
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
    status,
    setStatus,
    loading,
    triggerToast,
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
  };
}
