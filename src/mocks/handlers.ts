import { http, HttpResponse, delay } from 'msw';
import { APPS, generateGraph } from './data';

export const handlers = [
  http.get('/api/apps', async () => {
    await delay(300);
    return HttpResponse.json({ apps: APPS });
  }),

  http.get('/api/apps/:appId/graph', async ({ params }) => {
    await delay(300);

    // 10% random failure rate to demonstrate error state
    if (Math.random() < 0.1) {
      return new HttpResponse(JSON.stringify({ message: 'Internal Server Error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { appId } = params;
    if (typeof appId !== 'string') {
      return new HttpResponse(JSON.stringify({ message: 'Bad Request' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const app = APPS.find((a) => a.id === appId);
    if (!app) {
      return new HttpResponse(JSON.stringify({ message: 'App not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return HttpResponse.json({ graph: generateGraph(appId) });
  }),
];
