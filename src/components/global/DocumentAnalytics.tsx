'use client';

import { useEffect } from 'react';
import posthog from '@/lib/postHog';

type Props = {
  documentId: string;
  pageId: string;
  domain: string;
};

const DocumentAnalytics = ({ documentId, pageId, domain }: Props) => {
  useEffect(() => {
    posthog.capture('document_viewed', {
      documentId,
      pageId,
      domain,
    });
  }, [documentId, pageId, domain]);

  return null;
};

export default DocumentAnalytics;
