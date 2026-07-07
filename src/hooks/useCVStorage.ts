import { useState, useEffect, useCallback, useRef } from 'react';
import { cvApi } from '@/integrations/api/client';
import { defaultCVData, defaultCVSettings } from '@/types/cv';
import type { CVData, CVSettings } from '@/types/cv';

const LOCAL_STORAGE_KEY = 'cv-data';
const LOCAL_SETTINGS_KEY = 'cv-settings';

// Debounce helper
function debounce<T extends (...args: unknown[]) => void>(fn: T, delay: number): T & { cancel: () => void } {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  const debounced = (...args: unknown[]) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
  debounced.cancel = () => {
    if (timeoutId) clearTimeout(timeoutId);
  };
  return debounced as T & { cancel: () => void };
}

export interface CVStorageResult {
  cvData: CVData;
  cvSettings: CVSettings;
  cvTitle: string;
  isLoading: boolean;
  isSaving: boolean;
  updateCVData: (data: CVData) => void;
  updateCVSettings: (settings: CVSettings) => void;
  updateCVTitle: (title: string) => void;
  forceSave: () => Promise<void>;
}

/**
 * Hook for CV data storage with backend API + localStorage hybrid.
 */
export function useCVStorage(cvId: string | null, userId: string | null): CVStorageResult {
  const [cvData, setCVData] = useState<CVData>(defaultCVData);
  const [cvSettings, setCVSettings] = useState<CVSettings>(defaultCVSettings);
  const [cvTitle, setCVTitle] = useState<string>('Untitled CV');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const isMountedRef = useRef(true);
  const pendingSaveRef = useRef(false);

  // Track if data has been loaded to avoid overwriting on mount
  const hasLoadedRef = useRef(false);

  // Load data on mount
  useEffect(() => {
    isMountedRef.current = true;
    return () => { isMountedRef.current = false; };
  }, []);

  useEffect(() => {
    hasLoadedRef.current = false;
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cvId, userId]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      if (cvId && userId) {
        // Load from backend API
        await loadFromAPI(cvId);
      } else {
        // Legacy mode: load from localStorage
        loadFromLocalStorage();
      }
    } catch (error) {
      console.error('Error loading CV data:', error);
      // Fallback to localStorage on error
      if (cvId) {
        loadFromLocalStorage();
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
        hasLoadedRef.current = true;
      }
    }
  };

  const loadFromAPI = async (id: string) => {
    const { cv } = await cvApi.getById(id);

    if (cv && isMountedRef.current) {
      setCVData(cv.cv_data || defaultCVData);
      setCVSettings(cv.cv_settings || defaultCVSettings);
      setCVTitle(cv.title || 'Untitled CV');
    }
  };

  const loadFromLocalStorage = () => {
    try {
      const storedData = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      const storedSettings = window.localStorage.getItem(LOCAL_SETTINGS_KEY);

      if (storedData && isMountedRef.current) {
        setCVData(JSON.parse(storedData));
      }
      if (storedSettings && isMountedRef.current) {
        setCVSettings(JSON.parse(storedSettings));
      }
    } catch (error) {
      console.error('Error reading from localStorage:', error);
    }
  };

  // Save to backend API (debounced)
  const saveToAPI = useCallback(
    debounce(async (data: CVData, settings: CVSettings, title: string) => {
      if (!cvId || !userId) return;
      
      pendingSaveRef.current = true;
      if (isMountedRef.current) setIsSaving(true);

      try {
        await cvApi.update(cvId, {
          cv_data: data,
          cv_settings: settings,
          title,
        });
      } catch (error) {
        console.error('Error saving to API:', error);
        // Fallback: save to localStorage on error
        saveToLocalStorage(data, settings);
      } finally {
        pendingSaveRef.current = false;
        if (isMountedRef.current) setIsSaving(false);
      }
    }, 2000),
    [cvId, userId]
  );

  const saveToLocalStorage = (data: CVData, settings: CVSettings) => {
    try {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
      window.localStorage.setItem(LOCAL_SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  // Update handlers
  const updateCVData = useCallback((newData: CVData) => {
    setCVData(newData);
    if (cvId && userId) {
      saveToAPI(newData, cvSettings, cvTitle);
    } else {
      saveToLocalStorage(newData, cvSettings);
    }
  }, [cvId, userId, cvSettings, cvTitle, saveToAPI]);

  const updateCVSettings = useCallback((newSettings: CVSettings) => {
    setCVSettings(newSettings);
    if (cvId && userId) {
      saveToAPI(cvData, newSettings, cvTitle);
    } else {
      saveToLocalStorage(cvData, newSettings);
    }
  }, [cvId, userId, cvData, cvTitle, saveToAPI]);

  const updateCVTitle = useCallback((newTitle: string) => {
    setCVTitle(newTitle);
    if (cvId && userId) {
      saveToAPI(cvData, cvSettings, newTitle);
    }
  }, [cvId, userId, cvData, cvSettings, saveToAPI]);

  // Force save (for explicit save actions)
  const forceSave = useCallback(async () => {
    saveToAPI.cancel();
    if (!cvId || !userId) return;
    
    if (isMountedRef.current) setIsSaving(true);
    try {
      await cvApi.update(cvId, {
        cv_data: cvData,
        cv_settings: cvSettings,
        title: cvTitle,
      });
    } catch (error) {
      console.error('Network error during force save:', error);
    } finally {
      if (isMountedRef.current) setIsSaving(false);
    }
  }, [cvId, userId, cvData, cvSettings, cvTitle, saveToAPI]);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      saveToAPI.cancel();
    };
  }, [saveToAPI]);

  return {
    cvData,
    cvSettings,
    cvTitle,
    isLoading,
    isSaving,
    updateCVData,
    updateCVSettings,
    updateCVTitle,
    forceSave,
  };
}

