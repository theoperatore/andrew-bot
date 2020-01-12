import nock from 'nock';
import httpMocks from 'node-mocks-http';
import messageHandler from '../../pages/api/message';

jest.mock('../commands', () => ({
  commandRandom: () => {
    throw new Error('Test Error');
  },
  commandWhoami: () =>
    Promise.resolve({
      bot_id: 'test-bot-id',
      text: 'test',
    }),
  commandDnd: () => ({}),
}));

test('responds 200 unsupported when non-POST request', async () => {
  const req = httpMocks.createRequest({
    method: 'GET',
    path: '/message',
  });

  const res = httpMocks.createResponse();
  await messageHandler(req, res);

  expect(res.statusCode).toBe(200);
  expect(res._getData()).toBe('unsupported method');
});

test('response 200 non-user send type when sender_type is bot', async () => {
  const req = httpMocks.createRequest({
    method: 'POST',
    body: {
      sender_type: 'bot',
    },
  });

  const res = httpMocks.createResponse();
  await messageHandler(req, res);

  expect(res.statusCode).toBe(200);
  expect(res._getData()).toBe('non-user sender_type');
});

test('response 200 no text to parse when there is no text in body', async () => {
  const req = httpMocks.createRequest({
    method: 'POST',
    body: {
      sender_type: 'user',
      text: '',
    },
  });

  const res = httpMocks.createResponse();
  await messageHandler(req, res);

  expect(res.statusCode).toBe(200);
  expect(res._getData()).toBe('no text to parse');
});

test('response 200 unknown bot id when an unsupported group_id is sent', async () => {
  const req = httpMocks.createRequest({
    method: 'POST',
    body: {
      sender_type: 'user',
      text: 'some text',
      group_id: '',
    },
  });

  const res = httpMocks.createResponse();
  await messageHandler(req, res);

  expect(res.statusCode).toBe(200);
  expect(res._getData()).toBe('unknown bot id');
});

test('response 200 no command found when there is no command registered to execute', async () => {
  const req = httpMocks.createRequest({
    method: 'POST',
    body: {
      sender_type: 'user',
      text: '#unknown_command',
      group_id: '17602864',
    },
  });

  const res = httpMocks.createResponse();
  await messageHandler(req, res);

  expect(res.statusCode).toBe(200);
  expect(res._getData()).toBe('no command found');
});

test('response 200 recovered from error when a command throws an error', async () => {
  nock(`https://api.groupme.com`)
    .post(`/v3/bots/post?token=${process.env.GM_TOKEN}`)
    .reply(204);

  const req = httpMocks.createRequest({
    method: 'POST',
    body: {
      sender_type: 'user',
      text: '#gotd',
      group_id: '17602864',
    },
  });

  const res = httpMocks.createResponse();
  await messageHandler(req, res);

  expect(res.statusCode).toBe(200);
  expect(res._getData()).toBe('recovered from error');
});

test('response 200 success everything goes right', async () => {
  nock(`https://api.groupme.com`)
    .post(`/v3/bots/post?token=${process.env.GM_TOKEN}`)
    .reply(204);

  const req = httpMocks.createRequest({
    method: 'POST',
    body: {
      sender_type: 'user',
      text: '#whoami',
      group_id: '17602864',
    },
  });

  const res = httpMocks.createResponse();
  await messageHandler(req, res);

  expect(res.statusCode).toBe(200);
  expect(res._getData()).toBe('success');
});
