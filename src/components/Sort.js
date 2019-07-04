import React from "react";

function Sort(props) {
  return (
    <div>
      <p>Sort by:</p>
      <select value={props.sortBy} onChange={props.onChangeSort} name="Sort">
        <option value="title">title</option>
        <option value="id">id</option>
      </select>
    </div>
  );
}

export default Sort;
