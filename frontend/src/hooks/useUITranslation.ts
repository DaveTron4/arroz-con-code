/**
 * Hook for UI translations
 * Automatically uses current user's preferred language to translate UI strings
 */

import { useAuth } from '../context/AuthContext';
import { getTranslation, type TranslationKey, type Language } from '../translations/ui';

export function useUITranslation() {
  const { user } = useAuth();
  const language = (user?.preferredLanguage as Language | undefined) || 'en';

  const t = (key: TranslationKey): string => {
    return getTranslation(key, language);
  };

  return { t, language };
}
