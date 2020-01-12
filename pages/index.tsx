import * as React from 'react';
import fetch from 'isomorphic-unfetch';

export default function Index() {
  async function testGotd() {
    try {
      const response = await fetch('/api/message', {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          group_id: '17602864',
          sender_type: 'user',
          text: '#gotd',
        }),
      });

      console.log(response.status, response.statusText);
    } catch (error) {
      console.error(error);
    }
  }

  async function testWhoami() {
    try {
      const response = await fetch('/api/message', {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          group_id: '17602864',
          sender_type: 'user',
          text: '#whoami',
        }),
      });

      console.log(response.status, response.statusText);
    } catch (error) {
      console.error(error);
    }
  }

  async function testDnd() {
    try {
      const response = await fetch('/api/message', {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          group_id: '17602864',
          sender_type: 'user',
          text: '#dnd cleric',
        }),
      });

      console.log(response.status, response.statusText);
    } catch (error) {
      console.error(error);
    }
  }

  async function testHelp() {
    try {
      const response = await fetch('/api/message', {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          group_id: '17602864',
          sender_type: 'user',
          text: '#help',
        }),
      });

      console.log(response.status, response.statusText);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <h3>This is a chat bot</h3>
      <div className="button">
        <button onClick={testGotd}>gotd</button>
      </div>
      <div className="button">
        <button onClick={testWhoami}>whoami</button>
      </div>
      <div className="button">
        <button onClick={testDnd}>dnd</button>
      </div>
      <div className="button">
        <button onClick={testHelp}>help</button>
      </div>
      <div className="button">
        <p>End testing commands.</p>
      </div>
      <style jsx>
        {`
          .button {
            margin-bottom: 12px;
          }
        `}
      </style>
    </div>
  );
}
