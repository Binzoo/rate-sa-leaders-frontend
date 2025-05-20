const BASE_URL = import.meta.env.VITE_API_BASE_URL;
export async function getPoliticianBySlug(slug) {
  const response = await fetch(`${BASE_URL}/web/api/v1/politicians/${slug}`);
  if (!response.ok) {
    throw new Error("Failed to fetch politician");
  }
  return await response.json();
}

export async function getAllPoliticians() {
  const response = await fetch(`${BASE_URL}/web/api/v1/politicians`);
  if (!response.ok) {
    throw new Error("Failed to fetch politicians");
  }
  return await response.json();
}

export async function getAllSixPoliticians() {
  const response = await fetch(
    `${BASE_URL}/web/api/v1/politicians/getsixpolitican`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch politicians");
  }
  return await response.json();
}

export async function upvote(slug) {
  try {
    const response = await fetch(
      `${BASE_URL}/web/api/v1/politicians/${slug}/upvote`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error("Upvote failed");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export async function downvote(slug) {
  try {
    const response = await fetch(
      `${BASE_URL}/web/api/v1/politicians/${slug}/downvote`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error("Upvote failed");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export async function searchPoliticians(query) {
  const res = await fetch(
    `${BASE_URL}/web/api/v1/politicians?query=${encodeURIComponent(query)}`
  );

  if (!res.ok) throw new Error("Failed to search politicians");

  const text = await res.text();
  return text ? JSON.parse(text) : [];
}
