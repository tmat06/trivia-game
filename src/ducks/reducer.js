const initialState = {
  room: "",
  character: {},
  questions: []
};

const JOIN_ROOM = "JOIN_ROOM";
const UPDATE_CHARACTER = "UPDATE_CHARACTER";
const UPDATE_QUESTIONS = "UPDATE_QUESTIONS";

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case JOIN_ROOM:
      return Object.assign({}, state, { room: action.payload });
    case UPDATE_CHARACTER:
      return Object.assign({}, state, { character: action.payload });
    case UPDATE_QUESTIONS:
      return Object.assign({}, state, { questions: [...action.payload] });
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
  console.log("hitting reducer?", questions);
  return { type: UPDATE_QUESTIONS, payload: questions };
}
