import { useEffect, useContext } from "react";

import EventContext from "./EventContext";

export default function useEvent(event, callback) {
  const [subscribe, unsubscribe, _dispatch] = useContext(EventContext);

  useEffect(() => {
    subscribe(event, callback);
    return () => unsubscribe(event, callback);
  }, [subscribe, unsubscribe, event, callback]);
}
