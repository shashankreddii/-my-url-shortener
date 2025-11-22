'use client';

import { useState, useEffect, FormEvent } from 'react';

interface Link {
  slug: string;
  url: string;
  clicks: number;
  created_at: string;
}

export default function Home() {
  const [url, setUrl] = useState('');
  const [slug, setSlug] = useState('');
  const [links, setLinks] = useState<Link[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchLinks = async () => {
    try {
      const response = await fetch('/api/links');
      const data = await response.json();
      if (response.ok) {
        setLinks(data);
      } else {
        setError(data.error || 'Failed to fetch links');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, slug }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(`Successfully created short link: /${data.slug}`);
        setUrl('');
        setSlug('');
        fetchLinks(); // Refresh the list of links
      } else {
        setError(data.error || 'Failed to create link');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    }
  };
  
  const handleDelete = async (slugToDelete: string) => {
    try {
      const response = await fetch('/api/links', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slug: slugToDelete }),
      });
  
      if (response.ok) {
        setSuccess('Link deleted successfully');
        fetchLinks(); // Refresh the list
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to delete link');
      }
    } catch (err) {
      setError('An unexpected error occurred during deletion.');
    }
  };
  
  

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-900 text-white">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold mb-8 text-center w-full">URL Shortener</h1>
      </div>

      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="url">
              Long URL
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-700 text-white leading-tight focus:outline-none focus:shadow-outline"
              id="url"
              type="text"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="slug">
              Custom Slug (Optional)
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-700 text-white mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="slug"
              type="text"
              placeholder="my-custom-slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Shorten
            </button>
          </div>
        </form>
        {error && <p className="text-red-500 text-xs italic">{error}</p>}
        {success && <p className="text-green-500 text-xs italic">{success}</p>}
      </div>

      <div className="w-full max-w-4xl mt-12">
        <h2 className="text-2xl font-bold mb-4">Shortened Links</h2>
        <div className="bg-gray-800 shadow-md rounded">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-4 py-2 text-left">Slug</th>
                <th className="px-4 py-2 text-left">Original URL</th>
                <th className="px-4 py-2 text-left">Clicks</th>
                <th className="px-4 py-2 text-left">Created At</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {links.map((link) => (
                <tr key={link.slug} className="border-b border-gray-700">
                  <td className="px-4 py-2">
                    <a href={`/${link.slug}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                      /{link.slug}
                    </a>
                  </td>
                  <td className="px-4 py-2 truncate max-w-xs">{link.url}</td>
                  <td className="px-4 py-2">{link.clicks}</td>
                  <td className="px-4 py-2">{new Date(link.created_at).toLocaleString()}</td>
                  <td className="px-4 py-2">
                    <button
                        onClick={() => handleDelete(link.slug)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                    >
                        Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
