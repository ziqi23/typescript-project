import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import type { RootState } from ".";
import type { AppDispatch } from ".";

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;