const initialState = {
  room: "",
  character: {},
  questions: [],
  points: []
};

const JOIN_ROOM = "JOIN_ROOM";
const UPDATE_CHARACTER = "UPDATE_CHARACTER";
const UPDATE_QUESTIONS = "UPDATE_QUESTIONS";
const UPDATE_POINTS = "UPDATE_POINTS";
const PURGE_ALL = "PURGE_ALL";

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case JOIN_ROOM:
      return Object.assign({}, state, { room: action.payload });
    case UPDATE_CHARACTER:
      return Object.assign({}, state, { character: action.payload });
    case UPDATE_QUESTIONS:
      return Object.assign({}, state, { questions: [...action.payload] });
    case UPDATE_POINTS:
      return Object.assign({}, state, { points: [...action.payload] });
    case PURGE_ALL:
      return Object.assign({}, state, {
        room: "",
        character: {},
        questions: [],
        points: []
      });
    default:
      return Object.assign({}, state);
  }
}

export function joinRoom(room) {
  return { type: JOIN_ROOM, payload: room };
}

export function updateCharacter(character) {
  return { type: UPDATE_CHARACTER, payload: character };
}

export function updateQuestions(questions) {
  return { type: UPDATE_QUESTIONS, payload: questions };
}

export function updatePoints(points) {
  return { type: UPDATE_POINTS, payload: points };
}

export function purgeAll() {
  return { type: PURGE_ALL, payload: "purging" };
}
