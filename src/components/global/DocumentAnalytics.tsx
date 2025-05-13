'use client';

import { useEffect } from 'react';
import posthog from '@/lib/postHog';
import { v4 } from "uuid";


type Props = {
  documentId: string;
  pageId: string;
  domain: string;
};

const sessionId = sessionStorage.getItem("doc_session") || v4();
sessionStorage.setItem("doc_session", sessionId);

const DocumentAnalytics = ({ documentId, pageId, domain }: Props) => {
  useEffect(() => {
    posthog.capture('document_viewed', {
      documentId,
      pageId,
      domain,
      sessionId,
    });
  }, [documentId, pageId, domain, sessionId]);

  return null;
};

export default DocumentAnalytics;
