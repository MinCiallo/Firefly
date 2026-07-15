import type { APIRoute } from 'astro';

const images = [
  '/images/sana/sana1.jpg',
  '/images/sana/sana2.jpg',
  '/images/sana/sana3.jpg',
  '/images/sana/sana6.jpg',
  '/images/sana/sana7.jpg',
  '/images/sana/sana8.jpg',
  '/images/sana/sana9.jpg',
  '/images/sana/sana10.jpg',
];

export const GET: APIRoute = () => {
  const randomImage = images[Math.floor(Math.random() * images.length)];
  return new Response(JSON.stringify({ url: randomImage }), {
    headers: { 'Content-Type': 'application/json' },
  });
};