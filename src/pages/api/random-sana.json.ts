import type { APIRoute } from 'astro';

const desktop = [
  '/images/sana/sana1.jpg',
  '/images/sana/sana2.jpg',
  '/images/sana/sana3.jpg',
  '/images/sana/sana6.jpg',
  '/images/sana/sana7.jpg',
  '/images/sana/sana8.jpg',
  '/images/sana/sana9.jpg',
  '/images/sana/sana10.jpg',
];

const mobile = [
  '/images/sana/mobile1.jpg',
  '/images/sana/mobile2.jpg',
  '/images/sana/mobile3.jpg',
  '/images/sana/mobile4.jpg',
  '/images/sana/mobile5.jpg',
  '/images/sana/mobile6.jpg',
  '/images/sana/mobile7.jpg',
  '/images/sana/mobile8.jpg',
];

export const GET: APIRoute = () => {
  const randomDesktop = desktop[Math.floor(Math.random() * desktop.length)];
  const randomMobile = mobile[Math.floor(Math.random() * mobile.length)];
  return new Response(
    JSON.stringify({ desktop: randomDesktop, mobile: randomMobile }),
    { headers: { 'Content-Type': 'application/json' } },
  );
};