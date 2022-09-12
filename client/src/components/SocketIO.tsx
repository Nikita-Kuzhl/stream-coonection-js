import styled from "styled-components";
import io from "socket.io-client";
import { FC, useEffect, useReducer, useRef, useState } from "react";
import axios from "axios";

const socket = io("http://localhost:8080");

// REDUCERS

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case "JOINED":
      return {
        ...state,
        joined: true,
        userName: action.payload.userName,
        roomId: action.payload.roomId,
      };

    case "SET_DATA":
      return {
        ...state,
        users: action.payload.users,
        messages: action.payload.messages,
      };

    case "SET_USERS":
      return {
        ...state,
        users: action.payload,
      };

    case "NEW_MESSAGE":
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };

    default:
      return state;
  }
};

// STYlES

const Section = styled.section`
  width: 500px;
  height: 100%;
  margin: 0 auto;
`;

const Form = styled.div`
  margin-top: 80px;
  display: flex;
  flex-direction: column;
  row-gap: 30px;
  border: 2px solid purple;
  padding: 20px;
  border-radius: 20px;
`;
const Input = styled.input`
  padding: 10px;
  font-size: large;
  outline: none;
  border: 2px solid purple;
  border-radius: 10px;
`;
const TextArea = styled.textarea`
  padding: 10px;
  font-size: large;
  outline: none;
  border: 2px solid purple;
  border-radius: 10px;
`;
const Button = styled.button`
  padding: 10px;
  font-size: large;
  outline: none;
  border: 2px solid purple;
  border-radius: 10px;
  background: none;
  cursor: pointer;
  width: 200px;
  margin: 0 auto;
`;
const Messages = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 20px;
`;

// COMPONENT JOINBLOCK

const JoinBlock: FC<{ onLogin: any }> = ({ onLogin }) => {
  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState("");
  const [isLoading, setLoading] = useState(false);

  const onEnter = async () => {
    if (!roomId || !userName) {
      return alert("Неверные данные");
    }
    const obj = {
      roomId,
      userName,
    };
    setLoading(true);
    await axios.post("http://localhost:8080/rooms", obj);
    onLogin(obj);
  };
  return (
    <Section>
      <Form>
        <Input
          placeholder="Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />
        <Input
          placeholder="Имя"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <Button disabled={isLoading} onClick={onEnter}>
          {isLoading ? "ВХОД..." : "ВОЙТИ"}
        </Button>
      </Form>
    </Section>
  );
};

// COMPONENT CHAT

const Chat: FC<{
  users: any;
  messages: any;
  userName: any;
  roomId: any;
  onAddMessage: any;
}> = ({ users, messages, userName, roomId, onAddMessage }) => {
  const [messageValue, setMessageValue] = useState("");
  const messagesRef = useRef(null);

  const onSendMessage = () => {
    socket.emit("ROOM:NEW_MESSAGE", {
      userName,
      roomId,
      text: messageValue,
    });
    onAddMessage({ userName, text: messageValue });
    setMessageValue("");
  };

  useEffect(() => {
    //   @ts-ignore
    messagesRef.current.scrollTo(0, 99999);
  }, [messages]);

  return (
    <div>
      <div>
        Комната: <b>{roomId}</b>
        <hr />
        <b>Онлайн ({users.length}):</b>
        <ul>
          {users.map((name: any, index: any) => (
            <li key={name + index}>{name}</li>
          ))}
        </ul>
      </div>
      <Form>
        <div ref={messagesRef}>
          {messages.map((message: any) => (
            <div>
              <div>
                <span>
                  <strong>{message.userName}</strong>
                </span>
              </div>
              <p>{message.text}</p>
            </div>
          ))}
        </div>
        <Form>
          <TextArea
            value={messageValue}
            onChange={(e) => setMessageValue(e.target.value)}
            rows={3}
          ></TextArea>
          <Button onClick={onSendMessage} type="button">
            Отправить
          </Button>
        </Form>
      </Form>
    </div>
  );
};

// MAIN COMPONENT

const SocketIO = () => {
  const [state, dispatch] = useReducer(reducer, {
    joined: false,
    roomId: null,
    userName: null,
    users: [],
    messages: [],
  });

  const onLogin = async (obj: any) => {
    dispatch({
      type: "JOINED",
      payload: obj,
    });
    socket.emit("ROOM:JOIN", obj);
    const { data } = await axios.get(
      `http://localhost:8080/rooms/${obj.roomId}`
    );
    dispatch({
      type: "SET_DATA",
      payload: data,
    });
  };
  const setUsers = (users: any) => {
    dispatch({
      type: "SET_USERS",
      payload: users,
    });
  };

  const addMessage = (message: any) => {
    dispatch({
      type: "NEW_MESSAGE",
      payload: message,
    });
  };

  useEffect(() => {
    socket.on("ROOM:SET_USERS", setUsers);
    socket.on("ROOM:NEW_MESSAGE", addMessage);
  }, []);

  //   @ts-ignore
  window.socket = socket;

  return (
    <>
      {!state.joined ? (
        <JoinBlock onLogin={onLogin} />
      ) : (
        <Chat {...state} onAddMessage={addMessage} />
      )}
    </>
  );
};

export default SocketIO;
