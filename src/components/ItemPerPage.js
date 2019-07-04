import React from "react";

function ItemPerPage(props) {
  return (
    <div>
      <p>ItemPerPage by: </p>
      <select
        value={props.ItemPerPage}
        onChange={props.onChangeItemPerPage}
        name="ItemPerPage"
      >
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="15">15</option>
        <option value="20">20</option>
      </select>
    </div>
  );
}

export default ItemPerPage;