/**
 * Migrate localStorage CV data to backend API.
 * Returns the new CV ID if migration was successful, null otherwise.
 */
export async function migrateLocalStorageToAPI(): Promise<string | null> {
  try {
    const storedData = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    const storedSettings = window.localStorage.getItem(LOCAL_SETTINGS_KEY);

    if (!storedData) return null;

    const cvData: CVData = JSON.parse(storedData);
    const cvSettings: CVSettings = storedSettings ? JSON.parse(storedSettings) : defaultCVSettings;

    const { cv } = await cvApi.create({
      title: cvData.personalInfo?.fullName 
        ? `${cvData.personalInfo.fullName}'s CV`
        : 'My CV',
      cv_data: cvData,
      cv_settings: cvSettings,
    });

    console.log('Successfully migrated CV to backend:', cv.id);
    return cv.id;
  } catch (error) {
    console.error('Error during migration:', error);
    return null;
  }
}

/**
 * Get all CVs for a user from backend API.
 */
export async function getUserCVs() {
  try {
    const { cvs } = await cvApi.getAll();
    return cvs || [];
  } catch (error) {
    console.error('Error fetching user CVs:', error);
    return [];
  }
}

/**
 * Create a new CV via backend API.
 */
export async function createNewCV(title: string = 'Untitled CV'): Promise<string | null> {
  try {
    const { cv } = await cvApi.create({
      title,
      cv_data: defaultCVData,
      cv_settings: defaultCVSettings,
    });
    return cv.id;
  } catch (error) {
    console.error('Error creating new CV:', error);
    return null;
  }
}

/**
 * Duplicate an existing CV.
 */
export async function duplicateCV(sourceId: string, newTitle?: string): Promise<string | null> {
  try {
    const { cv } = await cvApi.duplicate(sourceId);
    if (newTitle) {
      await cvApi.rename(cv.id, newTitle);
    }
    return cv.id;
  } catch (error) {
    console.error('Error duplicating CV:', error);
    return null;
  }
}

/**
 * Delete a CV.
 */
export async function deleteCV(cvId: string): Promise<boolean> {
  try {
    await cvApi.delete(cvId);
    return true;
  } catch (error) {
    console.error('Error deleting CV:', error);
    return false;
  }
}

/**
 * Set a CV as primary.
 */
export async function setPrimaryCV(cvId: string): Promise<boolean> {
  try {
    await cvApi.setPrimary(cvId);
    return true;
  } catch (error) {
    console.error('Error setting primary CV:', error);
    return false;
  }
}

/**
 * Save CV data and settings for a specific CV.
 */
export async function saveCVToAPI(
  cvId: string,
  cvData: CVData,
  cvSettings: CVSettings,
): Promise<boolean> {
  try {
    await cvApi.update(cvId, {
      cv_data: cvData,
      cv_settings: cvSettings,
    });
    return true;
  } catch (error) {
    console.error('Error saving CV:', error);
    return false;
  }
}

/**
 * Rename a CV.
 */
export async function renameCV(cvId: string, newTitle: string): Promise<boolean> {
  try {
    await cvApi.rename(cvId, newTitle);
    return true;
  } catch (error) {
    console.error('Error renaming CV:', error);
    return false;
  }
}