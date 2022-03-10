import React from "react";
import Blurb from "./Blurb";

const ContentWar = () => {
  return (
    <div className=" pr-10% flex flex-direction  mt-20">
      <div className="mt-10 w-100%">
        <img alt="Logo" src={"img/pd-dots1.png"} />
      </div>
      <div className="ml-10">
        <Blurb
          header="MUSEUM OF WAR"
          english="A chronology of events of the Ukrainian history of modern times, set in stone. The NFTs are facts accompanied by personal reflections. The formula of each NFT is clear and simple: each token is a real news piece from official sources and an illustration from a Ukrainian artist. "
          russian="відверта хронологія подій новітньої історії України. Експонати — це факти, супроводжені емоційними спогадами. Формула експонату проста і прозора, кожен токен — це реальне новинне повідомлення з офіційних джерел та ілюстрація до нього від українського художника."
        />
      </div>
    </div>
  );
};

export default ContentWar;
