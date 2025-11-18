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
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error("Failed to fetch brands");
    const data = await res.json();
    return data?.data || [];
  }

  async function addBrands({name,email,postcode,websiteUrl,logoUrl}){
    const baseURL = "https://revtrust-front.onrender.com";
    const url = new URL("/brand-widget", baseURL);
    url.searchParams.set("name", name);
    url.searchParams.set("email", email);
    url.searchParams.set("postcode", postcode);
    url.searchParams.set("websiteUrl", websiteUrl);
    url.searchParams.set("logoUrl", logoUrl);
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error("Failed to add brand");
    const data = await res.json();  
  }


  const form = document.querySelector('#brandform');
  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      const responseMsg = document.querySelector('.responseMessage');
      if (responseMsg) responseMsg.innerHTML = '';

      const requiredFields = ['name', 'email', 'postcode', 'websiteUrl', 'logoUrl'];
      let isValid = true;

      requiredFields.forEach(id => {
        const field = document.getElementById(id);
        if (field) field.style.borderColor = '';
        if (field) {
          if (field.type === 'file' && field.files.length === 0) {
            field.style.borderColor = 'red';
            isValid = false;
          }else if (field.value.trim() === '') {
            field.style.borderColor = 'red';
            isValid = false;
          }
        }
      });

      if (!isValid) {
        if (responseMsg) responseMsg.innerHTML = `<p style="color:red;">Please fill in all required fields.</p>`;
        return;
      }

      const formData = new FormData(form);

      try {
        const result = addBrands(formData);
        if (result?.statusCode === 400 && result?.message === 'Validation failed') {
          const errorMsg = result?.validation?.body?.message || 'Validation failed. Please check your input.';
          if (responseMsg) {
            responseMsg.innerHTML = `<p style="color:red;">${errorMsg}</p>`;
          }
          return;

        }else {
          const errorMsg = result?.desc || result?.message || 'There was an error adding the brand. Please try again later.';
          if (responseMsg) {
            responseMsg.innerHTML = `<p style="color:red;">${errorMsg}</p>`;
          }
          return;
        }

        if (responseMsg) responseMsg.innerHTML = `<p style="color:green;">${result.message || 'Brand added successfully!'}</p>`;
        form.reset();

      }catch (error) {
        console.error('Error:', error);
        if (responseMsg) responseMsg.innerHTML = `<p style="color:red;">Something went wrong. Please try again later.</p>`;
      }
    });
  }

})();