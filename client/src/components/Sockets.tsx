import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

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

const Sockets = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [value, setValue] = useState("");
  const [connected, setConnected] = useState<boolean>(false);
  const [username, setUsername] = useState("");

  const socket = useRef<WebSocket>();

  const connect = () => {
    socket.current = new WebSocket("ws://localhost:8080");

    socket.current.onopen = () => {
      setConnected(true);
      const message = {
        event: "connection",
        id: Date.now(),
        username,
      };
      socket.current?.send(JSON.stringify(message));
    };
    socket.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prev) => [message, ...prev]);
    };
    socket.current.onclose = () => {
      console.log("Подключение закрыто");
    };
    socket.current.onerror = () => {
      console.log("Ошибка подключения");
    };
  };

  const sendMessage = () => {
    const message = {
      username,
      message: value,
      id: Date.now(),
      event: "message",
    };
    socket.current?.send(JSON.stringify(message));
    setValue("");
  };

  if (!connected) {
    return (
      <Section>
        <Form>
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            placeholder="Введите имя"
          />
          <Button onClick={connect}>Войти</Button>
        </Form>
      </Section>
    );
  }
  return (
    <Section>
      <Form>
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          type="text"
        />
        <Button type="button" onClick={sendMessage}>
          Отправить
        </Button>
      </Form>
      <Messages>
        {messages.map((item) => (
          <div key={item.id}>
            {item.event === "connection" ? (
              <div>Пользователь {item.username} подключился</div>
            ) : (
              <div>
                {item.username}. {item.message}
              </div>
            )}
          </div>
        ))}
      </Messages>
    </Section>
  );
};

export default Sockets;
