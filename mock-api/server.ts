import http from 'http';

const port = process.env.PORT ? Number(process.env.PORT) : 8787;

const server = http.createServer((req, res) => {
  if (!req.url) {
    res.writeHead(400);
    res.end('Bad Request');
    return;
  }
  if (req.url.startsWith('/api/battle/report')) {
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        id: 'api-battle-1',
        title: 'API Battle',
        subtitle: 'From mock server',
        overview: 'Served by local mock API',
        scenario: 'Two sides clash via HTTP.',
        komae: {
          imageUrl: 'https://placehold.co/200x100?text=K',
          title: 'Komae (API)',
          subtitle: 'Remote',
          description: 'Mocked by API',
          power: 40,
        },
        yono: {
          imageUrl: 'https://placehold.co/200x100?text=Y',
          title: 'Yono (API)',
          subtitle: 'Remote',
          description: 'Mocked by API',
          power: 42,
        },
        status: 'success',
      }),
    );
    return;
  }
  if (req.url.startsWith('/api/battle/judgement')) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify('DRAW'));
    return;
  }
  res.writeHead(404);
  res.end('Not Found');
});

server.listen(port, () => {
  console.log(`Mock API listening on http://localhost:${port}`);
});
