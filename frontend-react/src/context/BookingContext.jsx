import { createContext, useContext, useReducer } from 'react';

const BookingContext = createContext(null);

const initialState = {
    movie: null,
    showtime: null,
    selectedDate: null,
    selectedSeats: [],
    reservation: null,
    payment: null,
    step: 1, // 1: Select showtime, 2: Select seats, 3: Payment, 4: Confirmation
};

function bookingReducer(state, action) {
    switch (action.type) {
        case 'SET_MOVIE':
            return { ...state, movie: action.payload };

        case 'SET_DATE':
            return { ...state, selectedDate: action.payload };

        case 'SET_SHOWTIME':
            return { ...state, showtime: action.payload, step: 2 };

        case 'SET_SEATS':
            return { ...state, selectedSeats: action.payload };

        case 'SET_RESERVATION':
            return { ...state, reservation: action.payload, step: 3 };

        case 'SET_PAYMENT':
            return { ...state, payment: action.payload, step: 4 };

        case 'NEXT_STEP':
            return { ...state, step: Math.min(state.step + 1, 4) };

        case 'PREV_STEP':
            return { ...state, step: Math.max(state.step - 1, 1) };

        case 'GO_TO_STEP':
            return { ...state, step: action.payload };

        case 'RESET':
            return initialState;

        default:
            return state;
    }
}

export function BookingProvider({ children }) {
    const [state, dispatch] = useReducer(bookingReducer, initialState);

    const actions = {
        setMovie: (movie) => dispatch({ type: 'SET_MOVIE', payload: movie }),
        setDate: (date) => dispatch({ type: 'SET_DATE', payload: date }),
        setShowtime: (showtime) => dispatch({ type: 'SET_SHOWTIME', payload: showtime }),
        setSeats: (seats) => dispatch({ type: 'SET_SEATS', payload: seats }),
        setReservation: (reservation) => dispatch({ type: 'SET_RESERVATION', payload: reservation }),
        setPayment: (payment) => dispatch({ type: 'SET_PAYMENT', payload: payment }),
        nextStep: () => dispatch({ type: 'NEXT_STEP' }),
        prevStep: () => dispatch({ type: 'PREV_STEP' }),
        goToStep: (step) => dispatch({ type: 'GO_TO_STEP', payload: step }),
        reset: () => dispatch({ type: 'RESET' }),
    };

    return (
        <BookingContext.Provider value={{ ...state, ...actions }}>
            {children}
        </BookingContext.Provider>
    );
}

export const useBooking = () => {
    const context = useContext(BookingContext);
    if (!context) {
        throw new Error('useBooking must be used within BookingProvider');
    }
    return context;
};
