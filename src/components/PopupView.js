import React from "react";

function PopuoView(props) {
  return (
    <div className="popup">
      <div className="popupInner">
        <div>
          <img
            alt={props.imgData.title}
            src={props.imgData.url}
            width="100%"
            onError={e => {
              props.onImgError(props.imgData.id);
              e.target.src = "http://www.webcolorsonline.com/images/error.png";
            }}
          />
        </div>
        <div>
          <h1>{props.imgData.title}</h1>
          <button onClick={() => props.onPopClose()}>Close</button>
          <button onClick={() => props.onPopChange(props.imgData, "next")}>
            next
          </button>
          <button onClick={() => props.onPopChange(props.imgData, "previous")}>
            previous
          </button>
        </div>
      </div>
    </div>
  );
}

export default PopuoView;
