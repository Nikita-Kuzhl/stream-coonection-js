import { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";

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

const LongPulling = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [value, setValue] = useState("");

  const sendMessage = async () => {
    await axios.post("http://localhost:8080/new-messages", {
      message: value,
      id: Date.now(),
    });
  };

  const subscriebe = async () => {
    try {
      const { data } = await axios.get("http://localhost:8080/get-messages");
      setMessages((prev) => [data, ...prev]);
      await subscriebe();
    } catch (error) {
      setTimeout(() => subscriebe(), 500);
    }
  };

  useEffect(() => {
    subscriebe();
  }, []);

  return (
    <Section>
      <Form>
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          type="text"
        />
        <Button onClick={sendMessage}>Отправить</Button>
      </Form>
      <Messages>
        {messages.map((item) => (
          <p key={item.id}>{item.message}</p>
        ))}
      </Messages>
    </Section>
  );
};

export default LongPulling;
