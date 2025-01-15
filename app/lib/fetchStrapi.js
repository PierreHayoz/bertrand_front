export async function fetchStrapi(endpoint) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
      },
      cache: 'no-store', // Utilisez 'force-cache' ou 'no-store' selon vos besoins
    });
  
    if (!res.ok) {
      throw new Error('Failed to fetch data from Strapi');
    }
  
    return res.json();
  }
  