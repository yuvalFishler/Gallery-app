export function compareValues(key, order = "asc") {
  return function(a, b) {
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      return 0;
    }

    const varA = typeof a[key] === "string" ? a[key].toUpperCase() : a[key];
    const varB = typeof b[key] === "string" ? b[key].toUpperCase() : b[key];

    let comparison = 0;
    if (varA > varB) {
      comparison = 1;
    } else if (varA < varB) {
      comparison = -1;
    }
    return order === "desc" ? comparison * -1 : comparison;
  };
}

export function formatFeedToArray(foreignArray) {
  //Formating an given feed to imgList array
  //It can be changed as the structure of the feed
  const newimgList = foreignArray.map(img => {
    return {
      id: parseInt(img.id),
      title: img.author,
      url: img.download_url,
      width: img.width,
      height: img.height
    };
  });
  return newimgList;
}

export function calculateNewGrid(page, resultsPerPage, filterdList) {
  let firstImg;
  let lastImg;
  if (page === 1) {
    firstImg = 0;
    lastImg = resultsPerPage;
  } else {
    firstImg = resultsPerPage * (page - 1);
    lastImg = firstImg + resultsPerPage;
  }
  const NewfilterdList = filterdList.slice(firstImg, lastImg);
  return NewfilterdList;
}
