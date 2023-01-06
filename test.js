function urlToSearch() {
  const urlParams = new URLSearchParams(window.location.search);

  function getParam(param) {
    if (urlParams.get(param)) {
      return urlParams.get(param);
    } else {
      return false;
    }
  }

  if (getParam("keyword")) {
    $("#filter-keyword").val(decodeURIComponent(getParam("keyword")));
  }

  if (getParam("interest")) {
    $("#filter-interest")
      .val(reverseObject(interestLegends)[getParam("interest")])
      .change();
  }

  if (getParam("program")) {
    $("#filter-program").val(getParam("program")).change();
  }
}
