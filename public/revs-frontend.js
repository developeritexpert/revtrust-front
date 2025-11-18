(function () {
  if (window.__reviewWidgetLoaded) return;
  window.__reviewWidgetLoaded = true;

	const STAR_YELLOW = `<svg width="20" height="18" viewBox="0 0 27 26"><path fill="#FFBF00" d="M13.2 0l3.12 9.59h10.08l-8.16 5.93 3.12 9.59-8.16-5.93-8.16 5.93 3.12-9.59L0 9.59h10.08L13.2 0z"/></svg>`;
	const STAR_GRAY = `<svg width="20" height="18" viewBox="0 0 27 26"><path fill="#D9D9D9" d="M13.2 0l3.12 9.59h10.08l-8.16 5.93 3.12 9.59-8.16-5.93-8.16 5.93 3.12-9.59L0 9.59h10.08L13.2 0z"/></svg>`;
    
	const starsHTML = (n) => STAR_YELLOW.repeat(n) + STAR_GRAY.repeat(5 - n);


    async function fetchBrands({ name, brandId }) {
        const baseURL = "https://revtrust-front.onrender.com";
        const url = new URL("/brand-widget", baseURL);
        url.searchParams.set("name", name);
        if (brandId) url.searchParams.set("brandId", brandId);
        const res = await fetch(url.toString());
        if (!res.ok) throw new Error("Failed to fetch reviews");
        const data = await res.json();
        return data?.data || [];
    }


    console.log(fetchBrands('a'))

})();