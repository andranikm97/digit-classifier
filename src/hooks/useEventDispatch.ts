import { useContext } from "react";
import EventContext from "./EventContext";

export default function useEventDispatch() {
  const [_sub, _unsub, dispatch] = useContext(EventContext);

  return dispatch;
}
