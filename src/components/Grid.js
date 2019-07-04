import React from "react";

function Grid(props) {
  return (
    <div className="container" style={{ marginTop: "30px" }}>
      <div className="row">
        {props.imagesList.map(img => {
          return (
            <div key={img.id} className="col-sm-6 col-md-3 px-2">
              <button
                key={img.id}
                value={img.id}
                onClick={() => props.onDeleteImg(img.id)}
              >
                X
              </button>
              <img
                alt={img.title}
                src={img.url}
                width="100%"
                height="200px"
                onClick={() => props.onImgClick(img, "this")}
                onError={e => {
                  props.onImgError(img.id);
                  e.target.src =
                    "http://www.webcolorsonline.com/images/error.png";
                }}
              />
            </div>
          );
        })}
      </div>
      {props.imagesListLength === 0 && <h1>No images found</h1>}
    </div>
  );
}

export default Grid;
