import axios from 'axios';

interface StoicResponse {
  text: string;
  author: 'Seneca' | 'Epictetus' | 'Marcus Aurelius';
}

export async function getStoicQuote(): Promise<StoicResponse> {
  const response = await axios.get(`https://stoic-quotes.com/api/quote`);
  return response.data;
}
