import { useEffect } from 'react';

export const useDocumentTitle = (title) => {
  useEffect(() => {
    document.title = title ? `${title} | KHPR` : 'KHPR | Redefining Legacy';
  }, [title]);
};
