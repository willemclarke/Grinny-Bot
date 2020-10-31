import rp from "request-promise";

interface StoicResponse {
  text: string;
  author: string;
}

export async function getStoicQuote(): Promise<StoicResponse> {
  const options = {
    url: `https://stoic-quotes.com/api/quote`,
    json: true
  }
  return await rp(options)
}

