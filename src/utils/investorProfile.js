const STORAGE_KEY = 'investorProfile';

export const getInvestorProfile = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setInvestorProfile = (investor) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(investor));
};

export const clearInvestorProfile = () => {
  localStorage.removeItem(STORAGE_KEY);
};
