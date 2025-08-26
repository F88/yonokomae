import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

export const handlers = [
  http.get('/api/battle/report', () => {
    return HttpResponse.json({
      id: 'msw-battle-1',
      title: 'MSW Battle',
      subtitle: 'Stubbed',
      overview: 'From MSW',
      scenario: 'Stub path',
      komae: {
        imageUrl: 'k',
        title: 'K',
        subtitle: 'k',
        description: 'k',
        power: 10,
      },
      yono: {
        imageUrl: 'y',
        title: 'Y',
        subtitle: 'y',
        description: 'y',
        power: 10,
      },
      status: 'success',
    });
  }),
  http.get('/api/battle/judgement', () => {
    return HttpResponse.json('DRAW');
  }),
];

export const server = setupServer(...handlers);
