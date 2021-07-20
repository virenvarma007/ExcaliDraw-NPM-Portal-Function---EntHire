import React, { useEffect, useState, useRef } from "react";
import Excalidraw, {
  exportToCanvas,
  exportToSvg,
  exportToBlob
} from "@excalidraw/excalidraw";
import InitialData from "./initialData";
import Sidebar from "./sidebar/sidebar";

import "./styles.scss";
import initialData from "./initialData";

const renderTopRightUI = () => {
  return (
    <button
      onClick={() =>
        alert("Scroll Below to download image of any version of the change")
      }
    >
      {" "}
      Important{" "}
    </button>
  );
};

const renderFooter = () => {
  return (
    <button onClick={() => alert("This is dummy footer")}>
      {" "}
      custom footer{" "}
    </button>
  );
};

export default function App() {
  const excalidrawRef = useRef(null);

  const [viewModeEnabled, setViewModeEnabled] = useState(false);
  const [zenModeEnabled, setZenModeEnabled] = useState(false);
  const [gridModeEnabled, setGridModeEnabled] = useState(false);
  const [blobUrl, setBlobUrl] = useState(null);
  const [canvasUrl, setCanvasUrl] = useState(null);
  const [exportWithDarkMode, setExportWithDarkMode] = useState(false);
  const [shouldAddWatermark, setShouldAddWatermark] = useState(false);
  const [theme, setTheme] = useState("light");
  const elementsOverTime = require("./elements.json");
  var blobs = [];
  var d = new Date();
  var time = d.getTime();
  var newtime = d.getTime();

  useEffect(() => {
    const onHashChange = () => {
      const hash = new URLSearchParams(window.location.hash.slice(1));
      const libraryUrl = hash.get("addLibrary");
      if (libraryUrl) {
        excalidrawRef.current.importLibrary(libraryUrl, hash.get("token"));
      }
    };
    window.addEventListener("hashchange", onHashChange, false);
    return () => {
      window.removeEventListener("hashchange", onHashChange);
    };
  }, []);

  function myfunction(elements, state) {
    //elementsOverTime.put(elements);
    newtime = newtime + 75;
    if (newtime - time >= 10000) {
      time = newtime;
      let nele = JSON.stringify(elements);
      elementsOverTime.push(JSON.parse(nele));
      document.getElementById("demo").innerHTML =
        "Total Number if Iterations Saved: " +
        (Object.keys(elementsOverTime).length - 1);
    }
  }

  const updateScene = () => {
    const sceneData = {
      elements: [
        {
          type: "rectangle",
          version: 141,
          versionNonce: 361174001,
          isDeleted: false,
          id: "oDVXy8D6rom3H1-LLH2-f",
          fillStyle: "hachure",
          strokeWidth: 1,
          strokeStyle: "solid",
          roughness: 1,
          opacity: 100,
          angle: 0,
          x: 100.50390625,
          y: 93.67578125,
          strokeColor: "#c92a2a",
          backgroundColor: "transparent",
          width: 186.47265625,
          height: 141.9765625,
          seed: 1968410350,
          groupIds: []
        }
      ],
      appState: {
        viewBackgroundColor: "#edf2ff"
      }
    };
    excalidrawRef.current.updateScene(sceneData);
  };

  return (
    <div className="App">
      <h1> Excalidraw: EntHire Assignment</h1>
      <p id="demo">0 Images saved</p>
      <div className="button-wrapper">
        <button className="update-scene" onClick={updateScene}>
          Update Scene
        </button>
        <button
          className="reset-scene"
          onClick={() => {
            excalidrawRef.current.resetScene();
          }}
        >
          Reset Scene
        </button>
      </div>
      <div className="excalidraw-wrapper">
        <Excalidraw
          ref={excalidrawRef}
          initialData={InitialData}
          //
          onChange={(elements, state) => myfunction(elements, state)}
          onPointerUpdate={(payload) => console.log(payload)}
          onCollabButtonClick={() =>
            window.alert("You clicked on collab button")
          }
          viewModeEnabled={viewModeEnabled}
          zenModeEnabled={zenModeEnabled}
          gridModeEnabled={gridModeEnabled}
          theme={theme}
          name="Custom name of drawing"
          UIOptions={{
            canvasActions: { loadScene: false /*, export: false*/ }
          }}
          renderTopRightUI={renderTopRightUI}
          renderFooter={renderFooter}
        />
      </div>
      <div className="value">
        <label for="quantity">Iteration to be seen: </label>
        <input type="number" id="quantity" name="quantity" min="1"></input>
        <h6>Click on Image to download</h6>
      </div>
      <button
        onClick={async () => {
          var value = document.getElementById("quantity").value;
          if (value > 0) {
            const blob = await exportToBlob({
              elements: elementsOverTime[value],
              mimeType: "image/png",
              appState: {
                ...initialData.appState,
                exportWithDarkMode,
                shouldAddWatermark
              }
            });
            setBlobUrl(window.URL.createObjectURL(blob));
            //document.getElementById("demo").innerHTML = blobUrl;
            blobs.push(blobUrl);
          }
        }}
      >
        Show Version
      </button>
      <br />
      <br />
      <br />
      <a href={blobUrl} download>
        <img src={blobUrl} alt="" />
      </a>
    </div>
  );
}
