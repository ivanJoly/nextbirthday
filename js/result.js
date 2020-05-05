let params;
window.onload = function () {
  params = getAllUrlParams();
  if (Object.keys(params).length === 0) {
    window.location.href = "./index.html";
  }
  setResultPhrase(params);
  getGifById(params);
};
