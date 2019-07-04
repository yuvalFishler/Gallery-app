import React from "react";

function Pagination(props) {
  const { resultsOnPage, lenghtOflist, pageOnShow } = props;
  const numberOfPages = Math.ceil(lenghtOflist / resultsOnPage);
  const buttons = [];

  for (let i = 0; i < numberOfPages; i++) {
    let pageNum = i + 1;
    buttons.push(
      <button
        key={pageNum}
        disabled={pageOnShow === pageNum ? true : false}
        onClick={() => props.onChangePage(pageNum)}
      >
        {pageNum}
      </button>
    );
  }
  return <div>{buttons}</div>;
}

export default Pagination;
