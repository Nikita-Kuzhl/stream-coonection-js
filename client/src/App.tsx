import { FC } from "react";
import EventSource from "./components/EventSource";
import LongPulling from "./components/LongPulling";
import SocketIO from "./components/SocketIO";
import Sockets from "./components/Sockets";

const App: FC = () => {
  return (
    <>
      {/* <LongPulling /> */}
      {/* <EventSource /> */}
      {/* <Sockets /> */}
      <SocketIO />
    </>
  );
};

export default App;
