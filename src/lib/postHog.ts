import posthog from 'posthog-js';

if (typeof window !== 'undefined') {
  posthog.init('phc_4v5p9jpEKaZqMqZiqEkXPFubmuMrcl1r4Orcz5eA63F', {
    api_host: 'https://us.i.posthog.com', // or your self-hosted instance
  });
}

export default posthog;