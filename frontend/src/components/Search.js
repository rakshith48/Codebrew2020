import React, { useState, useEffect, useRef } from "react";

let autoComplete;

const loadScript = (url, callback) => {
  let script = document.createElement("script");
  script.type = "text/javascript";

  if (script.readyState) {
    script.onreadystatechange = function() {
      if (script.readyState === "loaded" || script.readyState === "complete") {
        script.onreadystatechange = null;
        callback();
      }
    };
  } else {
    script.onload = () => callback();
  }

  script.src = url;
  document.getElementsByTagName("head")[0].appendChild(script);
};

function handleScriptLoad(updateQuery, autoCompleteRef) {
  autoComplete = new window.google.maps.places.Autocomplete(
    autoCompleteRef.current,
    { types: [], componentRestrictions: { country: "au" } }
  );
  autoComplete.setFields(["address_components", "formatted_address"]);
  autoComplete.addListener("place_changed", () =>
    handlePlaceSelect(updateQuery)
  );
}

async function handlePlaceSelect(updateQuery) {
  const addressObject = autoComplete.getPlace();
  const query = addressObject.formatted_address;
  updateQuery(query);
}

function Search() {
  const [query, setQuery] = useState("");
  const [finalQuery, setFinalQuery] = useState("");
  const autoCompleteRef = useRef(null);

  useEffect(() => {
    loadScript(
      `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_TOKEN}&libraries=places`,
      () => handleScriptLoad(setQuery, autoCompleteRef)
    );
  }, []);

  useEffect(() => {
    setFinalQuery(query);
    console.log(query);
  }, [query]
  )

  const onSubmit = (e) => {
      e.preventDefault();
      return false;
  }

    return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        style={inputStyle}
        ref={autoCompleteRef}
        onChange={event => setQuery(event.target.value)}
        placeholder="Enter or choose your location here"
        value={query}
      />
    </form>
  );
}

const inputStyle = {
    background: "#c7d3d1",
    textAlign: "center",
    width: "90%",
    height: "60px",
    margin: "10px",
}

export default Search;
