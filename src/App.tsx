import React, { useState } from "react";
import "./App.css";
import pokemonList from "./pokemon.json";

interface IMon {
  id: number;
  name: string;
  boat: boolean;
  hit: HitState;
  miss: boolean;
}

enum HitState {
  None,
  Hit,
  Sunk,
}

enum Sort {
  Alpha,
  Numeric,
}

function App() {
  const [mons, setMons] = useState(
    pokemonList
      .sort((a, b) => a.localeCompare(b))
      .map((name, i) => ({
        id: i + 1,
        name: name.toLowerCase(),
        boat: false,
        hit: HitState.None,
        miss: false,
      }))
  );

  const [searchTerm, setSearchTerm] = useState("");

  const [boatEdit, setBoatEdit] = useState(false);
  const toggleBoatEdit = () => setBoatEdit(!boatEdit);

  const setMon = (id: number, mon: IMon) => {
    const foo = [...mons];
    foo[id - 1] = mon;
    setMons(foo);
  };

  const hitMon = (id: number) => {
    const mon = mons[id - 1];

    if (mon.boat) {
      switch (mon.hit) {
        case HitState.None:
          return setMon(id, {
            ...mons[id - 1],
            hit: HitState.Hit,
          });
        case HitState.Hit:
          return setMon(id, {
            ...mons[id - 1],
            hit: HitState.Sunk,
          });

        case HitState.Sunk:
          return setMon(id, {
            ...mons[id - 1],
            hit: HitState.None,
          });
      }
    }

    return setMon(id, {
      ...mons[id - 1],
      miss: !mons[id - 1].miss,
    });
  };
  const boatMon = (id: number) => {
    setMon(id, {
      ...mons[id - 1],
      boat: !mons[id - 1].boat,
    });
  };

  const handleClick = (id: number) => {
    if (boatEdit) {
      return boatMon(id);
    }

    return hitMon(id);
  };

  return (
    <>
      <h1>Pokemon Yeet Yachts Tracker</h1>
      <label>
        <input
          checked={boatEdit}
          onClick={() => toggleBoatEdit()}
          type="checkbox"
        />
        Boat Edit
      </label>
      <label>
        Search
        <input
          value={searchTerm}
          onChange={(ev) => setSearchTerm(ev.target.value)}
        />
      </label>
      <div className="board">
        {mons.map((mon) => (
          <div
            className={`square${mon.hit === HitState.Hit ? " hit" : ""}${
              mon.hit === HitState.Sunk ? " sunk" : ""
            }${mon.boat ? " boat" : ""}${mon.miss ? " miss" : ""}${
              searchTerm
                ? mon.name.startsWith(searchTerm)
                  ? " highlight"
                  : ""
                : ""
            }`}
            onClick={() => handleClick(mon.id)}
          >
            <img
              className="sprite"
              src={`https://img.pokemondb.net/sprites/lets-go-pikachu-eevee/normal/${mon.name}.png`}
              alt={mon.name}
            />
          </div>
        ))}
      </div>
      <div>
        Shots Fired:{" "}
        {mons.reduce((prev, curr) => {
          if (curr.hit || curr.miss) {
            return prev + 1;
          }
          return prev;
        }, 0)}
      </div>
    </>
  );
}

export default App;
