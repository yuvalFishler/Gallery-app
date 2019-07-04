import React from "react";

function Search(props) {
  return (
    <div>
      <input
        type="text"
        value={props.searchInput}
        name="search"
        placeholder="search"
        onChange={props.handleChangeSearch}
      />
    </div>
  );
}

export default Search;
