import "./styles.css";

import { createStore } from "redux";
// container
const matchConiner = document.querySelector(".all-matches");
const addMatchButton = document.querySelector(".lws-addMatch");
const resetButton = document.querySelector(".lws-reset");

const initialScore = [{ id: 1, name: "Match 1", score: 0 }];

const INCREMENT = "increment";
const DECREMENT = "decrement";
const RESET = "reset";
const ADDMATCH = "addMatch";

//action creator
const increment = (id, value) => {
  return {
    type: INCREMENT,
    payload: {
      score: value,
      matchId: id,
    },
  };
};
const decrement = (id, value) => {
  return {
    type: DECREMENT,
    payload: {
      score: value,
      matchId: id,
    },
  };
};

// create reducer function
const scoreReducer = (state = initialScore, action) => {
  switch (action.type) {
    case INCREMENT: {
      const matchId = action.payload.matchId;
      const updateMatch = state.map((match) => {
        if (matchId === match.id) {
          const parent = document.querySelector(`[data-id="${matchId}"]`);
          parent.querySelector(".lws-singleResult").innerText =
            match.score + parseInt(action.payload.score, 10);
          return {
            ...match,
            score: match.score + parseInt(action.payload.score, 10),
          };
        } else {
          return match;
        }
      });
      return updateMatch;
    }
    case DECREMENT: {
      const matchId = action.payload.matchId;
      const updateMatch = state.map((match) => {
        if (matchId === match.id) {
          const parent = document.querySelector(`[data-id="${matchId}"]`);
          parent.querySelector(".lws-singleResult").innerText =
            match.score - parseInt(action.payload.score, 10);
          return {
            ...match,
            score: match.score - parseInt(action.payload.score, 10),
          };
        } else {
          return match;
        }
      });
      return updateMatch;
    }
    case RESET: {
      const allResultContainer = document.querySelectorAll(".lws-singleResult");
      allResultContainer.forEach((result) => {
        result.innerText = 0;
      });
      const resetScore = state.map((match) => {
        return {
          ...match,
          score: 0,
        };
      });
      return resetScore;
    }
    case ADDMATCH: {
      const newId = state.length + 1;
      const matchElement = document.createElement("div");
      matchElement.classList = "match";
      matchElement.setAttribute("data-id", newId);
      matchElement.innerHTML = `

    <div class="wrapper">
      <button class="lws-delete">
        <img src="../src/image/delete.svg" alt="" />
      </button>
      <h3 class="lws-matchName">Match ${newId}</h3>
    </div>
    <div class="inc-dec">
      <form class="incrementForm">
        <h4>Increment</h4>
        <input type="number" name="increment" class="lws-increment" />
      </form>
      <form class="decrementForm">
        <h4>Decrement</h4>
        <input type="number" name="decrement" class="lws-decrement" />
      </form>
    </div>
    <div class="numbers">
      <h2 class="lws-singleResult">0</h2>
    </div>

      `;
      matchConiner.appendChild(matchElement);

      return [...state, { id: newId, name: `Match ${newId}`, score: 0 }];
    }

    default:
      return state;
  }
};

// Create store
const store = createStore(scoreReducer);

const render = () => {
  const state = store.getState();
};
render();
store.subscribe(render);

matchConiner.addEventListener("submit", function (e) {
  e.preventDefault();
  const matchDiv = e.target.closest(".match");
  const matchId = parseInt(matchDiv.dataset.id, 10);

  if (e.target.classList.contains("incrementForm")) {
    store.dispatch(increment(matchId, e.target.increment.value));
    e.target.increment.value = "";
  }
  if (e.target.classList.contains("decrementForm")) {
    store.dispatch(decrement(matchId, e.target.decrement.value));
    e.target.decrement.value = "";
  }
});

resetButton.addEventListener("click", () => {
  store.dispatch({ type: RESET });
});

addMatchButton.addEventListener("click", () => {
  store.dispatch({ type: ADDMATCH });
});
