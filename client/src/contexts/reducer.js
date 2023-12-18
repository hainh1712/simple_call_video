// import {initialState} from './initialState';
export const actionType = {
	SET_IS_LOGIN: 'SET_IS_LOGIN',
};

const reducer = (state, action) => {
  switch (action.type) {
		case actionType.SET_IS_LOGIN:
			return {
				...state,
				isLogin: action.value,
			};
		default:
			return state;
  }
};

export default reducer;
