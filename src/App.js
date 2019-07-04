import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import MyGallery from "./components/MyGallery";

function App() {
  return (
    <MyGallery
      feed="https://picsum.photos/v2/list?limit=100"
      resultsPerPage="10"
      search="true"
      pagination="true"
      sorting="true"
      autoRotateTime="4"
    />
  );
}

export default App;
