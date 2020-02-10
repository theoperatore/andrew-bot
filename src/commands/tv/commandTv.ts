import fetch from 'isomorphic-unfetch';
import { Command, CommandError } from '../../lib';

type TvSearchResponse = {
  page: number;
  results: {
    poster_path: string;
    popularity: number;
    id: number;
    backdrop_path: string;
    vote_average: number;
    overview: string;
    first_air_date: string;
    origin_country: string[];
    genre_ids: number[];
    original_language: string;
    vote_count: number;
    name: string;
    original_name: string;
  }[];
  total_results: number;
  total_pages: number;
};

const formatDate = (date: string) =>
  new Intl.DateTimeFormat('en', {
    timeZone: 'UTC',
    month: 'short',
    year: 'numeric',
    day: 'numeric',
  }).format(new Date(date));

async function mdFetch<T>(url: string) {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.MD_TOKEN}`,
      'Content-Type': 'application/json',
    },
  });

  if (response.ok) {
    return (await response.json()) as T;
  }

  throw new CommandError('Failed to search for TV');
}

export const commandTv: Command = async (botId, rawText) => {
  const searchable = rawText
    .split(' ')
    .map(part => part.trim())
    .filter(part => part !== '')
    .filter(part => !part.match('#tv'))
    .join(' ');

  if (!searchable.length) {
    return {
      bot_id: botId,
      text: 'You must enter a tv search term!',
    };
  }

  const results = await mdFetch<TvSearchResponse>(
    `https://api.themoviedb.org/3/search/tv?query=${encodeURIComponent(
      searchable
    )}`
  );

  if (results.total_results < 1) {
    return {
      bot_id: botId,
      text: 'No tv shows found!',
    };
  }

  const [tvShow] = results.results;

  const name =
    tvShow.name !== tvShow.original_name
      ? `${tvShow.original_name}, also known as: ${tvShow.name}`
      : tvShow.original_name;

  const date = formatDate(tvShow.first_air_date);

  const desc = tvShow.overview;
  const overflowText = `# ${name}\n# ${date}\n\n${desc}`;
  const text =
    overflowText.length >= 500
      ? `${overflowText.substr(0, 490)}...`
      : overflowText;

  return {
    bot_id: botId,
    text,
    image: `https://image.tmdb.org/t/p/original${tvShow.poster_path}`,
  };
};
